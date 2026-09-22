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

// Role Switcher
window.setRole = function(role) {
    currentRole = role;
    document.getElementById('role-school').classList.toggle('active', role === 'school');
    document.getElementById('role-student').classList.toggle('active', role === 'student');
};

// 2. Manual Login
window.manualLogin = function() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    
    if (!user || !pass) {
        alert('કૃપા કરીને યુઝરનેમ અને પાસવર્ડ દાખલ કરો.');
        return;
    }
    openPortal(user);
};

// 3. Real Google Account Popup Authentication
window.googleLogin = function() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            openPortal(user.displayName || user.email);
        })
        .catch((error) => {
            alert('Google લૉગિન એરર: ' + error.message);
        });
};

// 4. Session Control
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

// 5. Student Registry Persistence (LocalStorage Engine)
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
            ? `<td><button class="btn-3d btn-danger btn-sm" onclick="window.deleteStudent(${idx})">Delete</button></td>` 
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

window.addStudent = function() {
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
};

window.deleteStudent = function(index) {
    if (confirm('શું તમે ખરેખર આ વિદ્યાર્થીનો રેકોર્ડ કાઢી નાખવા માંગો છો?')) {
        const list = getStudents();
        list.splice(index, 1);
        localStorage.setItem('ambica_students', JSON.stringify(list));
        loadStudents();
    }
};

// 6. Ambica AI Academic Assistant (Reliable Client Engine)
window.handleKey = function(e) {
    if (e.key === 'Enter') window.sendChatMessage();
};

window.sendChatMessage = function() {
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

    // Simulate instant AI synthesis without blocking network errors
    setTimeout(() => {
        const q = msg.toLowerCase();
        let reply = "";

        if (q.includes("hi") || q.includes("hello") || q.includes("હેલો") || q.includes("કેમ છો")) {
            reply = "નમસ્તે! હું શ્રી અંબિકા વિદ્યાલયનો શૈક્ષણિક AI સહાયક છું. અભ્યાસક્રમ, પરીક્ષા કે શાળા સંબંધિત પ્રશ્નો પૂછી શકો છો.";
        } else if (q.includes("admission") || q.includes("પ્રવેશ")) {
            reply = "શ્રી અંબિકા વિદ્યાલયમાં નવા શૈક્ષણિક સત્ર માટે પ્રવેશ પ્રક્રિયા ચાલુ છે. જરૂરી દસ્તાવેજો: જન્મ પ્રમાણપત્ર, પાછલા ધોરણની માર્કશીટ અને LC.";
        } else if (q.includes("fee") || q.includes("ફી")) {
            reply = "શાળા ફી સંબંધિત વિગતો ઓફિસ કાઉન્ટર પર સવારે ૮:૦૦ થી બપોરે ૧૨:૦૦ વાગ્યા સુધી ઉપલબ્ધ છે.";
        } else if (q.includes("exam") || q.includes("પરીક્ષા") || q.includes("તારીખ")) {
            reply = "વાર્ષિક અને એકમ કસોટીઓનું સમયપત્રક નોટિસ બોર્ડ તેમજ પોર્ટલના સ્ટુડન્ટ ડેશબોર્ડ પર પ્રકાશિત કરવામાં આવે છે.";
        } else if (q.includes("science") || q.includes("વિજ્ઞાન") || q.includes("maths") || q.includes("ગણિત")) {
            reply = "ધોરણ ૧ થી ૧૨ ના વિજ્ઞાન અને ગણિત વિષય માટે લેબોરેટરી પ્રેક્ટિકલ અને વિશેષ માર્ગદર્શન વર્ગોનું આયોજન કરવામાં આવેલું છે.";
        } else {
            reply = `તમારા પ્રશ્ન ("${msg}") માટે: શ્રી અંબિકા વિદ્યાલયના શૈક્ષણિક નિયમો અને અભ્યાસક્રમ મુજબ આ વિષયે જરૂરી માર્ગદર્શન વિદ્યાર્થી ડેશબોર્ડ તેમજ શાળા કાર્યાલય દ્વારા પૂરી પાડવામાં આવે છે.`;
        }

        const bubble = document.getElementById(loadingId);
        if (bubble) {
            bubble.innerText = reply;
        }
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 450);
};
