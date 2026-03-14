# Hash Map / Hash Set

## When to Use

- **Duplicate detection** — has this value been seen before? (e.g. Valid Sudoku, Contains Duplicate)
- **Frequency counting** — how many times does each element appear? (e.g. Top K Frequent, Anagram)
- **Complement lookup** — find another element that pairs with this one in O(1) (e.g. Two Sum)
- **Grouping** — bucket elements by a shared property (e.g. Group Anagrams)
- **Scoped tracking** — track duplicates per row/column/region, not globally (e.g. Valid Sudoku)

**Signal:** Brute force needs nested loops for lookup → replace inner loop with a hash map/set for O(1) access.

## Templates

### Duplicate detection (scoped per key)

Use `defaultdict(set)` when you need a **separate set for each category** (row, column, box, etc.).

```python
from collections import defaultdict

seen = defaultdict(set)

for item in items:
    category = get_category(item)   # e.g. row index, column index

    if item in seen[category]:
        return False                # duplicate within this category

    seen[category].add(item)

return True
```

### Frequency counter

```python
from collections import Counter

freq = Counter(arr)          # {element: count}

# Or manually:
freq = defaultdict(int)
for x in arr:
    freq[x] += 1
```

### Complement lookup (Two Sum style)

```python
seen = {}   # {value: index}

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
    key = compute_key(item)   # e.g. sorted(word) for anagrams
    groups[key].append(item)

return list(groups.values())
```

## `defaultdict` Quick Reference

| Type | Auto-initialises to | Common operation | Use case | Duplicate handling |
|------|---------------------|-----------------|----------|--------------------|
| `defaultdict(int)` | `0` | `+= 1` | count occurrences | counts them |
| `defaultdict(set)` | `set()` | `.add(val)` | group unique items | ignores them |
| `defaultdict(list)` | `[]` | `.append(val)` | group all items | keeps them |

The pattern is always the same — whatever you pass in (`int`, `set`, `list`) is the **factory function** called to create the default value for any new key.

### `defaultdict(int)` — counting

```python
from collections import defaultdict

freq = defaultdict(int)
nums = [1, 2, 2, 3, 3, 3]

for n in nums:
    freq[n] += 1

# freq = {1: 1, 2: 2, 3: 3}
```

Traced step by step — the loop runs **once per element** (6 elements → 6 iterations):

```
iteration 1: n=1 → freq[1] = 0+1 = 1      freq = {1:1}
iteration 2: n=2 → freq[2] = 0+1 = 1      freq = {1:1, 2:1}
iteration 3: n=2 → freq[2] = 1+1 = 2      freq = {1:1, 2:2}   ← second 2 in list
iteration 4: n=3 → freq[3] = 0+1 = 1      freq = {1:1, 2:2, 3:1}
iteration 5: n=3 → freq[3] = 1+1 = 2      freq = {1:1, 2:2, 3:2}
iteration 6: n=3 → freq[3] = 2+1 = 3      freq = {1:1, 2:2, 3:3}
```

> `defaultdict` only initialises to `0` on **first access**. After that it's a normal integer that keeps incrementing each time that number appears in the list.

### `defaultdict(set)` — grouping unique values

```python
from collections import defaultdict

groups = defaultdict(set)
pairs = [("a", 1), ("b", 2), ("a", 3), ("a", 1)]

for key, val in pairs:
    groups[key].add(val)

# groups = {"a": {1, 3}, "b": {2}}
# ("a", 1) appeared twice but set ignores the duplicate
```

**Why use `defaultdict` over plain `dict`?**
Accessing a missing key in a plain `dict` raises `KeyError`. `defaultdict` auto-creates the key with a default value — no manual init needed.

```python
# Plain dict — must init manually
d = {}
d[key] = set()      # required before calling .add()
d[key].add(val)

# defaultdict(set) — one line
d = defaultdict(set)
d[key].add(val)     # auto-creates set() if key is new
```

## My Gotchas

> Fill in after solving problems.

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
When you need **separate sets per category** (e.g. per row, per column). A plain set loses which category an element belongs to.

`defaultdict(set)` vs `defaultdict(int)` — when to use which?
?
- `defaultdict(set)` — tracking membership / duplicates per key
- `defaultdict(int)` — counting frequency per key

Two Sum: why does storing the complement work?
?
For each `x`, you need `target - x`. Store what you've seen so far; if the complement is already there, the pair is found in O(1) without a second loop.

How do you map a 9×9 Sudoku cell `(r, c)` to its 3×3 box?::`(r // 3, c // 3)` — integer division maps rows 0–2 → 0, 3–5 → 1, 6–8 → 2.
