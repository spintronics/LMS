import random
from functools import wraps

default_config = {"space": 10, "spread": 20}

"""
history = [math.calculus.vector_calculus.6,...],
tree = {
    math: {
        correct_answers: 10,
        weight: 50,
        calculus: {
            weight: 50,
            correct_answers: 5,
            vector_calculus: {
                1: {
                    is_question: true,
                    correct_answers: 1
                },
                weight: 20
                ...
            },
            integrals: {
                weight: 20,
                ...
            }
        }
    },
    physics: {
        weight: 60,
        ...
    }
    weight: 100
}

Node: {
    correct_answers?: int,
    weight?: int,
    is_question: bool,
    [key]: Node
}
"""


def log(a):
    print(a)
    return a


def del_path(path, obj):
    path = path.split("~") if isinstance(path, str) else path
    target = obj
    for key in path[:-1]:
        if not key in target:
            return
        target = target[key]

    if path[-1] in target:
        del target[path[-1]]

    return obj


def select_question(tree={}, config=default_config, history=[], path=[]):
    """
    returns a path (str[]) to the question, or empty [] for malformed input or edge cases
    """
    config = config or {}
    history = history or []
    config = {**default_config, **config}

    # possible edge case where history contains all choices
    # consumer should be aware that the default [] indicates a
    # question couldnt be selected
    for q in history:
        tree = del_path(q, tree)

    # select a node based on their weight and correct_answers
    # weight increases the probability, correct_answers reduces

    nodes = list(filter(lambda item: isinstance(item[1], dict), tree.items()))

    if not len(nodes):
        return []

    # spread is a percentage to reduce the wieght by per correct answer
    # spread = 20 -> each question reduces weight by 20%
    weight = lambda node: (
        (node.get("weight") or 0)
        - (node.get("correct_answers") or 0) * config["spread"]
    )

    weights = [weight(node) for [key, node] in nodes]
    minimum = min(weights)

    # adjust for correct answers pulling weight below zero
    if minimum < 0:
        weights = [weight - minimum for weight in weights]

    weight_sum = sum(weights) or 1

    relative_weights = [weight / weight_sum for weight in weights]

    choice = None

    if not sum(relative_weights):
        choice = random.choice(nodes)
    else:
        choice = random.choices(nodes, weights=relative_weights)[0]

    if choice[1].get("is_question"):
        # return the question path
        return path + [choice[0]]

    # recurse until a question is selected
    return select_question(choice[1], config, [], path + [choice[0]])
