$(function () {

    // Once Logged In
    $('#login').on('hide.bs.modal', () => {

        // Show the Assignment Center
        $('#assignmentCenter').show();
        loadAssignments(renderAssignments);
    });
});

// Load the User's Assignments
function loadAssignments (callback) {

    let userID = localStorage.getItem('userID');
    let password = localStorage.getItem('password');

    // Receive the User's Assignments from the Server
    fetch('http://127.0.0.1:5601/getAssignments?userID=' + userID + '&password=' + password, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })

        .then(response => response.json())
        .then(data => {

            // Account for the Case Where the User Has No Assignments
            let assignments = data.assignments;
            if (assignments === undefined) { assignments = []; }

            // Convert the Dates from Strings to Date Objects
            for (let i = 0; i < assignments.length; i++) {

                let assignmentCreationDate = new Date(assignments[i].creationDate);
                assignments[i].creationDate = assignmentCreationDate;
        
                let assignmentDueDate = new Date(assignments[i].dueDate);
                assignments[i].dueDate = assignmentDueDate;
        
                if (assignments[i].completionDate !== null) {
        
                    let assignmentCompletionDate = new Date(assignments[i].completionDate);
                    assignments[i].completionDate = assignmentCompletionDate;
                }
            }
        
            callback(assignments);
        });
}

