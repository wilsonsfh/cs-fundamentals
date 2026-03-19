# Dynamic Programming

**Pattern Type:** Algorithmic Optimization Technique
**Core Idea:** Solve problems by breaking them into overlapping subproblems, solve each once, and reuse the results

---

## Why DP Works: Time Complexity Reduction

### The General Formula

```
Time Complexity = (Number of unique subproblems/states) × (Time to compute each state)
```

The key insight is the word **unique**. Without DP, you recompute the same subproblems over and over. With DP, each one is solved exactly once.

### Exponential → Polynomial

| Problem | Brute Force | With DP | What changed |
|---------|-------------|---------|--------------|
| Fibonacci | O(2^n) | O(n) | Each `fib(i)` solved once |
| LCS | O(2^(m+n)) | O(m×n) | Each `(i,j)` pair solved once |
| Matrix Chain | O(exponential) | O(n³) | Each interval `(i,j)` solved once |
| 0/1 Knapsack | O(2^n) | O(n×W) | Each `(item, capacity)` pair solved once |

### The Trade-off

DP spends memory to save time. Every subproblem result is stored so it's never recomputed. This is almost always worth it for the problems DP applies to.

- **Gain:** Exponential → Polynomial time
- **Cost:** O(n), O(n²), O(n×W), etc. extra space

---

## What Happens as n Grows

This is where DP's limits become visible. Not all polynomial complexities are equal.

### Concrete Numbers: O(2^n) vs O(n) vs O(n²) vs O(n³)

| n | O(n) | O(n²) | O(n³) | O(n×W) (W=1000) | O(2^n) brute force |
|---|------|-------|-------|------------------|--------------------|
| 10 | 10 | 100 | 1,000 | 10,000 | 1,024 |
| 20 | 20 | 400 | 8,000 | 20,000 | 1,048,576 |
| 50 | 50 | 2,500 | 125,000 | 50,000 | ~10^15 (years to run) |
| 100 | 100 | 10,000 | 1,000,000 | 100,000 | ~10^30 (impossible) |
| 1,000 | 1,000 | 1,000,000 | 10^9 (slow) | 10^6 | dead |
| 10,000 | 10,000 | 10^8 (slow) | 10^12 (dead) | 10^7 | dead |

**Reading the table:**
- O(n) and O(n×W): fine well into millions
- O(n²): starts hurting around n=10,000
- O(n³): hits a wall around n=1,000 — **this is where Matrix Chain Multiplication becomes impractical at large scale**
- O(2^n): useless past n=50 without DP

### When DP Itself Becomes the Bottleneck

DP is not a silver bullet. The `n×W` in knapsack is the first sign:

```
n = 1,000 items, W = 1,000,000 capacity
DP table size = 1,000 × 1,000,000 = 10^9 cells

That's ~8 GB of memory if each cell is a 64-bit integer.
Not feasible.
```

Similarly, LCS on two strings of length 100,000 (e.g. comparing large files):
```
m × n = 100,000 × 100,000 = 10^10 cells
Not feasible — this is why diff tools use approximations in practice.
```

At this scale, DP gives you the exact answer but the exact answer becomes uncomputable. This is when you reach for something else.

---

## When NOT to Use DP: Alternatives

### 1. When Greedy Is Sufficient (Faster, Simpler)

Greedy works when a **locally optimal choice always leads to a globally optimal solution** — i.e., you never need to look back. No subproblems overlap because each decision is final.

| Problem | Why Greedy Works (No Need for DP) |
|---------|-----------------------------------|
| Coin Change (canonical coins) | Always pick the largest coin that fits — leads to optimal |
| Activity Selection | Always pick the earliest-ending activity — greedy is provably optimal |
| Fractional Knapsack | Take the highest value-per-weight first — you can split items, so local is global |
| Huffman Encoding | Always merge the two smallest frequency nodes — provably optimal |

**Key distinction:**
- **0/1 Knapsack** → items are whole, taking one item blocks others → choices interact → **DP required**
- **Fractional Knapsack** → items are divisible, no blocking → choices are independent → **Greedy works**

