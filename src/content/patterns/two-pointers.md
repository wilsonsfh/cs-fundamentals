# Two Pointers

## When to Use

- **Sorted array** with pair/triplet sum problems (Two Sum II, 3Sum)
- **In-place** removal or rearrangement (Remove Duplicates, Move Zeroes)
- **Palindrome** check on a string
- **Opposite ends** converging toward the middle

**Signal:** Need to compare or combine elements from two ends of a sorted array.

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

## My Gotchas

> Fill in after solving problems.

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Two Sum II | Easy | sorted → opposite pointers | [LC 167](https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/) |
| 3Sum | Medium | sort + outer loop + inner two-ptr | [LC 15](https://leetcode.com/problems/3sum/) |
| Remove Duplicates from Sorted Array | Easy | slow/fast same direction | [LC 26](https://leetcode.com/problems/remove-duplicates-from-sorted-array/) |
| Container With Most Water | Medium | converge, always move smaller side | [LC 11](https://leetcode.com/problems/container-with-most-water/) |

## Flashcards

Two pointers requires the array to be sorted (for opposite-direction variant).

Opposite-direction two pointers: when do you move left vs right?
?
- Sum < target → move `left` right (increase sum)
- Sum > target → move `right` left (decrease sum)
- Sum == target → record result, move both

How do you skip duplicates in two pointers?
?
After recording a result, advance pointer while `arr[i] == arr[i-1]` (same level).

Same-direction two pointers: what does `slow` track?::The write position — next index for a valid element.

Container With Most Water: why always move the shorter side?::Moving the taller side can only decrease or maintain width without increasing height — no gain possible.
