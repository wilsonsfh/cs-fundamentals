# Backtracking

## When to Use

- Generate **all permutations, combinations, subsets**
- **Constraint satisfaction**: Sudoku, N-Queens, word search
- **Decision tree** exploration with pruning
- Keywords: "all possible", "generate", "find all", "enumerate"

**Signal:** Need to explore all possibilities with pruning of invalid branches.

## Template

```python
def backtrack(candidates, path, result, start=0):
    if is_solution(path):
        result.append(path[:])  # copy! not reference
        return

    for i in range(start, len(candidates)):
        if should_prune(candidates[i], path):
            continue

        path.append(candidates[i])
        backtrack(candidates, path, result, start=i + 1)
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
        if i > start and candidates[i] == candidates[i - 1]:
            continue

        path.append(candidates[i])
        backtrack_dedup(candidates, path, result, i + 1)
        path.pop()

# Sort first!
candidates.sort()
```

## My Gotchas

- **Always copy path** when appending to result: `result.append(path[:])` not `result.append(path)`
- **Sort input** before deduplication pruning
- `start=i` for combinations with repetition, `start=i+1` for without
- For permutations, use a `used` boolean array instead of `start`

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Subsets | Medium | include/exclude each element | [LC 78](https://leetcode.com/problems/subsets/) |
| Subsets II (with duplicates) | Medium | sort + skip duplicate at same level | [LC 90](https://leetcode.com/problems/subsets-ii/) |
| Permutations | Medium | used[] array, no start index | [LC 46](https://leetcode.com/problems/permutations/) |
| Combination Sum | Medium | can reuse elements (start=i) | [LC 39](https://leetcode.com/problems/combination-sum/) |
| N-Queens | Hard | row constraint + col/diag sets | [LC 51](https://leetcode.com/problems/n-queens/) |
| Word Search | Medium | DFS on grid with visited | [LC 79](https://leetcode.com/problems/word-search/) |

## Flashcards

Backtracking template: 3 steps inside the loop?
?
1. **Choose** — `path.append(candidates[i])`
2. **Explore** — recursive call
3. **Un-choose** — `path.pop()`

Why must you copy path when appending to result?::`path` is mutated during backtracking — `result.append(path[:])` captures the current state; `result.append(path)` just stores a reference.

`start=i` vs `start=i+1` in combination problems?::`start=i` → element can be reused (Combination Sum). `start=i+1` → each element used at most once.

Deduplication in backtracking requires 2 things?
?
1. Sort the input first
2. Skip: `if i > start and candidates[i] == candidates[i-1]: continue`

Permutations vs Combinations: key difference in template?::Permutations use a `used[]` boolean array (no start index). Combinations use a `start` index.

When does backtracking add to result: at base case or every call?::Base case only for fixed-length results (permutations). Every call for subsets.
