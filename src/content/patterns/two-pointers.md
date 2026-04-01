# Two Pointers

## When to Use

- **Sorted array** with pair/triplet sum problems (Two Sum II, 3Sum)
- **In-place** removal or rearrangement (Remove Duplicates, Move Zeroes)
- **Palindrome** check on a string
- **Opposite ends** converging toward the middle

**Signal:** Need to compare or combine elements from two ends of a sorted array.

---

## Template

### Opposite-direction (meet in middle)

```python
def two_pointers_opposite(arr):
    left, right = 0, len(arr) - 1
    result = []

    while left < right:
        current = arr[left] + arr[right]

        if current == target:
            result.append([arr[left], arr[right]])
            left += 1
            right -= 1
            # Skip duplicates if needed:
            while left < right and arr[left] == arr[left - 1]:
                left += 1
            while left < right and arr[right] == arr[right + 1]:
                right -= 1
        elif current < target:
            left += 1
        else:
            right -= 1

    return result
```

### Same-direction (fast/slow)

```python
def two_pointers_same(arr):
    slow = 0

    for fast in range(len(arr)):
        if condition(arr[fast]):
            arr[slow] = arr[fast]
            slow += 1

    return slow  # length of valid prefix
```

---

## My Gotchas

> Fill in after solving problems.

-
-

---

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Two Sum II | Easy | sorted → opposite pointers | [LC 167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) |
| 3Sum | Medium | sort + outer loop + inner two-ptr | [LC 15](https://leetcode.com/problems/3sum/) |
| Remove Duplicates from Sorted Array | Easy | slow/fast same direction | [LC 26](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) |
| Container With Most Water | Medium | converge, always move smaller side | [LC 11](https://leetcode.com/problems/container-with-most-water/) |

---

## Problem Flashcards

### LC 125 — Valid Palindrome

How do you clean a string for palindrome check in one line?::`"".join(c.lower() for c in s if c.isalnum())` — filters non-alphanumeric, lowercases, joins with no separator.

Valid Palindrome: why `right = len(cleaned) - 1` not `len(cleaned)`?::Strings are 0-indexed. `len(s)` is a count, not an index. Last valid index = `len - 1`. Using `len` causes `IndexError`.

Valid Palindrome loop: what does `while left < right` do when pointers meet?::Loop exits. The middle element of an odd-length string compares to itself — always equal, no need to check. `<` correctly excludes this case.

### LC 42 — Trapping Rain Water

Trapping Rain Water: water formula for any position `i`?::`min(max_left[i], max_right[i]) - height[i]` — capped by the shorter surrounding wall.

Why process the shorter side first in two-pointer trap water?::Water is bounded by the shorter wall. If `height[left] < height[right]`, the right side is guaranteed taller — `left_max` alone fully determines the water at `left`.

When do you update `left_max` without adding water?::When `height[left] > left_max` — it's a new wall, not a valley. Water sits in valleys (where height < max), not on top of walls.

Two-pointer trap water vs prefix/suffix array — trade-off?::Prefix/suffix: O(n) space, simpler to reason about. Two-pointer: O(1) space, same O(n) time. Two-pointer is the space-optimised version.

---

## Flashcards

Two pointers requires the array to be ==sorted== (for opposite-direction variant).

Opposite-direction two pointers: when do you move left vs right?
?
- Sum < target → move `left` right (increase sum)
- Sum > target → move `right` left (decrease sum)
- Sum == target → record result, move both

How do you skip duplicates in two pointers?
?
After recording a result, advance pointer while `arr[i] == arr[i-1]` (same level).

Same-direction two pointers: what does `slow` track?::The write position — next index for a valid element.
<!--SR:!2026-04-02,1,210-->

Container With Most Water: why always move the shorter side?::Moving the taller side can only decrease or maintain width without increasing height — no gain possible.
