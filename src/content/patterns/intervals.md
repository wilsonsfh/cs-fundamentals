# Intervals

## When to Use

- **Merge overlapping intervals**
- **Insert interval** into sorted list
- **Meeting rooms** / scheduling conflicts
- **Minimum intervals** to cover a range

**Signal:** Array of `[start, end]` pairs → sort by start (or end) then sweep.

## Template

### Merge overlapping intervals

```python
def merge(intervals):
    if not intervals:
        return []

    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]

    for start, end in intervals[1:]:
        last_end = merged[-1][1]

        if start <= last_end:
            merged[-1][1] = max(last_end, end)
        else:
            merged.append([start, end])

    return merged
```

### Insert interval

```python
def insert(intervals, new_interval):
    result = []
    i = 0
    n = len(intervals)

    while i < n and intervals[i][1] < new_interval[0]:
        result.append(intervals[i])
        i += 1

    while i < n and intervals[i][0] <= new_interval[1]:
        new_interval[0] = min(new_interval[0], intervals[i][0])
        new_interval[1] = max(new_interval[1], intervals[i][1])
        i += 1

    result.append(new_interval)

    while i < n:
        result.append(intervals[i])
        i += 1

    return result
```

### Meeting rooms (detect conflict)

```python
def canAttendMeetings(intervals):
    intervals.sort(key=lambda x: x[0])

    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return False
    return True
```

### Minimum meeting rooms needed

```python
import heapq

def minMeetingRooms(intervals):
    if not intervals:
        return 0

    intervals.sort(key=lambda x: x[0])
    heap = []

    for start, end in intervals:
        if heap and heap[0] <= start:
            heapq.heapreplace(heap, end)
        else:
            heapq.heappush(heap, end)

    return len(heap)
```

## My Gotchas

- Sort by **start** for merging; sort by **end** for greedy interval selection
- Two intervals `[a, b]` and `[c, d]` overlap if `a <= d AND c <= b`
- After sorting, only need to compare with the **last merged** interval

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|-----------|-------------|------|
| Merge Intervals | Medium | sort by start, merge overlaps | [LC 56](https://leetcode.com/problems/merge-intervals/) |
| Insert Interval | Medium | three-phase sweep | [LC 57](https://leetcode.com/problems/insert-interval/) |
| Meeting Rooms II | Medium | min-heap of end times | [LC 253](https://leetcode.com/problems/meeting-rooms-ii/) |
| Non-overlapping Intervals | Medium | sort by end, greedy | [LC 435](https://leetcode.com/problems/non-overlapping-intervals/) |

## Flashcards

Merging intervals: sort by start.

Two intervals `[a,b]` and `[c,d]` overlap when::`a <= d AND c <= b` (equivalently: `c <= b` after sorting by start)

Merge intervals: when do you extend vs append?
?
- `start <= merged[-1][1]` → overlapping → extend: `merged[-1][1] = max(merged[-1][1], end)`
- Otherwise → new interval → `merged.append([start, end])`

Minimum meeting rooms: which data structure and what does it store?::Min-heap storing end times of ongoing meetings — size of heap = rooms in use.

Insert interval: 3 phases of the sweep?
?
1. Add all intervals that end before new interval starts
2. Merge all overlapping intervals into new interval
3. Add remaining intervals

Non-overlapping intervals: sort by end (greedy — always keep the interval that ends earliest).
