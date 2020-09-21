import random
import functools
import json
import sys
import os
import copy

backup_filename = './bins.json'


def noop():
    pass



def questionGenerator(config = {}, question_history = []):
    """
    Keyword arguments:
    config:
    space: number of questions between seeing a previous one
    spread: the difference in weight between each bucket (front more likely)
    ignoreHistory: space has no effect
    """
    config = {
        **{
            'ignoreHistory': False,
            'space': 1,
            'spread': .1
        },
        **config
    }
    def selectQuestion(question_bins = [[]]):
        """
        selected weighted random question other than most previous

        Keyword arguments:
        question_bins -- a list of bins of questions to choose from [[1,2],[3],[],[],[]] (default [[]])

        Returns: the question number or false if finished
        """
        nonlocal question_history
        result = False
        question_total = functools.reduce(lambda tot, bucket: tot + len(bucket), question_bins, 0)

        if question_total == 0: return False

        #adjust question history based on total questions left (shift left)
        if question_total <= len(question_history):
            question_history = question_history[:len(question_history) - 1]

        # buckets with more questions are more likely
        # with equal items in each bucket: [.2, .2, .2, .2, .2]
        item_weights = [len(bucket) / question_total for bucket in question_bins.copy()]
        # earlier buckets are more likely
        # equal items and .5 spread: [.2, .3, .45, .675, 1.0125]
        bucket_weights = list(
            reversed([weight * (1 + config['spread']) ** i for i, weight in enumerate(reversed(item_weights))])
        )
        weight_sum = sum(bucket_weights)

        # sum(relative_weights) = 100
        # same assumptions as above for example: [7,11,17,25,38] (decimals ommitted)
        relative_weights = [100 * weight / weight_sum for weight in bucket_weights]

        # for random.choice, if done manually: choose a number between 1-100
        # check if number < first weight, if not continue
        # cumulative_weights = functools.reduce(
        #     lambda weights, weight: weights + [weights[-1] + weight],
        #     relative_weights[1:],
        #     [relative_weights[0]]
        # )

        #arbitrary limit on iterations, for want of better solution
        for _ in range(100):

            bucket = random.choices(question_bins, weights=relative_weights)
            selection = random.choice(bucket[0])
            if(not config['ignoreHistory'] and (selection in question_history)): continue
            else:
                result = selection
                break
        
        if result:
            if len(question_history) >= config['space']: question_history = question_history[1:]
            question_history.append(result)

        return result

    return selectQuestion


def updateBins(answered_correctly=False, question_bins=[[]], question=0):
    question_bins_copy = copy.deepcopy(question_bins)
    for i, bucket in enumerate(question_bins_copy):
        if question in bucket:
            bucket.remove(question)
            if not answered_correctly:
                question_bins_copy[0].append(question)
            else:
                if len(question_bins_copy) > i + 1:
                    question_bins_copy[i + 1].append(question)
            break
    return question_bins_copy


def save(question_bins=[[]]):
    with open(backup_filename, 'w') as backup:
        backup.write(json.dumps(question_bins))


def load(question_bins=[[]]):
    with open(backup_filename, 'r') as backup:
        return json.loads(backup.read())

def getInput(question=''):
    return input(f'do question {question} and give result ([C]orrect [I]ncorrect E[x]it): ').lower()


def handleInput(question_bins=[[]], selectQuestion = questionGenerator(), getInput = getInput):
    """
    input loop to track which question were answered correctly
    """

    actions = {
        'c': functools.partial(updateBins, True),
        'i': functools.partial(updateBins, False)
    }
    while(True):
        print(question_bins)
        question = selectQuestion(question_bins)

        if question == False:
            print('i like what you got, good job')
            if os.path.exists(backup_filename):
                os.remove(backup_filename)
            break

        
        response = getInput(question)
        
        if response == 'x':
            save(question_bins)
            break
        if not (response in actions):
            print('invalid input')
            continue

        question_bins = actions[response](question_bins, question)


def main():
    questions = list(range(1,25))
    binCount = 3
    question_bins = [questions] + [[] for _ in range(binCount - 1)]

    try:
        question_bins = load()
    except:
        print('no stored bins')

    handleInput(question_bins)


if __name__ == '__main__':
    main()
