from flask import Flask, request, jsonify, json, Response
from flask_cors import CORS, cross_origin
import predict

app = Flask(__name__)

CORS(app, supports_credentials=True)

@app.route('/')
def home():
    response = Response('Hello', headers={
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Methods' : 'GET, POST'
    }, mimetype='text/json')
    # response.headers['Access-Control-Allow-Origin'] = '*'
    # response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    # response.headers['Access-Control-Allow-Methods'] = 'GET, POST'
    return response

@app.route('/predict', methods=['POST'])
@cross_origin()
def getPlacementPrediction():
    received = request.get_json()
    # response = Response(predict.predict([received['gender'], received['xPercentage'], received['xiiPercentage'], received['degreePercentage'], received['workex'], received['etestP'], received['specialisation'], received['mbaP']]), headers={
    #     'Access-Control-Allow-Origin' : '*',
    #     'Access-Control-Allow-Headers' : 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    #     'Access-Control-Allow-Methods' : 'GET, POST'
    # }, mimetype='text/json')
    # response.headers['Access-Control-Allow-Origin'] = '*'
    # response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    # response.headers['Access-Control-Allow-Methods'] = 'GET, POST'
    return predict.predict([received['gender'], float(received['xPercentage']), float(received['xiiPercentage']), float(received['degreePercentage']), received['workex'], float(received['etestP']), received['specialisation'], float(received['mbaP'])])

if __name__ == '__main__':
    app.run(port=7000, debug=True, use_reloader=False)