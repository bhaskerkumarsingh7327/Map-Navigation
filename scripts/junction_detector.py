import time
import pyogrio

from collections import defaultdict
from shapely.geometry import LineString
from shapely.geometry import MultiLineString

from config import GPKG_FILE
from config import ROAD_LAYER
from config import BATCH_SIZE

from db_utils import (
    connect_db,
    close_db,
    execute,
    executemany,
    commit
)


# ============================================================
# Load Batch
# ============================================================

def load_batch(offset):

    df = pyogrio.read_dataframe(

        GPKG_FILE,

        layer=ROAD_LAYER,

        skip_features=offset,

        max_features=BATCH_SIZE

    )

    return df


# ============================================================
# Vertex Counter
# ============================================================

class VertexCounter:

    def __init__(self):

        self.counter = defaultdict(int)

        self.total_roads = 0


    def add_point(self, point):

        x = round(point[0],7)

        y = round(point[1],7)

        self.counter[(x,y)] += 1


    def process_geometry(self, geometry):

        if geometry is None:

            return


        if isinstance(

            geometry,

            LineString

        ):

            coords = list(

                geometry.coords

            )

            if len(coords) < 2:

                return


            self.add_point(

                coords[0]

            )

            self.add_point(

                coords[-1]

            )

            return


        if isinstance(

            geometry,

            MultiLineString

        ):

            if len(

                geometry.geoms

            ) == 0:

                return


            first = list(

                geometry.geoms[0].coords

            )

            last = list(

                geometry.geoms[-1].coords

            )

            if len(first) > 0:

                self.add_point(

                    first[0]

                )

            if len(last) > 0:

                self.add_point(

                    last[-1]

                )
                # ============================================================
# Process Batch
# ============================================================

def process_batch(df, counter):

    for geometry in df.geometry:

        counter.process_geometry(geometry)

        counter.total_roads += 1


# ============================================================
# Build Counter
# ============================================================

def build_counter():

    print("\n")
    print("=" * 60)
    print("COUNTING ROAD ENDPOINTS")
    print("=" * 60)

    counter = VertexCounter()

    offset = 0

    start = time.time()

    while True:

        df = load_batch(offset)

        if len(df) == 0:

            break

        process_batch(df, counter)

        offset += len(df)

        print(f"Processed Roads : {offset}")

    end = time.time()

    print("\n")
    print("=" * 60)
    print("COUNTING COMPLETED")
    print("=" * 60)
    print("Total Roads :", counter.total_roads)
    print("Unique Endpoints :", len(counter.counter))
    print("Time :", round(end - start, 2), "sec")

    return counter


# ============================================================
# Extract Junctions
# ============================================================

def get_junctions(counter):

    print("\n")
    print("=" * 60)
    print("DETECTING JUNCTIONS")
    print("=" * 60)

    junctions = []

    checked = 0

    total = len(counter.counter)

    for point, frequency in counter.counter.items():

        checked += 1

        if frequency >= 2:

            junctions.append(point)

        if checked % 100000 == 0:

            print(f"Checked : {checked}/{total}")

    print("\n")
    print("Detected Junctions :", len(junctions))

    return junctions
# ============================================================
# Save Junctions
# ============================================================

def save_junctions(junctions):

    print("\n")
    print("=" * 60)
    print("SAVING GRAPH NODES")
    print("=" * 60)

    conn, cursor = connect_db()

    execute(
        cursor,
        "TRUNCATE TABLE graph_nodes"
    )

    commit(conn)

    insert_query = """
    INSERT INTO graph_nodes
    (
        latitude,
        longitude,
        geom
    )
    VALUES
    (
        %s,
        %s,
        ST_SRID(POINT(%s,%s),4326)
    )
    """

    batch = []

    inserted = 0

    total = len(junctions)

    for point in junctions:

        lon = point[0]

        lat = point[1]

        batch.append(

            (

                lat,

                lon,

                lon,

                lat

            )

        )

        if len(batch) >= 5000:

            executemany(

                cursor,

                insert_query,

                batch

            )

            commit(conn)

            inserted += len(batch)

            print(
                f"Inserted : {inserted}/{total}"
            )

            batch.clear()

    if batch:

        executemany(

            cursor,

            insert_query,

            batch

        )

        commit(conn)

        inserted += len(batch)

        batch.clear()

    close_db(conn, cursor)

    print("\n")
    print("=" * 60)
    print("GRAPH NODES SAVED")
    print("=" * 60)
    print("Total :", inserted)
    # ============================================================
# Main
# ============================================================

def main():

    start = time.time()

    counter = build_counter()

    junctions = get_junctions(counter)

    save_junctions(junctions)

    end = time.time()

    print("\n")
    print("=" * 60)
    print("JUNCTION DETECTOR COMPLETED")
    print("=" * 60)
    print("Total Roads       :", counter.total_roads)
    print("Total Endpoints   :", len(counter.counter))
    print("Total Junctions   :", len(junctions))
    print("Execution Time    :", round(end - start, 2), "sec")
    print("=" * 60)


# ============================================================
# Run
# ============================================================

if __name__ == "__main__":

    main()