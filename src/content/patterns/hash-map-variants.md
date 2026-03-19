# Hash Map Variants: OrderedDict & SortedDict

**See also:** [[hash-map-set]] for basic HashMap / HashSet patterns

---

## The Three Maps at a Glance

| | HashMap (`dict`) | LinkedHashMap (`OrderedDict`) | TreeMap (`SortedDict`) |
|--|--|--|--|
| Internal structure | Array of buckets | Array of buckets + doubly linked list | Red-Black Tree |
| get / put / delete | O(1) | O(1) | O(log n) |
| Range query | O(n) | O(n) | O(log n) |
| Iteration | O(n) | O(n) | O(n) |
| Order | None | Insertion / access order | Sorted by key |
| Python | `dict` | `collections.OrderedDict` | `sortedcontainers.SortedDict` |

**Decision rule:**
```
Need speed, no order        → dict
Need speed + order          → OrderedDict
Need sorted + range queries → SortedDict
```

---

## How HashMap Works Internally

```
key → hash function → mod array size → index → value
```

Every step is O(1) and **independent of map size** — 10 keys or 1,000,000 keys, same number of steps.

### Collisions

Two keys can hash to the same index. Each bucket becomes a linked list of colliding entries.

- No collision → O(1)
- Collision → scan the list → worst case O(n)
- Good hash functions spread evenly, so **average stays O(1)**

---

## LinkedHashMap (`OrderedDict`)

### Structure

HashMap + doubly linked list stitched together.

- HashMap part → O(1) lookup by key
- Linked list part → tracks insertion or access order

Maintaining order costs O(1) per operation — the linked list node is appended as a byproduct of the same hashmap insert. No extra time cost.

### Python API

```python
from collections import OrderedDict

od = OrderedDict()
od['a'] = 1
od.move_to_end('a')               # move to back (most recent)
od.move_to_end('a', last=False)   # move to front (oldest)
od.popitem(last=False)            # remove from front (oldest)
od.popitem(last=True)             # remove from back (newest)
```

> Regular `dict` (Python 3.7+) preserves insertion order but lacks `move_to_end` and `popitem(last=False)`. Use `OrderedDict` when you need to **actively manipulate** order.

### When to Use

Use when you need **both simultaneously:**
- O(1) lookup by key
- Order preserved (insertion or access order)

**Use cases:** LRU Cache, browser history deduplication, task reprioritisation, rate limiting (last N requests per user), feed deduplication (same item from multiple sources)

---

## LRU Cache Pattern

