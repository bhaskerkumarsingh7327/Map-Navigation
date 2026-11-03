import os
import time
import pyogrio
import pandas as pd
import mysql.connector

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
# GPKG File
# ==========================================

GPKG_FILE = os.path.expanduser(
    "~/Downloads/eastern-zone-260716-free/eastern-zone.gpkg"
)

LAYER_NAME = "gis_osm_places_free"

# ==========================================
# Read GPKG
# ==========================================

def load_places():

    print("=" * 60)
    print("Reading Eastern Zone GPKG...")
    print("=" * 60)

    start = time.time()

    df = pyogrio.read_dataframe(
        GPKG_FILE,
        layer=LAYER_NAME
    )

    end = time.time()

    print(f"Loaded Successfully")
    print(f"Rows : {len(df)}")
    print(f"Time : {round(end-start,2)} sec")

    return df


# ==========================================
# Keep Required Columns
# ==========================================

def filter_columns(df):

    print("\nFiltering Required Columns...")

    df = df[
        [
            "name",
            "fclass",
            "geometry"
        ]
    ]

    return df


# ==========================================
# Extract Latitude Longitude
# ==========================================

def extract_coordinates(df):

    print("Extracting Coordinates...")

    df["longitude"] = df.geometry.x
    df["latitude"] = df.geometry.y

    df.drop(columns=["geometry"], inplace=True)

    return df


# ==========================================
# Keep Only Required Place Types
# ==========================================

VALID_PLACE_TYPES = [
    "city",
    "town",
    "village",
    "hamlet",
    "suburb",
    "locality"
]

def filter_place_types(df):

    print("Filtering Place Types...")

    df = df[
        df["fclass"].isin(VALID_PLACE_TYPES)
    ]

    return df
# ==========================================
# Remove Invalid Rows
# ==========================================

def clean_data(df):

    print("\nCleaning Data...")

    before = len(df)

    # Remove NULL names
    df = df[df["name"].notna()]

    # Remove empty names
    df = df[df["name"].astype(str).str.strip() != ""]

    # Remove duplicate places
    df = df.drop_duplicates(
        subset=[
            "name",
            "latitude",
            "longitude"
        ]
    )

    after = len(df)

    print(f"Before Cleaning : {before}")
    print(f"After Cleaning  : {after}")

    return df


# ==========================================
# Connect MySQL
# ==========================================

def connect_database():

    print("\nConnecting MySQL...")

    conn = mysql.connector.connect(**DB_CONFIG)

    print("Connected Successfully")

    return conn


# ==========================================
# Prepare Data
# ==========================================

def prepare_records(df):

    records = []

    for _, row in df.iterrows():

        records.append(
            (
                str(row["name"]).strip(),
                float(row["latitude"]),
                float(row["longitude"])
            )
        )

    return records


# ==========================================
# Insert Query
# ==========================================

INSERT_QUERY = """
INSERT IGNORE INTO locations
(
    name,
    latitude,
    longitude
)
VALUES
(
    %s,
    %s,
    %s
)
"""
# ==========================================
# Batch Import
# ==========================================

def import_locations(records):

    conn = connect_database()
    cursor = conn.cursor()

    total = len(records)

    print("\n====================================")
    print(f"Total Records : {total}")
    print("Starting Import...\n")

    start = time.time()

    imported = 0

    batch = []

    BATCH_SIZE = 1000

    for record in records:

        batch.append(record)

        if len(batch) >= BATCH_SIZE:

            cursor.executemany(
                INSERT_QUERY,
                batch
            )

            conn.commit()

            imported += len(batch)

            print(
                f"Imported : {imported}/{total}"
            )

            batch.clear()

    if batch:

        cursor.executemany(
            INSERT_QUERY,
            batch
        )

        conn.commit()

        imported += len(batch)

        print(
            f"Imported : {imported}/{total}"
        )

    end = time.time()

    print("\n====================================")
    print("Import Completed Successfully")
    print("====================================")
    print(f"Total Imported : {imported}")
    print(f"Time Taken : {round(end-start,2)} sec")
    print("====================================")

    cursor.close()
    conn.close()


# ==========================================
# Main
# ==========================================

def main():

    df = load_places()

    df = filter_columns(df)

    df = extract_coordinates(df)

    df = filter_place_types(df)

    df = clean_data(df)

    records = prepare_records(df)

    import_locations(records)


if __name__ == "__main__":
    main()