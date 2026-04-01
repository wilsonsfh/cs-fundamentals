# Binary Search

## When to Use

- Input is **sorted** (array, search space, answer space)
- **"Find minimum/maximum value that satisfies condition X"** (binary search on answer)
- **"Find target in rotated sorted array"**
- O(log n) time is expected/required

**Signal:** If you can define a monotonic predicate (all False then all True, or vice versa), binary search applies.

---

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
    # Define: feasible(mid) returns True if mid satisfies the condition
    def feasible(mid):
        pass  # implement condition check

    while lo < hi:
        mid = lo + (hi - lo) // 2
        if feasible(mid):
            hi = mid        # answer could be mid or smaller
        else:
            lo = mid + 1    # mid is too small

    return lo  # smallest value satisfying feasible()
```

---

## My Gotchas

- `lo <= hi` for exact search, `lo < hi` for bound search — **do not mix**
- `hi = len(arr)` (not `len-1`) when searching for insertion point
- Avoid integer overflow: `mid = lo + (hi - lo) // 2`

### Why `mid = right // 2` is silently wrong

```python
mid = right // 2          # WRONG — ignores left entirely
mid = (left + right) // 2 # CORRECT — mid tracks the shrinking interval
```

When `left` has advanced (e.g. `left = 6, right = 10`), `right // 2 = 5` — outside `[left, right]`. The search space shrinks but `mid` doesn't follow it. Binary search quietly searches the wrong region.

> `mid` must always be a function of **both** boundaries.

---

## Loop Condition Semantics

The condition you choose commits you to a contract. Mixing them is the most common source of off-by-one bugs.

| Condition | Meaning | Use for |
|---|---|---|
| `while lo <= hi` | "check every candidate including `lo == hi`" | Exact target search |
| `while lo < hi` | "stop with 1 candidate remaining — handle it after" | Lower/upper bound search |

### The `lo == hi` state is not a termination shortcut — it's a valid candidate

```python
# With lo <= hi: the lo == hi case is handled inside the loop — safe
# With lo < hi:  the loop exits with lo == hi still unchecked — you MUST verify after
result = lo if nums[lo] == target else -1
```

### The dangerous mix (root cause of most binary search bugs)

```
✗ while lo < hi   ← boundary-style termination
    ... exact search logic ...   ← never post-checks lo == hi
```

This skips valid answers at edge positions — especially:
- single-element arrays `[5]`
- two-element arrays `[1, 3]`
- target at the last position

---

## Debugging Checklist

When a binary search is wrong, check in order:

1. **Mid validity** — is `mid ∈ [lo, hi]` every iteration? (`(lo + hi) // 2`, not `hi // 2`)
2. **Progress guarantee** — does every branch move `lo` or `hi`? No branch can leave both unchanged.
3. **Coverage** — with your loop condition, are all candidates evaluated before exit?
4. **Final state** — if `lo < hi` loop, is `nums[lo]` checked after the loop?

### Quickest diagnostic

```python
while ...:
    print(lo, mid, hi)   # must change every iteration — if stuck, infinite loop
```

Simulate the two smallest cases by hand: `[x]` and `[x, y]`. These expose termination bugs faster than any large array.

---

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Binary Search | Easy | standard template | [LC 704](https://leetcode.com/problems/binary-search/) |
| Find Minimum in Rotated Sorted Array | Medium | compare mid vs right | [LC 153](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) |
| Koko Eating Bananas | Medium | binary search on answer (speed) | [LC 875](https://leetcode.com/problems/koko-eating-bananas/) |
| Search in Rotated Sorted Array | Medium | determine which half is sorted | [LC 33](https://leetcode.com/problems/search-in-rotated-sorted-array/) |

---

## Flashcards

Exact search uses `lo <= hi`; lower bound search uses ==`lo < hi`==.

Safe midpoint formula (no overflow)::``mid = lo + (hi - lo) // 2``
<!--SR:!2026-03-27,2,230-->

Binary search on answer: what must be true about the predicate?::It must be monotonic — all False then all True (or vice versa) across the search space.

For "find minimum satisfying X", what does the template return?::``lo`` — the smallest value where ``feasible(mid)`` is True.

Why set `hi = len(arr)` (not `len-1`) for lower bound?::The answer could be an insertion at the end — need to include index `len` as a candidate.

Binary search on answer: when do you set `hi = mid` vs `lo = mid + 1`?
?
- `feasible(mid)` is True → answer could be `mid` or smaller → `hi = mid`
- `feasible(mid)` is False → mid is too small → `lo = mid + 1`

Why is `mid = right // 2` wrong?::It ignores `left`. When `left` has advanced (e.g. `left=6, right=10`), `right // 2 = 5` — outside the search space. `mid` must depend on **both** boundaries: `(left + right) // 2`.

`while lo <= hi` vs `while lo < hi` — what contract does each make?::`lo <= hi` checks every candidate including the `lo == hi` case inside the loop. `lo < hi` exits with one unchecked candidate — you must verify `nums[lo]` after the loop.

What bugs does mixing `while lo < hi` with exact search logic cause?::Skips the final candidate when `lo == hi`. Fails on single-element arrays, two-element arrays, and targets at the last position.

Binary search debugging: what's the first thing to print?::`print(lo, mid, hi)` each iteration. If any iteration shows no change — infinite loop. If `mid` ever falls outside `[lo, hi]` — wrong mid formula.

What are the two smallest cases to always simulate by hand for binary search?::`[x]` (single element) and `[x, y]` (two elements). These expose termination and off-by-one bugs faster than any large input.

`lo == hi` state in binary search — valid candidate or safe to ignore?::Valid candidate. With `lo <= hi`, it's handled inside the loop. With `lo < hi`, the loop exits before checking it — you must check `nums[lo]` explicitly after.
