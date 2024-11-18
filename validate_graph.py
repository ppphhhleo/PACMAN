import json

with open('graph.json', 'r', encoding='utf-8') as f:
    grid = json.load(f)

with open('adjacency_list.json', 'r', encoding='utf-8') as f:
    adjacency_list = json.load(f)

for node_key in adjacency_list:
    row, col = map(int, node_key.split(','))
    if grid[row][col] != 1:
        print(f"node {node_key} is not a walkable grid point.")
for node_key, neighbors in adjacency_list.items():
    node_row, node_col = map(int, node_key.split(','))
    for neighbor_key in neighbors:
        neighbor_row, neighbor_col = map(int, neighbor_key.split(','))
        if abs(node_row - neighbor_row) + abs(node_col - neighbor_col) != 1:
            print(f"node {node_key} and neighbor {neighbor_key} are not adjacent")
        if grid[neighbor_row][neighbor_col] != 1:
            print(f"neighbor {neighbor_key} is not a walkable grid point.")
for row in range(len(grid)):
    for col in range(len(grid[0])):
        if grid[row][col] == 1:
            node_key = f"{row},{col}"
            if node_key not in adjacency_list:
                print(f"walkable node {node_key} is not in adjacency list.")
