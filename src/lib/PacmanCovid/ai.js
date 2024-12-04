import { ConstructionOutlined } from '@mui/icons-material';
import { adjacencyList } from './adjacency_list.js';


const directions = [
    { direction: 'NORTH', delta: [1, 0], value: 1 },
    { direction: 'SOUTH', delta: [-1, 0], value: 3 },
    { direction: 'WEST', delta: [0, -1], value: 2 },
    { direction: 'EAST', delta: [0, 1], value: 0 },
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

export function convertToNode(position) {
    const x = Math.floor(position[1]);
    const y = Math.floor(position[0]);
    return `${x},${y}`;
}

function findDirectionByDelta(delta) {
    const result = directions.find(d => d.delta[0] === delta[0] && d.delta[1] === delta[1]);
    return result ? result.value : null; 
}

export function bigFoodStrategy(player, food) {
    const start_string = findNextDecisionPoint(player.position, player.direction)
    const bigFood = food.filter(f => !f.eaten && f.big); // Filter uneaten big food items
    if (bigFood.length === 0) return null; // No targets available

    let closestPath = null;
    let minDistance = Infinity;
    let suggestedPath = null;

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

    let closestNodeString;
    if (closestPath.length > 1) {
        closestNodeString = closestPath[1];
    } else {
        closestNodeString = closestPath[0]
    }

    const [targetY, targetX] = closestNodeString.split(',').map(Number);
    const [startY, startX] = start_string.split(',').map(Number);
    const deltaX = targetX - startX; 
    const deltaY = targetY - startY;
    const delta = [
        deltaY === 0 ? 0 : deltaY > 0 ? 1 : -1,
        deltaX === 0 ? 0 : deltaX > 0 ? 1 : -1
    ];
    const nextDirection = findDirectionByDelta(delta);
    console.log("nextDirection", nextDirection)
    console.log("start_string", start_string)
    console.log("target", closestNodeString)
    suggestedPath = closestPath.map(position => position.split(',').map(Number));

    return { direction: nextDirection, path: suggestedPath };
}

export function monsterStrategy(player, monsters) {
    const start_string = findNextDecisionPoint(player.position, player.direction); 
    if (monsters.length === 0) return null; 
    console.log(monsters[0].position, player.position)
    let minDistance = Infinity;
    let nearestMonster;



    monsters.forEach(monster => {
        const distance = Math.abs(monster.position[0] - player.position[0]) +
                         Math.abs(monster.position[1] - player.position[1]);
   
      
        if (distance < minDistance) {
          minDistance = distance;
          nearestMonster = monster.position;
        }
      });

    const validCoordinate = convertToNode(nearestMonster)
      

     

    if (!validCoordinate) {
        console.log("No valid coordinate found for nearest monster in adjacency list.");
        return { direction: 3, path: [] };
    }

   
    const { distance, closestPath } = dijkstra(adjacencyList, start_string, validCoordinate);
    console.log("validcoor", validCoordinate)

    
    
    console.log("CAWEE", distance, closestPath)
    if (closestPath === null) {
        console.log("cloasepat = null")
        return { direction: 3, path: [] };
    }


    if (!closestPath || closestPath.length === 0) {
        console.log("cloasepad lenght = 0")
        return { direction: 3, path: [] };
    }

    let closestNodeString;
    if (closestPath.length > 1) {
        closestNodeString = closestPath[1]; 
    } else {
        closestNodeString = closestPath[0]; 
    }

    const [targetY, targetX] = closestNodeString.split(',').map(Number);
    const [startY, startX] = start_string.split(',').map(Number);
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;
    const delta = [
        deltaY === 0 ? 0 : deltaY > 0 ? 1 : -1,
        deltaX === 0 ? 0 : deltaX > 0 ? 1 : -1
    ];
    const nextDirection = findDirectionByDelta(delta);

    console.log("Next Direction:", nextDirection);
    console.log("Start Position:", start_string);
    console.log("Target Monster:", nearestMonster);
    console.log("Path to Monster:", closestPath);

    const suggestedPath = closestPath.map(position => position.split(',').map(Number));

    return { direction: nextDirection, path: suggestedPath };
}


export function findNextDecisionPoint(start, direction) {
    const directionInfo = directions.find(d => d.value === direction);
    if (!directionInfo) {
        console.error(`Invalid direction: ${direction}`);
        return null;
    }
    const [dx, dy] = directionInfo.delta;


    let current = convertToNode(start);

    while (true) {
        const current_string = current;
        const neighbors = adjacencyList[current_string];
        if (!neighbors) {
            console.error(`No neighbors found for ${current_string}`);
            return null; 
        }

        if (neighbors.length > 2) {
            console.log(adjacencyList)
            return current_string; 
        }

        const next = neighbors.find(neighbor => {
            const [nx, ny] = neighbor.split(',').map(Number);
            const [current_x, current_y] = current_string.split(',').map(Number);
 
            return nx === current_x + dy && ny === current_y + dx;
        });


        if (!next) {
            return current;
        }

        current = next
    }

}


export function testing(player){
    const startNode = convertToNode(player.position);
    const shortestPath = dijkstra(adjacencyList, startNode, "14,17");
    if (shortestPath) {
        console.log("shortest path:", shortestPath);
    } else {
        console.log("NA");
    }
}
