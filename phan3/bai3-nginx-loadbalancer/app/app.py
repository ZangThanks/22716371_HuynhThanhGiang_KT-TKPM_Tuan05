import os
import time
from flask import Flask, jsonify, request
from datetime import datetime

app = Flask(__name__)

INSTANCE_NAME = os.getenv('INSTANCE_NAME', 'Flask-Instance')
INSTANCE_PORT = int(os.getenv('INSTANCE_PORT', 5000))

# Counter for requests
request_count = 0

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'instance': INSTANCE_NAME,
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/', methods=['GET'])
def index():
    global request_count
    request_count += 1
    
    return jsonify({
        'message': f'Request processed by {INSTANCE_NAME}',
        'instance': INSTANCE_NAME,
        'request_count': request_count,
        'timestamp': datetime.utcnow().isoformat(),
        'port': INSTANCE_PORT
    })

@app.route('/info', methods=['GET'])
def info():
    return jsonify({
        'instance_name': INSTANCE_NAME,
        'instance_port': INSTANCE_PORT,
        'total_requests': request_count,
        'uptime_seconds': time.time(),
        'timestamp': datetime.utcnow().isoformat()
    })

@app.route('/api/data', methods=['GET'])
def get_data():
    global request_count
    request_count += 1
    
    return jsonify({
        'data': [
            {'id': 1, 'value': 'Item 1', 'served_by': INSTANCE_NAME},
            {'id': 2, 'value': 'Item 2', 'served_by': INSTANCE_NAME},
            {'id': 3, 'value': 'Item 3', 'served_by': INSTANCE_NAME}
        ],
        'instance': INSTANCE_NAME,
        'total_requests': request_count
    })

@app.route('/api/echo', methods=['POST'])
def echo():
    global request_count
    request_count += 1
    
    data = request.get_json() or {}
    return jsonify({
        'received': data,
        'instance': INSTANCE_NAME,
        'request_count': request_count,
        'timestamp': datetime.utcnow().isoformat()
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found', 'instance': INSTANCE_NAME}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error', 'instance': INSTANCE_NAME}), 500

if __name__ == '__main__':
    print(f'Starting {INSTANCE_NAME} on port {INSTANCE_PORT}')
    app.run(host='0.0.0.0', port=INSTANCE_PORT, debug=False)
