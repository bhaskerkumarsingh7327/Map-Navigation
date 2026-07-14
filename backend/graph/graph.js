class Graph {

    constructor() {
        this.adjacencyList = {};
    }
    addVertex(vertex) {

    if (!this.adjacencyList[vertex]) {
        this.adjacencyList[vertex] = [];
    }

}
addEdge(source, destination, distance) {

    this.addVertex(source);
    this.addVertex(destination);

    this.adjacencyList[source].push({
        node: destination,
        distance: distance
    });

    this.adjacencyList[destination].push({
        node: source,
        distance: distance
    });

}

}


module.exports = Graph;