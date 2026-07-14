#include "graph.h"
#include "dijkstra.h"

extern "C" DijkstraResult runDijkstra(int source, int destination)
{
    Graph g;

    g.addEdge(1, 2, 10);
    g.addEdge(2, 3, 20);
    g.addEdge(1, 3, 30);
    g.addEdge(3, 4, 5);
    g.addEdge(2, 4, 50);

    DijkstraResult result = dijkstra(g, source);

    return result;
}