from flask import Flask, render_template, send_from_directory

app = Flask(__name__)


app.static_folder = 'static'


@app.route("/waltuh/static/<path:path>")
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/waltuh/')
def index():
    return render_template('index.html')


if __name__ == "__main__":
    app.run()