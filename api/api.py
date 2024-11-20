from flask import Flask, jsonify, make_response, request 
from flask_restful import Resource, Api 
from flask_cors import CORS
from service import store,summarize
  
# creating the flask app 
app = Flask(__name__) 
cors = CORS(app)
# creating an API object 
api = Api(app) 
  
class StoreSubtitle(Resource): 
    # Corresponds to POST request 
    def post(self): 
        data = request.get_json()    
        store(data)
        return make_response(jsonify(data), 200)

class GetSubtitle(Resource):
    def post(self): 
        data = request.get_json()
        data["summary"] = summarize(data)
        return make_response(jsonify(data), 200)
        

  
# adding the defined resources along with their corresponding urls 
api.add_resource(StoreSubtitle, '/') 
api.add_resource(GetSubtitle, '/getsubtitle') 
  
  
# driver function 
if __name__ == '__main__': 
  
    app.run(debug = True) 