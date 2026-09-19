let currentRole = 'school';

// --- લોગિન અને રોલ કંટ્રોલ ---
function setRole(role) {
    currentRole = role;
    document.getElementById('role-school').classList.toggle('active', role === 'school');
    document.getElementById('role-student').classList.toggle('active', role === 'student');
}

function sendOTP() {
    const mobile = document.getElementById('mobile-input').value.trim();
    if (mobile.length !== 10) {
        alert('કૃપા કરીને માન્ય 10 આંકડાનો મોબાઇલ નંબર લખો.');
        return;
    }
    alert('મોબાઇલ નંબર ' + mobile + ' પર OTP મોકલવામાં આવ્યો છે: 1234 (ડેમો)');
    document.getElementById('otp-input').style.display = 'block';
    document.getElementById('verify-btn').style.display = 'inline-block';
}

function verifyOTP() {
    const otp = document.getElementById('otp-input').value.trim();
    if (otp === '1234') {
        initSession(currentRole);
    } else {
        alert('ખોટો OTP! સાચો OTP દાખલ કરો.');
    }
}

function loginWithGoogle() {
    alert('Google Login સફળ થયું!');
    initSession(currentRole);
}

function initSession(role) {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('user-badge').innerText = role === 'school' ? 'School Admin' : 'Student Mode';

    // જો વિદ્યાર્થી લોગિન હોય તો તેને ફક્ત લિસ્ટ જોવા મળશે (Add/Delete સંતાડવું)
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

// --- LOCALSTORAGE અને DELETE ફીચર ---
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
        alert('બધી માહિતી ભરવી ફરજિયાત છે.');
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
    if (confirm('શું તમે આ વિદ્યાર્થીનો રેકોર્ડ ડિલીટ કરવા માંગો છો?')) {
        const students = getStudents();
        students.splice(index, 1); // પસંદ કરેલો વિદ્યાર્થી લિસ્ટમાંથી દૂર કરો
        localStorage.setItem('ambica_students', JSON.stringify(students));
        loadStudents();
    }
}

// --- AI CHATBOT INTEGRATION ---
function toggleChat() {
    const box = document.getElementById('chat-box');
    box.style.display = box.style.display === 'none' ? 'flex' : 'none';
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const chatBody = document.getElementById('chat-messages');
    chatBody.innerHTML += `<div class="msg user-msg">${msg}</div>`;
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    // Python સર્વર પર API કોલ
    fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
    })
    .then(res => res.json())
    .then(data => {
        chatBody.innerHTML += `<div class="msg ai-msg">${data.reply}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
    })
    .catch(err => {
        chatBody.innerHTML += `<div class="msg ai-msg">સર્વર કનેક્શનમાં ખામી છે.</div>`;
    });
}