// Render the User's Assignments
function renderAssignments (assignments) {

    let listAssignments = document.getElementById('listAssignments');
    listAssignments.innerHTML = '';

    // Get the User's Status Filters
    let showToDoStatus = document.getElementById('toDoStatus').checked;
    let showInProgressStatus = document.getElementById('inProgressStatus').checked;
    let showCompletedStatus = document.getElementById('completedStatus').checked;

    // Get the User's Sort Filters
    let sortAssignmentTitle = document.getElementById('sortAssignmentTitle').classList.contains('active');
    let sortCreationDate = document.getElementById('sortCreationDate').classList.contains('active');
    let sortDueDate = document.getElementById('sortDueDate').classList.contains('active');

    // Sort the User's Assignments
    if (sortAssignmentTitle) { assignments.sort((a, b) => a.title.localeCompare(b.title)); }
    else if (sortCreationDate) { assignments.sort((a, b) => a.creationDate - b.creationDate); }
    else if (sortDueDate) { assignments.sort((a, b) => a.dueDate - b.dueDate); }

    // Iterate Through the User's Assignments
    for (let i = 0; i < assignments.length; i++) {

        // Get the Assignment's Data
        let assignment = assignments[i];
        let assignmentID = assignment.assignmentID;
        let assignmentTitle = assignment.title;
        let assignmentDescription = assignment.description;
        let assignmentDueDate = assignment.dueDate;
        let assignmentStatus = assignment.status;
        let rowElement = document.createElement('tr');

        // Apply the User's Status Filters & Styling
        if (assignmentStatus === 'To Do') { 
            
            rowElement.classList.add('table-danger'); 
            if (!showToDoStatus) { continue; }
        } else if (assignmentStatus === 'In Progress') { 
            
            rowElement.classList.add('table-warning'); 
            if (!showInProgressStatus) { continue; }
        } else if (assignmentStatus === 'Completed') { 
            
            rowElement.classList.add('table-success'); 
            if (!showCompletedStatus) { continue; }
        }

        // Specify the Assignment's Primary Key
        rowElement.setAttribute('assignmentID', assignmentID);

        // Create the Assignment's Table Cells
        let titleElement = document.createElement('td');
        titleElement.classList.add('text-center', 'text-break', 'align-middle');
        titleElement.style.maxWidth = '200px';
        titleElement.textContent = assignmentTitle;

        let descriptionElement = document.createElement('td');
        descriptionElement.classList.add('w-25', 'text-center', 'text-break', 'align-middle');
        descriptionElement.textContent = assignmentDescription;

        let dueDateElement = document.createElement('td');
        dueDateElement.classList.add('text-center', 'align-middle');
        dueDateElement.style.maxWidth = '100px';
        dueDateElement.textContent = (assignmentDueDate.getMonth() + 1) + '/' + assignmentDueDate.getDate() + '/' + assignmentDueDate.getFullYear();

        let statusElement = document.createElement('td');
        statusElement.classList.add('w-25', 'text-center', 'align-middle');
        statusElement.style.maxWidth = '100px';

        let statusDropdown = document.createElement('div');
        statusDropdown.classList.add('dropdown');

        let statusDropdownButton = document.createElement('button');
        statusDropdownButton.classList.add('btn', 'btn-sm', 'btn-secondary', 'dropdown-toggle');
        statusDropdownButton.setAttribute('type', 'button');
        statusDropdownButton.setAttribute('data-bs-toggle', 'dropdown');
        statusDropdownButton.setAttribute('aria-expanded', 'false');
        statusDropdownButton.textContent = assignment.status;

        let statusDropdownMenu = document.createElement('div');
        statusDropdownMenu.classList.add('dropdown-menu');

        let statusDropdownMenuItem1 = document.createElement('button');
        statusDropdownMenuItem1.classList.add('dropdown-item');
        statusDropdownMenuItem1.setAttribute('type', 'button');
        statusDropdownMenuItem1.setAttribute('onclick', 'changeAssignmentStatus(this);');
        statusDropdownMenuItem1.textContent = 'To Do';

        let statusDropdownMenuItem2 = document.createElement('button');
        statusDropdownMenuItem2.classList.add('dropdown-item');
        statusDropdownMenuItem2.setAttribute('type', 'button');
        statusDropdownMenuItem2.setAttribute('onclick', 'changeAssignmentStatus(this);');
        statusDropdownMenuItem2.textContent = 'In Progress';

        let statusDropdownMenuItem3 = document.createElement('button');
        statusDropdownMenuItem3.classList.add('dropdown-item');
        statusDropdownMenuItem3.setAttribute('type', 'button');
        statusDropdownMenuItem3.setAttribute('onclick', 'changeAssignmentStatus(this);');
        statusDropdownMenuItem3.textContent = 'Completed';

        if (assignmentStatus === 'To Do') { statusDropdownMenuItem1.classList.add('active'); }
        else if (assignmentStatus === 'In Progress') { statusDropdownMenuItem2.classList.add('active'); }
        else if (assignmentStatus === 'Completed') { statusDropdownMenuItem3.classList.add('active'); }

        let actionsElement = document.createElement('td');
        actionsElement.classList.add('text-center', 'align-middle');
        actionsElement.style.maxWidth = '100px';

        let editElement = document.createElement('button');
        editElement.classList.add('btn', 'btn-primary', 'btn-sm');
        editElement.setAttribute('onclick', 'editAssignment(this);');
        editElement.textContent = 'Edit';

        let deleteElement = document.createElement('button');
        deleteElement.classList.add('btn', 'btn-danger', 'btn-sm', 'ms-1');
        deleteElement.setAttribute('onclick', 'deleteAssignment(this);');
        deleteElement.textContent = 'Delete';
        
        // Append the Assignment's Table Cells to the Assignment's Table Row
        rowElement.appendChild(titleElement);
        rowElement.appendChild(descriptionElement);
        rowElement.appendChild(dueDateElement);
        statusElement.appendChild(statusDropdown);
        statusDropdown.appendChild(statusDropdownButton);
        statusDropdown.appendChild(statusDropdownMenu);
        statusDropdownMenu.appendChild(statusDropdownMenuItem1);
        statusDropdownMenu.appendChild(statusDropdownMenuItem2);
        statusDropdownMenu.appendChild(statusDropdownMenuItem3);
        rowElement.appendChild(statusElement);
        actionsElement.appendChild(editElement);
        actionsElement.appendChild(deleteElement);
        rowElement.appendChild(actionsElement);
        listAssignments.appendChild(rowElement);
    }

    // Calculate the Assignment Center Statistics
    let completedAssignments = 0;
    let completedOnTimeAssignments = 0;

    // Iterate Through the User's Assignments
    for (let i = 0; i < assignments.length; i++) {

        // Get the Assignment's Data
        let assignment = assignments[i];
        let assignmentDueDate = assignment.dueDate;
        let assignmentCompletionDate = assignment.completionDate;
        let assignmentStatus = assignment.status;

        // Ensure the Assignment is Completed
        if (assignmentStatus !== 'Completed') { continue; }

        // Ensure the Assignment was Completed in the Last 30 Days
        let today = new Date();
        let thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        if (assignmentCompletionDate === null || assignmentCompletionDate < thirtyDaysAgo) { continue; }

        // Update the Assignment Center Statistics
        completedAssignments++;
        if (assignmentCompletionDate <= assignmentDueDate) { completedOnTimeAssignments++; }
    }

    document.getElementById('completedAssignments').textContent = completedAssignments;
    document.getElementById('completedOnTimeAssignments').textContent = completedOnTimeAssignments;
}

