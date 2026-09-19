let currentRole = 'school';

function setRole(role) {
    currentRole = role;
    document.getElementById('role-school').classList.toggle('active', role === 'school');
    document.getElementById('role-student').classList.toggle('active', role === 'student');
}

function loginWithCredentials() {
    const user = document.getElementById('user-identifier').value.trim();
    const pass = document.getElementById('user-password').value.trim();

    if (!user || !pass) {
        alert('Krupya kari username ane password lakhvo.');
        return;
    }
    initSession(currentRole);
}

function toggleOtpView() {
    const otpSection = document.getElementById('otp-section');
    otpSection.style.display = otpSection.style.display === 'none' ? 'block' : 'none';
}

function sendOTP() {
    const mobile = document.getElementById('mobile-otp-input').value.trim();
    if (mobile.length !== 10) {
        alert('Maany 10 aankdano mobile number lakho.');
        return;
    }
    alert('OTP tame lidhela number par mokli didho chhe: 1234 (Demo)');
}

function verifyOTP() {
    const otp = document.getElementById('otp-verify-input').value.trim();
    if (otp === '1234') {
        initSession(currentRole);
    } else {
        alert('Khoto OTP! 1234 nakho.');
    }
}

function loginWithGoogle() {
    alert('Google Login safal thayu!');
    initSession(currentRole);
}

function initSession(role) {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('user-badge').innerText = role === 'school' ? 'School Admin' : 'Student Mode';

    if (role === 'student') {
        document.getElementById('admin-panel').style.display = 'none';
        document.getElementById('action-header').style.display = 'none';
    } else {
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('action-header').style.display = 'table-cell';
    }
    loadStudents();
}

function logout() {
    location.reload();
}

// LocalStorage Records Handling
function getStudents() {
    const data = localStorage.getItem('ambica_students');
    return data ? JSON.parse(data) : [];
}

function loadStudents() {
    const students = getStudents();
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';

    students.forEach((student, index) => {
        const actionCell = currentRole === 'school' 
            ? `<td><button class="btn-delete" onclick="deleteStudent(${index})">Delete</button></td>` 
            : '';

        const row = `<tr>
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.roll_no}</td>
            <td>${student.standard}</td>
            ${actionCell}
        </tr>`;
        tbody.innerHTML += row;
    });
}

function addStudent() {
    const name = document.getElementById('name').value.trim();
    const roll_no = document.getElementById('roll_no').value.trim();
    const standard = document.getElementById('standard').value.trim();

    if (!name || !roll_no || !standard) {
        alert('Badhi vigato bharo.');
        return;
    }

    const students = getStudents();
    students.push({ name, roll_no, standard });
    localStorage.setItem('ambica_students', JSON.stringify(students));

    document.getElementById('name').value = '';
    document.getElementById('roll_no').value = '';
    document.getElementById('standard').value = '';
    loadStudents();
}

function deleteStudent(index) {
    if (confirm('Aa record delete karvo chhe?')) {
        const students = getStudents();
        students.splice(index, 1);
        localStorage.setItem('ambica_students', JSON.stringify(students));
        loadStudents();
    }
}
