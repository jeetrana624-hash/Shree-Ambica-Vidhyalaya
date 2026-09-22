// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPsW-Yn9hLqF8arfRlcdT3gWmNuDlIFAQ",
  authDomain: "shree-ambica-vidhyalaya.firebaseapp.com",
  projectId: "shree-ambica-vidhyalaya",
  storageBucket: "shree-ambica-vidhyalaya.firebasestorage.app",
  messagingSenderId: "347039718162",
  appId: "1:347039718162:web:645fe9b67afbd4e5da31cb"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();

let currentRole = 'school';

// Role Switcher: Administrator gets only ID & Password, Student gets Google Login
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

// 2. Strict Administrator ID & Password Login
window.manualLogin = function() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    
    if (!user || !pass) {
        alert('કૃપા કરીને ID અને Password દાખલ કરો.');
        return;
    }

    if (currentRole === 'school') {
        if (user === "admin" && pass === "admin123") {
            openPortal("Principal / Administrator");
        } else {
            alert("અમાન્ય Administrator ID અથવા Password! કૃપા કરીને સાચો ID અને Password નાખો.");
        }
    } else {
        openPortal(user);
    }
};

// 3. Student-Only Google Authentication
window.googleLogin = function() {
    if (currentRole === 'school') {
        alert('Administrator લૉગિન ફક્ત ID અને Password દ્વારા જ થઈ શકે છે.');
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

// 4. Session Control & Authorization
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

// 5. Student Registry Storage (Aadhaar, Phone, DOB, Standard, Roll No)
function getStudents() {
    const data = localStorage.getItem('ambica_students');
    return data ? JSON.parse(data) : [];
}

function loadStudents() {
    const list = getStudents();
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${currentRole === 'school' ? 8 : 7}" style="text-align:center; color:#636366; padding:24px;">કોઈ વિદ્યાર્થીનો રેકોર્ડ મળ્યો નથી.</td></tr>`;
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
        alert('નામ, રોલ નંબર અને ધોરણ ભરવું ફરજિયાત છે.');
        return;
    }

    const list = getStudents();
    list.push({ name, roll_no, standard, aadhaar, phone, dob });
    localStorage.setItem('ambica_students', JSON.stringify(list));

    // Reset Form Fields
    document.getElementById('name').value = '';
    document.getElementById('roll_no').value = '';
    document.getElementById('standard').value = '';
    document.getElementById('aadhaar').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('dob').value = '';
    
    loadStudents();
};

window.deleteStudent = function(index) {
    if (confirm('શું તમે ખરેખર આ વિદ્યાર્થીનો રેકોર્ડ કાઢી નાખવા માંગો છો?')) {
        const list = getStudents();
        list.splice(index, 1);
        localStorage.setItem('ambica_students', JSON.stringify(list));
        loadStudents();
    }
};

// 6. Ambica AI Engine (CORS-Free OpenAI Client API)
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
    chatBody.innerHTML += `<div class="chat-bubble ai-bubble" id="${loadingId}">વિચારી રહ્યું છે...</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    const systemPrompt = "You are the official smart academic AI assistant of Shree Ambica Vidhyalaya. Today is Tuesday, September 22, 2026. Provide smart, direct, and polite answers to students in Gujarati or English as asked.";

    try {
        const response = await fetch("https://text.pollinations.ai/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: msg }
                ],
                model: "openai"
            })
        });

        if (response.ok) {
            const reply = await response.text();
            document.getElementById(loadingId).innerText = reply || "કોઈ ઉત્તર મળ્યો નથી.";
        } else {
            throw new Error("HTTP Status " + response.status);
        }
    } catch (err) {
        console.error("AI Error:", err);
        const q = msg.toLowerCase();
        if (q.includes("time") || q.includes("સમય") || q.includes("વાગ્યા")) {
            const now = new Date();
            document.getElementById(loadingId).innerText = `અત્યારે સમય થયો છે: ${now.toLocaleTimeString('gu-IN')}`;
        } else {
            document.getElementById(loadingId).innerText = "માફ કરજો, સર્વર કનેક્શનમાં ક્ષતિ આવી. થોડી ક્ષણો પછી ફરી પ્રયત્ન કરો.";
        }
    }
    chatBody.scrollTop = chatBody.scrollHeight;
};
