# import time
# import math
# import pyogrio

# from shapely.geometry import LineString
# from shapely.geometry import MultiLineString
# from shapely.geometry import Point
# from shapely.strtree import STRtree

# from config import (
#     GPKG_FILE,
#     ROAD_LAYER,
#     BATCH_SIZE
# )

# from db_utils import (
#     connect_db,
#     close_db,
#     execute,
#     executemany,
#     commit
# )


# # ============================================================
# # Load Roads Batch
# # ============================================================

# def load_batch(offset):

#     return pyogrio.read_dataframe(

#         GPKG_FILE,

#         layer=ROAD_LAYER,

#         skip_features=offset,

#         max_features=BATCH_SIZE

#     )


# # ============================================================
# # Load Graph Nodes
# # ============================================================

# def load_graph_nodes():

#     conn, cursor = connect_db()

#     execute(
#         cursor,
#         """
#         SELECT
#             id,
#             latitude,
#             longitude
#         FROM graph_nodes
#         """
#     )

#     rows = cursor.fetchall()

#     close_db(conn, cursor)

#     points = []

#     point_map = {}

#     for row in rows:

#         p = Point(

#             row["longitude"],

#             row["latitude"]

#         )

#         points.append(p)

#         point_map[id(p)] = row

#     tree = STRtree(points)

#     print(f"Loaded Graph Nodes : {len(points)}")

#     return tree, point_map
# # ============================================================
# # Haversine Distance
# # ============================================================

# def haversine(lat1, lon1, lat2, lon2):

#     R = 6371000.0

#     lat1 = math.radians(lat1)
#     lon1 = math.radians(lon1)

#     lat2 = math.radians(lat2)
#     lon2 = math.radians(lon2)

#     dlat = lat2 - lat1
#     dlon = lon2 - lon1

#     a = (
#         math.sin(dlat / 2) ** 2
#         +
#         math.cos(lat1)
#         *
#         math.cos(lat2)
#         *
#         math.sin(dlon / 2) ** 2
#     )

#     c = 2 * math.atan2(
#         math.sqrt(a),
#         math.sqrt(1 - a)
#     )

#     return R * c


# # ============================================================
# # Find Nearest Junction
# # ============================================================

# def nearest_node(tree, point_map, coord):

#     p = Point(

#         coord[0],

#         coord[1]

#     )

#     nearest = tree.nearest(p)

#     row = point_map[id(nearest)]

#     return row


# # ============================================================
# # Road → Edge
# # ============================================================

# def build_edge(geometry, tree, point_map):

#     if geometry is None:

#         return None

#     if isinstance(

#         geometry,

#         LineString

#     ):

#         coords = list(

#             geometry.coords

#         )

#     elif isinstance(

#         geometry,

#         MultiLineString

#     ):

#         coords = []

#         for line in geometry.geoms:

#             coords.extend(

#                 list(line.coords)

#             )

#     else:

#         return None

#     if len(coords) < 2:

#         return None

#     start = coords[0]

#     end = coords[-1]

#     start_node = nearest_node(

#         tree,

#         point_map,

#         start

#     )

#     end_node = nearest_node(

#         tree,

#         point_map,

#         end
#     )

#     if start_node["id"] == end_node["id"]:

#         return None

#     distance = haversine(

#         start_node["latitude"],
#         start_node["longitude"],

#         end_node["latitude"],
#         end_node["longitude"]

#     )

#     return (

#         start_node["id"],
#         end_node["id"],
#         distance
#     )
# # ============================================================
# # Save Graph Edges
# # ============================================================

# def save_edges(edges):

#     if len(edges) == 0:

#         return

#     conn, cursor = connect_db()

#     query = """
#     INSERT INTO graph_edges
#     (
#         source_node,
#         destination_node,
#         distance
#     )
#     VALUES
#     (
#         %s,
#         %s,
#         %s
#     )
#     """

#     executemany(

#         cursor,

#         query,

#         edges

#     )

#     commit(conn)

#     close_db(conn, cursor)


# # ============================================================
# # Build Graph
# # ============================================================

# def build_graph():

#     tree, point_map = load_graph_nodes()

#     offset = 0

#     total_edges = 0

#     batch = []

#     while True:

#         df = load_batch(offset)

#         if len(df) == 0:

#             break

#         for geometry in df.geometry:

#             edge = build_edge(

#                 geometry,

#                 tree,

#                 point_map

#             )

#             if edge:

#                 batch.append(edge)

#             if len(batch) >= 5000:

#                 save_edges(batch)

#                 total_edges += len(batch)

#                 print(f"Edges Saved : {total_edges}")

#                 batch.clear()

#         offset += len(df)

#         print(f"Roads Processed : {offset}")

#     if batch:

#         save_edges(batch)

#         total_edges += len(batch)

