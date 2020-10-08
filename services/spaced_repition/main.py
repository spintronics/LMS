from flask import Flask
app = Flask(__name__)

print(123)


@app.route("/")
def hello():
    return "Hello from Python!"


if __name__ == "__main__":
    app.run(host='0.0.0.0')
