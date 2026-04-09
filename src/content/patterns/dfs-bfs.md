# DFS / BFS

---

## Mental Models (Your Thought Process — Corrections)

**Your thought:** "BFS = exploring all paths partially and storing shortest"

**Correction:** BFS does not store paths while comparing them. It just visits nodes level by level. The shortest path falls out naturally from the traversal order — the first time you reach the goal is guaranteed to be the shortest because you visit closer nodes before farther ones.

> BFS finds shortest path because of order, not because it tracks or compares paths.

---

**Your thought:** "Permutations need something more than DFS — you try all possibilities for each position"

**Correction:** That is exactly DFS on a decision tree. Each position in the permutation is a level in the tree. DFS explores one full branch (one complete permutation), then backtracks to try the next.

```
Level 0: []
Level 1: [1], [2], [3]
Level 2: [1,2], [1,3], ...
Level 3: [1,2,3], [1,3,2], ...
```

Permutations, subsets, Sudoku — all are DFS on a decision tree with constraints.

---

## What "Exploring Paths" Actually Means

You are not explicitly tracking paths — you are exploring a search tree.

```
A
├── B
│   ├── E
│   └── F
└── C
    ├── G
    └── H
```

**BFS traversal order:**
```
A → B, C → E, F, G, H
```
(level by level — all distance-1 nodes before any distance-2 node)

**DFS traversal order:**
```
A → B → E → (dead end) → backtrack → F → backtrack → C → G → H
```
(one full branch before the next)

---

## Why Queue for BFS, Stack for DFS

The data structure is not arbitrary — it enforces the traversal order. The algorithm is defined by *which node gets processed next*, and the data structure is what guarantees that.

**BFS requires FIFO (queue):**
BFS must process all nodes at distance 1 before any at distance 2. A queue enqueues children at the back and dequeues parents from the front — oldest entries come out first, which preserves level order.

**DFS requires LIFO (stack or recursion):**
DFS must go as deep as possible before backtracking to siblings. A stack pushes children and pops from the same end — most recently discovered node is processed next, which drives depth-first behaviour.

**Why recursion naturally gives DFS, not BFS:**

Recursion behaves like a call stack (LIFO). When you call `dfs(neighbor)`, you go deeper immediately before finishing the current level. That is depth-first by nature.

To do BFS recursively you would have to manually pass entire levels between calls — unnatural and inefficient. This is why BFS is always written iteratively with a queue.

```
Queue (FIFO) → "process in the order discovered"    → BFS
Stack (LIFO) → "process the most recently found"   → DFS
```

If you accidentally use `stack.pop(0)` (FIFO) in a DFS loop, you get BFS. If you use a stack in place of a queue, you get DFS.

---

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

## Backtracking = DFS + Undo

Backtracking is DFS on a decision tree where you undo your choice after each branch. Without undo, state bleeds across branches and corrupts subsequent paths.

```
choose → explore (DFS) → undo
```

Example — permutations of `[1,2,3]`:

```python
def backtrack(path, used):
    if len(path) == len(nums):
        result.append(path[:])
        return
    for i in range(len(nums)):
        if used[i]:
            continue
        used[i] = True
        path.append(nums[i])
        backtrack(path, used)
        path.pop()        # undo
        used[i] = False   # undo
```

Without `path.pop()` and `used[i] = False`, the next branch starts from a corrupted state.

---

## Cycle Detection with DFS

Track two things:

- `visited` — nodes ever seen (across all DFS calls)
- `in_stack` — nodes on the current active path

```python
def has_cycle(node, visited, in_stack, graph):
    visited.add(node)
    in_stack.add(node)

    for neighbor in graph[node]:
        if neighbor not in visited:
            if has_cycle(neighbor, visited, in_stack, graph):
                return True
        elif neighbor in in_stack:  # back edge = cycle
            return True

    in_stack.remove(node)
    return False
```

**Why `in_stack` and not just `visited`?**
`visited` alone cannot distinguish "I've seen this node in a previous DFS call" from "this node is on my current path." Only the latter is a cycle. `in_stack` tracks the current path only.

**Why BFS does not work for cycle detection:**
BFS has no concept of "current path." It spreads level by level without tracking which nodes form a chain.

---

## My Gotchas

- Always track `visited` to avoid infinite loops in graphs
- For trees, no `visited` needed (no cycles)
- BFS gives **shortest path** only for unweighted graphs
- BFS does not "store" the shortest path — it finds it first because of level-by-level order
- Backtracking requires explicit undo — forgetting `pop()` or resetting flags corrupts all subsequent branches
- Cycle detection needs `in_stack`, not just `visited` — a node seen in a past DFS branch is not a cycle
- Using `stack.pop(0)` instead of `stack.pop()` in a DFS loop silently turns it into BFS — FIFO vs LIFO changes the algorithm entirely
- Recursion cannot naturally do BFS — the call stack is LIFO, which forces DFS order

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

Why does BFS guarantee the shortest path in an unweighted graph?::It visits nodes in order of distance from the start. The first time you reach the goal it must be via the shortest route — closer nodes are always processed before farther ones.

What is the difference between `visited` and `in_stack` in cycle detection?::`visited` = ever seen (across all calls). `in_stack` = on the current active path. Only a node on the current path forms a cycle — a node seen in a past branch does not.

Why does backtracking require an explicit undo step?::Without undoing the choice (e.g. `path.pop()`, `used[i] = False`), state bleeds into subsequent branches and corrupts them.

Permutations / subsets / Sudoku — what algorithm category are these?::DFS on a decision tree with constraints. Each level of the tree is one decision. Backtracking undoes the decision after each branch.

Why can BFS not detect cycles?::BFS has no concept of a current path — it spreads level by level. Cycle detection requires knowing which nodes form the current chain, which only DFS tracks via recursion or an explicit stack.

Why does BFS use a queue and not recursion?::Recursion behaves like a stack (LIFO) — it goes deep immediately. BFS needs FIFO to process all nodes at the current level before going deeper. Implementing BFS recursively requires manually passing entire levels, which is unnatural.

What happens if you use `stack.pop(0)` instead of `stack.pop()` in a DFS loop?::You get BFS. `pop(0)` gives FIFO order; `pop()` gives LIFO. The traversal order — and therefore the algorithm — changes entirely.

What is the actual defining property of BFS vs DFS (not the data structure)?::The order nodes are processed: BFS processes in increasing distance from start (level order); DFS processes by going deep before siblings. The data structure just enforces that order.
