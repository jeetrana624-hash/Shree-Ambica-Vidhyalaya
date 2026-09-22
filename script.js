// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPsW-Yn9hLqF8arfRlcdT3gWmNuDlIFAQ",
  authDomain: "shree-ambica-vidhyalaya.firebaseapp.com",
  projectId: "shree-ambica-vidhyalaya",
  storageBucket: "shree-ambica-vidhyalaya.firebasestorage.app",
  messagingSenderId: "347039718162",
  appId: "1:347039718162:web:645fe9b67afbd4e5da31cb"
};

// 2. Live OpenAI ChatGPT Key
const OPENAI_API_KEY = "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";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

let currentRole = 'school';

// Role Switcher: Administrator gets ID & Password only, Student gets Google Login
window.setRole = function(role) {
    currentRole = role;
    document.getElementById('role-school').classList.toggle('active', role === 'school');
    document.getElementById('role-student').classList.toggle('active', role === 'student');

    const oauthBox = document.getElementById('student-oauth-container');
    const credBox = document.getElementById('credentials-box');

    if (role === 'school') {
        oauthBox.style.display = 'none';
        credBox.style.display = 'block';
        document.getElementById('login-username').placeholder = "Administrator ID";
    } else {
        oauthBox.style.display = 'block';
        credBox.style.display = 'block';
        document.getElementById('login-username').placeholder = "Student Enrollment / Username";
    }
};

// 3. Strict Administrator ID & Password Login
window.manualLogin = function() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    
    if (!user || !pass) {
        alert('Krupya ID ane Password dakhal karo.');
        return;
    }

    if (currentRole === 'school') {
        if (user === "admin" && pass === "admin123") {
            openPortal("Principal / Administrator");
        } else {
            alert("Aamanyo Administrator ID athva Password! Krupya saacho ID ane Password nakho.");
        }
    } else {
        openPortal(user);
    }
};

// 4. Student Google Account Popup Authentication
window.googleLogin = function() {
    if (currentRole === 'school') {
        alert('Administrator login fakt ID ane Password thi j thai shake chhe.');
        return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            openPortal(user.displayName || user.email);
        })
        .catch((error) => {
            alert('Google Login Error: ' + error.message);
        });
};

// 5. Session Control & Authorization
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

window.logout = function() {
    auth.signOut().then(() => {
        location.reload();
    });
};

// 6. Student Registry Storage (Aadhaar, Phone, DOB, Standard, Roll No)
function getStudents() {
    const data = localStorage.getItem('ambica_students');
    return data ? JSON.parse(data) : [];
}

function loadStudents() {
    const list = getStudents();
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${currentRole === 'school' ? 8 : 7}" style="text-align:center; color:#636366; padding:24px;">Koi vidyarthi no record malyo nathi.</td></tr>`;
        return;
    }

    list.forEach((st, idx) => {
        const actionCol = currentRole === 'school' 
            ? `<td><button class="btn-3d btn-danger btn-sm" onclick="window.deleteStudent(${idx})">Delete</button></td>` 
            : '';

        tbody.innerHTML += `<tr>
            <td><strong>${idx + 1}</strong></td>
            <td>${st.name}</td>
            <td><code>${st.roll_no}</code></td>
            <td>${st.standard}</td>
            <td><code>${st.aadhaar || '-'}</code></td>
            <td>${st.phone || '-'}</td>
            <td>${st.dob || '-'}</td>
            ${actionCol}
        </tr>`;
    });
}

window.addStudent = function() {
    const name = document.getElementById('name').value.trim();
    const roll_no = document.getElementById('roll_no').value.trim();
    const standard = document.getElementById('standard').value.trim();
    const aadhaar = document.getElementById('aadhaar').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dob = document.getElementById('dob').value;

    if (!name || !roll_no || !standard) {
        alert('Naam, Roll Number ane Dhoran bharvu farajiyat chhe.');
        return;
    }

    const list = getStudents();
    list.push({ name, roll_no, standard, aadhaar, phone, dob });
    localStorage.setItem('ambica_students', JSON.stringify(list));

    document.getElementById('name').value = '';
    document.getElementById('roll_no').value = '';
    document.getElementById('standard').value = '';
    document.getElementById('aadhaar').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('dob').value = '';
    
    loadStudents();
};

window.deleteStudent = function(index) {
    if (confirm('Su tame kharekhar aa vidyarthi no record delete karva mango chho?')) {
        const list = getStudents();
        list.splice(index, 1);
        localStorage.setItem('ambica_students', JSON.stringify(list));
        loadStudents();
    }
};

// 7. Direct ChatGPT API Engine (No Puter.js Popups)
window.handleKey = function(e) {
    if (e.key === 'Enter') window.sendChatMessage();
};

window.sendChatMessage = async function() {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const chatBody = document.getElementById('chat-messages');
    chatBody.innerHTML += `<div class="chat-bubble user-bubble">${msg}</div>`;
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;

    const loadingId = "loading-" + Date.now();
    chatBody.innerHTML += `<div class="chat-bubble ai-bubble" id="${loadingId}">ChatGPT vichari rahyu chhe...</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    { 
                        role: "system", 
                        content: "You are the official smart academic AI assistant of Shree Ambica Vidhyalaya. Today is Tuesday, September 22, 2026. Give smart, direct, and helpful answers in Gujarati or English as asked." 
                    },
                    { role: "user", content: msg }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();

        if (response.ok && data.choices && data.choices[0]) {
            const reply = data.choices[0].message.content;
            document.getElementById(loadingId).innerText = reply;
        } else {
            console.error("OpenAI Error:", data);
            document.getElementById(loadingId).innerText = "ChatGPT Error: " + (data.error?.message || "Krupya OpenAI billing ane quota check karo.");
        }
    } catch (err) {
        console.error("Connection Error:", err);
        document.getElementById(loadingId).innerText = "ChatGPT sathe connect na thai shakyu. Network connection check karo.";
    }
    chatBody.scrollTop = chatBody.scrollHeight;
};
