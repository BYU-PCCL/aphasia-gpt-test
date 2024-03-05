from flask import Flask
app = Flask(__name__)


@app.route('/api', methods=['GET'])
def hello_world():
    return "Hello, World!"


if __name__ == '__main__':
    # In development, match port in package.json
    # In development, match redirect values in next.config.mjs
    app.run(port=5328)
