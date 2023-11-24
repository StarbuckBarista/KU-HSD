import requests
from json import dumps

USER_ID = "Carlos"
input("GET Uncompleted Assignments")

# GET Uncompleted Assignments
uncompletedAssignments = requests.get("http://127.0.0.1:5601/getUncompletedAssignments?userID=" + USER_ID)
uncompletedAssignments = uncompletedAssignments.json()
print("")

for assignment in uncompletedAssignments:
    print(f"{assignment['title']} ({assignment['status']})")
    print(assignment["description"])
    print(f"Created: {assignment['creationDate']}")
    print(f"Due: {assignment['dueDate']}")
    print("")

input("\nPOST New Assignment")

# POST New Assignment
newAssignment = {
    "title": "API Assignment",
    "description": "This is a test assignment dispatched from the API Demo.",
    "creationDate": "Wed Oct 25 2023 13:20:00 GMT-0500 (Central Daylight Time)",
    "completionDate": None,
    "dueDate": "Wed Oct 25 2023 13:25:00 GMT-0500 (Central Daylight Time)",
    "status": "In Progress"
}

newAssignment = requests.post(
    "http://127.0.0.1:5601/addNewAssignment?userID=" + USER_ID, 
    headers={"Content-Type": "application/json"},
    data=dumps(newAssignment)
)

print(newAssignment.json())

input("\nPUT Edit Assignment")

# PUT Edit Assignment
editedAssignment = {
    "assignmentID": input("Edit Assignment ID: "),
    "title": "API Assignment",
    "description": "This is a test assignment dispatched from the API Demo.",
    "creationDate": "Wed Oct 25 2023 13:20:00 GMT-0500 (Central Daylight Time)",
    "completionDate": None,
    "dueDate": "Wed Oct 25 2023 13:25:00 GMT-0500 (Central Daylight Time)",
    "status": "Completed"
}

editedAssignment = requests.put(
    "http://127.0.0.1:5601/editAssignment?userID=" + USER_ID,
    headers={"Content-Type": "application/json"},
    data=dumps(editedAssignment)
)

print(editedAssignment.json())

input("\nDELETE Delete Assignment")

# DELETE Delete Assignment
deletedAssignment = input("Delete Assignment ID: ")
deletedAssignment = requests.delete("http://127.0.0.1:5601/deleteAssignment?assignmentID=" + deletedAssignment)
print(deletedAssignment.json())
