#include "dijkstra.h"

#include <iostream>
#include <queue>
#include <vector>
#include <limits>

using namespace std;

DijkstraResult dijkstra(Graph graph, int start)
{
    DijkstraResult result;

    auto adjacencyList = graph.getGraph();

    // Step 1: Initialize
    for (auto node : adjacencyList)
    {
        result.distance[node.first] = numeric_limits<int>::max();
        result.parent[node.first] = -1;
    }

    result.distance[start] = 0;

    // Step 2: Priority Queue
    priority_queue<
        pair<int, int>,
        vector<pair<int, int>>,
        greater<pair<int, int>>
    > pq;

    pq.push({0, start});

    // Step 3: Dijkstra Loop
    while (!pq.empty())
    {
        int currentDistance = pq.top().first;
        int currentNode = pq.top().second;
        pq.pop();

        for (auto neighbor : graph.getNeighbors(currentNode))
        {
            int nextNode = neighbor.first;
            int edgeWeight = neighbor.second;

            if (currentDistance + edgeWeight < result.distance[nextNode])
            {
                result.distance[nextNode] = currentDistance + edgeWeight;
                result.parent[nextNode] = currentNode;

                pq.push({result.distance[nextNode], nextNode});
            }
        }
    }

    return result;
} 