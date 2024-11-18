import { adjacencyList } from './adjacency_list.js';

class PriorityQueue {
    constructor() {
        this.elements = [];
    }

    enqueue(priority, node) {
        this.elements.push({ priority, node });
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }

        let minIndex = 0;
        for (let i = 1; i < this.elements.length; i++) {
            if (this.elements[i].priority < this.elements[minIndex].priority) {
                minIndex = i;
            }
        }
        return this.elements.splice(minIndex, 1)[0];
    }

    isEmpty() {
        return this.elements.length === 0;
    }
}

function dijkstra(adjacencyList, start, end) {
    const distances = {};
    const previous = {};
    const queue = new PriorityQueue();

    for (let node in adjacencyList) {
        distances[node] = Infinity;
        previous[node] = null;
    }

    distances[start] = 0;
    queue.enqueue(0, start);

    while (!queue.isEmpty()) {
        const { node: currentNode } = queue.dequeue();

        if (currentNode === end) {
            break;
        }

        for (let neighbor of adjacencyList[currentNode]) {
            const alt = distances[currentNode] + 1;
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = currentNode;
                queue.enqueue(alt, neighbor);
            }
        }
    }

    const path = [];
    let curr = end;
    while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr];
    }

    if (path[0] !== start) {
        return null;
    }

    return path;
}

export function testing(){
    const startNode = "0,0";
    const endNode = "28,25";

    const shortestPath = dijkstra(adjacencyList, startNode, endNode);

    if (shortestPath) {
        console.log("shortest path:", shortestPath);
    } else {
        console.log("NA");
    }
}