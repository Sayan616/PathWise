import networkx as nx

# Same edges as the CONCEPT_GRAPH in the UI prototype — keep these in sync.
PREREQ_EDGES = [
    ("python_basics", "numpy_arrays"),
    ("loops_functions", "numpy_arrays"),
    ("python_basics", "pandas_basics"),
    ("numpy_arrays", "linear_algebra"),
    ("numpy_arrays", "machine_learning"),
    ("linear_algebra", "machine_learning"),
    ("pandas_basics", "machine_learning"),
]

# Breaks ties between independent branches (e.g. numpy_arrays vs pandas_basics,
# which don't depend on each other) so the plan order is stable and matches
# the intended teaching sequence rather than whatever order the graph library picks.
CONCEPT_PRIORITY = [
    "python_basics",
    "loops_functions",
    "numpy_arrays",
    "linear_algebra",
    "pandas_basics",
    "machine_learning",
]


def build_prereq_graph() -> nx.DiGraph:
    graph = nx.DiGraph()
    graph.add_edges_from(PREREQ_EDGES)
    return graph


def find_gaps(knowledge_map: dict, goal: str = "machine_learning") -> list[str]:
    """
    knowledge_map: {concept: "KNOWN" | "UNKNOWN"}
    Returns an ordered list of UNKNOWN concepts standing between the student
    and `goal`, ordered so no concept appears before its own prerequisites.
    """
    graph = build_prereq_graph()

    if goal not in graph:
        return []

    ancestors = nx.ancestors(graph, goal)
    relevant = ancestors | {goal}

    def priority(node: str) -> int:
        return CONCEPT_PRIORITY.index(node) if node in CONCEPT_PRIORITY else len(CONCEPT_PRIORITY)

    ordered = [
        n for n in nx.lexicographical_topological_sort(graph, key=priority)
        if n in relevant
    ]

    return [n for n in ordered if knowledge_map.get(n) == "UNKNOWN"]