#         batch.clear()

#     print("\n")
#     print("=" * 60)
#     print("GRAPH BUILD COMPLETED")
#     print("=" * 60)
#     print("Total Graph Edges :", total_edges)
#     # ============================================================
# # Main
# # ============================================================

# def main():

#     conn, cursor = connect_db()

#     execute(

#         cursor,

#         "TRUNCATE TABLE graph_edges"

#     )

#     commit(conn)

#     close_db(conn, cursor)

#     start = time.time()

#     build_graph()

#     end = time.time()

#     print("\n")
#     print("=" * 60)
#     print("BUILD ROADS GRAPH FINISHED")
#     print("=" * 60)
#     print("Execution Time :", round(end - start, 2), "sec")
#     print("=" * 60)


# # ============================================================
# # Run
# # ============================================================

# if __name__ == "__main__":

#     main()
import logging
import math
import sys
import time
from typing import List, Tuple, Set, Optional, Dict
import numpy as np
import pyogrio
from shapely.geometry import Point, LineString, MultiLineString
from shapely.strtree import STRtree
import shapely

from config import (
    GPKG_FILE,
    ROAD_LAYER,
    BATCH_SIZE
)
from db_utils import get_db_connection, release_db_connection

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)]
)

EARTH_RADIUS_METERS = 6371000.0


