# Dynamic Programming

## When to Use

- Problem has **optimal substructure** (optimal solution uses optimal sub-solutions)
- Problem has **overlapping subproblems** (same sub-problems computed multiple times)
- Keywords: "maximum", "minimum", "count ways", "can you achieve", "longest", "shortest"

**Signal:** Brute force has exponential time due to repeated work → memoize or tabulate.

## Template

### Top-down (memoization)

```python
from functools import lru_cache

def dp_topdown(n):
    @lru_cache(maxsize=None)
    def solve(i):
        if i <= 0:
            return base_value
        return max(solve(i - 1) + ..., solve(i - 2) + ...)

    return solve(n)
```

### Bottom-up (tabulation)

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

## My Gotchas

- Define the state clearly before coding: `dp[i]` means "..."
- Think about the recurrence relation before the base case
- Space optimization: often can reduce from O(n²) to O(n) using rolling array
- Unbounded Knapsack pattern - Reuse blocks unlimited times to reach a target length

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Climbing Stairs | Easy | dp[i] = dp[i-1] + dp[i-2] | [LC 70](https://leetcode.com/problems/climbing-stairs/) |
| House Robber | Medium | dp[i] = max(dp[i-1], dp[i-2] + nums[i]) | [LC 198](https://leetcode.com/problems/house-robber/) |
| Longest Common Subsequence | Medium | 2D DP on two strings | [LC 1143](https://leetcode.com/problems/longest-common-subsequence/) |
| 0/1 Knapsack | Medium | 2D DP on items × capacity | — |
| Coin Change | Medium | dp[amount] = min coins needed | [LC 322](https://leetcode.com/problems/coin-change/) |
| Word Break | Medium | dp[i] = any valid split ending at i | [LC 139](https://leetcode.com/problems/word-break/) |

## Flashcards

Two conditions required for DP?::1. Optimal substructure  2. Overlapping subproblems

Top-down DP uses memoization; bottom-up DP uses tabulation.

House Robber recurrence::`dp[i] = max(dp[i-1], dp[i-2] + nums[i])`

Coin Change recurrence::`dp[amount] = min(dp[amount - coin] + 1 for coin in coins)`

LCS recurrence?
?
if s1[i] == s2[j]: dp[i][j] = dp[i-1][j-1] + 1
else: dp[i][j] = max(dp[i-1][j], dp[i][j-1])

Before coding DP, what 3 things must you define?
?
1. **State** — what does `dp[i]` (or `dp[i][j]`) represent?
2. **Recurrence** — how does `dp[i]` relate to smaller subproblems?
3. **Base case** — what are the smallest known values?

Space optimisation trick for 1D DP::If `dp[i]` only depends on the last 1–2 values, replace the array with two variables.