**Rule:** Try greedy first. If you can prove "local optimal = global optimal", use it. O(n log n) beats O(n²) every time.

### 2. When Heuristics Are Needed (n is Too Large for Exact DP)

When the state space explodes and exact answers become computationally infeasible, **heuristic algorithms** give you a good-enough answer fast.

| Scenario | DP Complexity | Why It Fails | Heuristic Alternative |
|----------|--------------|-------------|----------------------|
| Travelling Salesman (TSP) | O(n² × 2^n) | n=50 is already intractable | Nearest-neighbour, simulated annealing, genetic algorithms |
| Large Knapsack (huge W) | O(n × W) | W=10^9 means 10^12 cells | FPTAS (Fully Polynomial-Time Approximation Scheme), branch and bound |
| Protein folding | Exponential states | State space is astronomically large | Monte Carlo methods, ML-based (AlphaFold) |
| Real-time route planning | O(n²) or worse | Maps have billions of nodes | A* heuristic search, contraction hierarchies |

**Heuristics accept a trade-off:** you get a solution that's maybe 95–99% optimal, but computed in seconds instead of years.

### 3. When BFS/DFS Is More Natural

If your problem asks for **shortest path** or **reachability** (not optimization), BFS/DFS often works without the overhead of building a DP table.

```
Shortest path in an unweighted graph → BFS (O(V+E))
Shortest path in a weighted graph    → Dijkstra (O(E log V))
Both are faster than DP grid approaches for graph problems
```

DP shines for **sequence problems** (strings, arrays). BFS/Dijkstra shines for **graph problems** (nodes, edges).

### 4. When the Problem Has No Optimal Substructure

Some problems look like DP but aren't:

```
Longest simple path in a graph:
  Optimal substructure FAILS — taking the optimal path to node A
  might block the path to node B, so local optimal ≠ global optimal

  This is NP-hard. No polynomial algorithm known.
```

If you can't define a clean recurrence where `dp[i]` fully describes what you need from subproblems, DP won't give you a correct answer.

---

## When to Use DP (Both Conditions Required)

### 1. Overlapping Subproblems
The same subproblem appears multiple times in the recursion tree.

```
Fibonacci: fib(5) needs fib(3)
           fib(4) needs fib(3)  ← computed twice

Without DP: 2^n calls
With DP:    n calls, each unique
```

### 2. Optimal Substructure
The optimal solution is built from optimal solutions to subproblems.

```
Knapsack: Best for capacity W =
  max(best for W-weight[i] + value[i],   ← include item i
      best for W without item i)          ← exclude item i
      ↑
      Both branches use optimal subproblem answers
```

**Keywords that signal DP:** "maximum", "minimum", "count ways", "can you achieve", "longest", "shortest"

---

## Template

### Top-Down (Memoization)

```python
from functools import lru_cache

def dp_topdown(n):
    @lru_cache(maxsize=None)
    def solve(i):
        if i <= 0:              # base case
            return base_value
        return max(solve(i - 1) + ..., solve(i - 2) + ...)   # recurrence

    return solve(n)
```

### Bottom-Up (Tabulation)

```python
def dp_bottomup(n):
    dp = [0] * (n + 1)
    dp[0] = base_value_0
    dp[1] = base_value_1

    for i in range(2, n + 1):
        dp[i] = max(dp[i-1] + ..., dp[i-2] + ...)

    return dp[n]
```

### 2D DP (grid, strings, knapsack)

```python
def dp_2d(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]

    for i in range(m):
        for j in range(n):
            if i == 0 and j == 0:
                continue
            dp[i][j] = grid[i][j] + min(
                dp[i-1][j] if i > 0 else float('inf'),
                dp[i][j-1] if j > 0 else float('inf')
            )

    return dp[m-1][n-1]
```

---

## Example Problems with Detailed Analysis

