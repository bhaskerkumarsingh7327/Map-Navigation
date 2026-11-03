import time
import mysql.connector
import pyogrio
import pandas as pd

# ==========================================
# MySQL Configuration
# ==========================================

DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "123456780",
    "database": "google_maps_navigation"
}

# ==========================================
# GPKG Configuration
# ==========================================

GPKG_FILE = "/Users/bhaskerkumarsingh/Downloads/eastern-zone-260716-free/eastern-zone.gpkg"

LAYER_NAME = "gis_osm_roads_free"

# ==========================================
# Load Roads Layer
# ==========================================

def load_roads():

    print("=" * 60)
    print("Reading Eastern Zone Roads...")
    print("=" * 60)

    start = time.time()

    df = pyogrio.read_dataframe(
        GPKG_FILE,
        layer=LAYER_NAME
    )

    end = time.time()

    print("Loaded Successfully")
    print("Rows :", len(df))
    print("Time :", round(end - start, 2), "sec")

    return df

# ==========================================
# Clean Required Columns
# ==========================================

def prepare_data(df):

    print("\nPreparing Data...")

    keep_columns = []

    for col in [
        "osm_id",
        "name",
        "fclass",
        "oneway",
        "maxspeed",
        "geometry"
    ]:

        if col in df.columns:
            keep_columns.append(col)

    df = df[keep_columns]

    if "name" not in df.columns:
        df["name"] = ""

    if "fclass" not in df.columns:
        df["fclass"] = ""

    if "oneway" not in df.columns:
        df["oneway"] = 0

    if "maxspeed" not in df.columns:
        df["maxspeed"] = ""

    df = df.fillna("")

    print("Columns Ready")
    print(df.columns.tolist())

    return df
# ==========================================
# Connect MySQL
# ==========================================

def connect_db():

    print("\nConnecting MySQL...")

    conn = mysql.connector.connect(**DB_CONFIG)

    cursor = conn.cursor()

    print("Connected Successfully")

    return conn, cursor


# ==========================================
# Import Roads
# ==========================================

def import_roads(df, conn, cursor):

    print("\n" + "=" * 40)
    print("Starting Roads Import...")
    print("=" * 40)

    insert_query = """
    INSERT IGNORE INTO raw_roads
    (osm_id, name, road_type, oneway, maxspeed, geometry)
    VALUES (%s, %s, %s, %s, %s, %s)
    """

    total = len(df)
    imported = 0

    for _, row in df.iterrows():

        try:

            osm_id = str(row.get("osm_id", ""))

            name = str(row.get("name", ""))

            road_type = str(row.get("fclass", ""))

            # -------------------------------
            # Convert oneway safely
            # -------------------------------

            raw_oneway = str(row.get("oneway", "")).strip().lower()

            if raw_oneway in ["1", "yes", "true", "t", "y"]:
                oneway = 1
            else:
                oneway = 0

            maxspeed = str(row.get("maxspeed", ""))

            geometry = row.geometry.wkt if row.geometry else ""

            cursor.execute(
                insert_query,
                (
                    osm_id,
                    name,
                    road_type,
                    oneway,
                    maxspeed,
                    geometry
                )
            )

            imported += 1

            if imported % 1000 == 0:

                conn.commit()

                print(f"Imported : {imported}/{total}")

        except Exception as e:
                print(e)
                continue




    conn.commit()

    print(f"Imported : {imported}/{total}")

    return imported

# ==========================================
# Main Function
# ==========================================

def main():

    start = time.time()

    # Load Roads
    df = load_roads()

    # Prepare Data
    df = prepare_data(df)

    # Connect Database
    conn, cursor = connect_db()

    # Import Roads
    total = import_roads(df, conn, cursor)

    # Close Connection
    cursor.close()
    conn.close()

    end = time.time()

    print("\n" + "=" * 50)
    print("Road Import Completed Successfully")
    print("=" * 50)
    print(f"Total Imported : {total}")
    print(f"Time Taken : {round(end-start,2)} sec")
    print("=" * 50)


# ==========================================
# Run
# ==========================================

if __name__ == "__main__":
    main()