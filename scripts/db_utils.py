import mysql.connector
from config import DB_CONFIG


# ==========================================
# Connect Database
# ==========================================

def connect_db():

    conn = mysql.connector.connect(
        **DB_CONFIG
    )

    cursor = conn.cursor(
        dictionary=True
    )

    return conn, cursor


# ==========================================
# Close Database
# ==========================================

def close_db(conn, cursor):

    cursor.close()

    conn.close()


# ==========================================
# Execute Query
# ==========================================

def execute(
    cursor,
    query,
    values=None
):

    if values:

        cursor.execute(
            query,
            values
        )

    else:

        cursor.execute(query)


# ==========================================
# Batch Insert
# ==========================================

def executemany(
    cursor,
    query,
    values
):

    cursor.executemany(
        query,
        values
    )


# ==========================================
# Commit
# ==========================================

def commit(conn):

    conn.commit()