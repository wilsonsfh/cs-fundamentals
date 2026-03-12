# Hash Map / Hash Set

## When to Use

- **Duplicate detection** — has this value been seen before?
- **Frequency counting** — how many times does each element appear?
- **Complement lookup** — find another element that pairs with this one in O(1)
- **Grouping** — bucket elements by a shared property
- **Scoped tracking** — track duplicates per row/column/region, not globally

**Signal:** Brute force needs nested loops for lookup → replace inner loop with a hash map/set for O(1) access.

## Template

### Duplicate detection (scoped per key)

```python
from collections import defaultdict

seen = defaultdict(set)

for item in items:
    category = get_category(item)

    if item in seen[category]:
        return False

    seen[category].add(item)

return True
```

### Frequency counter

```python
from collections import Counter

freq = Counter(arr)

# Or manually:
freq = defaultdict(int)
for x in arr:
    freq[x] += 1
```

### Complement lookup (Two Sum style)

```python
seen = {}

for i, x in enumerate(arr):
    complement = target - x
    if complement in seen:
        return [seen[complement], i]
    seen[x] = i
```

### Grouping by key

```python
from collections import defaultdict

groups = defaultdict(list)

for item in items:
    key = compute_key(item)
    groups[key].append(item)

return list(groups.values())
```

## My Gotchas

- Using one flat set for all categories — loses which category a value belongs to; use `defaultdict(set)` with a key per category
- Forgetting that `defaultdict` creates a key on read — `key in d` won't trigger creation, but `d[key]` will

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Valid Sudoku | Medium | `defaultdict(set)` scoped per row, col, and `(r//3, c//3)` box | [LC 36](https://leetcode.com/problems/valid-sudoku/) |
| Two Sum | Easy | store complement → O(1) lookup instead of O(n) inner loop | [LC 1](https://leetcode.com/problems/two-sum/) |
| Contains Duplicate | Easy | set lookup — if element already in set, it's a duplicate | [LC 217](https://leetcode.com/problems/contains-duplicate/) |
| Group Anagrams | Medium | `sorted(word)` as key groups all anagrams into same bucket | [LC 49](https://leetcode.com/problems/group-anagrams/) |
| Top K Frequent Elements | Medium | `Counter` + heap or bucket sort | [LC 347](https://leetcode.com/problems/top-k-frequent-elements/) |

## Flashcards

When should you use `defaultdict(set)` instead of a plain `set`?
?
When you need separate sets per category (e.g. per row, per column). A plain set loses which category an element belongs to.

`defaultdict(set)` vs `defaultdict(int)` — when to use which?
?
- `defaultdict(set)` — tracking membership / duplicates per key
- `defaultdict(int)` — counting frequency per key

Two Sum: why does storing the complement work?
?
For each `x`, you need `target - x`. Store what you've seen so far; if the complement is already there, the pair is found in O(1) without a second loop.

How do you map a 9x9 Sudoku cell `(r, c)` to its 3x3 box?::`(r // 3, c // 3)` — integer division maps rows 0-2 → 0, 3-5 → 1, 6-8 → 2.
