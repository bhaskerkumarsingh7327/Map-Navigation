from shapely.geometry import LineString
from shapely.geometry import MultiLineString

# ==========================================
# Get First Coordinate
# ==========================================

def get_start_point(geometry):

    if geometry is None:
        return None

    if isinstance(geometry, LineString):

        coords = list(geometry.coords)

        if len(coords) == 0:
            return None

        return coords[0]

    if isinstance(geometry, MultiLineString):

        if len(geometry.geoms) == 0:
            return None

        coords = list(
            geometry.geoms[0].coords
        )

        if len(coords) == 0:
            return None

        return coords[0]

    return None


# ==========================================
# Get Last Coordinate
# ==========================================

def get_end_point(geometry):

    if geometry is None:
        return None

    if isinstance(geometry, LineString):

        coords = list(geometry.coords)

        if len(coords) == 0:
            return None

        return coords[-1]

    if isinstance(geometry, MultiLineString):

        if len(geometry.geoms) == 0:
            return None

        coords = list(
            geometry.geoms[-1].coords
        )

        if len(coords) == 0:
            return None

        return coords[-1]

    return None


# ==========================================
# Get All Vertices
# ==========================================

def get_vertices(geometry):

    vertices = []

    if geometry is None:
        return vertices

    if isinstance(geometry, LineString):

        for point in geometry.coords:

            vertices.append(point)

        return vertices

    if isinstance(geometry, MultiLineString):

        for line in geometry.geoms:

            for point in line.coords:

                vertices.append(point)

        return vertices

    return vertices