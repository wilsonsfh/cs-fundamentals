# Backtracking

## When to Use

- Generate **all permutations, combinations, subsets**
- **Constraint satisfaction**: Sudoku, N-Queens, word search
- **Decision tree** exploration with pruning
- Keywords: "all possible", "generate", "find all", "enumerate"

**Signal:** Need to explore all possibilities with pruning of invalid branches.

---

## Template

```python
def backtrack(candidates, path, result, start=0):
    # Base case: path is a valid solution
    if is_solution(path):
        result.append(path[:])  # copy! not reference
        return

    for i in range(start, len(candidates)):
        # Pruning: skip invalid choices
        if should_prune(candidates[i], path):
            continue

        # Choose
        path.append(candidates[i])

        # Explore (start=i for reuse, start=i+1 for no reuse)
        backtrack(candidates, path, result, start=i + 1)

        # Un-choose (backtrack)
        path.pop()

def solve(candidates):
    result = []
    backtrack(candidates, [], result)
    return result
```

### With deduplication (for arrays with duplicates)

```python
def backtrack_dedup(candidates, path, result, start=0):
    result.append(path[:])

    for i in range(start, len(candidates)):
        # Skip duplicates at same level
        if i > start and candidates[i] == candidates[i - 1]:
            continue

        path.append(candidates[i])
        backtrack_dedup(candidates, path, result, i + 1)
        path.pop()

# Sort first!
candidates.sort()
```

---

## My Gotchas

- **Always copy path** when appending to result: `result.append(path[:])` not `result.append(path)`
- **Sort input** before deduplication pruning
- `start=i` for combinations with repetition, `start=i+1` for without
- For permutations, use a `used` boolean array instead of `start`
- **`nonlocal` is not optional when DFS updates outer variables** — without it Python silently creates a new local variable and your update is lost
- **Output format ≠ internal representation** — solve for the correct answer first, then format the output to match exactly what's asked
- **Tie-breaking requires extra tracking state** — track both the solution *and* the property you're optimising for (e.g. `best_minus_count`)

---

## DFS for Expression Problems (±)

When a problem asks "assign `+` or `-` to make total = 0" (or some target):

```python
def solve(nums, target):
    best = [None]
    best_minus_count = [-1]

    def dfs(i, total, signs):
        nonlocal best, best_minus_count  # required — we're assigning, not just reading
        if i == len(nums):
            if total == target:
                minus_count = signs.count('-')
                if minus_count > best_minus_count[0]:
                    best[0] = signs
                    best_minus_count[0] = minus_count
            return

        dfs(i + 1, total + nums[i], signs + '+')
        dfs(i + 1, total - nums[i], signs + '-')

    dfs(0, 0, "")
    return best[0]
```

> **Train of thought:** `nonlocal` is needed because we're *assigning* to `best` and `best_minus_count`, not just mutating them. If you use a list (`best = [None]`), mutation (`best[0] = ...`) works without `nonlocal` — but the `nonlocal` version is cleaner.

### Scope Reference

| Scope | Keyword | Example |
|---|---|---|
| Current function | (none) | `x = 1` |
| Enclosing function | `nonlocal` | `nonlocal best` |
| Module level | `global` | `global config` |

---

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Subsets | Medium | include/exclude each element | [LC 78](https://leetcode.com/problems/subsets/) |
| Subsets II (with duplicates) | Medium | sort + skip duplicate at same level | [LC 90](https://leetcode.com/problems/subsets-ii/) |
| Permutations | Medium | used[] array, no start index | [LC 46](https://leetcode.com/problems/permutations/) |
| Combination Sum | Medium | can reuse elements (start=i) | [LC 39](https://leetcode.com/problems/combination-sum/) |
| N-Queens | Hard | row constraint + col/diag sets | [LC 51](https://leetcode.com/problems/n-queens/) |
| Word Search | Medium | DFS on grid with visited | [LC 79](https://leetcode.com/problems/word-search/) |

---

## Flashcards

Backtracking template: 3 steps inside the loop?
?
1. **Choose** — `path.append(candidates[i])`
2. **Explore** — recursive call
3. **Un-choose** — `path.pop()`

Why must you copy path when appending to result?::``path`` is mutated during backtracking — ``result.append(path[:])`` captures the current state; ``result.append(path)`` just stores a reference.

`start=i` vs `start=i+1` in combination problems?::``start=i`` → element can be reused (Combination Sum).  ``start=i+1`` → each element used at most once.

Deduplication in backtracking requires 2 things?
?
1. Sort the input first
2. Skip: ``if i > start and candidates[i] == candidates[i-1]: continue``

Permutations vs Combinations: key difference in template?::Permutations use a ``used[]`` boolean array (no start index — all positions revisitable). Combinations use a ``start`` index.

When does backtracking add to result: at base case or every call?::Base case only for fixed-length results (permutations). Every call for subsets.

DFS updates outer variable but nothing changes — what's the bug?::Missing `nonlocal`. Without it, Python treats the assignment as creating a new local variable. The outer variable is never updated.

`nonlocal` vs mutable container workaround — when to use each?::Both work. `nonlocal best` is cleaner when there's one outer variable. `best = [None]` + `best[0] = ...` works without `nonlocal` because it mutates (not assigns) — useful when `nonlocal` feels awkward.

DFS for ± expression problem: how do you find the solution with the most minus signs?
?
Track two outer variables: `best` (the signs string) and `best_minus_count`. At the base case, only update `best` if `signs.count('-') > best_minus_count`. This filters to the optimal valid solution.

DFS ± problem: your logic is correct but the output is `2+6+7-1-2` instead of `++--`. What's wrong?::Output format mismatch. You returned the full expression; the problem wants only the signs (`+` or `-`). Solve for correctness first, then format output separately.

Base conversion: why do you prepend digits instead of appending?::The first remainder computed is the **least significant digit** (rightmost). Prepending builds the correct order immediately. Appending requires a reverse at the end.

Python string classification: how do you detect a symbol (punctuation/special char)?::`not c.isalnum()` — catches anything that is neither a letter nor a digit. `isalnum()` returns True for letters and digits, so its negation covers all symbols.