**LeetCode:** [146. LRU Cache](https://leetcode.com/problems/lru-cache/) | **Difficulty:** Medium

LRU (Least Recently Used) evicts the element that was accessed least recently when the cache is full.

```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity   # self-imposed limit, not built into OrderedDict

    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)   # mark as recently used → push to back
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            del self.cache[key]
        elif len(self.cache) >= self.capacity:
            self.cache.popitem(last=False)   # evict BEFORE inserting
        self.cache[key] = value              # newly inserted → goes to back
```

**Invariant:**
```
front = least recently used → gets evicted first
back  = most recently used  → safe from eviction

every access  → move_to_end()       → push to back
cache full    → popitem(last=False) → kill from front
```

**Why `del` before re-inserting on update?**
If a key already exists and you just do `self.cache[key] = value`, the position in the linked list doesn't change — it stays where it was inserted originally, not at the back. Deleting and re-inserting resets it to the back (most recent position).

**Time:** O(1) for both `get` and `put`
**Space:** O(capacity)

---

## TreeMap (`SortedDict`)

### Structure

Internally uses a **Red-Black Tree** (self-balancing BST). Every insert automatically maintains sorted key order.

### Python API

```python
from sortedcontainers import SortedDict  # pip install sortedcontainers

sd = SortedDict()
sd[5] = 'five'
sd[1] = 'one'
sd[3] = 'three'

sd.irange(2, 5)                             # keys between 2 and 5 inclusive
sd.irange(3, None, inclusive=(False, False)) # keys greater than 3
sd.irange(None, 4)                          # keys less than 4
```

### When to Use

- Need **sorted keys** at all times
- Need **range queries** — give me all keys between X and Y in O(log n)
- Natural sort order matters, insertion order does not

**Use cases:** Leaderboard with rank lookups, time-series data (range by timestamp), calendar event scheduling, sliding window with sorted keys

---

## Red-Black Tree Internals

Why is TreeMap O(log n)? Because it uses a **self-balancing BST** that keeps height at O(log n).

### The Problem a Regular BST Has

Insert keys in sorted order into a plain BST:
```
1 → 2 → 3 → 4 → 5   (straight line, height = n)
lookup = O(n), not O(log n)
```

A Red-Black tree forces height to stay O(log n) no matter insertion order.

### Why O(log n)?

At each node: one comparison (`<`, `>`, or `=`), then move left or right. No scanning, no loops.

```
Total cost = O(1) per level × number of levels = O(height) = O(log n)
```

### The Two Rules

1. No two consecutive red nodes
2. Every path from root to null has the **same number of black nodes**

### Red vs Black

- **Red** = filler, doesn't count toward balance measurement
- **Black** = the measuring stick, equal on every path
- Equal black count → tree can never be more than 2× lopsided → height stays O(log n)

### Insert Flow

```
Insert node → colour red (safe default — doesn't disturb black count)
           → check for violations
           → fix via recolour or rotation
           → root always forced black
```

### Fix Cases

| Case | Condition | Fix |
|------|-----------|-----|
| 1 | Uncle is red | Recolour parent + uncle to black |
| 2 | Uncle is black, straight shape | Single rotation |
| 3 | Uncle is black, zig-zag shape | Double rotation |

At most 1–2 rotations + recolouring per insert, bounded by tree height → O(log n). Balancing is absorbed into the insert cost.

---

## My Gotchas

- `dict` alone lacks `move_to_end` — use `OrderedDict` when you need LRU-style manipulation
- On LRU `put` update: don't just reassign `cache[key] = value` — it won't move the position to the back; delete and re-insert instead
- `SortedDict` is **third-party** (`sortedcontainers`) — not available in all coding environments; mention this in interviews and implement with `bisect` if needed
- TreeMap range query returns keys in O(log n), but iterating over all results is still O(k) where k = number of results returned

---

## Key Problems

| Problem | Difficulty | Which variant | Link |
|---------|-----------|---------------|------|
| LRU Cache | Medium | `OrderedDict` — O(1) get + ordered eviction | [LC 146](https://leetcode.com/problems/lru-cache/) |
| Insert Delete GetRandom O(1) | Medium | `dict` + array combo | [LC 380](https://leetcode.com/problems/insert-delete-getrandom-o1/) |
| My Calendar I | Medium | `SortedDict` range query to find conflicts | [LC 729](https://leetcode.com/problems/my-calendar-i/) |
| Sliding Window Maximum | Hard | `deque` or `SortedDict` for O(log n) max | [LC 239](https://leetcode.com/problems/sliding-window-maximum/) |

---

## Flashcards

`dict` vs `OrderedDict` — when does `dict` fall short?::`dict` has no `move_to_end` or `popitem(last=False)`. Use `OrderedDict` when you need to actively reorder entries, not just preserve insertion order.

LRU Cache invariant?
?
```
front = least recently used → evicted first via popitem(last=False)
back  = most recently used  → safe, pushed there by move_to_end(key)
```

Why delete before re-inserting on LRU `put` update?::Assigning `cache[key] = value` doesn't change the linked list position. Deleting and re-inserting moves the key to the back (most recently used).

TreeMap vs HashMap — when to choose TreeMap?::When you need **sorted keys** or **range queries** (give me all keys between X and Y). The O(log n) cost per operation is the price for always-sorted order.

Why does Red-Black Tree guarantee O(log n)?::It enforces equal black-node count on every root-to-null path. This prevents the tree from becoming skewed, keeping height at O(log n) regardless of insertion order.

When would a plain BST degrade to O(n)?::When keys are inserted in sorted order, the tree becomes a straight line (each node has only a right child). Height = n → O(n) per lookup. Red-Black tree prevents this with rotations.
