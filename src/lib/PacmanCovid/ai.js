import { ConstructionOutlined } from '@mui/icons-material';
import { adjacencyList } from './adjacency_list.js';


const directions = [
    { direction: 'NORTH', delta: [0, -1], value: 1 },
    { direction: 'SOUTH', delta: [0, 1], value: 3 },
    { direction: 'WEST', delta: [-1, 0], value: 2 },
    { direction: 'EAST', delta: [1, 0], value: 0 },
  ];
  
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

function dijkstra(adjacencyList, startNode, endNode) {
    const distances = {};
    const previous = {};
    const queue = new PriorityQueue();

    for (let node in adjacencyList) {
        distances[node] = Infinity;
        previous[node] = null;
    }

    distances[startNode] = 0;
    queue.enqueue(0, startNode);

    while (!queue.isEmpty()) {
        const { node: currentNode } = queue.dequeue();

        if (currentNode === endNode) {
            break;
        }

        for (let neighbor of adjacencyList[currentNode]) {
            const alt = distances[currentNode] + 1; // Assuming weight of 1 for simplicity
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                previous[neighbor] = currentNode;
                queue.enqueue(alt, neighbor);
            }
        }
    }

    // Reconstruct the path
    const path = [];
    let curr = endNode;
    while (curr !== null) {
        path.unshift(curr);
        curr = previous[curr];
    }

    if (path[0] !== startNode) {
        return { distance: Infinity, path: null }; // No valid path
    }

    return { distance: distances[endNode], path };
}

function convertToNode(position) {
    const x = Math.floor(position[1]);
    const y = Math.floor(position[0]);
    return `${x},${y}`;
}

function findDirectionByDelta(delta) {
    const result = directions.find(d => d.delta[0] === delta[0] && d.delta[1] === delta[1]);
    return result ? result.value : null; 
}

export function bigFoodStrategy(start_string, food) {
    const bigFood = food.filter(f => !f.eaten && f.big); // Filter uneaten big food items
    if (bigFood.length === 0) return null; // No targets available

    let closestPath = null;
    let minDistance = Infinity;

    for (let foodItem of bigFood) {
        const big_food_position_string = convertToNode(foodItem.position);


        const { distance, path } = dijkstra(adjacencyList, start_string, big_food_position_string);

        if (distance < minDistance) {
            minDistance = distance;
            closestPath = path;
        }
    }

    if (!closestPath || closestPath.length === 0) {
        return null; 
    }

    const closestNodeString = closestPath[1];



    const [targetX, targetY] = closestNodeString.split(',').map(Number);
    const [startX, startY] = start_string.split(',').map(Number);


    const deltaX = targetX - startX; 
    const deltaY = targetY - startY; 
    console.log([deltaX, deltaY])
    console.log(findDirectionByDelta([deltaX, deltaY]))


    return findDirectionByDelta([deltaX, deltaY]);
}

export function findNextDecisionPoint(start, direction) {
    const directionInfo = directions.find(d => d.value === direction);
    if (!directionInfo) {
        console.error(`Invalid direction: ${direction}`);
        return null;
    }
    const [dx, dy] = directionInfo.delta;

    let current = start;

    while (true) {
        const current_string = convertToNode(current) 
        const neighbors = adjacencyList[current_string];
        if (!neighbors) {
            console.error(`No neighbors found for ${current}`);
            return null; 
        }

        if (neighbors.length >= 2) {
            return current_string; 
        }

        const next = neighbors.find(neighbor => {
            const [nx, ny] = neighbor.split(',').map(Number);
            const [current_x, current_y] = current_string.split(',').map(Number);
            return nx === current_x + dx && ny === current_y + dy;
        });


        if (!next) {
            console.error(`No valid next node in direction: ${direction}`);
            return null;
        }
        current = next.split(',').map(Number);
    }

}

