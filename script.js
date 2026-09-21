// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPsW-Yn9hLqF8arfRlcdT3gWmNuDlIFAQ",
  authDomain: "shree-ambica-vidhyalaya.firebaseapp.com",
  projectId: "shree-ambica-vidhyalaya",
  storageBucket: "shree-ambica-vidhyalaya.firebasestorage.app",
  messagingSenderId: "347039718162",
  appId: "1:347039718162:web:645fe9b67afbd4e5da31cb"
};

// 2. Google AI Auth Key (નવા ફોર્મેટ વાળી કી ફિટ કરી દીધી છે)
const GEMINI_API_KEY = "AQ.Ab8RN6J1l5xSXJgdIWpiN3pt28TrQ0Li0CxHxEOW3s1ZyKBdBg";

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

let currentRole = 'school';

// Role Switcher
function setRole(role) {
    currentRole = role;
    document.getElementById('role-school').classList.toggle('active', role === 'school');
    document.getElementById('role-student').classList.toggle('active', role === 'student');
}

// 3. Manual Login
function manualLogin() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    
    if (!user || !pass) {
        alert('કૃપા કરીને યુઝરનેમ અને પાસવર્ડ દાખલ કરો.');
        return;
    }
    openPortal(user);
}

// 4. Google Account Popup Authentication
function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            openPortal(user.displayName || user.email);
        })
        .catch((error) => {
            alert('Google લૉગિન એરર: ' + error.message);
        });
}

// 5. Session Control
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

// 6. Student Registry Persistence (LocalStorage Engine)
function getStudents() {
    const data = localStorage.getItem('ambica_students');
    return data ? JSON.parse(data) : [];
}

function loadStudents() {
    const list = getStudents();
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${currentRole === 'school' ? 5 : 4}" style="text-align:center; color:#636366; padding:24px;">કોઈ વિદ્યાર્થીનો રેકોર્ડ મળ્યો નથી.</td></tr>`;
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
        alert('બધા ખાના ભરવા ફરજિયાત છે: નામ, રોલ નંબર અને ધોરણ.');
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
    if (confirm('શું તમે ખરેખર આ વિદ્યાર્થીનો રેકોર્ડ કાઢી નાખવા માંગો છો?')) {
        const list = getStudents();
        list.splice(index, 1);
        localStorage.setItem('ambica_students', JSON.stringify(list));
        loadStudents();
    }
}

// 7. Gemini AI Assistant Engine (AQ. કી માટેનું એડવાન્સ ડ્યુઅલ એન્ડપોઇન્ટ હેન્ડલર)
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
    chatBody.innerHTML += `<div class="chat-bubble ai-bubble" id="${loadingId}">વિચારી રહ્યું છે...</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    const requestPayload = {
        contents: [{ parts: [{ text: msg }] }]
    };

    try {
        // First try: Express REST endpoint with Auth Bearer
        let response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            },
            body: JSON.stringify(requestPayload)
        });

        // Second try fallback: Standard key header if Bearer requires token mapping
        if (!response.ok) {
            response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestPayload)
            });
        }

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);
            document.getElementById(loadingId).innerText = "API Error: " + (data.error?.message || "પ્રક્રિયા પૂર્ણ થઈ શકી નથી.");
            return;
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "કોઈ જવાબ મળ્યો નથી.";
        document.getElementById(loadingId).innerText = reply;
    } catch (err) {
        console.error("Network Error:", err);
        document.getElementById(loadingId).innerText = "કનેક્શન એરર. ઇન્ટરનેટ તપાસી ફરી પ્રયત્ન કરો.";
    }
    chatBody.scrollTop = chatBody.scrollHeight;
}
