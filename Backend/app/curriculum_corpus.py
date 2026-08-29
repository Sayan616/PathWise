CURRICULUM = {
    "numpy_arrays": """
NumPy arrays are grids of values, all of the same type, stored contiguously in
memory. This is different from a plain Python list, which can mix types and
stores pointers scattered across memory. Because every element in a NumPy
array is the same type and packed tightly together, operations like addition
or multiplication can run on the whole array at once — no explicit loop
needed. This is called vectorisation, and it's the main reason NumPy code
runs dramatically faster than the equivalent pure-Python loop.

You create an array with np.array([1, 2, 3]). Arithmetic works elementwise:
arr * 2 returns a new array with every value doubled, and arr + arr adds
elementwise. Arrays also have a shape attribute describing their dimensions —
a 1D array of 5 numbers has shape (5,), while a 3x4 grid has shape (3, 4).
Every downstream tool in data science — Pandas, scikit-learn, PyTorch
tensors — builds on this same idea of a typed, shaped, contiguous array.
""",
    "linear_algebra": """
Linear algebra is the branch of math dealing with vectors, matrices, and the
operations between them. A vector is just an ordered list of numbers — think
of it as a point or direction in space. A matrix is a 2D grid of numbers,
which can represent a transformation (like a rotation or scaling) applied to
vectors.

Matrix multiplication combines two matrices into a new one, and it's not the
same as multiplying elementwise — each entry in the result is a sum of
products across a row and a column. The determinant of a small square matrix
(like a 2x2) is a single number computed from its entries — for
[[a, b], [c, d]] it's a*d - b*c — and it tells you whether the matrix can be
"undone" (inverted) at all.

In machine learning, linear algebra is everywhere: a neural network layer is
literally a matrix multiplication followed by a nonlinearity, and a dataset
of N rows and M features is naturally represented as an N x M matrix.
""",
    "pandas_basics": """
Pandas is a library for working with tabular data — rows and columns, like a
spreadsheet, but manipulable in code. The core object is the DataFrame: a 2D
table where each column can hold a different type of data (numbers, text,
dates), and each row is one record.

You load a CSV file into a DataFrame with pd.read_csv("file.csv"). Once
loaded, df["column_name"] pulls out a single column (a Series), and
df[df["age"] > 30] filters rows where the age column exceeds 30 — this is
called boolean indexing. Common operations include df.groupby("category")
to aggregate rows by a shared value, df.dropna() to remove missing data, and
df.merge() to combine two DataFrames on a shared key, similar to a SQL join.

Pandas sits directly on top of NumPy — under the hood, each column is stored
as a NumPy array, which is why Pandas operations are fast even on large
datasets.
""",
    "python_basics": """
Python's core building blocks are variables, data types (strings, integers,
floats, booleans), and collections like lists, tuples, and dictionaries. A
list holds an ordered, changeable sequence of items — my_list = [1, 2, 3] —
and you access items by index, my_list[0].

A particularly useful pattern is the list comprehension: [x**2 for x in
range(5)] builds a new list by applying an expression to every item in a
sequence, producing [0, 1, 4, 9, 16]. It's a compact alternative to writing
a full for-loop that appends to an empty list.

Functions are defined with def, take parameters, and return a value with
return. They let you package up a piece of logic once and reuse it — the
foundation of writing code that doesn't repeat itself.
""",
    "loops_functions": """
A for loop repeats a block of code once for each item in a sequence: for x in
range(5): print(x) prints 0 through 4. Loops are how you process every item
in a list, every row in a dataset, or every character in a string without
writing the same line five, ten, or a thousand times.

Functions and loops combine constantly: a function often contains a loop
internally to process its input, and returns an accumulated result. For
example, a function that filters even numbers from a list uses a loop to
check each item, and an if statement inside it to decide whether to keep
that item.

The key habit to build is thinking in terms of "for each item, do this" —
once that clicks, loops stop feeling like syntax to memorise and start
feeling like the natural way to describe repetitive work.
""",
}
