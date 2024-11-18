import json

with open('graph.json', 'r') as f:
    grid = json.load(f)

rows = len(grid)
cols = len(grid[0])  

adjacency_list = {}

directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

for row in range(rows):
    for col in range(cols):
        if grid[row][col] == 1:
            node = (row, col)
            adjacency_list[node] = []
            for dr, dc in directions:
                nr, nc = row + dr, col + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    if grid[nr][nc] == 1:
                        neighbor = (nr, nc)
                        adjacency_list[node].append(neighbor)


for node, neighbors in adjacency_list.items():
    print(f"node {node}: neighbor -> {neighbors}")

adjacency_list_serializable = {}
for node, neighbors in adjacency_list.items():
    node_key = f"{node[0]},{node[1]}"
    neighbor_list = [f"{neighbor[0]},{neighbor[1]}" for neighbor in neighbors]
    adjacency_list_serializable[node_key] = neighbor_list

with open('adjacency_list.json', 'w') as f:
    json.dump(adjacency_list_serializable, f)
