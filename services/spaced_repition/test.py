from spaced_repitition import select_question

test_tree = {
    "math": {
        "correct_answers": 10,
        "weight": 50,
        "calculus": {
            "weight": 50,
            "correct_answers": 5,
            "vector_calculus": {
                "1": {"is_question": True, "correct_answers": 1},
                "2": {"is_question": True, "correct_answers": 0},
                "3": {"is_question": True, "correct_answers": 0},
                "4": {"is_question": True, "correct_answers": 1},
                "weight": 20,
            },
            "derivatives": {
                "1": {"is_question": True, "correct_answers": 1},
                "2": {"is_question": True, "correct_answers": 0},
                "3": {"is_question": True, "correct_answers": 0},
                "4": {"is_question": True, "correct_answers": 1},
                "weight": 20,
            },
            "integrals": {
                "1": {"is_question": True, "correct_answers": 1},
                "2": {"is_question": True, "correct_answers": 0},
                "3": {"is_question": True, "correct_answers": 0},
                "4": {"is_question": True, "correct_answers": 1},
                "weight": 20,
            },
        },
        "statistics": {
            "weight": 50,
            "correct_answers": 5,
            "std": {
                "1": {"is_question": True, "correct_answers": 1},
                "2": {"is_question": True, "correct_answers": 0},
                "3": {"is_question": True, "correct_answers": 0},
                "4": {"is_question": True, "correct_answers": 1},
                "weight": 20,
            },
            "probability": {
                "1": {"is_question": True, "correct_answers": 1},
                "2": {"is_question": True, "correct_answers": 0},
                "3": {"is_question": True, "correct_answers": 0},
                "4": {"is_question": True, "correct_answers": 1},
                "weight": 50,
            },
        },
    },
    "physics": {
        "correct_answers": 10,
        "weight": 50,
        "mechanics": {
            "weight": 50,
            "correct_answers": 2,
            "collisions": {
                "1": {"is_question": True, "correct_answers": 1},
                "2": {"is_question": True, "correct_answers": 0},
                "3": {"is_question": True, "correct_answers": 0},
                "4": {"is_question": True, "correct_answers": 1},
                "weight": 20,
            },
            "gravitation": {
                "1": {"is_question": True, "correct_answers": 1},
                "2": {"is_question": True, "correct_answers": 0},
                "3": {"is_question": True, "correct_answers": 0},
                "4": {"is_question": True, "correct_answers": 1},
                "weight": 20,
            },
            "thermodynamics": {
                "1": {"is_question": True, "correct_answers": 1},
                "2": {"is_question": True, "correct_answers": 0},
                "3": {"is_question": True, "correct_answers": 0},
                "4": {"is_question": True, "correct_answers": 1},
                "weight": 20,
            },
        },
        "E&M": {
            "weight": 50,
            "correct_answers": 5,
            "DC circuits": {
                "1": {"is_question": True, "correct_answers": 1},
                "2": {"is_question": True, "correct_answers": 0},
                "3": {"is_question": True, "correct_answers": 0},
                "4": {"is_question": True, "correct_answers": 1},
                "weight": 20,
            },
            "magnetic fields": {
                "1": {"is_question": True, "correct_answers": 1},
                "2": {"is_question": True, "correct_answers": 0},
                "3": {"is_question": True, "correct_answers": 0},
                "4": {"is_question": True, "correct_answers": 1},
                "weight": 50,
            },
        },
    },
}


def correct_less_likely():
    tree = {
        "1": {"is_question": True, "correct_answers": 0},
        "2": {"is_question": True, "correct_answers": 5},
        "3": {"is_question": True, "correct_answers": 10},
        "4": {"is_question": True, "correct_answers": 20},
    }
    selections = [select_question(tree) for _ in range(100)]

    qs = [0, 0, 0, 0, 0]

    for q in selections:
        qs[int("".join(q))] += 1

    print("correct less likely: ", qs[1] > qs[2] > qs[3] > qs[4])


def weight_more_likely():
    tree = {
        "1": {"is_question": True, "weight": 0},
        "2": {"is_question": True, "weight": 5},
        "3": {"is_question": True, "weight": 10},
        "4": {"is_question": True, "weight": 20},
    }
    selections = [select_question(tree) for _ in range(100)]

    qs = [0, 0, 0, 0, 0]

    for q in selections:
        qs[int("".join(q))] += 1

    print("weight more likely: ", qs[1] < qs[2] < qs[3] < qs[4])


def validates_input():
    a = list(
        filter(
            lambda b: b != [],
            [
                select_question({"1": {"is_question": True}}, history=["1"]),
                select_question({}),
                select_question(),
                select_question({"2": 3}),
            ],
        )
    )

    print("validates input: ", len(a) == 0)


def respects_history():
    tree = {
        "1": {"is_question": True},
        "2": {"is_question": True},
        "3": {"is_question": True},
        "4": {"is_question": True},
    }

    qs = [select_question(tree, history=["1"]) for _ in range(100)]

    valid = not len(list(filter(lambda q: q[0] == "1", qs)))

    print("respects history: ", valid)


def doesnt_throw():
    q = [select_question(test_tree) for _ in range(100)]
    print("doesnt throw: ", True)


for test in [
    respects_history,
    validates_input,
    correct_less_likely,
    weight_more_likely,
    doesnt_throw,
]:
    test()

# print([select_question(test_tree) for _ in range(50)])