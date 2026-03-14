# String Parsing & Manipulation

## When to Use
- Input is a structured string that needs to be broken into components
- Converting between string formats (dates, URLs, expressions)
- Extracting numbers, words, or tokens from raw text
- Keywords: "parse", "convert", "format", "extract", "split"

Signal: Input is a string with a predictable structure/pattern that needs to be decoded or reformatted.

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

## Ordered List as Lookup (no hashmap)

```python
# Instead of hardcoding a dict, use list index
months = ["Jan","Feb","Mar","Apr","May","Jun",
          "Jul","Aug","Sep","Oct","Nov","Dec"]

month_num = months.index("Oct") + 1   # → 10
```

## My Gotchas

Fill in after solving problems.
- `split()` with no args splits on any whitespace and strips extras; `split(" ")` is stricter
- Slicing never throws — `s[:-2]` on `"4th"` safely gives `"4"`
- `int("04")` works fine, leading zeros don't cause issues in Python
- `f"{n:02d}"` only works for integers, not strings — convert first with `int()`
- `.index()` throws `ValueError` if element not found — only use when input is guaranteed valid

## Key Problems

| Problem | Difficulty | Key Insight | Link |
|---------|------------|-------------|------|
| Reverse Words in a String | Medium | split() + reverse + join | LC 151 |
| String to Integer (atoi) | Medium | strip, sign, digit-by-digit | LC 8 |
| Valid Anagram | Easy | split into chars, sort or count | LC 242 |
| Decode String | Medium | stack-based parsing | LC 394 |
| Date conversion (this problem) | Easy | split + slice + list lookup | — |

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
