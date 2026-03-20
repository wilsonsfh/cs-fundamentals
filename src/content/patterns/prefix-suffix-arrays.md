# Prefix / Suffix Arrays

## When to Use

- **Per-element context** — each answer needs information from both sides of that element (e.g. product except self, count of distinct elements on each side)
- **Precompute left/right state** — scanning once left-to-right and once right-to-left captures everything before and after each index
- **Avoid O(n²)** — instead of recomputing a running value for every index separately, precompute it in two passes

**Signal:** answer at index `i` depends on elements to the left *and* right of `i` — reach for prefix/suffix arrays.

---

## Core Idea

```
For each index i:
    answer[i] = f(everything left of i) ⊕ f(everything right of i)
```

Where `⊕` is whatever combination the problem needs (multiply, add, max, count…).

Build two arrays in two passes, then combine:

```
left[i]  = accumulated value of nums[0..i-1]
right[i] = accumulated value of nums[i+1..n-1]
output[i] = left[i] ⊕ right[i]
```

---

## Templates

### Three-array (explicit, easiest to reason about)

```python
n = len(nums)
left, right, output = [identity] * n, [identity] * n, [identity] * n

# Left pass — forward
for i in range(1, n):
    left[i] = combine(left[i - 1], nums[i - 1])

# Right pass — backward
for i in reversed(range(n - 1)):
    right[i] = combine(right[i + 1], nums[i + 1])

# Combine
for i in range(n):
    output[i] = combine(left[i], right[i])
```

For products: `identity = 1`, `combine = multiply`
For sums: `identity = 0`, `combine = add`

### O(1) space (fold right pass into output)

```python
output = [1] * n

left = 1
for i in range(n):
    output[i] = left        # store before including nums[i]
    left *= nums[i]

right = 1
for i in range(n - 1, -1, -1):
    output[i] *= right      # fold in right product
    right *= nums[i]
```

The "store before update" pattern ensures `nums[i]` is excluded from its own position.

### Prefix count of distinct (set-based)

```python
prefix = [0] * n
seen = set()
for i in range(n):
    seen.add(arr[i])
    prefix[i] = len(seen)   # distinct count from left up to i

suffix = [0] * n
seen = set()
for i in range(n - 1, -1, -1):
    seen.add(arr[i])
    suffix[i] = len(seen)   # distinct count from right up to i
```

---

## `reversed(range(n))` — visit order only

```python
reversed(range(3))  # visits: 2, 1, 0
```

Changes only the order you visit indices — not what the indices mean. Index arithmetic (`nums[i+1]`, `right[i+1]`) stays the same. Use it when `state[i]` depends on `state[i+1]` (must compute right before left).

---

## My Gotchas

- Initialise with `identity` not `0` — for products that's `1`; using `0` kills everything
- "Store before update" in the O(1) pass: `output[i] = left` then `left *= nums[i]` — reversed order includes `nums[i]` in its own product
- `reversed(range(n-1))` not `reversed(range(n))` — the last index has no right neighbour, its right value stays at the identity
- Scan direction matters for set-based prefix: left→right gives "seen so far from left", right→left gives "seen so far from right"

---

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Product of Array Except Self | Medium | `left[i] * right[i]`; O(1) space with "store before update" | [LC 238](https://leetcode.com/problems/product-of-array-except-self/) |
| Max Distinct Split | Medium | prefix + suffix count of distinct elements, try every split point | — |

---

## Problem Flashcards

### LC 238 — Product of Array Except Self

LC 238: what does `left[i]` store?::Product of all elements to the **left** of index `i` — `nums[0..i-1]`. `left[0] = 1` because nothing is to the left of index 0.

LC 238: why initialise with `[1] * n` not `[0] * n`?::Multiplication identity is `1`. `0` would zero out every product. Boundary indices should contribute `1`.

LC 238: what does `reversed(range(n-1))` change?::Only the **visit order**. `right[i]` depends on `right[i+1]`, so backward iteration ensures `i+1` is computed before `i`.

LC 238: O(1) space — why `output[i] = left` before `left *= nums[i]`?::Store first, update after. This makes `output[i]` the product of everything *before* `i`. Reversing the order would include `nums[i]` in its own product.

LC 238: why not divide the total product by `nums[i]`?::Breaks when the array contains `0`. Prefix/suffix only multiplies — handles zeros naturally.

---

## Flashcards

When should you reach for prefix/suffix arrays?::When the answer at each index depends on elements on **both sides** of it — precompute left and right state in two passes instead of recomputing per index.

Prefix/suffix: what is the "identity" value and why does it matter?::The identity is the neutral element for the operation (`1` for multiply, `0` for add). Boundary indices have no elements on one side — the identity ensures they contribute nothing to the product/sum.

O(1) space prefix/suffix: what is the "store before update" pattern?::`output[i] = running; running = combine(running, nums[i])` — storing first means `nums[i]` is excluded from position `i`. Updating first would include it.

`reversed(range(n))` — what changes and what stays the same?::Visit **order** changes (right to left). The index values and all arithmetic (`i+1`, `i-1`) stay identical.
