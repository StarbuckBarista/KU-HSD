from flask import Flask, request
from flask_cors import CORS, cross_origin
import json

from random import choice
from string import ascii_uppercase, digits

app = Flask(__name__)
cors = CORS(app, resources={r"/foo": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

# Validates the User's Login Credentials
def validateLogin(userID, password):
    with open("src/data_backend/data/users.json", "r") as userData:
        users = json.load(userData)["users"]
        userData.close()

        # Iterates Through the Users
        for user in users:
            # Checks if the User's Credentials Match
            if user["userID"] == userID and user["password"] == password:
                return True
            
    return False

# Generates a Unique Assignment ID
def getAssignmentID():
    uniqueAssignmentID = False
    assignmentID = ""

    # Ensures the Assignment ID is Unique
    while not uniqueAssignmentID:
        assignmentID = "".join([choice(ascii_uppercase + digits) for _ in range(8)])

        # Checks if the Assignment ID is Unique
        with open("src/data_backend/data/assignments.json", "r") as assignmentData:
            assignments = json.load(assignmentData)["assignments"]
            assignmentData.close()

            for assignment in assignments:
                if assignment["assignmentID"] == assignmentID:
                    break
            else:
                uniqueAssignmentID = True

    return {"assignmentID": assignmentID}

# API Endpoints
@app.route("/register", methods=["POST"])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def register():
    userID = request.args.get("userID")
    password = request.args.get("password")

    with open("src/data_backend/data/users.json", "r") as userData:
        users = json.load(userData)["users"]
        userData.close()

        for user in users:
            if user["userID"] == userID:
                return {"success": False}
    
    with open("src/data_backend/data/users.json", "r+") as userData:
        users = json.load(userData)["users"]
        users.append({
            "userID": userID, 
            "password": password,
            "emailUpdates": False,
            "email": "",
            "emailPassword": ""
        })

        userData.seek(0)
        json.dump({"users": users}, userData, indent=4)
        userData.truncate()
        userData.close()

        return {"success": True}

@app.route("/login", methods=["GET"])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def login():
    userID = request.args.get("userID")
    password = request.args.get("password")

    if validateLogin(userID, password): return {"success": True}
    return {"success": False}

@app.route("/generateAssignmentID", methods=["GET"])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def generateAssignmentID(): return getAssignmentID()

@app.route("/getAssignments", methods=["GET"])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def getAssignments():
    userID = request.args.get("userID")
    password = request.args.get("password")

    if validateLogin(userID, password):
        with open("src/data_backend/data/assignments.json", "r") as assignmentData:
            assignments = json.load(assignmentData)["assignments"]
            assignmentData.close()

            userAssignments = []

            for assignment in assignments:
                if assignment["userID"] == userID:
                    userAssignments.append(assignment)

            return {"assignments": userAssignments}
        
    return {"success": False}

@app.route("/updateEmailUpdates", methods=["PUT"])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def updateEmailUpdates():
    userID = request.args.get("userID")
    email = request.args.get("email")
    emailPassword = request.args.get("emailPassword")
    emailPassword = emailPassword.replace(";", " ")

    with open("src/data_backend/data/users.json", "r+") as userData:
        users = json.load(userData)["users"]
        
        for i in range(len(users)):
            user = users[i]

            if user["userID"] == userID:
                users[i]["emailUpdates"] = True
                users[i]["email"] = email
                users[i]["emailPassword"] = emailPassword
                break
        else:
            return {"success": False}
        
        userData.seek(0)
        json.dump({"users": users}, userData, indent=4)
        userData.truncate()
        userData.close()

        return {"success": True}

# Bonus Point API Endpoints
@app.route("/getUncompletedAssignments", methods=["GET"])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def getUncompletedAssignments():
    userID = request.args.get("userID")

    with open("src/data_backend/data/assignments.json", "r") as assignmentData:
        assignments = json.load(assignmentData)["assignments"]
        assignmentData.close()

        userAssignments = []

        for assignment in assignments:
            if assignment["userID"] == userID and assignment["status"] != "Completed":
                userAssignments.append(assignment)

        return userAssignments

@app.route("/addNewAssignment", methods=["POST"])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def addNewAssignment():
    userID = request.args.get("userID")
    newAssignment = request.json

    newAssignment["assignmentID"] = getAssignmentID()["assignmentID"]
    newAssignment["userID"] = userID

    with open("src/data_backend/data/assignments.json", "r+") as assignmentData:
        assignments = json.load(assignmentData)["assignments"]
        assignments.append(newAssignment)

        assignmentData.seek(0)
        json.dump({"assignments": assignments}, assignmentData, indent=4)
        assignmentData.truncate()
        assignmentData.close()

        return {"success": True, "assignmentID": newAssignment["assignmentID"]}

@app.route("/editAssignment", methods=["PUT"])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def editAssignment():
    userID = request.args.get("userID")
    editedAssignment = request.json
    editedAssignment["userID"] = userID

    with open("src/data_backend/data/assignments.json", "r+") as assignmentData:
        assignments = json.load(assignmentData)["assignments"]

        for i in range(len(assignments)):
            assignment = assignments[i]

            if assignment["assignmentID"] == editedAssignment["assignmentID"]:
                assignments[i] = editedAssignment
                break
        else:
            return {"success": False}

        assignmentData.seek(0)
        json.dump({"assignments": assignments}, assignmentData, indent=4)
        assignmentData.truncate()
        assignmentData.close()

        return {"success": True}

@app.route("/deleteAssignment", methods=["DELETE"])
@cross_origin(origin='*', headers=['Content-Type','Authorization'])
def deleteAssignment():
    assignment_id = request.args.get("assignmentID")

    with open("src/data_backend/data/assignments.json", "r+") as assignmentData:
        assignments = json.load(assignmentData)["assignments"]

        for assignment in assignments:
            if assignment["assignmentID"] == assignment_id:
                assignments.remove(assignment)
                break

        assignmentData.seek(0)
        json.dump({"assignments": assignments}, assignmentData, indent=4)
        assignmentData.truncate()
        assignmentData.close()

        return {"success": True}

if __name__ == "__main__":
    app.run(debug=True, port=5601)
