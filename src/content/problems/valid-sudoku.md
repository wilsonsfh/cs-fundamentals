---
name: Valid Sudoku
difficulty: Medium
patternSlug: hash-map-set
link: https://leetcode.com/problems/valid-sudoku/
---

## Solution

```python
from collections import defaultdict

def isValidSudoku(board):
    rows = defaultdict(set)
    cols = defaultdict(set)
    boxes = defaultdict(set)

    for r in range(9):
        for c in range(9):
            val = board[r][c]
            if val == ".":
                continue

            box_key = (r // 3, c // 3)

            if val in rows[r] or val in cols[c] or val in boxes[box_key]:
                return False

            rows[r].add(val)
            cols[c].add(val)
            boxes[box_key].add(val)

    return True
```

## Approach

Use three `defaultdict(set)` structures to track seen digits per row, per column, and per 3x3 box. Iterate through every cell once. For each non-empty cell, check if the digit has already been seen in its row, column, or box. If yes, the board is invalid.

## Key Insight

Map each cell `(r, c)` to its 3x3 box using `(r // 3, c // 3)`. This gives 9 unique box identifiers. Using `defaultdict(set)` means you don't need to pre-initialize anything.

## Failed Approaches

- Initially tried using a single flat set and encoding "row-val", "col-val", "box-val" as strings — works but `defaultdict(set)` is cleaner and more readable.

## Time Complexity

O(1) — the board is always 9x9, so it's 81 cells max.

## Space Complexity

O(1) — at most 27 sets with up to 9 elements each.
