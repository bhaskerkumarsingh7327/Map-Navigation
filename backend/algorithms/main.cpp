// #include "graph.h"
// #include "dijkstra.h"

// #include <iostream>
// #include <fstream>
// #include <string>

// using namespace std;

// // Path print function
// void printPath(int node, unordered_map<int, int> &parent)
// {
//     if (node == -1)
//         return;

//     if (parent[node] != -1)
//     {
//         printPath(parent[node], parent);
//         cout << " -> ";
//     }

//     cout << node;
// }

// int main(int argc, char *argv[])
// {
//     Graph g;

//     // graph.txt read karo
//     ifstream file("graph.txt");

//     if (!file.is_open())
//     {
//         cout << "Unable to open graph.txt" << endl;
//         return 1;
//     }

//     int source, destination;
//     double distance;

//     while (file >> source >> destination >> distance)
//     {
//         g.addEdge(source, destination, (int)distance);
//     }

//     file.close();

//     // Default values
//     int start = 2;
//     int end = 7;

//     // Agar Node.js se arguments aaye
//     if (argc >= 3)
//     {
//         start = stoi(argv[1]);
//         end = stoi(argv[2]);
//     }

//     // Run Dijkstra
//     DijkstraResult result = dijkstra(g, start);

//     cout << "Shortest distance to " << end << " = "
//          << result.distance[end] << endl;

//     cout << "Path: ";
//     printPath(end, result.parent);
//     cout << endl;

//     return 0;
// }

#include "graph.h"
#include "dijkstra.h"

#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <limits>

using namespace std;

void buildPath(
    int node,
    unordered_map<int,int> &parent,
    vector<int> &path
)
{
    if(parent.find(node)==parent.end())
        return;

    if(node==-1)
        return;

    if(parent[node]!=-1)
        buildPath(parent[node],parent,path);

    path.push_back(node);
}

int main(int argc,char *argv[])
{

    Graph g;

    // IMPORTANT
    ifstream file("algorithms/graph.txt");

    if(!file.is_open())
    {
        cout<<"ERROR";
        return 1;
    }

    int source,destination;
    double distance;

    while(file>>source>>destination>>distance)
    {
        g.addEdge(source,destination,(int)distance);
    }

    file.close();

    int start=2;
    int end=7;

    if(argc>=3)
    {
        start=stoi(argv[1]);
        end=stoi(argv[2]);
    }

    DijkstraResult result=dijkstra(g,start);

    if(result.distance.find(end)==result.distance.end())
    {
        cout<<"{\"success\":false,\"message\":\"Destination Not Found\"}";
        return 0;
    }

    if(result.distance[end]==numeric_limits<int>::max())
    {
        cout<<"{\"success\":false,\"message\":\"No Path Found\"}";
        return 0;
    }

    vector<int> path;

    buildPath(end,result.parent,path);

    cout<<"{";

    cout<<"\"success\":true,";

    cout<<"\"distance\":"
        <<result.distance[end]
        <<",";

    cout<<"\"path\":[";

    for(size_t i=0;i<path.size();i++)
    {
        cout<<path[i];

        if(i!=path.size()-1)
            cout<<",";
    }

    cout<<"]";

    cout<<"}";

    return 0;

}