### 1. Fibonacci Sequence
**LeetCode:** [509. Fibonacci Number](https://leetcode.com/problems/fibonacci-number/) | **Difficulty:** Easy

**Why DP is perfect:**
- **Overlapping subproblems:** `fib(5)` calls `fib(4)` and `fib(3)`. `fib(4)` also calls `fib(3)`. Same work repeated.
- **Optimal substructure:** `fib(n) = fib(n-1) + fib(n-2)`

**Complexity:**
```
Plain recursion:   O(2^n)   fib(40) ≈ 2 billion calls
DP memoization:    O(n)     fib(40) = 40 calls, each solved once
DP tabulation:     O(n)     Single loop, O(n) space
```

**Space optimization:** Use two variables instead of array → O(1) space:
```python
a, b = 0, 1
for _ in range(n):
    a, b = b, a + b
return a
```

**At scale:** At n=1000, plain recursion would call 2^1000 ≈ 10^301 subproblems. Python can't even represent that number of operations. DP makes n=10,000 trivial.

---

### 2. Longest Common Subsequence (LCS)
**LeetCode:** [1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/) | **Difficulty:** Medium

**Why DP is perfect:**
- **Overlapping subproblems:** `lcs(i, j)` is computed in multiple branches of recursion
- **Optimal substructure:**
  - If `s1[i] == s2[j]`: `lcs(i,j) = 1 + lcs(i-1, j-1)`
  - Else: `lcs(i,j) = max(lcs(i-1, j), lcs(i, j-1))`

**Complexity:**
```
Plain recursion:   O(2^(m+n))   Exponential
DP tabulation:     O(m × n)     Fill m×n table once
```

**At scale:** For m=n=1000, DP requires 10^6 cells — instant. For m=n=100,000 (large file diff), 10^10 cells — infeasible. Real diff tools use **patience diff** or **Myers diff** (linear-space heuristic approximations) instead.

**Real-world use:** DNA alignment, git diff, spell checkers, auto-complete

---

### 3. Matrix Chain Multiplication
**LeetCode:** [1039. Minimum Score Triangulation of Polygon](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/) | **Difficulty:** Medium

**Why DP is perfect:**
- **Overlapping subproblems:** `minCost(i, j)` for different bracket positions reuses earlier results
- **Optimal substructure:** Try all split points k: `minCost(i,j) = min(minCost(i,k) + minCost(k,j) + cost(i,k,j))`

**Complexity:**
```
Brute force (all parenthesizations):   O(Catalan(n)) ≈ O(4^n / n^1.5)
DP tabulation:                         O(n³)
```

**At scale:** O(n³) is polynomial but grows fast. At n=1000, that's 10^9 operations — borderline. At n=10,000, it's 10^12 — not feasible. For deep learning frameworks that need to optimize large computation graphs, **greedy heuristics** and **profile-guided ordering** are used instead.

**Real-world use:** Optimizing matrix multiplication order in ML pipelines, parse trees, interval DP problems

---

### 4. 0/1 Knapsack Problem
**LeetCode:** [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/) (knapsack variant) | **Difficulty:** Medium

**Why DP is perfect:**
- **Overlapping subproblems:** `dp[i][w]` (best value using first i items with capacity w) appears in multiple branches
- **Optimal substructure:** `dp[i][w] = max(dp[i-1][w], value[i] + dp[i-1][w-weight[i]])`

**Complexity:**
```
Brute force (all subsets):   O(2^n)     Try every combination of n items
DP tabulation:               O(n × W)   n items × W capacity slots
```

**At scale — the pseudo-polynomial problem:** O(n×W) looks polynomial, but W can be astronomically large. If `W = 10^9` (a common real-world constraint), `n × W = 10^12` — completely infeasible. This is why Knapsack is technically **NP-hard**. The complexity is polynomial in n but exponential in the *number of bits* needed to represent W.

**When DP fails here:** Use approximation algorithms (FPTAS) that solve to within (1-ε) of optimal in O(n²/ε) time.

**Space optimization:** Reduce from O(n×W) to O(W) by filling the 1D array backwards:
```python
for item in items:
    for w in range(W, weight[item]-1, -1):   # ← backwards is critical
        dp[w] = max(dp[w], dp[w - weight[item]] + value[item])
```

**Real-world use:** Resource allocation, cargo loading, investment portfolio selection

---

### Other Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Climbing Stairs | Easy | dp[i] = dp[i-1] + dp[i-2] | [LC 70](https://leetcode.com/problems/climbing-stairs/) |
| House Robber | Medium | dp[i] = max(dp[i-1], dp[i-2] + nums[i]) | [LC 198](https://leetcode.com/problems/house-robber/) |
| Coin Change | Medium | dp[amount] = min coins needed | [LC 322](https://leetcode.com/problems/coin-change/) |
| Word Break | Medium | dp[i] = any valid split ending at i | [LC 139](https://leetcode.com/problems/word-break/) |

---

## My Gotchas

- Define the state clearly before coding: `dp[i]` means "..."
- Think about the recurrence relation before the base case
- Space optimization: often can reduce from O(n²) to O(n) using rolling array
- **Unbounded Knapsack** — fill forwards (reuse items); **0/1 Knapsack** — fill backwards (each item once)

```python
# Unbounded (coins, cutting rod) — forward fill
for capacity in range(W + 1):
    for item in items:
        dp[capacity] += dp[capacity - item_size]

# 0/1 (partition, subset sum) — backward fill
for item in items:
    for capacity in range(W, item_size - 1, -1):
        dp[capacity] = max(dp[capacity], dp[capacity - item_size] + value)
```

---

## Checklist: Is This a DP Problem?

- [ ] Can I break the problem into subproblems?
- [ ] Do those subproblems overlap (same subproblem computed multiple times)?
- [ ] Can I build the optimal solution from optimal subproblem solutions?
- [ ] Is brute force exponential due to repeated work?

**If all YES** → DP. Implement memoization or tabulation.

**If n is huge and DP table is still too large** → Consider greedy, FPTAS, or heuristics.

**If any NO** → DP won't help. Try greedy, BFS/Dijkstra, or simulation.

---

## Key Takeaway

> DP transforms exponential brute-force into polynomial time by solving each unique subproblem **once**. Use it when you have overlapping subproblems AND optimal substructure. But watch out for pseudo-polynomial problems (Knapsack with huge W) and cubic blow-up (Matrix Chain at large n) — at those scales, heuristics and approximation algorithms take over.

---

## Flashcards

Two conditions required for DP?::1. Optimal substructure  2. Overlapping subproblems

Top-down DP uses ==memoization==; bottom-up DP uses ==tabulation==.

House Robber recurrence::``dp[i] = max(dp[i-1], dp[i-2] + nums[i])``

Coin Change recurrence::``dp[amount] = min(dp[amount - coin] + 1 for coin in coins)``

LCS recurrence?
?
```
if s1[i] == s2[j]: dp[i][j] = dp[i-1][j-1] + 1
else:              dp[i][j] = max(dp[i-1][j], dp[i][j-1])
```

Before coding DP, what 3 things must you define?
?
1. **State** — what does `dp[i]` (or `dp[i][j]`) represent?
2. **Recurrence** — how does `dp[i]` relate to smaller subproblems?
3. **Base case** — what are the smallest known values?

Space optimisation trick for 1D DP::If `dp[i]` only depends on the last 1–2 values, replace the array with two variables.

Why is 0/1 Knapsack technically NP-hard despite having a DP solution?::Its complexity O(n×W) is polynomial in n but exponential in the number of bits needed to represent W — this is called pseudo-polynomial.

When should you use greedy over DP?::When the problem has optimal substructure BUT choices are independent (local optimal = global optimal). Fractional Knapsack, activity selection, Huffman encoding.

At what point does DP itself become impractical?
?
- O(n³) hits a wall around n=1,000–10,000
- O(n×W) fails when W is very large (e.g. W=10^9)
- O(m×n) for LCS fails when strings are > ~100,000 characters
→ Switch to heuristics, FPTAS, or approximation algorithms
