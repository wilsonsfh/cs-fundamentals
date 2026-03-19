# Sliding Window

## What is an Algorithm?

A finite, ordered set of well-defined instructions to solve a problem. Key properties: **finiteness**, **definiteness**, **effectiveness**.

> Sliding window, two pointers, and hashmaps are *algorithmic techniques/patterns* — not algorithms themselves. They describe a strategy, not a specific step-by-step procedure.

---

## Core Idea

Maintain a "window" (contiguous range) over a sequence and slide it forward, **reusing previous computation** instead of recalculating from scratch.

> Instead of nested loops O(n²), carry forward window state → O(n)

When sliding from window `[i..j]` → `[i+1..j+1]`:
```
new_state = old_state - arr[left] + arr[right]
```
You already had the state — just drop the outgoing left element, add the incoming right element.

---

## How to Spot Sliding Window Problems

### The 3-Question Test
1. Is the input a **linear sequence**? (array, string)
2. Am I optimising over a **contiguous range**?
3. Can I **reuse work** from the previous window cheaply?

If all 3 → try sliding window first.

### Keyword Triggers
- "subarray" / "substring" / "contiguous"
- "window of size k"
- "longest / shortest ... that satisfies"
- "maximum / minimum sum of k elements"
- "at most k distinct", "no repeating"

### Brute Force Smell
```python
for i in range(n):
    for j in range(i, n):  # ← nested loop = possible sliding window
        # check window [i..j]
```

**Signal:** O(n²) brute force with nested loops → shrink to O(n) with a window that slides forward.

---

## Fixed vs Variable Window

| Clue | Type |
|---|---|
| "subarray of size **k**" | Fixed |
| "**longest** substring with..." | Variable |
| "**shortest** subarray with sum ≥ target" | Variable |
| "**exactly** k elements" | Fixed |
| "**at most** k distinct" | Variable |

---

## Templates

### Fixed Window (size k)

```python
def fixed_window(arr, k):
    window_sum = sum(arr[:k])
    best = window_sum

    for i in range(k, len(arr)):
        window_sum += arr[i]        # add incoming right element
        window_sum -= arr[i - k]    # remove outgoing left element
        best = max(best, window_sum)

    return best
```

### Variable Window (expand right, shrink left)

```python
def variable_window(arr):
    left = 0
    best = 0
    window_state = 0   # sum, count, hashmap — changes per problem

    for right in range(len(arr)):
        # 1. Expand — add arr[right] to window
        window_state += arr[right]

        # 2. Shrink — while constraint violated, move left
        while window_state > LIMIT:
            window_state -= arr[left]
            left += 1

        # 3. Update answer — window [left..right] is now valid
        best = max(best, right - left + 1)

    return best
```

### Variable Window with HashMap (string problems)

```python
def window_with_map(s):
    left = 0
    best = 0
    counts = {}

    for right in range(len(s)):
        c = s[right]
        counts[c] = counts.get(c, 0) + 1

        while len(counts) > K:          # shrink if too many distinct chars
            left_c = s[left]
            counts[left_c] -= 1
            if counts[left_c] == 0:
                del counts[left_c]
            left += 1

        best = max(best, right - left + 1)

    return best
```

### Universal Skeleton (memorise this)

```
init window state
for right in range(n):
    add s[right] to window
    while/if window invalid:
        remove s[left] from window
        left += 1
    update answer
```

The only thing that changes between problems: **what "window state" is** and **what "invalid" means**.

---

## Common Archetypes

| Problem | Type |
|---|---|
| Max/min sum of subarray of size k | Fixed |
| Longest substring without repeating chars | Variable |
| Minimum window substring | Variable |
| Longest subarray with at most k zeros | Variable |
| Count subarrays with product < k | Variable |
| Find all anagrams in a string | Fixed |

---

## When It's NOT Sliding Window

- Elements don't need to be **contiguous** → two pointers or DP
- Need to **skip/pick** elements freely → DP
- Order doesn't matter → hashmap/sorting
- Trees/graphs → different patterns

---

## Sliding Window vs DP vs Two Pointers

| | Sliding Window | DP | Two Pointers |
|---|---|---|---|
| **Structure** | Contiguous window | Overlapping subproblems | Two indices, independent |
| **State** | Window boundaries | Full memo/table | Left and right pointers |
| **Direction** | Always forward | Any prior subproblem | Varies |
| **Complexity** | O(n) | O(n²) or O(n·k) | O(n) |
| **Sorted required?** | No | No | Sometimes |

> Sliding window is a **special case of two pointers** where both move rightward only.
> Sliding window is a **flat DP** where state compresses to a running value.

---

