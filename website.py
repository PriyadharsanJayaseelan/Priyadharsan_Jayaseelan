from flask import Flask, render_template
import os

app = Flask(__name__)
app.template_folder = os.path.abspath('templates')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)