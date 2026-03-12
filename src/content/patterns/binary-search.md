# Binary Search

## When to Use

- Input is **sorted** (array, search space, answer space)
- **"Find minimum/maximum value that satisfies condition X"** (binary search on answer)
- **"Find target in rotated sorted array"**
- O(log n) time is expected/required

**Signal:** If you can define a monotonic predicate (all False then all True, or vice versa), binary search applies.

## Template

### Standard (find exact target)

```python
def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1

    while lo <= hi:
        mid = lo + (hi - lo) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1

    return -1  # not found
```

### Find leftmost (lower bound)

```python
def lower_bound(arr, target):
    lo, hi = 0, len(arr)  # hi = len, not len-1

    while lo < hi:  # strict <
        mid = lo + (hi - lo) // 2
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid

    return lo  # first index where arr[lo] >= target
```

### Binary search on answer space

```python
def binary_search_answer(lo, hi):
    def feasible(mid):
        pass  # implement condition check

    while lo < hi:
        mid = lo + (hi - lo) // 2
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1

    return lo  # smallest value satisfying feasible()
```

## My Gotchas

- `lo <= hi` for exact search, `lo < hi` for bound search
- `hi = len(arr)` (not `len-1`) when searching for insertion point
- Avoid integer overflow: `mid = lo + (hi - lo) // 2`

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Binary Search | Easy | standard template | [LC 704](https://leetcode.com/problems/binary-search/) |
| Find Minimum in Rotated Sorted Array | Medium | compare mid vs right | [LC 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) |
| Koko Eating Bananas | Medium | binary search on answer (speed) | [LC 875](https://leetcode.com/problems/koko-eating-bananas/) |
| Search in Rotated Sorted Array | Medium | determine which half is sorted | [LC 33](https://leetcode.com/problems/search-in-rotated-sorted-array/) |

## Flashcards

Exact search uses `lo <= hi`; lower bound search uses `lo < hi`.

Safe midpoint formula (no overflow)::`mid = lo + (hi - lo) // 2`

Binary search on answer: what must be true about the predicate?::It must be monotonic — all False then all True (or vice versa) across the search space.

For "find minimum satisfying X", what does the template return?::`lo` — the smallest value where `feasible(mid)` is True.

Why set `hi = len(arr)` (not `len-1`) for lower bound?::The answer could be an insertion at the end — need to include index `len` as a candidate.

Binary search on answer: when do you set `hi = mid` vs `lo = mid + 1`?
?
- `feasible(mid)` is True → answer could be `mid` or smaller → `hi = mid`
- `feasible(mid)` is False → mid is too small → `lo = mid + 1`
