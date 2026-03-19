# DFS / BFS

## When to Use

**DFS:** Explore all paths, detect cycles, topological sort, tree traversal (pre/in/post-order)
**BFS:** Shortest path in **unweighted** graph, level-order traversal, multi-source spreading

**Signal:**
- Tree/graph problem → think DFS or BFS first
- "Shortest path" or "minimum steps" → BFS
- "All paths", "connected components", "can you reach X" → DFS

---

## Template

### DFS — Recursive (tree/graph)

```python
def dfs(node, visited=None):
    if visited is None:
        visited = set()
    if node is None or node in visited:
        return

    visited.add(node)
    # process node

    for neighbor in node.neighbors:
        dfs(neighbor, visited)
```

### DFS — Iterative (explicit stack)

```python
def dfs_iterative(start):
    stack = [start]
    visited = set([start])

    while stack:
        node = stack.pop()
        # process node

        for neighbor in node.neighbors:
            if neighbor not in visited:
                visited.add(neighbor)
                stack.append(neighbor)
```

### BFS — Level-order

```python
from collections import deque

def bfs(start):
    queue = deque([start])
    visited = set([start])
    steps = 0

    while queue:
        for _ in range(len(queue)):  # process level by level
            node = queue.popleft()
            # process node

            for neighbor in node.neighbors:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        steps += 1

    return steps
```

### Grid DFS/BFS

```python
DIRECTIONS = [(0,1),(0,-1),(1,0),(-1,0)]

def valid(r, c, grid):
    return 0 <= r < len(grid) and 0 <= c < len(grid[0])

def bfs_grid(grid, start_r, start_c):
    queue = deque([(start_r, start_c)])
    visited = set([(start_r, start_c)])

    while queue:
        r, c = queue.popleft()
        for dr, dc in DIRECTIONS:
            nr, nc = r + dr, c + dc
            if valid(nr, nc, grid) and (nr, nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc))
```

---

## My Gotchas

> Fill in after solving problems.

- Always track `visited` to avoid infinite loops in graphs
- For trees, no `visited` needed (no cycles)
- BFS gives **shortest path** only for unweighted graphs

---

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Number of Islands | Medium | DFS/BFS flood fill | [LC 200](https://leetcode.com/problems/number-of-islands/) |
| Word Ladder | Hard | BFS on state space | [LC 127](https://leetcode.com/problems/word-ladder/) |
| Course Schedule | Medium | DFS cycle detection (topological) | [LC 207](https://leetcode.com/problems/course-schedule/) |
| Binary Tree Level Order Traversal | Medium | BFS level by level | [LC 102](https://leetcode.com/problems/binary-tree-level-order-traversal/) |
| Rotten Oranges | Medium | multi-source BFS | [LC 994](https://leetcode.com/problems/rotting-oranges/) |

---

## Flashcards

DFS vs BFS: which gives shortest path?::==BFS== — only for unweighted graphs.

DFS vs BFS: which is better for "all paths" or cycle detection?::==DFS==

Why do you need a `visited` set in graph DFS/BFS but not tree DFS?::Graphs can have cycles; trees are acyclic by definition.

BFS level-order: how do you process one level at a time?::Loop ``for _ in range(len(queue))`` before dequeuing — captures the current level size before adding children.

Grid directions array::``DIRECTIONS = [(0,1),(0,-1),(1,0),(-1,0)]``

Multi-source BFS: how do you initialise it?::Add **all** source nodes to the queue at the start (and mark all as visited) before the main loop.

Topological sort signal::Directed graph + "prerequisites" / "ordering" / "course schedule" → DFS cycle detection or BFS (Kahn's algorithm).
