// Encode Data Using SHA-256
async function sha256 (string) {

    const utf8 = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');

    return hashHex;
}

// Register the User
async function register () {

    let userID = document.getElementById('userID').value;
    let password = document.getElementById('password').value;
    password = await sha256(password);

    // Send the Registration Data to the Server
    fetch('http://127.0.0.1:5601/register?userID=' + userID + '&password=' + password, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })

        .then(response => response.json())
        .then(data => {

            if (data.success) {

                // Store the User ID and Password in Local Storage
                localStorage.setItem('userID', userID);
                localStorage.setItem('password', password);
                $('#login').modal('hide');

                document.getElementById('profileUserID').textContent = userID;
            } else {

                // Display the Error Message
                document.getElementById('loginError').textContent = 'User ID Already Exists';
            }
        });

    // Clear the Input Fields
    document.getElementById('userID').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').textContent = '';
}

// Login the User
async function login () {

    let userID = document.getElementById('userID').value;
    let password = document.getElementById('password').value;
    password = await sha256(password);

    // Send the Login Data to the Server
    fetch('http://127.0.0.1:5601/login?userID=' + userID + '&password=' + password, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })

        .then(response => response.json())
        .then(data => {

            if (data.success) {

                // Store the User ID and Password in Local Storage
                localStorage.setItem('userID', userID);
                localStorage.setItem('password', password);
                $('#login').modal('hide');

                document.getElementById('profileUserID').textContent = userID;
            } else {

                // Display the Error Message
                document.getElementById('loginError').textContent = 'Invalid User ID or Password';
            }
        });

    // Clear the Input Fields
    document.getElementById('userID').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').textContent = '';
}

// Update Email Settings
function updateEmailUpdates () {

    let userID = localStorage.getItem('userID');
    let email = document.getElementById('email').value;
    let emailPassword = document.getElementById('emailPassword').value;
    emailPassword = emailPassword.replaceAll(' ', ';');

    // Send the Email Settings to the Server
    fetch('http://127.0.0.1:5601/updateEmailUpdates?userID=' + userID + '&email=' + email + '&emailPassword=' + emailPassword, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    })

        .then(response => response.json())
        .then(data => {

            if (data.success) {

                document.getElementById('email').value = '';
                document.getElementById('emailPassword').value = '';
                document.getElementById('emailSubmitButton').classList.add('btn-success');
                document.getElementById('emailSubmitButton').classList.remove('btn-primary');
                document.getElementById('emailSubmitButton').classList.remove('btn-danger');
            } else {

                document.getElementById('emailSubmitButton').classList.add('btn-danger');
                document.getElementById('emailSubmitButton').classList.remove('btn-primary');
                document.getElementById('emailSubmitButton').classList.remove('btn-success');
            }
        });
}

// Logout the User
function logout () {

    // Remove the User ID and Password from Local Storage
    localStorage.removeItem('userID');
    localStorage.removeItem('password');
    location.reload();
}

window.addEventListener('load', () => { 
    
    $('#login').modal('show'); 

    // Check If the User is Already Logged In
    if (localStorage.getItem('userID') && localStorage.getItem('password')) { 
        
        $('#login').modal('hide'); 
        document.getElementById('profileUserID').textContent = localStorage.getItem('userID');

        setTimeout(function () {

            $('#login').modal('show'); 
            $('#login').modal('hide'); 
        }, 200);
    }
});
