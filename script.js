// ૧. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPsW-Yn9hLqF8arfRlcdT3gWmNuDlIFAQ",
  authDomain: "shree-ambica-vidhyalaya.firebaseapp.com",
  projectId: "shree-ambica-vidhyalaya",
  storageBucket: "shree-ambica-vidhyalaya.firebasestorage.app",
  messagingSenderId: "347039718162",
  appId: "1:347039718162:web:645fe9b67afbd4e5da31cb"
};

// ૨. Gemini AI API Key
const GEMINI_API_KEY = "AQ.Ab8RN6JJrVX-v86uLT8fq7R24JEcAYFXZTbZi1yfjLTMAeQ";

// Firebase Initialize
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

let currentRole = 'school';
let confirmationResultRef = null;

function setRole(role) {
    currentRole = role;
    document.getElementById('role-school').classList.toggle('active', role === 'school');
    document.getElementById('role-student').classList.toggle('active', role === 'student');
}

// ૩. સામાન્ય ID / Password Login
function manualLogin() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    if (!user || !pass) {
        alert('Username ane password lakhvo jaruri chhe.');
        return;
    }
    openPortal(user);
}

// ૪. સાચું Google Account Popup Login
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            openPortal(user.displayName || user.email);
        })
        .catch((error) => {
            alert('Google Login Error: ' + error.message);
        });
}

// ૫. સાચો SMS Phone OTP Login
function toggleOtpSection() {
    const el = document.getElementById('otp-section');
    el.style.display = el.style.display === 'none' ? 'block' : 'none';

    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible'
        });
    }
}

function sendRealSMS() {
    const phone = document.getElementById('mobile-input').value.trim();
    if (phone.length < 12) {
        alert('+91 sathe 10 ankda no number lakho (Example: +919876543210)');
        return;
    }

    auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
        .then((confirmationResult) => {
            confirmationResultRef = confirmationResult;
            alert('Tamara mobile number par SMS OTP mokli didho chhe!');
            document.getElementById('verify-area').style.display = 'block';
        })
        .catch((error) => {
            alert('SMS Error: ' + error.message);
        });
}

function verifyRealSMS() {
    const code = document.getElementById('sms-code-input').value.trim();
    if (!code) {
        alert('OTP code enter karo');
        return;
    }

    confirmationResultRef.confirm(code)
        .then((result) => {
            openPortal(result.user.phoneNumber);
        })
        .catch((error) => {
            alert('Khoto OTP code: ' + error.message);
        });
}

// ૬. સેશન કંટ્રોલ
function openPortal(name) {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('user-display-name').innerText = name;
    document.getElementById('user-badge').innerText = currentRole === 'school' ? 'School Admin' : 'Student Mode';

    if (currentRole === 'student') {
        document.getElementById('admin-panel').style.display = 'none';
        document.getElementById('action-header').style.display = 'none';
    } else {
        document.getElementById('admin-panel').style.display = 'block';
        document.getElementById('action-header').style.display = 'table-cell';
    }
    loadStudents();
}

function logout() {
    auth.signOut().then(() => {
        location.reload();
    });
}

// ૭. LocalStorage Records (Add & Delete)
function getStudents() {
    const data = localStorage.getItem('ambica_students');
    return data ? JSON.parse(data) : [];
}

function loadStudents() {
    const list = getStudents();
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';

    list.forEach((st, idx) => {
        const actionCol = currentRole === 'school' 
            ? `<td><button class="btn-delete" onclick="deleteStudent(${idx})">Delete</button></td>` 
            : '';

        tbody.innerHTML += `<tr>
            <td>${idx + 1}</td>
            <td>${st.name}</td>
            <td>${st.roll_no}</td>
            <td>${st.standard}</td>
            ${actionCol}
        </tr>`;
    });
}

function addStudent() {
    const name = document.getElementById('name').value.trim();
    const roll_no = document.getElementById('roll_no').value.trim();
    const standard = document.getElementById('standard').value.trim();

    if (!name || !roll_no || !standard) {
        alert('Badhi vigato bharvi farjiyaat chhe.');
        return;
    }

    const list = getStudents();
    list.push({ name, roll_no, standard });
    localStorage.setItem('ambica_students', JSON.stringify(list));

    document.getElementById('name').value = '';
    document.getElementById('roll_no').value = '';
    document.getElementById('standard').value = '';
    loadStudents();
}

function deleteStudent(index) {
    if (confirm('Kharekhar aa record delete karvo chhe?')) {
        const list = getStudents();
        list.splice(index, 1);
        localStorage.setItem('ambica_students', JSON.stringify(list));
        loadStudents();
    }
}

// ૮. Gemini AI Chatbot Integration
function handleKey(e) {
    if (e.key === 'Enter') sendChatMessage();
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const chatBody = document.getElementById('chat-messages');
    chatBody.innerHTML += `<div class="msg user-msg">${msg}</div>`;
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    const loadingId = "loading-" + Date.now();
    chatBody.innerHTML += `<div class="msg ai-msg" id="${loadingId}">વિચારી રહ્યો છું...</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: "તમે Shree Ambica Vidhyalaya ના શાળા સહાયક AI છો. વિદ્યાર્થીઓને અભ્યાસ, ગણિત, વિજ્ઞાન કે શાળા બાબતે ગુજરાતી અથવા સરળ ભાષામાં વિવેકપૂર્ણ ઉત્તર આપો." }]
                },
                contents: [{ parts: [{ text: msg }] }]
            })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "માફ કરશો, જવાબ આપવામાં મુશ્કેલી થઈ રહી છે.";
        document.getElementById(loadingId).innerText = reply;
    } catch (err) {
        document.getElementById(loadingId).innerText = "કનેક્શનમાં ખામી આવી છે, ફરી પ્રયત્ન કરો.";
    }
    chatBody.scrollTop = chatBody.scrollHeight;
}