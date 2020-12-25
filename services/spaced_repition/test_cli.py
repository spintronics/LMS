import spaced_repition


def identity(x):
    return x


def test(message="", boolean=False):
    return boolean or message


def testAll(message="", *tests):
    return all([test(x) for x in tests]) or message


def run(tests=[], context={}, beforeEach=lambda x: x):
    ctx = {**{"results": []}, **context}
    for t in tests:
        result = t(beforeEach(ctx))
        if not result:
            ctx["results"].append(t.__name__)

    if not len(ctx["results"]):
        print("all tests passed")
    else:
        print("failed tests:")
        for fail in ctx["results"]:
            print(fail)


# def it(spec, fn, config = {}):
#     defaltConfig = {
#         'before': identity,
#         'after': identity
#     }
#     return {
#         'spec': spec,
#         'fn': fn,
#         'config': {**defaltConfig, **config}
#     }

# when a question is answered correctly, it moves to the next bin
# or removed if in the last
# if it is answered incorrectly, it moves to the first bin

# the question selector should be should be weighted towards
# bins at the start and exclude questions asked in the past n questions


def front_bins_more_likely(ctx):
    selectQuestion = spaced_repition.questionGenerator(config={"spread": 0.6})
    question_bins = [[1], [2], [3], [4], [5]]
    results = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    }
    for _ in range(500):
        selection = selectQuestion(question_bins)
        results[selection] = results[selection] + 1
    return results[1] >= results[2] >= results[3] >= results[4] >= results[5]


def doesnt_ask_same_question(ctx):
    selectQuestion = spaced_repition.questionGenerator({"space": 4})
    question_bins = [[1], [2], [3], [4], [5]]
    history = []

    for _ in range(20):
        selection = selectQuestion(question_bins)
        if selection in history:
            return False
        if len(history) == 4:
            history = history[1:]
        history.append(selection)

    return True


def false_if_no_questions(ctx):
    return not ctx["selectQuestion"]([[]])


def removes_from_last_bin(ctx):
    result = spaced_repition.updateBins(True, [[1]], 1)
    return len(result[0]) == 0


def transfers_to_next_bin(ctx):
    result = spaced_repition.updateBins(True, [[1], []], 1)
    return result == [[], [1]]


def question_history_underflow(ctx):
    """
    questions can still be selected irregardless of spacing if the pool is limited
    """
    selectQuestion = spaced_repition.questionGenerator({"space": 10})
    question_bins = [[1], [2], [3], [4], [5]]

    for _ in range(10):
        if not selectQuestion(question_bins):
            return False

    return True


run(
    [
        front_bins_more_likely,
        doesnt_ask_same_question,
        false_if_no_questions,
        removes_from_last_bin,
        transfers_to_next_bin,
        question_history_underflow,
    ],
    beforeEach=lambda ctx: {"selectQuestion": spaced_repition.questionGenerator()},
)