## Case Study: Best Time to Buy & Sell Stock
**LeetCode:** [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | **Difficulty:** Easy

### Why it's NOT textbook sliding window

- No gradually shrinking window
- No maintained window state (no sum, no hashmap)
- `L` jumps directly to `R` when a new minimum is found

### DP framing

```
dp[i] = prices[i] - min(prices[0..i])
answer = max(dp)
```

DP collapses to a scalar because the recurrence only needs `min_so_far` → O(1) space. This is why it looks like a greedy scan.

### Optimal solution

```python
def maxProfit(prices):
    min_price = float('inf')
    max_profit = 0

    for price in prices:
        min_price = min(min_price, price)               # best buy day so far
        max_profit = max(max_profit, price - min_price) # profit if sell today

    return max_profit
```

`min_price` is always from an earlier index → buy-before-sell guaranteed automatically.

### Common Bugs

| Bug | Why it's wrong |
|-----|---------------|
| `while j < last_day` | Off-by-one — skips the last price; use `j < len(prices)` |
| Tracking min and max independently | Doesn't guarantee sell index > buy index — running min fixes this |

---

## Meta-Insights

> **When DP state compresses to a single running variable, it looks identical to greedy or sliding window.** All three describe the same O(n) pass from different angles.

> **The single best mental cue:** "contiguous range + can slide cheaply" → reach for sliding window immediately.

> Sliding window does **not** require sorted data (unlike two pointers for Two Sum). It works on unsorted arrays/strings as long as the problem involves contiguous elements.

---

## My Gotchas

- `while` vs `if` for shrinking: use `while` for variable windows (may need to shrink multiple steps), `if` only when one shrink step is guaranteed sufficient
- Window size: `right - left + 1` (both inclusive)
- Fixed window update: `window_sum += arr[i] - arr[i - k]` — drop left, add right in one line
- Don't update the answer inside the shrink loop — only after the window is valid again

---

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Longest Substring Without Repeating Chars | Medium | shrink when char count > 1 | [LC 3](https://leetcode.com/problems/longest-substring-without-repeating-characters/) |
| Max Sum Subarray of Size K | Easy | fixed window | — |
| Minimum Window Substring | Hard | shrink when all required chars covered | [LC 76](https://leetcode.com/problems/minimum-window-substring/) |
| Longest Subarray with Sum ≤ K | Medium | variable window | — |
| Best Time to Buy and Sell Stock | Easy | running min + max profit | [LC 121](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) |
| Longest Subarray with At Most K Zeros | Medium | shrink when zeros > k | — |
| Find All Anagrams in a String | Medium | fixed window + char frequency match | [LC 438](https://leetcode.com/problems/find-all-anagrams-in-a-string/) |

---

## Problem Flashcards

### LC 3 — Longest Substring Without Repeating Characters

LC 3: why `set` instead of `dict`?::Constraint is uniqueness — binary question. A `set` answers "is it present?" directly. A `dict` tracks counts you don't need.

LC 3: why `while s[right] in seen` not `if`?::The duplicate can be anywhere in the window, not just at `left`. Multiple shrink steps may be needed before `s[right]` is evicted from `seen`.

LC 3: when to update `max_count`?::After the `while` loop — only when `[left..right]` is fully valid. Updating inside the shrink loop records invalid (still-duplicate) windows.

LC 3 time complexity — why O(n) despite nested loops?::Each character is added to `seen` once and removed at most once. Total = 2n = O(n).

### LC 424 — Longest Repeating Character Replacement

LC 424: validity formula?::`(right - left + 1) - max(counter.values()) > k` — replacements needed exceeds budget k.

LC 424: why always keep the most frequent character?::Replacing the minority is always cheaper. Keeping the majority minimises replacements needed to make the window uniform.

LC 424: `if` vs `while` for shrinking — which and why?::`if` — window size is monotonically non-decreasing. Once a valid window of length L is found, only L+1 or larger matters. Never needs to shrink more than 1 step.

LC 424: why is `max(counter.values())` O(1)?::Counter holds at most 26 keys (bounded alphabet). Iterating 26 entries is O(1) regardless of string length.

### LC 567 — Permutation in String

LC 567: why does same frequency map → permutation?::Two strings are permutations iff they have identical character counts. `dict ==` checks both keys and values, ignoring insertion order.

LC 567: fixed window — `if` or `while` for shrinking?::`if` — fixed window can only exceed `window_size` by exactly 1 per iteration. One shrink step always restores it.

LC 567: why must you `del` zero-count keys from the window dict?::`{'a':1,'b':0} != {'a':1}` — zero-value key is still a key. `dict ==` sees them as different → comparison fails silently.

LC 567: which string counts upfront and why?::`s1` — static, never changes. `s2` window counts update incrementally (add incoming, subtract outgoing). Counting `s2` upfront gives global not window frequencies.

---

## Flashcards

When should I reach for sliding window?::Subarray/substring problem with O(n²) brute force — nested loops scanning the same linear sequence.

What are the 3 steps inside the sliding window loop?
?
1. **Expand** — add `arr[right]` to window state
2. **Shrink** — `while invalid: remove arr[left], left += 1`
3. **Update result** — window is now valid

Window size formula::``right - left + 1``

Fixed-size window update formula::``window_sum += arr[i] - arr[i - k]``

Keywords that hint at sliding window?::subarray, substring, contiguous, longest, shortest, at most K, exactly K, window of size k

For "Minimum Window Substring", when do you shrink?::When all required characters are already covered — shrink to minimise length while still valid.

What is the only thing that changes between sliding window problems?::The window state (sum, counter, hashmap) and the definition of "invalid". The skeleton is always the same.

Fixed vs Variable window — how to tell which?
?
- "size k" / "exactly k" → Fixed
- "longest", "shortest", "at most k" → Variable

Sliding window vs two pointers — what's the key difference?::Sliding window both pointers move rightward only. Two pointers can move independently (e.g. from both ends toward the middle).

Why does Best Time to Buy/Sell Stock look like sliding window but isn't?::There's no maintained window state — `L` jumps directly to `R` when a new minimum is found. It's actually compressed DP where state reduces to a running minimum.

What is sliding window a special case of?::Both two pointers (both move right only) and DP (window state compresses the recurrence to a running value).
