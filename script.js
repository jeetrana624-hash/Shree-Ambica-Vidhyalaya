// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPsW-Yn9hLqF8arfRlcdT3gWmNuDlIFAQ",
  authDomain: "shree-ambica-vidhyalaya.firebaseapp.com",
  projectId: "shree-ambica-vidhyalaya",
  storageBucket: "shree-ambica-vidhyalaya.firebasestorage.app",
  messagingSenderId: "347039718162",
  appId: "1:347039718162:web:645fe9b67afbd4e5da31cb"
};

// 2. Gemini AI Integration Key (Tamari Navi Key)
const GEMINI_API_KEY = "AQ.Ab8RN6IShk7fnFCRpaO3WXEUQs3kTzLiSdVWWu89JEU8Ut6_Jw";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

let currentRole = 'school';
let confirmationResultRef = null;

// Role Switcher Function
function setRole(role) {
    currentRole = role;
    document.getElementById('role-school').classList.toggle('active', role === 'school');
    document.getElementById('role-student').classList.toggle('active', role === 'student');
}

// 3. Username / Password Login
function manualLogin() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    
    if (!user || !pass) {
        alert('Please enter your username and password.');
        return;
    }
    openPortal(user);
}

// 4. Real Google Account Popup Authentication
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            openPortal(user.displayName || user.email);
        })
        .catch((error) => {
            alert('Google Authentication Error: ' + error.message);
        });
}

// 5. SMS Phone OTP Verification Flow
function toggleOtpSection() {
    const el = document.getElementById('otp-section');
    el.style.display = el.style.display === 'none' ? 'flex' : 'none';

    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible'
        });
    }
}

function sendRealSMS() {
    const phone = document.getElementById('mobile-input').value.trim();
    if (phone.length < 12) {
        alert('Please enter a valid 10-digit mobile number prefixed with +91 (e.g., +919876543210).');
        return;
    }

    auth.signInWithPhoneNumber(phone, window.recaptchaVerifier)
        .then((confirmationResult) => {
            confirmationResultRef = confirmationResult;
            alert('A verification code has been dispatched to your mobile device via SMS.');
            document.getElementById('verify-area').style.display = 'flex';
        })
        .catch((error) => {
            alert('SMS Dispatch Error: ' + error.message);
        });
}

function verifyRealSMS() {
    const code = document.getElementById('sms-code-input').value.trim();
    if (!code) {
        alert('Please input the 6-digit OTP code.');
        return;
    }

    confirmationResultRef.confirm(code)
        .then((result) => {
            openPortal(result.user.phoneNumber);
        })
        .catch((error) => {
            alert('Invalid verification code: ' + error.message);
        });
}

// 6. Session Orchestration & Authorization
function openPortal(name) {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('user-display-name').innerText = name;
    document.getElementById('user-badge').innerText = currentRole === 'school' ? 'Administrator' : 'Student';

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

// 7. Student Registry Persistence (LocalStorage Engine)
function getStudents() {
    const data = localStorage.getItem('ambica_students');
    return data ? JSON.parse(data) : [];
}

function loadStudents() {
    const list = getStudents();
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${currentRole === 'school' ? 5 : 4}" style="text-align:center; color:#636366; padding:24px;">No student records found in the registry.</td></tr>`;
        return;
    }

    list.forEach((st, idx) => {
        const actionCol = currentRole === 'school' 
            ? `<td><button class="btn-3d btn-danger btn-sm" onclick="deleteStudent(${idx})">Delete</button></td>` 
            : '';

        tbody.innerHTML += `<tr>
            <td><strong>${idx + 1}</strong></td>
            <td>${st.name}</td>
            <td><code>${st.roll_no}</code></td>
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
        alert('All fields are mandatory. Please provide Name, Roll Number, and Standard.');
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
    if (confirm('Are you certain you want to permanently delete this student record?')) {
        const list = getStudents();
        list.splice(index, 1);
        localStorage.setItem('ambica_students', JSON.stringify(list));
        loadStudents();
    }
}

// 8. Gemini Flash AI Assistant Engine
function handleKey(e) {
    if (e.key === 'Enter') sendChatMessage();
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const chatBody = document.getElementById('chat-messages');
    chatBody.innerHTML += `<div class="chat-bubble user-bubble">${msg}</div>`;
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    const loadingId = "loading-" + Date.now();
    chatBody.innerHTML += `<div class="chat-bubble ai-bubble" id="${loadingId}">Synthesizing response...</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': GEMINI_API_KEY
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: "You are the official academic AI assistant of Shree Ambica Vidhyalaya. Deliver structured, articulate, professional, and clear answers regarding academics, curriculum, sciences, mathematics, and institutional queries." }]
                },
                contents: [{ parts: [{ text: msg }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            document.getElementById(loadingId).innerText = "API Error: " + (data.error?.message || "Check API Key");
            return;
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
        document.getElementById(loadingId).innerText = reply;
    } catch (err) {
        console.error("Network Error:", err);
        document.getElementById(loadingId).innerText = "Connection error. Please try again.";
    }
    chatBody.scrollTop = chatBody.scrollHeight;
}
