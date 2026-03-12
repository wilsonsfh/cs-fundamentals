# Heap / Priority Queue

## When to Use

- **K-th largest/smallest** element
- **Top-K** elements (frequent, closest, largest)
- **Merge K sorted** lists/arrays
- **Running median** (two heaps)
- Greedy problems needing efficient min/max extraction

**Signal:** "K-th", "Top K", "K closest", "K most frequent" → heap.

## Template

### Min-heap (Python default)

```python
import heapq

heap = [3, 1, 4, 1, 5]
heapq.heapify(heap)        # O(n)
heapq.heappush(heap, 2)    # push
val = heapq.heappop(heap)  # pop min
peek = heap[0]             # peek min (no pop)
```

### Max-heap (negate values)

```python
import heapq

max_heap = []
heapq.heappush(max_heap, -value)   # push (negated)
max_val = -heapq.heappop(max_heap) # pop max (negate back)
```

### K largest elements

```python
import heapq

def k_largest(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)

    for num in nums[k:]:
        if num > heap[0]:
            heapq.heapreplace(heap, num)

    return heap
```

### Running median (two heaps)

```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (negated)
        self.large = []  # min-heap

    def addNum(self, num):
        heapq.heappush(self.small, -num)

        if self.small and self.large and (-self.small[0] > self.large[0]):
            heapq.heappush(self.large, -heapq.heappop(self.small))

        if len(self.small) > len(self.large) + 1:
            heapq.heappush(self.large, -heapq.heappop(self.small))
        elif len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
```

## My Gotchas

- Python's `heapq` is **min-heap only** — negate for max-heap
- `heapq.nlargest(k, iterable)` is O(n log k), not O(n)
- For objects, push tuples: `(priority, item)` — comparison goes by first element

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Kth Largest Element in Array | Medium | min-heap of size k | [LC 215](https://leetcode.com/problems/kth-largest-element-in-an-array/) |
| Top K Frequent Elements | Medium | heap on (freq, element) | [LC 347](https://leetcode.com/problems/top-k-frequent-elements/) |
| Merge K Sorted Lists | Hard | min-heap of (val, list_idx, node) | [LC 23](https://leetcode.com/problems/merge-k-sorted-lists/) |
| Find Median from Data Stream | Hard | two heaps | [LC 295](https://leetcode.com/problems/find-median-from-data-stream/) |
| K Closest Points to Origin | Medium | min-heap on distance | [LC 973](https://leetcode.com/problems/k-closest-points-to-origin/) |

## Flashcards

Python's `heapq` is a min-heap by default.

How do you simulate a max-heap in Python?::Push and pop negated values: `heapq.heappush(h, -val)` → `max_val = -heapq.heappop(h)`

K largest elements: use a min-heap or max-heap?::Min-heap of size k — when a new element beats the smallest (`heap[0]`), replace it.

Running median: two-heap invariants?
?
- `small` (max-heap) holds the lower half
- `large` (min-heap) holds the upper half
- `len(small) == len(large)` or `len(small) == len(large) + 1`
- `max(small) <= min(large)`

When pushing objects/tuples to a heap, comparison is on::The first element of the tuple — use `(priority, item)`.

`heapq.heapreplace(heap, val)` does what?::Pops the smallest element and pushes `val` in one O(log n) operation — more efficient than separate pop + push.
