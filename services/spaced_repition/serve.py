from flask import Flask, request
from spaced_repitition import select_question
from functools import wraps

app = Flask("spaced_repition")


class Params:
    config = "config"
    history = "history"
    tree = "tree"


class Routes:
    get_question = "/select_question"


def required_params(*keys):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            body = request.json
            if not body:
                return {"code": 400, "data": f"expected a body"}
            for key in keys:
                if not (key in body):
                    return {"code": 400, "data": f"expected {key}"}
            return f(body)

        return decorated_function

    return decorator


@app.route(Routes.get_question, methods=["POST"])
@required_params(Params.tree)
def get_question(body):
    question = select_question(
        body.get(Params.tree),
        history=(body.get(Params.history) or []),
        config=(body.get(Params.config) or {}),
    )
    return {"status": 200, "data": question}


if __name__ == "__main__":
    app.run(host="0.0.0.0")