// Show the Add Assignment Modal
function addAssignment () {

    document.getElementById('addAssignmentTitle').value = '';
    document.getElementById('addAssignmentDescription').value = '';
    $('#addAssignmentDate').datepicker('setDate', new Date(new Date().toDateString()));

    $('#addAssignmentDate').datepicker('show');
    $('#addAssignment').modal('show');
}

// Save the New Assignment
function saveAddAssignment () {

    // Get the New Assignment's Data
    let assignmentTitle = document.getElementById('addAssignmentTitle').value;
    let assignmentDescription = document.getElementById('addAssignmentDescription').value;
    let assignmentDate = $('#addAssignmentDate').datepicker('getDate');

    // Send the New Assignment's Data to the Server
    loadAssignments(assignments => {

        fetch('http://127.0.0.1:5601/generateAssignmentID', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

            .then(response => response.json())
            .then(data => {

                newAssignment = {
                    assignmentID: data.assignmentID,
                    userID: localStorage.getItem('userID'),
                    title: assignmentTitle,
                    description: assignmentDescription,
                    creationDate: new Date(),
                    completionDate: null,
                    dueDate: assignmentDate,
                    status: 'To Do'
                };

                assignments.push(newAssignment);

                assignmentDeepCopy = {
                    assignmentID: newAssignment.assignmentID,
                    userID: newAssignment.userID,
                    title: newAssignment.title,
                    description: newAssignment.description,
                    creationDate: newAssignment.creationDate,
                    completionDate: newAssignment.completionDate,
                    dueDate: newAssignment.dueDate,
                    status: newAssignment.status
                };

                let deepCopyCreationDate = assignmentDeepCopy.creationDate;
                assignmentDeepCopy.creationDate = deepCopyCreationDate.toString();

                let deepCopyCompletionDate = assignmentDeepCopy.completionDate;
                if (deepCopyCompletionDate !== null) { assignmentDeepCopy.completionDate = deepCopyCompletionDate.toString(); }

                let deepCopyDueDate = assignmentDeepCopy.dueDate;
                assignmentDeepCopy.dueDate = deepCopyDueDate.toString();
            
                // Refresh the Assignment Center
                fetch('http://127.0.0.1:5601/addNewAssignment?userID=' + localStorage.getItem('userID'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(assignmentDeepCopy)
                })

                    // Refresh Assignment Center
                    .then(response => response.json())
                    .then(data => {

                        renderAssignments(assignments);
                        $('#addAssignmentDate').datepicker('hide');
                        $('#addAssignment').modal('hide');
                    })
            });
    });
}

// Show the Filter Status Modal
function filterStatus () { $('#filterStatus').modal('show'); }

// Select All Status Filters
function selectAllFilters () {

    $('#toDoStatus').prop('checked', true);
    $('#inProgressStatus').prop('checked', true);
    $('#completedStatus').prop('checked', true);
}

// Deselect All Status Filters
function deselectAllFilters () {

    $('#toDoStatus').prop('checked', false);
    $('#inProgressStatus').prop('checked', false);
    $('#completedStatus').prop('checked', false);
}

// Apply the Status Filters
function applyFilterStatus () { 
    
    loadAssignments(renderAssignments);
    $('#filterStatus').modal('hide'); 
}

// Set the Status Filter to Assignment Title
function sortAssignmentTitle () {

    let sortAssignmentTitle = document.getElementById('sortAssignmentTitle');
    let sortCreationDate = document.getElementById('sortCreationDate');
    let sortDueDate = document.getElementById('sortDueDate');

    if (!sortAssignmentTitle.classList.contains('active')) { sortAssignmentTitle.classList.add('active'); }
    if (sortCreationDate.classList.contains('active')) { sortCreationDate.classList.remove('active'); }
    if (sortDueDate.classList.contains('active')) { sortDueDate.classList.remove('active'); }

    loadAssignments(renderAssignments);
}

// Set the Status Filter to Creation Date
function sortCreationDate () {

    let sortAssignmentTitle = document.getElementById('sortAssignmentTitle');
    let sortCreationDate = document.getElementById('sortCreationDate');
    let sortDueDate = document.getElementById('sortDueDate');

    if (sortAssignmentTitle.classList.contains('active')) { sortAssignmentTitle.classList.remove('active'); }
    if (!sortCreationDate.classList.contains('active')) { sortCreationDate.classList.add('active'); }
    if (sortDueDate.classList.contains('active')) { sortDueDate.classList.remove('active'); }

    loadAssignments(renderAssignments);
}

// Set the Status Filter to Due Date
function sortDueDate () {

    let sortAssignmentTitle = document.getElementById('sortAssignmentTitle');
    let sortCreationDate = document.getElementById('sortCreationDate');
    let sortDueDate = document.getElementById('sortDueDate');

    if (sortAssignmentTitle.classList.contains('active')) { sortAssignmentTitle.classList.remove('active'); }
    if (sortCreationDate.classList.contains('active')) { sortCreationDate.classList.remove('active'); }
    if (!sortDueDate.classList.contains('active')) { sortDueDate.classList.add('active'); }

    loadAssignments(renderAssignments);
}

// Change the Assignment's Status
function changeAssignmentStatus (element) {

    let assignment = element.parentElement.parentElement.parentElement.parentElement;
    let newAssignmentStatus = element.textContent;

    // Send the New Assignment's Data to the Server
    loadAssignments(assignments => {
    
        for (let i = 0; i < assignments.length; i++) {

            if (assignments[i].assignmentID === assignment.getAttribute('assignmentID')) {
    
                editedAssignment = assignments[i];
                editedAssignment.status = newAssignmentStatus;
                if (newAssignmentStatus === 'Completed') { editedAssignment.completionDate = new Date(); }
                else { editedAssignment.completionDate = null; }

                assignments[i] = editedAssignment;

                assignmentDeepCopy = {
                    assignmentID: editedAssignment.assignmentID,
                    userID: editedAssignment.userID,
                    title: editedAssignment.title,
                    description: editedAssignment.description,
                    creationDate: editedAssignment.creationDate,
                    completionDate: editedAssignment.completionDate,
                    dueDate: editedAssignment.dueDate,
                    status: editedAssignment.status
                };

                let deepCopyCreationDate = assignmentDeepCopy.creationDate;
                assignmentDeepCopy.creationDate = deepCopyCreationDate.toString();

                let deepCopyCompletionDate = assignmentDeepCopy.completionDate;
                if (deepCopyCompletionDate !== null) { assignmentDeepCopy.completionDate = deepCopyCompletionDate.toString(); }

                let deepCopyDueDate = assignmentDeepCopy.dueDate;
                assignmentDeepCopy.dueDate = deepCopyDueDate.toString();

                fetch('http://127.0.0.1:5601/editAssignment?userID=' + localStorage.getItem('userID'), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(assignmentDeepCopy)
                })

                    // Refresh Assignment Center
                    .then(response => response.json())
                    .then(data => {

                        renderAssignments(assignments);
                        $('#addAssignmentDate').datepicker('hide');
                        $('#addAssignment').modal('hide');
                    })

                break;
            }
        }
    });
}

