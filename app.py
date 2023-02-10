from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
import json
from datetime import datetime
from typing import Any
from bson import ObjectId


database_uri = "mongodb+srv://admin:QqvOqu1fXTvmjkZJ@app.dllreui.mongodb.net/?retryWrites=true&w=majority"

app = Flask(__name__)


class MongoJSONEncoder(json.JSONEncoder):
    def default(self, o: Any) -> Any:
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


try:
    client = MongoClient(database_uri)
    print("Connected successfully!!!")
except:
    print("Could not connect to MongoDB")


db = client.app
collection = db.todos


@app.route("/")
def index():
    return render_template("index.html")


@app.route('/add_one', methods=['POST'])
def add_one():
    content_type = request.headers.get('Content-Type')
    if content_type == 'application/json':
        data = request.json
        collection.insert_one({"message": data["message"], "completed": False})
        return data
    else:
        return 'Content-Type not supported!'


@app.route("/get_all_todos", methods=["GET"])
async def get_all_todos():
    try:
        todos = collection.find({})
        all_todos = []
        for document in todos:
            all_todos.append(document)

        return MongoJSONEncoder().encode(list(all_todos))

    except:
        return "Verileri getirirken bir hata oluştu"


@app.route("/delete_todo/<id>", methods=["DELETE"])
def delete_todo(id):
    try:
        collection.delete_one({"_id": ObjectId(id)})
        return id

    except Exception as e:
        print(e)
        return "Veri silme işlemi gerçekleştirilemedi"


@app.route("/update_todo/<id>", methods=["PATCH"])
def update_todo(id):
    try:
        content_type = request.headers.get('Content-Type')
        if content_type == 'application/json':
            data = request.json
            collection.update_one(
                {"_id": ObjectId(id)}, {"$set": {"message": data["message"]}})

            return data["message"]
        else:
            return 'Content-Type not supported!'
    except:
        return " Veri günncellernemedi"


@app.route("/check_todo/<id>", methods=["PATCH"])
def check_todo(id):
    try:
        content_type = request.headers.get('Content-Type')
        if content_type == 'application/json':
            data = request.json
            collection.update_one(
                {"_id": ObjectId(id)}, {"$set": {"completed": data["completed"]}})

            return str(data["completed"])
        else:
            return 'Content-Type not supported!'
    except:
        return "Check işlemi gerçekleştirilemedi"


if __name__ == "__main__":
    app.run(debug=True)