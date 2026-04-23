from flask import Flask, jsonify, request
import redis
import os

app = Flask(__name__)

redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))
r = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

options = ['Option A', 'Option B', 'Option C']

@app.route('/')
def index():
    return jsonify({'message': 'Voting App', 'options': options})

@app.route('/vote/<option>', methods=['POST'])
def vote(option):
    if option not in options:
        return jsonify({'error': 'Invalid option'}), 400
    
    r.incr(f'votes:{option}')
    return jsonify({'vote': option, 'status': 'recorded'})

@app.route('/results', methods=['GET'])
def results():
    results = {}
    for option in options:
        count = r.get(f'votes:{option}')
        results[option] = int(count) if count else 0
    return jsonify(results)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