// Show the Edit Assignment Modal
function editAssignment (element) {

    // Remove the Edited Assignment Specification
    let oldAssignment = document.getElementById('editedAssignment');
    if (oldAssignment !== null) { oldAssignment.id = ''; }

    // Specify the Edited Assignment for Future Reference
    let assignment = element.parentElement.parentElement;
    assignment.id = 'editedAssignment';

    // Get the Assignment's Data
    let assignmentTitle = assignment.querySelectorAll('td')[0].textContent;
    let assignmentDescription = assignment.querySelectorAll('td')[1].textContent;
    let assignmentDueDate = new Date(assignment.querySelectorAll('td')[2].textContent);

    let assignmentDueDateMonth = assignmentDueDate.getMonth() + 1;
    let assignmentDueDateDay = assignmentDueDate.getDate();
    let assignmentDueDateYear = assignmentDueDate.getFullYear();

    // Populate the Edit Assignment Modal
    document.getElementById('editAssignmentTitle').setAttribute('value', assignmentTitle)
    $('#editAssignmentDescription').val(assignmentDescription);

    $('#editAssignmentDate').datepicker('setDate', assignmentDueDateMonth + '/' + assignmentDueDateDay + '/' + assignmentDueDateYear);
    $('#editAssignmentDate').datepicker('show');
    $('#editAssignment').modal('show');
}