def haversine_distance(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return EARTH_RADIUS_METERS * c


def fetch_all_graph_nodes() -> Tuple[List[int], List[Point], STRtree]:
    logging.info("MySQL database se graph_nodes load kiye ja rahe hain...")
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        query = "SELECT id, longitude, latitude FROM graph_nodes ORDER BY id ASC"
        cursor.execute(query)
        rows = cursor.fetchall()

        if not rows:
            raise ValueError("graph_nodes table khali hai! Graph generation stop ho raha hai.")

        node_ids: List[int] = []
        node_geometries: List[Point] = []

        for row in rows:
            node_ids.append(int(row["id"]))
            node_geometries.append(Point(float(row["longitude"]), float(row["latitude"])))

        logging.info(f"Total {len(node_ids)} nodes successfully load ho gaye.")
        logging.info("Shapely 2.x STRtree spatial index build ho raha hai...")
        
        spatial_tree = STRtree(node_geometries)
        logging.info("STRtree spatial index successfully ready ho gaya.")

        return node_ids, node_geometries, spatial_tree

    except Exception as err:
        logging.error(f"graph_nodes fetch karne me error aaya: {err}")
        raise err
    finally:
        cursor.close()
        release_db_connection(conn)


def get_existing_edge_keys() -> Set[Tuple[int, int]]:
    logging.info("Existing graph_edges database se fetch kar rahe hain duplicates avoid karne ke liye...")
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        query = "SELECT source_node_id, target_node_id FROM graph_edges"
        cursor.execute(query)
        existing_edges: Set[Tuple[int, int]] = set()

        for u, v in cursor.fetchall():
            existing_edges.add((int(u), int(v)))

        logging.info(f"Total {len(existing_edges)} existing edges memory me store ho gaye.")
        return existing_edges

    except Exception as err:
        logging.error(f"Existing edges fetch karne me error aaya: {err}")
        raise err
    finally:
        cursor.close()
        release_db_connection(conn)


def insert_edges_batch(edges_batch: List[Tuple[int, int, float, str, Optional[int]]]) -> int:
    if not edges_batch:
        return 0

    conn = get_db_connection()
    cursor = conn.cursor()

    insert_query = """
        INSERT INTO graph_edges (source_node_id, target_node_id, distance_meters, geometry_wkt, road_id)
        VALUES (%s, %s, %s, %s, %s)
    """

    try:
        cursor.executemany(insert_query, edges_batch)
        conn.commit()
        inserted_count = cursor.rowcount
        return inserted_count

    except Exception as err:
        conn.rollback()
        logging.error(f"Batch insertion fail ho gaya, rollback executed: {err}")
        raise err
    finally:
        cursor.close()
        release_db_connection(conn)


def extract_endpoints(geom: shapely.Geometry) -> Optional[Tuple[Point, Point]]:
    if geom is None or geom.is_empty:
        return None

    if isinstance(geom, LineString):
        coords = geom.coords
        if len(coords) < 2:
            return None
        return Point(coords[0]), Point(coords[-1])

    elif isinstance(geom, MultiLineString):
        lines = list(geom.geoms)
        if not lines:
            return None
        first_coords = lines[0].coords
        last_coords = lines[-1].coords
        if len(first_coords) < 1 or len(last_coords) < 1:
            return None
        return Point(first_coords[0]), Point(last_coords[-1])

    return None


def process_roads_and_build_graph() -> None:
    start_time = time.time()
    logging.info("Starting road graph construction process...")

    node_ids, node_geometries, spatial_tree = fetch_all_graph_nodes()
    existing_edges = get_existing_edge_keys()

    logging.info(f"GPKG File: {GPKG_PATH}, Layer: {ROADS_LAYER_NAME} se processing start ho rahi hai...")

    total_roads_processed = 0
    total_edges_inserted = 0
    skipped_duplicates = 0
    skipped_no_node = 0

    batch_edges_to_insert: List[Tuple[int, int, float, str, Optional[int]]] = []

    try:
        gpkg_info = pyogrio.read_info(GPKG_PATH, layer=ROADS_LAYER_NAME)
        total_features = gpkg_info.get("features", 0)
        logging.info(f"GPKG me total estimated roads/features: {total_features}")
    except Exception as e:
        logging.warning(f"Feature count read nahi ho paya: {e}")
        total_features = 0

    offset = 0

    while True:
        try:
            df_batch = pyogrio.read_dataframe(
                GPKG_PATH,
                layer=ROADS_LAYER_NAME,
                skip_features=offset,
                max_features=BATCH_SIZE
            )

            if df_batch.empty:
                break

            current_batch_size = len(df_batch)

            for idx, row in df_batch.iterrows():
                total_roads_processed += 1
                geom = row.geometry
                road_id = row.get("id", None) if "id" in row else None
                if road_id is not None:
                    try:
                        road_id = int(road_id)
                    except (ValueError, TypeError):
                        road_id = None

                endpoints = extract_endpoints(geom)
                if endpoints is None:
                    continue

                start_pt, end_pt = endpoints

                start_idx = spatial_tree.nearest(start_pt)
                end_idx = spatial_tree.nearest(end_pt)

                matched_start_node_id = node_ids[start_idx]
                matched_start_node_geom = node_geometries[start_idx]

                matched_end_node_id = node_ids[end_idx]
                matched_end_node_geom = node_geometries[end_idx]

                start_dist = haversine_distance(
                    start_pt.x, start_pt.y,
                    matched_start_node_geom.x, matched_start_node_geom.y
                )

                end_dist = haversine_distance(
                    end_pt.x, end_pt.y,
                    matched_end_node_geom.x, matched_end_node_geom.y
                )

                if start_dist > NODE_MATCH_TOLERANCE_METERS or end_dist > NODE_MATCH_TOLERANCE_METERS:
                    skipped_no_node += 1
                    continue

                if matched_start_node_id == matched_end_node_id:
                    continue

                edge_key = (matched_start_node_id, matched_end_node_id)
                reverse_edge_key = (matched_end_node_id, matched_start_node_id)

                if edge_key in existing_edges or reverse_edge_key in existing_edges:
                    skipped_duplicates += 1
                    continue

                length_meters = haversine_distance(
                    matched_start_node_geom.x, matched_start_node_geom.y,
                    matched_end_node_geom.x, matched_end_node_geom.y
                )

                wkt_str = geom.wkt if geom is not None else None

                batch_edges_to_insert.append((
                    matched_start_node_id,
                    matched_end_node_id,
                    round(length_meters, 3),
                    wkt_str,
                    road_id
                ))

                existing_edges.add(edge_key)
                existing_edges.add(reverse_edge_key)

                if len(batch_edges_to_insert) >= BATCH_SIZE:
                    inserted = insert_edges_batch(batch_edges_to_insert)
                    total_edges_inserted += inserted
                    batch_edges_to_insert.clear()

            offset += current_batch_size
            logging.info(
                f"Progress: {total_roads_processed} roads process ho chuki hain. "
                f"Edges Inserted: {total_edges_inserted}, Duplicates Skipped: {skipped_duplicates}, "
                f"Out of tolerance skipped: {skipped_no_node}"
            )

        except Exception as batch_err:
            logging.error(f"Error processing batch starting at offset {offset}: {batch_err}")
            raise batch_err

    if batch_edges_to_insert:
        inserted = insert_edges_batch(batch_edges_to_insert)
        total_edges_inserted += inserted
        batch_edges_to_insert.clear()

    elapsed_time = time.time() - start_time
    logging.info("==================================================")
    logging.info("Road graph building complete ho gaya successfully!")
    logging.info(f"Total Roads Processed : {total_roads_processed}")
    logging.info(f"Total Edges Inserted  : {total_edges_inserted}")
    logging.info(f"Skipped Duplicates    : {skipped_duplicates}")
    logging.info(f"Skipped Out-of-Bound  : {skipped_no_node}")
    logging.info(f"Time Taken            : {elapsed_time:.2f} seconds")
    logging.info("==================================================")


if __name__ == "__main__":
    try:
        process_roads_and_build_graph()
    except Exception as global_err:
        logging.critical(f"Fatal error - Execution terminate ho gayi: {global_err}")
        sys.exit(1)