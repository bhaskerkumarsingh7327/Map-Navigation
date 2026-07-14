#include "graph.h"

Graph::Graph()
{
}

void Graph::addVertex(int vertex)
{
    if (adjacencyList.find(vertex) == adjacencyList.end())
    {
        adjacencyList[vertex] = {};
    }
}

void Graph::addEdge(int source, int destination, int distance)
{
    addVertex(source);
    addVertex(destination);

    adjacencyList[source].push_back({destination, distance});
    adjacencyList[destination].push_back({source, distance});
}

unordered_map<int, vector<pair<int, int>>> Graph::getGraph()
{
    return adjacencyList;
}

// 👇 Ye naya function add karo
vector<pair<int, int>> Graph::getNeighbors(int vertex)
{
    return adjacencyList[vertex];
}