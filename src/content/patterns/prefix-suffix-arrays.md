- precompute left and right answers
- full loop to filter duplicates, but scan order matters, combine left and right by half

```python
arr = [3, 1, 4, 1, 5]

# PREFIX - scan left to right
prefix = [0] * len(arr)
seen = set()
for i in range(len(arr)):
    seen.add(arr[i])
    prefix[i] = len(seen)

# prefix = [1, 2, 3, 3, 4]
#            3  3,1  3,1,4  3,1,4  3,1,4,5

# SUFFIX - scan right to left
suffix = [0] * len(arr)
seen = set()
for i in range(len(arr) - 1, -1, -1):
    seen.add(arr[i])
    suffix[i] = len(seen)

# suffix = [4, 4, 3, 2, 1]
#            all  1,4,1,5  4,1,5  1,5  5
```

The key insight — scanning **direction matters**:
- Prefix: set grows left→right, captures "distinct so far from left"
- Suffix: set grows right→left, captures "distinct so far from right"
```python
left  = arr[0..i]    → prefix[i]
right = arr[i+1..n]  → suffix[i+1]

answer = max(prefix[i] + suffix[i+1]) for all i

# ---
arr     =  [3,  1,  4,  1,  5]
prefix  =  [1,  2,  3,  3,  4]
suffix  =  [4,  4,  3,  2,  1]

split at 0: prefix[0] + suffix[1] = 1 + 4 = 5
split at 1: prefix[1] + suffix[2] = 2 + 3 = 5  ← also max
split at 2: prefix[2] + suffix[3] = 3 + 2 = 5  ← also max
split at 3: prefix[3] + suffix[4] = 3 + 1 = 4
```

## Key Problems
- getMaxSum HackerRank
- productExceptSelf LeetCode
	```python
	class Solution:
		def productExceptSelf(self, nums: List[int]) -> List[int]:
			n = len(nums)
			output = [1] * n
			# idea is to gap the element itself, so use left and right to compute both sides with a "lag"
		
			left = 1
			for i in range(n):
				output[i] = left #product is complete at end, afterwards incrementally reverse(i) steps behind
				left *= nums[i] #set up for next iteration to right
			
			right = 1
			for i in range(n - 1, -1 , -1):
				output[i] *= right # missing right-side products to fill in the gap from missing steps in left
				right *= nums[i]
			
			return output
	```
