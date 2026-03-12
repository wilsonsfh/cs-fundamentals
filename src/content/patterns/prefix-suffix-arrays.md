# Prefix & Suffix Arrays

## When to Use

- Precompute left and right answers for range queries
- Problems requiring "product/sum/count except self"
- Split array into two parts and combine results

**Signal:** Need to efficiently query ranges or exclude one element — precompute from both directions.

## Template

```python
arr = [3, 1, 4, 1, 5]

# PREFIX - scan left to right
prefix = [0] * len(arr)
seen = set()
for i in range(len(arr)):
    seen.add(arr[i])
    prefix[i] = len(seen)

# prefix = [1, 2, 3, 3, 4]

# SUFFIX - scan right to left
suffix = [0] * len(arr)
seen = set()
for i in range(len(arr) - 1, -1, -1):
    seen.add(arr[i])
    suffix[i] = len(seen)

# suffix = [4, 4, 3, 2, 1]
```

### Product Except Self

```python
def productExceptSelf(nums):
    n = len(nums)
    output = [1] * n

    left = 1
    for i in range(n):
        output[i] = left
        left *= nums[i]

    right = 1
    for i in range(n - 1, -1, -1):
        output[i] *= right
        right *= nums[i]

    return output
```

## My Gotchas

- Scanning direction matters — prefix captures "so far from left", suffix captures "so far from right"
- For "product except self", use a lag — each position gets the product of everything before it (left pass) and everything after it (right pass)

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Product Except Self | Medium | left and right product arrays with lag | [LC 238](https://leetcode.com/problems/product-of-array-except-self/) |

## Flashcards

Prefix array: scan direction?::Left to right — captures cumulative result from the start.

Suffix array: scan direction?::Right to left — captures cumulative result from the end.

Product Except Self: how to achieve O(n) without division?::Two passes — left pass stores product of all elements before index i, right pass multiplies by product of all elements after index i.
