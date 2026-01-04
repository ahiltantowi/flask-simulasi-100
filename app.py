from flask import Flask, render_template, jsonify
from main import RNGBackend

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run-simulation')
def run_simulation():
    backend = RNGBackend(n_samples=1000)
    data_lcg = backend.generate_lcg()
    data_sys = backend.generate_system()
    return jsonify({
        "lcg": backend.evaluasi(data_lcg),
        "sys": backend.evaluasi(data_sys)
    })

if __name__ == '__main__':
    app.run(debug=True)