// Save the Edited Assignment
function saveEditAssignment () {

    let assignment = document.getElementById('editedAssignment');

    // Send the Edited Assignment's Data to the Server
    loadAssignments(assignments => {

        for (let i = 0; i < assignments.length; i++) {

            if (assignments[i].assignmentID === assignment.getAttribute('assignmentID')) {
    
                let editedAssignment = assignments[i];
                editedAssignment.title = document.getElementById('editAssignmentTitle').value;
                editedAssignment.description = document.getElementById('editAssignmentDescription').value;
                editedAssignment.dueDate = $('#editAssignmentDate').datepicker('getDate');

                assignments[i] = editedAssignment;

                assignmentDeepCopy = {
                    assignmentID: editedAssignment.assignmentID,
                    userID: editedAssignment.userID,
                    title: editedAssignment.title,
                    description: editedAssignment.description,
                    creationDate: editedAssignment.creationDate,
                    completionDate: editedAssignment.completionDate,
                    dueDate: editedAssignment.dueDate,
                    status: editedAssignment.status
                };

                let deepCopyCreationDate = assignmentDeepCopy.creationDate;
                assignmentDeepCopy.creationDate = deepCopyCreationDate.toString();

                let deepCopyCompletionDate = assignmentDeepCopy.completionDate;
                if (deepCopyCompletionDate !== null) { assignmentDeepCopy.completionDate = deepCopyCompletionDate.toString(); }

                let deepCopyDueDate = assignmentDeepCopy.dueDate;
                assignmentDeepCopy.dueDate = deepCopyDueDate.toString();

                fetch('http://127.0.0.1:5601/editAssignment?userID=' + localStorage.getItem('userID'), {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(assignmentDeepCopy)
                })

                    // Refresh Assignment Center
                    .then(response => response.json())
                    .then(data => {

                        renderAssignments(assignments);
                        $('#editAssignmentDate').datepicker('hide');
                        $('#editAssignment').modal('hide');
                    })

                break;
            }
        }
    });
}

// Delete the Assignment
function deleteAssignment (element) {

    let assignment = element.parentElement.parentElement;
    
    // Send the Assignment's Data to the Server
    loadAssignments(assignments => {

        for (let i = 0; i < assignments.length; i++) {

            if (assignments[i].assignmentID === assignment.getAttribute('assignmentID')) {
    
                assignments.splice(i, 1);

                fetch('http://127.0.0.1:5601/deleteAssignment?assignmentID=' + assignment.getAttribute('assignmentID'), {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    }
                })

                    // Refresh Assignment Center
                    .then(response => response.json())
                    .then(data => {

                        renderAssignments(assignments)
                    })

                break;
            }
        }
    });
}

