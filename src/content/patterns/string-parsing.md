# String Parsing & Manipulation

## When to Use
- Input is a structured string that needs to be broken into components
- Converting between string formats (dates, URLs, expressions)
- Extracting numbers, words, or tokens from raw text
- Keywords: "parse", "convert", "format", "extract", "split"

Signal: Input is a string with a predictable structure/pattern that needs to be decoded or reformatted.

---

## Template

```python
# Split into tokens
parts = s.split()           # by whitespace
parts = s.split(",")        # by delimiter

# Slicing
s[:-2]                      # remove last 2 chars (strip ordinal: "29th" → "29")
s[1:]                       # remove first char
s[2:5]                      # substring from index 2 to 4

# Type conversion
num = int("29")             # string → int
s = str(29)                 # int → string

# Zero padding
f"{num:02d}"                # 4 → "04"

# Check contents
s.isdigit()                 # "123" → True
s.isalpha()                 # "abc" → True

# Build output
result = f"{year}-{month:02d}-{day:02d}"   # f-string formatting
result = "-".join([year, month, day])       # join list into string
```

---

## Ordered List as Lookup (no hashmap)

```python
# Instead of hardcoding a dict, use list index
months = ["Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"]

month_num = months.index("Oct") + 1   # → 10
```

---

## My Gotchas

- `split()` with no args splits on any whitespace and strips extras; `split(" ")` is stricter and produces empty strings on multiple spaces
- Slicing never throws — `s[:-2]` on `"4th"` safely gives `"4"`
- `int("04")` works fine, leading zeros don't cause issues in Python
- `f"{n:02d}"` only works for integers, not strings — convert first with `int()`
- `.index()` throws `ValueError` if element not found — only use when input is guaranteed valid
- `len(s)` returns int — must `str(len(s))` before concatenating into a string
- `int(s[i:j])` uses `()` — `int[s[i:j]]` is a subscript and raises `TypeError`
- `.append()` is for lists; `.add()` is for sets — don't mix them

---

## Base Conversion Pattern

Convert a number from base 10 to base N using repeated division:

```python
def to_base(num, base):
    if num == 0:
        return "0"
    res = ""
    while num > 0:
        remainder = num % base
        res = str(remainder) + res   # PREPEND — remainders come in reverse order
        num //= base
    return res
```

### Why Prepend (not Append)

```
num = 13, base = 3

Step 1: 13 % 3 = 1  → LSB (rightmost digit)
Step 2:  4 % 3 = 1
Step 3:  1 % 3 = 1  → MSB (leftmost digit)

Remainder order: 1, 1, 1 → correct number: 111 (in base 3)
```

> First remainder = least significant digit. Prepending builds the correct order immediately. Appending would give `111` reversed = still `111` here, but for `13 in base 2` → `1101` reversed wrong = `1011`. Always prepend or reverse.

---

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|------------|-------------|------|
| Encode and Decode Strings | Medium | length-prefix encoding — `len(s)#s` makes `#` inside strings safe | [LC 271](https://leetcode.com/problems/encode-and-decode-strings/) |
| Reverse Words in a String | Medium | split() + reverse + join | LC 151 |
| String to Integer (atoi) | Medium | strip, sign, digit-by-digit | LC 8 |
| Valid Anagram | Easy | split into chars, sort or count | LC 242 |
| Decode String | Medium | stack-based parsing | LC 394 |
| Date conversion (this problem) | Easy | split + slice + list lookup | — |

---

## Problem Flashcards

### LC 271 — Encode and Decode Strings

Encode/Decode: why can't you use `"#"` alone as a delimiter?::Strings can contain `#`. Splitting on it breaks boundaries. Length-prefix (`len(s)#s`) lets the decoder skip `#` inside content by counting characters instead of scanning.

Encode/Decode: what does `j+1` do in the decode loop?::`j` lands on `#`, so `j+1` is the first char of the word. `j+1+length` is the end. `i = j+1+length` advances to the next chunk.

Encode/Decode: why `str(len(s))`?::`len()` returns an int — can't concatenate int + str. Must cast explicitly.

`s.index("#", start)` — what does it do?::Finds the next `#` from `start`. Replaces a manual inner while loop scanning forward character by character.

---

## Flashcards

Strip last N chars from a string?
:: `s[:-N]` e.g. `"29th"[:-2]` → `"29"`

Zero-pad a number to width 2?
:: `f"{n:02d}"` e.g. `4` → `"04"`

Split `"29th Oct 2052"` into parts?
:: `s.split()` → `["29th", "Oct", "2052"]`

Get month number without a dict?
:: `months.index("Oct") + 1` where months is an ordered list

Join a list into a string?
:: `"-".join(["2052", "10", "29"])` → `"2052-10-29"`

When to use `split()` vs `split(" ")`?
:: `split()` handles multiple spaces and strips edges; `split(" ")` is literal and can produce empty strings

Base conversion: why prepend the remainder instead of appending?::The first remainder is the least significant digit (rightmost). Prepending builds correct digit order directly. Appending requires reversing at the end.

Base conversion: what's the edge case you must handle?::When `num == 0` — the while loop never runs, so return `"0"` explicitly before the loop.

Detect punctuation/symbol in a string?::`not c.isalnum()` — True for anything that isn't a letter or digit. `isupper()`, `isdigit()`, `isalnum()` cover uppercase / number / letter-or-number detection.

Password validation: why normalize with `.lower()` before checking substrings?::Case-insensitive matches — `"passWord"` should match the word `"password"`. Always `.lower()` the input before substring checks.
