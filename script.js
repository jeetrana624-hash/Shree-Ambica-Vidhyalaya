// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPsW-Yn9hLqF8arfRlcdT3gWmNuDlIFAQ",
  authDomain: "shree-ambica-vidhyalaya.firebaseapp.com",
  projectId: "shree-ambica-vidhyalaya",
  storageBucket: "shree-ambica-vidhyalaya.firebasestorage.app",
  messagingSenderId: "347039718162",
  appId: "1:347039718162:web:645fe9b67afbd4e5da31cb"
};

// 2. OpenAI ChatGPT Key (Optional - direct key hoy to paste kari shako chho)
const OPENAI_API_KEY = "";

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

// 3. Strict Administrator ID & Password Login
window.manualLogin = function() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    
    if (!user || !pass) {
        alert('Krupya ID ane Password dakhal karo.');
        return;
    }

    if (currentRole === 'school') {
        // Administrator strict credentials check
        if (user === "admin" && pass === "admin123") {
            openPortal("Principal / Administrator");
        } else {
            alert("Aamanyo Administrator ID athva Password! Krupya saacho ID ane Password nakho.");
        }
    } else {
        // Student login
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

    // Reset Input Fields
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

// 7. Ambica AI Smart Academic Engine (ChatGPT / Puter AI Integration)
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
    chatBody.innerHTML += `<div class="chat-bubble ai-bubble" id="${loadingId}">Vichari rahyu chhe...</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    const systemPrompt = "You are the official smart academic AI assistant of Shree Ambica Vidhyalaya. Today is Tuesday, September 22, 2026. Give smart, direct, and helpful answers in Gujarati or English as asked.";

    try {
        // Option A: Direct OpenAI API Key
        if (OPENAI_API_KEY && OPENAI_API_KEY.startsWith("sk-")) {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: msg }
                    ]
                })
            });

            const data = await response.json();
            if (response.ok) {
                const reply = data.choices?.[0]?.message?.content || "Koi javab malyo nathi.";
                document.getElementById(loadingId).innerText = reply;
                chatBody.scrollTop = chatBody.scrollHeight;
                return;
            }
        }

        // Option B: Puter.js Live Multi-Engine (ChatGPT / Claude backend)
        if (window.puter && window.puter.ai) {
            const res = await puter.ai.chat(`${systemPrompt}\nStudent Question: ${msg}`);
            const replyText = typeof res === 'string' ? res : (res.message?.content || res.text || JSON.stringify(res));
            document.getElementById(loadingId).innerText = replyText;
        } else {
            // Local fallback logic
            const q = msg.toLowerCase();
            if (q.includes("time") || q.includes("samay") || q.includes("vagya")) {
                const now = new Date();
                document.getElementById(loadingId).innerText = `Atyare samay thayo chhe: ${now.toLocaleTimeString('gu-IN')} (${now.toLocaleDateString('gu-IN')})`;
            } else {
                document.getElementById(loadingId).innerText = "AI sathe jodai rahyu chhe. Krupya page refresh kari fari lakho.";
            }
        }
    } catch (err) {
        console.error("AI Assistant Error:", err);
        const now = new Date();
        if (msg.toLowerCase().includes("time") || msg.includes("samay") || msg.includes("vagya")) {
            document.getElementById(loadingId).innerText = `Atyare samay thayo chhe: ${now.toLocaleTimeString('gu-IN')}`;
        } else {
            document.getElementById(loadingId).innerText = "Maff karjo, javab lavva ma samasya aavi. Krupya network check karo.";
        }
    }
    chatBody.scrollTop = chatBody.scrollHeight;
};
