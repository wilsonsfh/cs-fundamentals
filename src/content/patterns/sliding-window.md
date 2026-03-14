# Sliding Window

## When to Use

- Find subarray/substring of **variable size** satisfying a condition (e.g., longest without repeating chars)
- Find subarray/substring of **fixed size** (e.g., max sum of k elements)
- Keywords: "subarray", "substring", "contiguous", "longest", "shortest", "at most K", "exactly K"

**Signal:** O(n²) brute force with nested loops → shrink to O(n) with two pointers on the same array.

## Template

```python
def sliding_window(arr, k):
    left = 0
    window_state = {}  # or counter, sum, set, etc.
    result = 0

    for right in range(len(arr)):
        # 1. Expand window: add arr[right] to state
        # window_state[arr[right]] = window_state.get(arr[right], 0) + 1

        # 2. Shrink window: while invalid, move left pointer
        while not is_valid(window_state):
            # remove arr[left] from state
            left += 1

        # 3. Update result (window is now valid)
        result = max(result, right - left + 1)

    return result
```

### Fixed-size window variant

```python
def fixed_window(arr, k):
    window_sum = sum(arr[:k])
    result = window_sum

    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        result = max(result, window_sum)

    return result
```

## My Gotchas

> Fill in after solving problems.

-
-

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Longest Substring Without Repeating Chars | Medium | shrink when char repeats | [LC 3](https://leetcode.com/problems/longest-substring-without-repeating-characters/) |
| Max Sum Subarray of Size K | Easy | fixed window | — |
| Minimum Window Substring | Hard | shrink when all chars covered | [LC 76](https://leetcode.com/problems/minimum-window-substring/) |
| Longest Subarray with Sum ≤ K | Medium | variable window | — |

## Flashcards

When should I reach for sliding window?::Subarray/substring problem with O(n²) brute force — two nested loops scanning the same array.

What are the 3 steps inside the sliding window loop?
?
1. Expand — add `arr[right]` to window state
2. Shrink — `while invalid: remove arr[left], left += 1`
3. Update result — window is now valid

Window size formula::`right - left + 1`

Fixed-size window update formula::`window_sum += arr[i] - arr[i - k]`

Keywords that hint at sliding window?::subarray, substring, contiguous, longest, shortest, at most K, exactly K

For "Minimum Window Substring", when do you shrink?::When all required characters are already covered — shrink to minimise length.
