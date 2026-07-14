#ifndef GRAPH_H
#define GRAPH_H

#include <unordered_map>
#include <vector>

using namespace std;

class Graph
{
private:
    unordered_map<int, vector<pair<int, int>>> adjacencyList;

public:
    Graph();

    void addVertex(int vertex);

    void addEdge(int source, int destination, int distance);

    unordered_map<int, vector<pair<int, int>>> getGraph();
    vector<pair<int, int>> getNeighbors(int vertex);
};

#endif