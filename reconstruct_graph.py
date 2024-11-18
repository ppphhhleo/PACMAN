import json

tracks = [
    [[0, 25]],  # first row (bottom)
    [[0, 0], [11, 11], [14, 14], [25, 25]],
    [[0, 0], [11, 11], [14, 14], [25, 25]],
    [[0, 5], [8, 11], [14, 17], [20, 25]],
    [[2, 2], [5, 5], [8, 8], [17, 17], [20, 20], [23, 23]],
    [[2, 2], [5, 5], [8, 8], [17, 17], [20, 20], [23, 23]],
    [[0, 2], [5, 20], [23, 25]],
    [[0, 0], [5, 5], [11, 11], [14, 14], [20, 20], [25, 25]],
    [[0, 0], [5, 5], [11, 11], [14, 14], [20, 20], [25, 25]],
    [[0, 11], [14, 25]],
    [[5, 5], [8, 8], [17, 17], [20, 20]],
    [[5, 5], [8, 8], [17, 17], [20, 20]],
    [[5, 5], [8, 17], [20, 20]],
    [[5, 5], [8, 8], [17, 17], [20, 20]],
    [[5, 5], [8, 8], [17, 17], [20, 20]],
    [[0, 8], [17, 25]],  # tunnels
    [[5, 5], [8, 8], [17, 17], [20, 20]],
    [[5, 5], [8, 8], [17, 17], [20, 20]],
    [[5, 5], [8, 17], [20, 20]],
    [[5, 5], [11, 11], [14, 14], [20, 20]],
    [[5, 5], [11, 11], [14, 14], [20, 20]],
    [[0, 5], [8, 11], [14, 17], [20, 25]],
    [[0, 0], [5, 5], [8, 8], [17, 17], [20, 20], [25, 25]],
    [[0, 0], [5, 5], [8, 8], [17, 17], [20, 20], [25, 25]],
    [[0, 25]],
    [[0, 0], [5, 5], [11, 11], [14, 14], [20, 20], [25, 25]],
    [[0, 0], [5, 5], [11, 11], [14, 14], [20, 20], [25, 25]],
    [[0, 0], [5, 5], [11, 11], [14, 14], [20, 20], [25, 25]],
    [[0, 11], [14, 25]]
]

rows = len(tracks)
cols = 26  
grid = [[0 for _ in range(cols)] for _ in range(rows)]

for row_idx, row in enumerate(tracks):
    for start, end in row:
        for col in range(start, end + 1):
            grid[row_idx][col] = 1

for row in grid:
    line = ''.join(['.' if cell == 1 else '#' for cell in row])
    print(line)
with open('graph.json', 'w') as f:
    json.dump(grid, f)
