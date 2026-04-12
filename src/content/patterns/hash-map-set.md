# Hash Map / Hash Set

## When to Use

- **Duplicate detection** — has this value been seen before? (e.g. Valid Sudoku, Contains Duplicate)
- **Frequency counting** — how many times does each element appear? (e.g. Top K Frequent, Anagram)
- **Complement lookup** — find another element that pairs with this one in O(1) (e.g. Two Sum)
- **Grouping** — bucket elements by a shared property (e.g. Group Anagrams)
- **Scoped tracking** — track duplicates per row/column/region, not globally (e.g. Valid Sudoku)

**Signal:** Brute force needs nested loops for lookup → replace inner loop with a hash map/set for O(1) access.

---

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

---

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

---

## My Gotchas

> Fill in after solving problems.

- Using one flat set for all categories — loses which category a value belongs to; use `defaultdict(set)` with a key per category
- Forgetting that `defaultdict` creates a key on read — `key in d` won't trigger creation, but `d[key]` will
- `sorted(word)` returns a **list**, not a string — lists are unhashable, can't be dict keys; use `tuple(sorted(word))` or `"".join(sorted(word))`
- `lst = lst.sort()` → `lst` becomes `None` — `.sort()` returns `None`, not the sorted list; see [[sorted]]

---

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Valid Sudoku | Medium | `defaultdict(set)` scoped per row, col, and `(r//3, c//3)` box | [LC 36](https://leetcode.com/problems/valid-sudoku/) |
| Two Sum | Easy | store complement → O(1) lookup instead of O(n) inner loop | [LC 1](https://leetcode.com/problems/two-sum/) |
| Contains Duplicate | Easy | set lookup — if element already in set, it's a duplicate | [LC 217](https://leetcode.com/problems/contains-duplicate/) |
| Group Anagrams | Medium | `sorted(word)` as key groups all anagrams into same bucket | [LC 49](https://leetcode.com/problems/group-anagrams/) |
| Top K Frequent Elements | Medium | `Counter` + heap or bucket sort | [LC 347](https://leetcode.com/problems/top-k-frequent-elements/) |

---

## Problem Flashcards

### Codility Pairs — First/Last Digits

Why precompute first digits in a separate pass for Codility Pairs?::O(1) lookup on the second pass. Without it, for each number you'd scan all n numbers to count matches → O(n²).

Codility Pairs: after counting first digits, why subtract 1 when first == last?::If first digit equals last digit, the number would match itself. Subtract 1 to exclude the self-pairing case.

Codility Pairs: why use a fixed array `[0] * 10` instead of `defaultdict(int)`?::Only 10 possible digits (0–9); fixed array is O(1) space, fast indexing, no hashing overhead.

---

### LC 49 — Group Anagrams

Why does sorting each word produce a canonical anagram key?::Anagrams contain the same characters — sorting them always produces the same sequence. `"eat"`, `"tea"`, `"ate"` all sort to `"aet"`.

Why use `defaultdict(list)` over plain `dict` for Group Anagrams?::No need to check `if key in hashmap` before appending. `defaultdict(list)` auto-initialises to `[]` on first access — one line instead of three.

Group Anagrams: `sorted(word)` returns what, and why does it need wrapping?::A **list** of chars — lists are unhashable and can't be dict keys. Use `tuple(sorted(word))` or `"".join(sorted(word))` to get a hashable key.

Group Anagrams: why `list(hashmap.values())` at the end?::LeetCode expects `List[List[str]]`. `dict.values()` returns a view object, not a list — wrap it.

`sorted("bca")` vs `"bca".sort()` — which works on strings?::`sorted("bca")` — built-in function, works on any iterable. `.sort()` is a list method; strings don't have it → `AttributeError`.

---

### LC 347 — Top K Frequent Elements

LC 347: why put `count` before `num` in `[count, num]`?::Python sorts lists lexicographically left to right. Count first means `freqlist.sort()` ranks by frequency. `[num, count]` would sort by the number itself.

LC 347: `pop()` vs `pop(0)` after ascending sort — which gives highest frequency?::`pop()` removes the rightmost (highest after ascending sort), O(1). `pop(0)` removes the lowest and is O(n) due to shifting.

`heapq.nlargest(k, hashmap, key=hashmap.get)` — what does iterating `hashmap` give?::Dict **keys** only. `key=hashmap.get` ranks each key by its frequency. Returns top k keys directly.

Sort vs heap for Top K — when does heap win?::When k << n. Heap is O(n log k); sort is O(n log n). Heap also uses O(k) space vs O(n).

---

### LC 128 — Longest Consecutive Sequence

Why convert `nums` to a set before iterating?::O(1) membership lookups. Without it, `num + 1 in nums` on a list is O(n) per check → O(n²) total.

What does `if num - 1 not in existing` guard do?::Ensures you only start counting from the **lowest element** of each sequence. Without it, every element restarts a count → sequences counted multiple times.

How is LC 128 O(n) despite a while loop inside a for loop?::Each element is touched at most twice — once in the outer for loop (guard check), once in the while loop from its sequence's lowest element. Total = 2n = O(n).

Why iterate over `existing` (the set) instead of `nums` in LC 128?::Deduplicates. Duplicates in `nums` would trigger redundant sequence counts from the same starting point.

---

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