// Download the Daily Report
function generateDailyReport () {

    let report = 'Assignment Center Daily Report\n';

    let today = new Date();
    let todayMonth = today.getMonth() + 1;
    let todayDay = today.getDate();
    let todayYear = today.getFullYear();
    let todayHours = today.getHours();
    let todayMinutes = today.getMinutes();
    let todaySeconds = today.getSeconds();
    report += todayMonth + '/' + todayDay + '/' + todayYear + ' ' + todayHours + ':' + todayMinutes + ':' + todaySeconds + '\n\n\n';

    // Load the User's Assignments
    loadAssignments(assignments => {

        // Organize the User's Assignments
        let completedAssignments = [];
        let dueNextDayAssignments = [];
        let dueNextThreeDaysAssignments = [];
        let dueNextFiveDaysAssignments = [];

        let twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setDate(today.getDate() - 1);

        let tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        let threeDaysFromToday = new Date();
        threeDaysFromToday.setDate(today.getDate() + 3);

        let fiveDaysFromToday = new Date();
        fiveDaysFromToday.setDate(today.getDate() + 5);

        let daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        // Iterate Through the User's Assignments
        for (let i = 0; i < assignments.length; i++) {

            // Get the Assignment's Data
            let assignment = assignments[i];
            let assignmentDueDate = assignment.dueDate;
            let assignmentCompletionDate = assignment.completionDate;

            // Ensure the Assignment is Completed
            if (assignmentCompletionDate !== null) {

                if (assignmentCompletionDate < twentyFourHoursAgo) { continue; }
                completedAssignments.push(assignment);
            }

            // Assign the Assignment to a Due Date Category
            if (assignmentDueDate < today) { continue; }
            if (assignmentDueDate <= tomorrow) { dueNextDayAssignments.push(assignment); }
            else if (assignmentDueDate <= threeDaysFromToday) { dueNextThreeDaysAssignments.push(assignment); }
            else if (assignmentDueDate <= fiveDaysFromToday) { dueNextFiveDaysAssignments.push(assignment); }
        }

        // Type the Daily Report
        report += 'Assignments Completed in the Last 24 Hours\n\n';
        completedAssignments.sort((a, b) => a.completionDate - b.completionDate);

        for (let i = 0; i < completedAssignments.length; i++) {

            let assignment = completedAssignments[i];
            let assignmentTitle = assignment.title;
            let assignmentDescription = assignment.description;
            let assignmentDueDate = assignment.dueDate;
            let assignmentCompletionDate = assignment.completionDate;

            report += 'Title: ' + assignmentTitle + '\n';
            report += 'Description: ' + assignmentDescription + '\n';
            report += 'Due On: ' + (daysOfTheWeek[assignmentDueDate.getDay()]) + '\n';
            report += 'Completed On: ' + (daysOfTheWeek[assignmentCompletionDate.getDay()]) + ' at ' + (assignmentCompletionDate.getHours() % 12) + ':' + assignmentCompletionDate.getMinutes() + ' ' + (assignmentCompletionDate.getHours() < 12 ? 'AM' : 'PM') + '\n';
            report += '\n';
        }

        report += '\n\nAssignments Due in the Next Day\n\n';
        dueNextDayAssignments.sort((a, b) => a.dueDate - b.dueDate);

        for (let i = 0; i < dueNextDayAssignments.length; i++) {

            let assignment = dueNextDayAssignments[i];
            let assignmentTitle = assignment.title;
            let assignmentDescription = assignment.description;
            let assignmentDueDate = assignment.dueDate;

            report += 'Title: ' + assignmentTitle + '\n';
            report += 'Description: ' + assignmentDescription + '\n';
            report += 'Due On: ' + (daysOfTheWeek[assignmentDueDate.getDay()]) + '\n';
            report += '\n';
        }

        report += '\n\nAssignments Due in the Next Three Days\n\n';
        dueNextThreeDaysAssignments.sort((a, b) => a.dueDate - b.dueDate);

        for (let i = 0; i < dueNextThreeDaysAssignments.length; i++) {

            let assignment = dueNextThreeDaysAssignments[i];
            let assignmentTitle = assignment.title;
            let assignmentDescription = assignment.description;
            let assignmentDueDate = assignment.dueDate;

            report += 'Title: ' + assignmentTitle + '\n';
            report += 'Description: ' + assignmentDescription + '\n';
            report += 'Due On: ' + (daysOfTheWeek[assignmentDueDate.getDay()]) + '\n';
            report += '\n';
        }

        report += '\n\nAssignments Due in the Next Five Days\n\n';
        dueNextFiveDaysAssignments.sort((a, b) => a.dueDate - b.dueDate);

        for (let i = 0; i < dueNextFiveDaysAssignments.length; i++) {

            let assignment = dueNextFiveDaysAssignments[i];
            let assignmentTitle = assignment.title;
            let assignmentDescription = assignment.description;
            let assignmentDueDate = assignment.dueDate;

            report += 'Title: ' + assignmentTitle + '\n';
            report += 'Description: ' + assignmentDescription + '\n';
            report += 'Due On: ' + (daysOfTheWeek[assignmentDueDate.getDay()]) + '\n';
            report += '\n';
        }

        // Download the Daily Report
        let reportBlob = new Blob([report], { type: 'text/plain' });
        let reportURL = URL.createObjectURL(reportBlob);
        let reportLink = document.createElement('a');
        reportLink.setAttribute('href', reportURL);
        reportLink.setAttribute('download', 'Assignment Center Daily Report.txt');
        reportLink.click();
    });
}
