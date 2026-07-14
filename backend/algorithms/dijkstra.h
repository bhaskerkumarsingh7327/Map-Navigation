#ifndef DIJKSTRA_H
#define DIJKSTRA_H

#include "graph.h"
#include <unordered_map>

using namespace std;

struct DijkstraResult
{
    unordered_map<int, int> distance;
    unordered_map<int, int> parent;
};

// correct return type
DijkstraResult dijkstra(Graph graph, int start);

#endif