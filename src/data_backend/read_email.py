import imaplib
import email

import json
from requests import post

from time import sleep

def addAssignment(assignment, userID):
    post(
        "http://127.0.0.1:5601/addNewAssignment?userID=" + userID, 
        headers={"Content-Type": "application/json"}, 
        data=json.dumps(assignment)
    )

while True:
    with open("src/data_backend/data/users.json", "r") as userData:
        users = json.load(userData)["users"]
        userData.close()

        for user in users:
            if not user["emailUpdates"]: continue
            username = user["email"]
            password = user["emailPassword"]
            imap_server = "imap.gmail.com"

            imap = imaplib.IMAP4_SSL(imap_server)
            imap.login(username, password)

            status, messages = imap.select("INBOX")
            messages = int(messages[0])

            for i in range(messages, messages - 3, -1):
                try:
                    response, message = imap.fetch(str(i), "(RFC822)")

                    for response in message:
                        if isinstance(response, tuple):
                            message = email.message_from_bytes(response[1])
                            subject, encoding = email.header.decode_header(message["Subject"])[0]

                            if isinstance(subject, bytes):
                                subject = subject.decode(encoding)

                            subject = subject.split(";")
                            assignment = {
                                "title": subject[0],
                                "description": subject[1],
                                "creationDate": "Wed Oct 25 2023 13:20:00 GMT-0500 (Central Daylight Time)",
                                "completionDate": None,
                                "dueDate": subject[2],
                                "status": "To Do"
                            }

                            addAssignment(assignment, user["userID"])
                            imap.store(str(i), "+FLAGS", "\\Deleted")
                except:
                    pass

    sleep(60)
