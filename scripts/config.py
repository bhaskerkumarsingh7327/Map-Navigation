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

GPKG_FILE = "/Users/bhaskerkumarsingh/Downloads/eastern-zone-260716-free/eastern-zone.gpkg"

ROAD_LAYER = "gis_osm_roads_free"

# ==========================================
# Batch Size
# ==========================================

BATCH_SIZE = 5000

# ==========================================
# Road Speed (km/h)
# ==========================================

ROAD_SPEED = {

    "motorway":100,
    "trunk":80,
    "primary":60,
    "secondary":50,
    "tertiary":40,

    "residential":25,
    "service":20,
    "living_street":15,

    "track":15,
    "track_grade1":15,

    "footway":5,
    "path":5,
    "pedestrian":5,
    "steps":3,

    "primary_link":50,
    "secondary_link":40,
    "tertiary_link":30,

    "trunk_link":60,

    "unclassified":30,

    "unknown":25

}

DEFAULT_SPEED = 30