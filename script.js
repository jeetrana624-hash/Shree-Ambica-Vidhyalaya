// ==========================================================================
// SHREE AMBICA VIDHYALAYA - ENTERPRISE ERP ENGINE
// Interactive Login Logo Changer, Targeted Notices, Full Enterprise Suite
// ==========================================================================

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
let currentLanguage = 'en';
let activeVaultStudentUID = null;
let activeStudentStandard = null;
let activeTeacherCode = null;
let isTimetableEditing = false;

// 1. Strict Date Mask DD/MM/YYYY
window.applyDateMask = function(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    if (v.length >= 5) {
        input.value = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`;
    } else if (v.length >= 3) {
        input.value = `${v.slice(0, 2)}/${v.slice(2)}`;
    } else {
        input.value = v;
    }
};

function formatToDDMMYYYY(dateString) {
    if (!dateString) return '-';
    if (dateString.includes('/')) return dateString;
    const parts = dateString.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(dateString);
    if (!isNaN(d.getTime())) {
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }
    return dateString;
}

// Credentials
function getAdminCredentials() {
    const saved = localStorage.getItem('sav_admin_credentials');
    return saved ? JSON.parse(saved) : { id: "admin", pass: "admin123" };
}

function getTeacherCredentials() {
    const saved = localStorage.getItem('sav_teacher_credentials');
    return saved ? JSON.parse(saved) : { code: "TCH101", pass: "teach123", name: "Senior Faculty" };
}

// ==========================================================================
// 2. SCHOOL LOGO MANAGER (Upload, Change, Delete / Reset)
// ==========================================================================
const DEFAULT_LOGO = "logo.png";
const FALLBACK_LOGO = "https://cdn-icons-png.flaticon.com/512/2602/2602414.png";

function getSchoolLogo() {
    return localStorage.getItem('sav_official_school_logo') || DEFAULT_LOGO;
}

function refreshSchoolLogos() {
    const logoUrl = getSchoolLogo();
    const loginImg = document.getElementById('login-logo-img');
    const sideImg = document.getElementById('sidebar-logo-img');
    const prevImg = document.getElementById('mgmt-logo-preview');

    if (loginImg) loginImg.src = logoUrl;
    if (sideImg) sideImg.src = logoUrl;
    if (prevImg) prevImg.src = logoUrl;
}

window.handleLogoUpload = function(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const base64Logo = e.target.result;
            localStorage.setItem('sav_official_school_logo', base64Logo);
            refreshSchoolLogos();
            alert('School Official Logo updated successfully!');
        };
        reader.readAsDataURL(file);
    }
};

window.removeSchoolLogo = function(e) {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to reset to the default school logo?')) {
        localStorage.removeItem('sav_official_school_logo');
        refreshSchoolLogos();
        alert('School logo reset to default!');
    }
};

// 3. Multilingual Dictionary
const translations = {
    en: {
        appSubtitle: "Enterprise Academic & Institutional Portal",
        selectLanguage: "Portal System Language",
        adminRole: "Admin",
        teacherRole: "Teacher",
        studentRole: "Student",
        loginBtn: "Secure Enterprise Login",
        orGoogle: "OR CONTINUE WITH GOOGLE",
        menuHome: "Dashboard Home",
        menuStudents: "Student Admission & Registry",
        menuVault: "Document Vault",
        menuAttendance: "Attendance Register",
        menuNotices: "Notice Board",
        menuCirculars: "Govt Circulars",
        menuTimetable: "Timetable",
        menuHolidays: "Holiday Calendar",
        menuSettings: "Security Settings",
        logoutBtn: "Log Out",
        institutionalPortal: "Institutional Portal",
        heroWelcomeTag: "OFFICIAL ACADEMIC REPOSITORY",
        heroWelcomeTitle: "Welcome to Shree Ambica Vidhyalaya",
        heroWelcomeDesc: "An integrated institutional management platform supporting advanced student records, statutory compliance, and real-time daily roll checks.",
        quickNewAdmission: "+ Enroll Student",
        quickAttendance: "Mark Attendance",
        statEnrolled: "Total Students",
        homeRecentNotices: "Latest Institutional Notices",
        homeUpcomingHolidays: "Upcoming Academic Holidays",
        formTitleEnroll: "Comprehensive Student Admission",
        formDescEnroll: "Complete student demographic and academic registry",
        fldGrNo: "G.R. Number *",
        fldUid: "UID Number (Username) *",
        fldPassword: "Student Login Password *",
        fldEmail: "Registered Student Email (for Google Login)",
        fldName: "Full Student Name *",
        fldStandard: "Standard / Division *",
        fldRoll: "Roll Number *",
        fldDob: "Date of Birth (DD/MM/YYYY) *",
        fldGender: "Gender *",
        fldWeight: "Weight (KG)",
        fldHeight: "Height (CM)",
        fldBlood: "Blood Group",
        fldAadhaar: "Student Govt ID Number *",
        fldFatherName: "Father / Guardian Name",
        fldFatherAadhaar: "Father Identification Number",
        fldMotherName: "Mother Name",
        fldMotherAadhaar: "Mother Identification Number",
        fldPhone: "Emergency Contact Number *",
        fldAddress: "Residential Address *",
        btnSaveStudent: "Register & Save Student Data",
        tblTitleRegistry: "Institutional Student Registry",
        tblDescRegistry: "Complete directory with record editing, deletion, and credentials administration",
        colGr: "GR No",
        colUid: "UID (User)",
        colName: "Student Name",
        colStd: "Standard",
        colRoll: "Roll",
        colDob: "DOB (DD/MM/YYYY)",
        colPhysical: "Ht / Wt",
        colPhone: "Contact",
        colActions: "Actions",
        vaultTitle: "Student Individual Document Archive & Gallery",
        vaultDesc: "Manage, upload, preview, update, and remove student identity proofs and certificates",
        docPassport: "Student Passport Photo",
        docBirth: "Birth Certificate",
        docAadhaar: "Student Govt ID Card",
        docIncome: "Income Certificate",
        docCaste: "Caste Certificate",
        docParentsAadhaar: "Parents Proofs",
        attTitle: "Daily Digital Attendance Register",
        attDesc: "Instant single-click roll call with automatic toggle & bulk actions",
        colAttendanceStatus: "Status",
        btnSaveAttendance: "Submit Attendance Records",
        noticeTitle: "Parent & Institutional Communication Board",
        noticeDesc: "Official circulars, urgent announcements, and class-specific student notices",
        btnNewNotice: "+ Post Notice",
        lblPostNotice: "Publish Official Notice",
        btnPublish: "Publish Notice",
        btnCancel: "Cancel",
        circTitle: "Official Government Circulars & Statutory Orders",
        circDesc: "Gujarat Education Department directives, Board notifications, and compliance orders",
        btnNewCirc: "+ Archive Order",
        lblArchiveOrder: "Archive Statutory Circular",
        btnSaveCircular: "Archive Circular",
        ttTitle: "Master Academic Schedule & Timetable",
        ttDesc: "Weekly 8-Lecture academic schedule with Prayer and Recess",
        hldTitle: "Annual & Local Holiday Schedule",
        hldDesc: "Statutory academic calendar and institutional holiday notifications"
    },
    gu: {
        appSubtitle: "શિક્ષણ અને વહીવટી સંચાલન પ્રણાલી",
        selectLanguage: "પોર્ટલની મુખ્ય ભાષા પસંદ કરો",
        adminRole: "એડમિન",
        teacherRole: "શિક્ષક",
        studentRole: "વિદ્યાર્થી",
        loginBtn: "સુરક્ષિત લૉગિન",
        orGoogle: "અથવા ગૂગલ વડે લૉગિન કરો",
        menuHome: "ડેશબોર્ડ મુખ્ય પૃષ્ઠ",
        menuStudents: "વિદ્યાર્થી પ્રવેશ / રજિસ્ટર",
        menuVault: "દસ્તાવેજ સંગ્રહાલય",
        menuAttendance: "દૈનિક હાજરી પત્રક",
        menuNotices: "સૂચના બોર્ડ (નોટિસ)",
        menuCirculars: "સરકારી પરિપત્રો",
        menuTimetable: "સમયપત્રક (ટાઇમટેબલ)",
        menuHolidays: "રજાઓનું કેલેન્ડર",
        menuSettings: "સિક્યોરિટી સેટિંગ્સ",
        logoutBtn: "લૉગ આઉટ",
        institutionalPortal: "શાળા સંચાલન પ્રણાલી",
        heroWelcomeTag: "સત્તાવાર શૈક્ષણિક પોર્ટલ",
        heroWelcomeTitle: "શ્રી અંબિકા વિદ્યાલયમાં આપનું સ્વાગત છે",
        heroWelcomeDesc: "વિદ્યાર્થી પ્રવેશ, ઓળખ પુરાવા અને પ્રમાણપત્રો, દૈનિક હાજરી અને સરકારી પરિપત્રો માટેનું સંપૂર્ણ ડિજિટલ પ્લેટફોર્મ.",
        quickNewAdmission: "+ નવો પ્રવેશ",
        quickAttendance: "હાજરી પૂરો",
        statEnrolled: "કુલ વિદ્યાર્થીઓ",
        homeRecentNotices: "તાજેતરની શાળા સૂચનાઓ",
        homeUpcomingHolidays: "આગામી શૈક્ષણિક રજાઓ",
        formTitleEnroll: "વિદ્યાર્થી પ્રવેશ ફોર્મ",
        formDescEnroll: "વિદ્યાર્થીની સંપૂર્ણ માહિતી અને વહીવટી રજિસ્ટર",
        fldGrNo: "જી.આર. નંબર (G.R. No) *",
        fldUid: "યુ.આઈ.ડી. નંબર (યુઝરનેમ) *",
        fldPassword: "વિદ્યાર્થી લૉગિન પાસવર્ડ *",
        fldEmail: "નોંધાયેલ ઈમેઈલ (ગૂગલ લૉગિન માટે)",
        fldName: "વિદ્યાર્થીનું પૂરું નામ *",
        fldStandard: "ધોરણ / વર્ગ *",
        fldRoll: "રોલ નંબર *",
        fldDob: "જન્મ તારીખ (DD/MM/YYYY) *",
        fldGender: "જાતિ (Gender) *",
        fldWeight: "વજન (કિલો)",
        fldHeight: "ઊંચાઈ (સેમી)",
        fldBlood: "બ્લડ ગ્રુપ",
        fldAadhaar: "વિદ્યાર્થી ઓળખ નંબર *",
        fldFatherName: "પિતા / વાલીનું નામ",
        fldFatherAadhaar: "પિતાનો ઓળખ નંબર",
        fldMotherName: "માતાનું નામ",
        fldMotherAadhaar: "માતાનો ઓળખ નંબર",
        fldPhone: "મોબાઈલ નંબર *",
        fldAddress: "રહેઠાણનું સરનામું *",
        btnSaveStudent: "વિદ્યાર્થી માહિતી સાચવો",
        tblTitleRegistry: "વિદ્યાર્થી જનરલ રજિસ્ટર",
        tblDescRegistry: "વિગતો સંપાદન, ડિલીટ અને લૉગિન બદલવાની સુવિધા",
        colGr: "જી.આર.",
        colUid: "UID (User)",
        colName: "વિદ્યાર્થી નામ",
        colStd: "ધોરણ",
        colRoll: "રોલ",
        colDob: "જન્મ તારીખ (DD/MM/YYYY)",
        colPhysical: "ઊંચાઈ/વજન",
        colPhone: "સંપર્ક",
        colActions: "કાર્યવાહી",
        vaultTitle: "વિદ્યાર્થી દસ્તાવેજ સંગ્રહાગાર અને ગેલેરી",
        vaultDesc: "દરેક વિદ્યાર્થીવાર ઓળખ પુરાવા, ફોટો અને પ્રમાણપત્રો અપલોડ, અપડેટ અને ડિલીટ કરો",
        docPassport: "પાસપોર્ટ સાઇઝ ફોટો",
        docBirth: "જન્મ પ્રમાણપત્ર",
        docAadhaar: "વિદ્યાર્થી ઓળખ કાર્ડ",
        docIncome: "આવકનો દાખલો",
        docCaste: "જાતિનો દાખલો",
        docParentsAadhaar: "માતા-પિતાના પુરાવા",
        attTitle: "દૈનિક ઓનલાઇન હાજરી રજિસ્ટર",
        attDesc: "એક જ ક્લિકમાં P/A ટૉગલ વડે હાજરી પૂરો",
        colAttendanceStatus: "સ્થિતિ",
        btnSaveAttendance: "હાજરી સબમિટ કરો",
        noticeTitle: "વાલી અને શાળા સંચાર બોર્ડ",
        noticeDesc: "સત્તાવાર પરિપત્રો, જાહેરાતો અને વર્ગવાર વિદ્યાર્થી નોટિસ",
        btnNewNotice: "+ નવી નોટિસ",
        lblPostNotice: "સત્તાવાર નોટિસ જાહેર કરો",
        btnPublish: "પ્રકાશિત કરો",
        btnCancel: "રદ કરો",
        circTitle: "સત્તાવાર સરકારી પરિપત્રો અને આદેશો",
        circDesc: "શિક્ષણ બોર્ડ અને ગાંધીનગર નિયામકની કચેરીના આદેશો",
        btnNewCirc: "+ પરિપત્ર ઉમેરો",
        lblArchiveOrder: "સરકારી પરિપત્ર સાચવો",
        btnSaveCircular: "સાચવો",
        ttTitle: "સાપ્તાહિક શૈક્ષણિક સમયપત્રક",
        ttDesc: "પ્રાર્થના, રીસેસ અને 8 તાસ સાથે ટાઇમટેબલ",
        hldTitle: "શાળા શૈક્ષણિક અને સ્થાનિક રજાઓ",
        hldDesc: "વાર્ષિક કેલેન્ડર અને તહેવારોની યાદી"
    },
    hi: {
        appSubtitle: "संस्थागत शैक्षणिक एवं प्रबंधन प्रणाली",
        selectLanguage: "पोर्टल की मुख्य भाषा चुनें",
        adminRole: "व्यवस्थापक",
        teacherRole: "शिक्षक",
        studentRole: "छात्र",
        loginBtn: "सुरक्षित लॉगिन",
        orGoogle: "या गूगल से लॉगिन करें",
        menuHome: "डैशबोर्ड मुख्य पृष्ठ",
        menuStudents: "छात्र प्रवेश / रजिस्टर",
        menuVault: "दस्तावेज़ संग्रह",
        menuAttendance: "दैनिक उपस्थिति रजिस्टर",
        menuNotices: "सूचना पट्ट (Notices)",
        menuCirculars: "सरकारी परिपत्र",
        menuTimetable: "समय सारिणी",
        menuHolidays: "अवकाश कैलेंडर",
        menuSettings: "सुरक्षा सेटिंग्स",
        logoutBtn: "लॉग आउट",
        institutionalPortal: "संस्थागत प्रबंधन प्रणाली",
        heroWelcomeTag: "आधिकारिक शैक्षणिक पोर्टल",
        heroWelcomeTitle: "श्री अंबिका विद्यालय में आपका स्वागत है",
        heroWelcomeDesc: "छात्र प्रवेश, दस्तावेज़, ऑनलाइन उपस्थिति और सरकारी परिपत्र हेतु एकीकृत डिजिटल मंच।",
        quickNewAdmission: "+ नया प्रवेश",
        quickAttendance: "उपस्थिति दर्ज करें",
        statEnrolled: "कुल छात्र",
        homeRecentNotices: "नवीनतम संस्थागत सूचनाएं",
        homeUpcomingHolidays: "आगामी शैक्षणिक अवकाश",
        formTitleEnroll: "छात्र प्रवेश फॉर्म",
        formDescEnroll: "छात्र की विस्तृत जानकारी एवं रजिस्टर",
        fldGrNo: "जी.आर. नंबर (G.R. No) *",
        fldUid: "यू.આઈ.ડી. નંબર (યુઝરનેમ) *",
        fldPassword: "छात्र लॉगिन पासवर्ड *",
        fldEmail: "पंजीकृत ईमेल (गूगल लॉगिन हेतु)",
        fldName: "छात्र का पूरा नाम *",
        fldStandard: "कक्षा / वर्ग *",
        fldRoll: "रोल नंबर *",
        fldDob: "जन्म तिथि (DD/MM/YYYY) *",
        fldGender: "लिंग *",
        fldWeight: "वजन (किग्रा)",
        fldHeight: "ऊंचाई (सेमी)",
        fldBlood: "रक्त समूह",
        fldAadhaar: "छात्र पहचान संख्या *",
        fldFatherName: "पिता / अभिभावक का नाम",
        fldFatherAadhaar: "पिता का पहचान नंबर",
        fldMotherName: "माता का नाम",
        fldMotherAadhaar: "माता का पहचान नंबर",
        fldPhone: "मोबाइल नंबर *",
        fldAddress: "स्थायी पता *",
        btnSaveStudent: "छात्र डेटा सुरक्षित करें",
        tblTitleRegistry: "छात्र जनरल रजिस्टर",
        tblDescRegistry: "विवरण संपादन, विलोपन और लॉगिन प्रबंधन",
        colGr: "जी.आर.",
        colUid: "UID (User)",
        colName: "छात्र का नाम",
        colStd: "कक्षा",
        colRoll: "रोल",
        colDob: "जन्म तिथि (DD/MM/YYYY)",
        colPhysical: "ऊंचाई/वजन",
        colPhone: "संपर्क",
        colActions: "कार्यवाही",
        vaultTitle: "छात्र दस्तावेज़ संग्रह एवं गैलरी",
        vaultDesc: "पहचान पत्र, फोटो और प्रमाण पत्रों का प्रबंधन",
        docPassport: "पासपोर्ट साइज फोटो",
        docBirth: "जन्म प्रमाण पत्र",
        docAadhaar: "छात्र पहचान कार्ड",
        docIncome: "आय प्रमाण पत्र",
        docCaste: "जाति प्रमाण पत्र",
        docParentsAadhaar: "माता-पिता के दस्तावेज",
        attTitle: "दैनिक डिजिटल उपस्थिति रजिस्टर",
        attDesc: "एक क्लिक में P/A टॉगल द्वारा उपस्थिति दर्ज करें",
        colAttendanceStatus: "स्थिति",
        btnSaveAttendance: "उपस्थिति जमा करें",
        noticeTitle: "अभिभावक एवं विद्यालय संवाद पट्ट",
        noticeDesc: "महत्वपूर्ण सूचनाएं और निर्देश",
        btnNewNotice: "+ नई सूचना",
        lblPostNotice: "आधिकारिक सूचना जारी करें",
        btnPublish: "प्रकाशित करें",
        btnCancel: "रद्द करें",
        circTitle: "सरकारी परिपत्र एवं वैधानिक आदेश",
        circDesc: "शिक्षा विभाग एवं बोर्ड के आधिकारिक आदेश",
        btnNewCirc: "+ परिपत्र जोड़ें",
        lblArchiveOrder: "सरकारी परिपत्र सुरक्षित करें",
        btnSaveCircular: "सुरक्षित करें",
        ttTitle: "मास्टर शैक्षणिक समय सारिणी",
        ttDesc: "प्रार्थना, विश्राम एवं 8 तास के साथ समय सारिणी",
        hldTitle: "वार्षिक एवं स्थानीय अवकाश सूची",
        hldDesc: "वार्षिक कैलेंडर और त्योहारों की सूची"
    }
};

window.switchLanguage = function(lang) {
    currentLanguage = lang;
    document.body.className = `lang-${lang} theme-dark-enterprise`;
    
    document.querySelectorAll('.lang-pill-selector .lang-tab').forEach((btn, idx) => {
        const langs = ['en', 'gu', 'hi'];
        btn.classList.toggle('active', langs[idx] === lang);
    });

    const tagEl = document.getElementById('current-lang-tag');
    if (tagEl) tagEl.innerText = lang.toUpperCase();

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });
};

window.cycleLanguage = function() {
    const sequence = ['en', 'gu', 'hi'];
    const next = sequence[(sequence.indexOf(currentLanguage) + 1) % sequence.length];
    window.switchLanguage(next);
};

// 4. Multi-Role Management
window.setRole = function(role) {
    currentRole = role;
    document.getElementById('role-school').classList.toggle('active', role === 'school');
    document.getElementById('role-teacher').classList.toggle('active', role === 'teacher');
    document.getElementById('role-student').classList.toggle('active', role === 'student');

    const oauthBox = document.getElementById('student-oauth-container');
    const credBox = document.getElementById('credentials-box');
    const uInput = document.getElementById('login-username');

    if (role === 'school') {
        oauthBox.style.display = 'none';
        credBox.style.display = 'block';
        uInput.placeholder = "Administrator ID";
    } else if (role === 'teacher') {
        oauthBox.style.display = 'none';
        credBox.style.display = 'block';
        uInput.placeholder = "Teacher Employee Code (e.g. TCH101)";
    } else {
        oauthBox.style.display = 'block';
        credBox.style.display = 'block';
        uInput.placeholder = "Student UID Number (Username)";
    }
};

window.manualLogin = function() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();

    if (!user || !pass) {
        alert('Please enter ID/Code and Password.');
        return;
    }

    if (currentRole === 'school') {
        const adminCreds = getAdminCredentials();
        if (user === adminCreds.id && pass === adminCreds.pass) {
            activeStudentStandard = null;
            activeTeacherCode = null;
            openPortal("Principal / Administrator");
        } else {
            alert("Invalid Administrator credentials!");
        }
    } else if (currentRole === 'teacher') {
        const tch = getTeacherCredentials();
        if (user === tch.code && pass === tch.pass) {
            activeTeacherCode = tch.code;
            activeStudentStandard = null;
            openPortal(`${tch.name} (${tch.code})`);
        } else {
            alert("Invalid Teacher Employee Code or Password!");
        }
    } else {
        const students = getStudents();
        const matched = students.find(s => (s.uid === user || s.gr === user) && s.password === pass);

        if (matched) {
            activeVaultStudentUID = matched.uid;
            activeStudentStandard = matched.standard;
            openPortal(matched.name);
        } else {
            alert("Unregistered student or invalid password!");
        }
    }
};

window.googleLogin = function() {
    if (currentRole !== 'student') {
        alert('Google Sign-In is configured exclusively for Student Portals.');
        return;
    }

    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then((result) => {
            const user = result.user;
            const userEmail = (user.email || "").toLowerCase();

            const students = getStudents();
            const matched = students.find(s => (s.email || "").toLowerCase() === userEmail);

            if (matched) {
                activeVaultStudentUID = matched.uid;
                activeStudentStandard = matched.standard;
                openPortal(matched.name);
            } else {
                auth.signOut();
                alert(`Email (${userEmail}) is not registered in school records!`);
            }
        })
        .catch((error) => {
            alert('Google Login Error: ' + error.message);
        });
};

function openPortal(name) {
    document.getElementById('login-modal').style.display = 'none';
    document.getElementById('main-content').style.display = 'flex';
    document.getElementById('user-display-name').innerText = name;
    
    let roleText = 'Principal';
    if (currentRole === 'teacher') roleText = 'Teacher';
    if (currentRole === 'student') roleText = 'Student';
    document.getElementById('user-badge').innerText = roleText;

    const isStaff = (currentRole === 'school' || currentRole === 'teacher');
    const ttSelector = document.getElementById('tt-standard-selector');
    const ttEditBtn = document.getElementById('btn-edit-tt');

    document.querySelectorAll('.staff-only-btn').forEach(b => b.style.display = isStaff ? 'inline-flex' : 'none');

    if (currentRole === 'student') {
        document.getElementById('admin-quick-actions').style.display = 'none';
        document.getElementById('admin-enrollment-card').style.display = 'none';
        document.getElementById('col-action-header').style.display = 'none';
        document.getElementById('menu-settings-link').style.display = 'none';
        document.getElementById('vault-student-selector').style.display = 'none';
        
        if (ttSelector && activeStudentStandard) {
            ttSelector.value = activeStudentStandard;
            ttSelector.style.display = 'none';
        }
        if (ttEditBtn) ttEditBtn.style.display = 'none';
    } else {
        document.getElementById('admin-quick-actions').style.display = 'flex';
        document.getElementById('admin-enrollment-card').style.display = 'block';
        document.getElementById('col-action-header').style.display = 'table-cell';
        document.getElementById('menu-settings-link').style.display = 'flex';
        document.getElementById('vault-student-selector').style.display = 'inline-block';
        
        if (ttSelector) ttSelector.style.display = 'inline-block';
        if (ttEditBtn) ttEditBtn.style.display = 'inline-flex';
    }

    const setRoleBadge = document.getElementById('settings-role-badge');
    const setLblId = document.getElementById('lbl-new-id');
    if (currentRole === 'school') {
        setRoleBadge.innerText = 'Admin Security';
        setLblId.innerText = 'New Administrator ID *';
    } else if (currentRole === 'teacher') {
        setRoleBadge.innerText = 'Faculty Security';
        setLblId.innerText = 'New Teacher Code *';
    }

    refreshSchoolLogos();
    loadStudents();
    populateVaultStudentDropdown();
    loadHomeData();
    renderAttendanceChart();
    loadAttendanceRoster();
    loadNotices();
    loadCirculars();
    loadTimetable();
    loadHolidays();
}

window.logout = function() {
    auth.signOut().then(() => location.reload());
};

window.navigateTo = function(viewId) {
    document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');

    const activeNav = Array.from(document.querySelectorAll('.nav-item')).find(btn => {
        const oc = btn.getAttribute('onclick') || '';
        return oc.includes(viewId);
    });
    if (activeNav) activeNav.classList.add('active');

    const bc = document.getElementById('active-breadcrumb');
    if (bc && activeNav) {
        bc.innerText = activeNav.innerText.trim();
    }
};

// 5. Student Management & Full Edit
function getStudents() {
    const data = localStorage.getItem('sav_enterprise_students');
    return data ? JSON.parse(data) : [];
}

function saveStudents(list) {
    localStorage.setItem('sav_enterprise_students', JSON.stringify(list));
}

function loadStudents() {
    const list = getStudents();
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';

    const countEl = document.getElementById('stat-total-students');
    if (countEl) countEl.innerText = list.length;

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${currentRole === 'student' ? 10 : 12}" style="text-align:center; color:#64748b; padding:28px;">No student records found in registry.</td></tr>`;
        return;
    }

    list.forEach((st, idx) => {
        const actionCol = (currentRole === 'school' || currentRole === 'teacher')
            ? `<td>
                <button class="btn-3d btn-secondary btn-sm" onclick="window.openEditStudentModal(${idx})">Edit</button>
                <button class="btn-3d btn-danger btn-sm" onclick="window.deleteStudent(${idx})">Delete</button>
               </td>`
            : '';

        tbody.innerHTML += `<tr>
            <td><strong>${idx + 1}</strong></td>
            <td><code>${st.gr || '-'}</code></td>
            <td><code>${st.uid || '-'}</code></td>
            <td><strong>${st.name}</strong></td>
            <td>${st.standard}</td>
            <td><code>${st.roll}</code></td>
            <td><small>${st.email || '-'}</small></td>
            <td>${formatToDDMMYYYY(st.dob)}</td>
            <td>${st.height ? st.height + 'cm' : '-'} / ${st.weight ? st.weight + 'kg' : '-'}</td>
            <td><code>${st.blood || 'N/A'}</code></td>
            <td><code>${st.phone || '-'}</code></td>
            ${actionCol}
        </tr>`;
    });
}

window.addStudentRecord = function() {
    const gr = document.getElementById('gr_no').value.trim();
    const uid = document.getElementById('uid_no').value.trim();
    const password = document.getElementById('st_password').value.trim();
    const email = document.getElementById('st_email').value.trim();
    const name = document.getElementById('st_name').value.trim();
    const standard = document.getElementById('st_standard').value;
    const roll = document.getElementById('st_roll').value.trim();
    const dob = document.getElementById('st_dob').value.trim();
    const gender = document.getElementById('st_gender').value;
    const weight = document.getElementById('st_weight').value.trim();
    const height = document.getElementById('st_height').value.trim();
    const blood = document.getElementById('st_blood').value;
    const aadhaar = document.getElementById('st_aadhaar').value.trim();
    const father = document.getElementById('st_father').value.trim();
    const fa_aadhaar = document.getElementById('st_fa_aadhaar').value.trim();
    const mother = document.getElementById('st_mother').value.trim();
    const mo_aadhaar = document.getElementById('st_mo_aadhaar').value.trim();
    const phone = document.getElementById('st_phone').value.trim();
    const address = document.getElementById('st_address').value.trim();

    if (!gr || !uid || !password || !name || !roll || !dob || !phone) {
        alert('Please fill all mandatory fields (GR, UID, Password, Name, Roll, DOB, Phone).');
        return;
    }

    const list = getStudents();
    list.push({
        gr, uid, password, email, name, standard, roll, dob: formatToDDMMYYYY(dob), gender, weight, height,
        blood, aadhaar, father, fa_aadhaar, mother, mo_aadhaar, phone, address,
        documents: {}
    });
    saveStudents(list);

    document.querySelectorAll('#admin-enrollment-card input, #admin-enrollment-card textarea').forEach(inp => inp.value = '');
    loadStudents();
    populateVaultStudentDropdown();
    renderAttendanceChart();
    alert('Student record registered successfully!');
};

window.openEditStudentModal = function(index) {
    const list = getStudents();
    const st = list[index];
    if (!st) return;

    document.getElementById('edit-student-idx').value = index;
    document.getElementById('edit-st-name').value = st.name || '';
    document.getElementById('edit-st-roll').value = st.roll || '';
    document.getElementById('edit-st-standard').value = st.standard || 'Grade 9-A';
    document.getElementById('edit-st-email').value = st.email || '';
    document.getElementById('edit-st-password').value = st.password || '';
    document.getElementById('edit-st-phone').value = st.phone || '';
    document.getElementById('edit-st-dob').value = formatToDDMMYYYY(st.dob) || '';
    document.getElementById('edit-st-blood').value = st.blood || 'N/A';
    document.getElementById('edit-st-address').value = st.address || '';

    document.getElementById('edit-student-modal').style.display = 'flex';
};

window.closeEditModal = function() {
    document.getElementById('edit-student-modal').style.display = 'none';
};

window.saveEditedStudentRecord = function() {
    const idx = parseInt(document.getElementById('edit-student-idx').value);
    const list = getStudents();
    if (isNaN(idx) || !list[idx]) return;

    list[idx].name = document.getElementById('edit-st-name').value.trim();
    list[idx].roll = document.getElementById('edit-st-roll').value.trim();
    list[idx].standard = document.getElementById('edit-st-standard').value;
    list[idx].email = document.getElementById('edit-st-email').value.trim();
    list[idx].password = document.getElementById('edit-st-password').value.trim();
    list[idx].phone = document.getElementById('edit-st-phone').value.trim();
    list[idx].dob = formatToDDMMYYYY(document.getElementById('edit-st-dob').value.trim());
    list[idx].blood = document.getElementById('edit-st-blood').value;
    list[idx].address = document.getElementById('edit-st-address').value.trim();

    saveStudents(list);
    window.closeEditModal();
    loadStudents();
    populateVaultStudentDropdown();
    renderAttendanceChart();
    alert('Student record & credentials updated successfully!');
};

window.deleteStudent = function(index) {
    if (confirm('Confirm deletion of this student record?')) {
        const list = getStudents();
        list.splice(index, 1);
        saveStudents(list);
        loadStudents();
        populateVaultStudentDropdown();
        renderAttendanceChart();
    }
};

window.filterStudents = function() {
    const q = document.getElementById('table-search').value.toLowerCase();
    const rows = document.querySelectorAll('#student-table-body tr');
    rows.forEach(r => {
        r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
};

// 6. Attendance Graph Analytics
function renderAttendanceChart() {
    const chartContainer = document.getElementById('attendance-bar-chart');
    if (!chartContainer) return;

    const standards = ["Grade 9-A", "Grade 9-B", "Grade 10-A", "Grade 10-B", "Grade 11-Commerce", "Grade 12-Commerce"];
    const percentages = [98, 96, 99, 97, 95, 98];

    chartContainer.innerHTML = '';

    standards.forEach((std, i) => {
        const shortName = std.replace("Grade ", "").replace("-Commerce", " Com");
        const pct = percentages[i];

        chartContainer.innerHTML += `
            <div class="chart-bar-group">
                <span class="chart-bar-percent">${pct}%</span>
                <div class="chart-bar-track">
                    <div class="chart-bar-fill" style="height: ${pct}%;"></div>
                </div>
                <span class="chart-bar-label">${shortName}</span>
            </div>
        `;
    });
}

// 7. Fast 1-Click P / A Attendance
function getAttendanceStorageKey(date, std) {
    return `sav_attendance_${date}_${std}`;
}

window.loadAttendanceRoster = function() {
    const std = document.getElementById('att-standard-filter').value;
    const dateInput = document.getElementById('att-date');
    if (!dateInput.value) {
        dateInput.value = formatToDDMMYYYY(new Date().toISOString().split('T')[0]);
    }

    const curDate = dateInput.value;
    const list = getStudents().filter(s => s.standard === std);
    const tbody = document.getElementById('attendance-table-body');
    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b; padding:20px;">No students enrolled in ${std}.</td></tr>`;
        return;
    }

    const savedSheet = JSON.parse(localStorage.getItem(getAttendanceStorageKey(curDate, std)) || '{}');

    list.forEach((st, idx) => {
        const status = savedSheet[st.uid] || 'Present';
        const isPres = status === 'Present';
        const isStaff = (currentRole === 'school' || currentRole === 'teacher');

        const markCol = isStaff
            ? `<td>
                <div class="pa-toggle-group">
                    <button class="pa-btn ${isPres ? 'active-p' : ''}" onclick="window.setPresence('${st.uid}', 'Present', ${idx})">P</button>
                    <button class="pa-btn ${!isPres ? 'active-a' : ''}" onclick="window.setPresence('${st.uid}', 'Absent', ${idx})">A</button>
                </div>
               </td>`
            : '<td>-</td>';

        tbody.innerHTML += `<tr>
            <td><code>${st.roll}</code></td>
            <td><strong>${st.name}</strong></td>
            <td><code>${st.gr || '-'}</code></td>
            <td><span class="${isPres ? 'status-badge-ready' : 'status-badge-na'}" id="att-status-text-${idx}">${status}</span></td>
            ${markCol}
        </tr>`;
    });
};

window.setPresence = function(uid, newStatus, idx) {
    if (currentRole !== 'school' && currentRole !== 'teacher') return;

    const std = document.getElementById('att-standard-filter').value;
    const curDate = document.getElementById('att-date').value || formatToDDMMYYYY(new Date().toISOString().split('T')[0]);
    const storageKey = getAttendanceStorageKey(curDate, std);
    
    const savedSheet = JSON.parse(localStorage.getItem(storageKey) || '{}');
    savedSheet[uid] = newStatus;
    localStorage.setItem(storageKey, JSON.stringify(savedSheet));

    window.loadAttendanceRoster();
};

window.markBulkAttendance = function(statusToApply) {
    if (currentRole !== 'school' && currentRole !== 'teacher') return;

    const std = document.getElementById('att-standard-filter').value;
    const curDate = document.getElementById('att-date').value || formatToDDMMYYYY(new Date().toISOString().split('T')[0]);
    const storageKey = getAttendanceStorageKey(curDate, std);
    const list = getStudents().filter(s => s.standard === std);

    const savedSheet = {};
    list.forEach(st => {
        savedSheet[st.uid] = statusToApply;
    });

    localStorage.setItem(storageKey, JSON.stringify(savedSheet));
    window.loadAttendanceRoster();
};

window.saveAttendanceRoster = function() {
    const selectedDate = document.getElementById('att-date').value || formatToDDMMYYYY(new Date().toISOString().split('T')[0]);
    alert(`Attendance register for ${selectedDate} finalized and submitted!`);
};

// 8. Document Vault Gallery
function populateVaultStudentDropdown() {
    const sel = document.getElementById('vault-student-selector');
    const students = getStudents();
    sel.innerHTML = '<option value="">-- Choose Enrolled Student --</option>';

    students.forEach(st => {
        sel.innerHTML += `<option value="${st.uid}">${st.name} (UID: ${st.uid} | Std: ${st.standard})</option>`;
    });

    if (currentRole === 'student' && activeVaultStudentUID) {
        sel.value = activeVaultStudentUID;
        window.loadStudentVaultDocs();
    }
}

window.loadStudentVaultDocs = function() {
    const uid = currentRole === 'student' ? activeVaultStudentUID : document.getElementById('vault-student-selector').value;
    const students = getStudents();
    const st = students.find(s => s.uid === uid);

    if (!st) {
        resetVaultGallery();
        return;
    }

    document.getElementById('showcase-st-name').innerText = st.name;
    document.getElementById('showcase-st-gr').innerText = `GR: ${st.gr}`;
    document.getElementById('showcase-st-uid').innerText = `UID: ${st.uid}`;
    document.getElementById('showcase-st-std').innerText = st.standard;

    const docs = st.documents || {};
    const docTypes = ['photo', 'birth', 'aadhaar', 'income', 'caste', 'parents'];
    let verifiedCount = 0;

    const photoBox = document.getElementById('showcase-photo-box');
    const removeProfileBtn = document.getElementById('btn-remove-profile-pic');

    if (docs['photo'] && docs['photo'].data) {
        photoBox.innerHTML = `<img src="${docs['photo'].data}" alt="${st.name}">`;
        if (removeProfileBtn && (currentRole === 'school' || currentRole === 'teacher')) removeProfileBtn.style.display = 'inline-flex';
    } else {
        photoBox.innerHTML = `<span class="no-photo-placeholder">No Photo</span>`;
        if (removeProfileBtn) removeProfileBtn.style.display = 'none';
    }

    docTypes.forEach(type => {
        const statusBadge = document.getElementById(`status-${type}`);
        const upBtn = document.getElementById(`btn-up-${type}`);
        const prevBtn = document.getElementById(`prev-${type}`);
        const downBtn = document.getElementById(`down-${type}`);
        const delBtn = document.getElementById(`del-${type}`);
        const thumbSlot = document.getElementById(`thumb-${type}`);
        const isStaff = (currentRole === 'school' || currentRole === 'teacher');

        if (docs[type] && docs[type].status === 'na') {
            statusBadge.innerText = "N/A (Not Applicable)";
            statusBadge.className = "doc-status-badge status-na";
            if (upBtn) upBtn.innerText = "Upload";
            prevBtn.style.display = 'none';
            downBtn.style.display = 'none';
            if (delBtn) delBtn.style.display = isStaff ? 'inline-flex' : 'none';
            thumbSlot.innerHTML = '🚫';
            verifiedCount++;
        } else if (docs[type] && docs[type].data) {
            statusBadge.innerText = `Verified (${docs[type].name || 'File'})`;
            statusBadge.className = "doc-status-badge status-ready";
            if (upBtn) upBtn.innerText = "Change";
            prevBtn.style.display = 'inline-flex';
            downBtn.style.display = 'inline-flex';
            if (delBtn) delBtn.style.display = isStaff ? 'inline-flex' : 'none';
            if (docs[type].data.startsWith('data:image')) {
                thumbSlot.innerHTML = `<img src="${docs[type].data}" alt="thumb">`;
            } else {
                thumbSlot.innerHTML = '📄';
            }
            verifiedCount++;
        } else {
            statusBadge.innerText = "Pending / Missing";
            statusBadge.className = "doc-status-badge";
            if (upBtn) upBtn.innerText = "Upload";
            prevBtn.style.display = 'none';
            downBtn.style.display = 'none';
            if (delBtn) delBtn.style.display = 'none';
            thumbSlot.innerHTML = getDocDefaultIcon(type);
        }
    });

    document.getElementById('showcase-count-verified').innerText = `${verifiedCount} / 6`;
    document.getElementById('showcase-status-label').innerText = verifiedCount === 6 ? 'Complete' : 'Incomplete';
    document.getElementById('showcase-status-label').style.color = verifiedCount === 6 ? '#059669' : '#d97706';
};

function getDocDefaultIcon(type) {
    const icons = { photo: '📷', birth: '📜', aadhaar: '🆔', income: '💼', caste: '🏷️', parents: '👨‍👩‍👧' };
    return icons[type] || '📁';
}

function resetVaultGallery() {
    document.getElementById('showcase-photo-box').innerHTML = '<span class="no-photo-placeholder">No Photo</span>';
    document.getElementById('showcase-st-name').innerText = 'Select a Student';
    document.getElementById('showcase-st-gr').innerText = 'GR: -';
    document.getElementById('showcase-st-uid').innerText = 'UID: -';
    document.getElementById('showcase-st-std').innerText = 'Standard -';
    document.getElementById('showcase-count-verified').innerText = '0 / 6';

    const removeProfileBtn = document.getElementById('btn-remove-profile-pic');
    if (removeProfileBtn) removeProfileBtn.style.display = 'none';

    const docTypes = ['photo', 'birth', 'aadhaar', 'income', 'caste', 'parents'];
    docTypes.forEach(type => {
        document.getElementById(`status-${type}`).innerText = "Pending / Missing";
        document.getElementById(`status-${type}`).className = "doc-status-badge";
        const upBtn = document.getElementById(`btn-up-${type}`);
        if (upBtn) upBtn.innerText = "Upload";
        document.getElementById(`prev-${type}`).style.display = 'none';
        document.getElementById(`down-${type}`).style.display = 'none';
        const delBtn = document.getElementById(`del-${type}`);
        if (delBtn) delBtn.style.display = 'none';
        document.getElementById(`thumb-${type}`).innerHTML = getDocDefaultIcon(type);
    });
}

window.handleVaultUpload = function(input, docType) {
    const uid = currentRole === 'student' ? activeVaultStudentUID : document.getElementById('vault-student-selector').value;
    if (!uid) {
        alert('Please choose an enrolled student first!');
        input.value = '';
        return;
    }

    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const base64Data = e.target.result;
            const students = getStudents();
            const idx = students.findIndex(s => s.uid === uid);

            if (idx !== -1) {
                if (!students[idx].documents) students[idx].documents = {};
                students[idx].documents[docType] = {
                    status: 'uploaded',
                    name: file.name,
                    size: (file.size / 1024).toFixed(1) + " KB",
                    type: file.type,
                    data: base64Data
                };
                saveStudents(students);
                window.loadStudentVaultDocs();
                alert('Document saved successfully!');
            }
        };
        reader.readAsDataURL(file);
    }
};

window.removeDoc = function(docType) {
    const uid = currentRole === 'student' ? activeVaultStudentUID : document.getElementById('vault-student-selector').value;
    if (!uid) return;

    if (confirm('Are you sure you want to remove this document?')) {
        const students = getStudents();
        const idx = students.findIndex(s => s.uid === uid);

        if (idx !== -1 && students[idx].documents && students[idx].documents[docType]) {
            delete students[idx].documents[docType];
            saveStudents(students);
            window.loadStudentVaultDocs();
            alert('Document removed successfully!');
        }
    }
};

window.markDocNA = function(docType) {
    const uid = currentRole === 'student' ? activeVaultStudentUID : document.getElementById('vault-student-selector').value;
    if (!uid) {
        alert('Please select a student first!');
        return;
    }

    const students = getStudents();
    const idx = students.findIndex(s => s.uid === uid);

    if (idx !== -1) {
        if (!students[idx].documents) students[idx].documents = {};
        students[idx].documents[docType] = { status: 'na', name: 'Not Applicable' };
        saveStudents(students);
        window.loadStudentVaultDocs();
    }
};

window.previewDoc = function(docType) {
    const uid = currentRole === 'student' ? activeVaultStudentUID : document.getElementById('vault-student-selector').value;
    const students = getStudents();
    const st = students.find(s => s.uid === uid);

    if (st && st.documents && st.documents[docType] && st.documents[docType].data) {
        const doc = st.documents[docType];
        document.getElementById('modal-doc-title').innerText = `${st.name} - ${docType.toUpperCase()}`;
        const body = document.getElementById('modal-doc-body');

        if (doc.data.startsWith('data:image')) {
            body.innerHTML = `<img src="${doc.data}" alt="Preview" style="max-height: 480px;">`;
        } else {
            body.innerHTML = `<embed src="${doc.data}" type="${doc.type}" width="100%" height="450px" />`;
        }

        document.getElementById('doc-modal').style.display = 'flex';
    }
};

window.closeDocModal = function() {
    document.getElementById('doc-modal').style.display = 'none';
};

window.downloadDoc = function(docType) {
    const uid = currentRole === 'student' ? activeVaultStudentUID : document.getElementById('vault-student-selector').value;
    const students = getStudents();
    const st = students.find(s => s.uid === uid);

    if (st && st.documents && st.documents[docType] && st.documents[docType].data) {
        const doc = st.documents[docType];
        const a = document.createElement('a');
        a.href = doc.data;
        a.download = `${st.uid}_${docType}_${doc.name || 'document'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
};

// 9. Timetable Engine
const defaultTimetables = {
    timings: {
        prayer: "07:00 - 07:20",
        p1: "07:20 - 07:55",
        p2: "07:55 - 08:30",
        p3: "08:30 - 09:05",
        p4: "09:05 - 09:40",
        recess: "09:40 - 10:00",
        p5: "10:00 - 10:35",
        p6: "10:35 - 11:10",
        p7: "11:10 - 11:45",
        p8: "11:45 - 12:20"
    },
    schedules: {
        "Grade 9-A": [
            { day: "Monday", p1: "Maths", p2: "Science", p3: "English", p4: "Gujarati", p5: "SS", p6: "Hindi", p7: "Sanskrit", p8: "PT" },
            { day: "Tuesday", p1: "Science", p2: "Maths", p3: "Gujarati", p4: "English", p5: "SS", p6: "Computer", p7: "Hindi", p8: "Drawing" },
            { day: "Wednesday", p1: "English", p2: "SS", p3: "Maths", p4: "Science", p5: "Gujarati", p6: "Hindi", p7: "PT", p8: "Library" },
            { day: "Thursday", p1: "Maths", p2: "Science", p3: "Gujarati", p4: "English", p5: "SS", p6: "Sanskrit", p7: "Computer", p8: "Music" },
            { day: "Friday", p1: "SS", p2: "Science", p3: "Maths", p4: "Hindi", p5: "English", p6: "Gujarati", p7: "Moral Sci", p8: "Sports" },
            { day: "Saturday", p1: "Unit Test", p2: "Weekly Exam", p3: "Evaluation", p4: "Sports", p5: "Activity", p6: "Assembly", p7: "Club", p8: "Cleanliness" }
        ],
        "Grade 9-B": [
            { day: "Monday", p1: "Science", p2: "Maths", p3: "Gujarati", p4: "English", p5: "SS", p6: "Sanskrit", p7: "Hindi", p8: "PT" },
            { day: "Tuesday", p1: "Maths", p2: "Science", p3: "English", p4: "Gujarati", p5: "Computer", p6: "SS", p7: "Drawing", p8: "Hindi" },
            { day: "Wednesday", p1: "SS", p2: "English", p3: "Science", p4: "Maths", p5: "Hindi", p6: "Gujarati", p7: "Library", p8: "PT" },
            { day: "Thursday", p1: "Gujarati", p2: "Maths", p3: "Science", p4: "English", p5: "Computer", p6: "SS", p7: "Music", p8: "Sanskrit" },
            { day: "Friday", p1: "Hindi", p2: "SS", p3: "Maths", p4: "Science", p5: "Gujarati", p6: "English", p7: "Sports", p8: "Moral Sci" },
            { day: "Saturday", p1: "Unit Test", p2: "Weekly Exam", p3: "Evaluation", p4: "Sports", p5: "Activity", p6: "Assembly", p7: "Club", p8: "Cleanliness" }
        ],
        "Grade 10-A": [
            { day: "Monday", p1: "Maths", p2: "Science", p3: "SS", p4: "English", p5: "Gujarati", p6: "Hindi", p7: "Sanskrit", p8: "Board Prep" },
            { day: "Tuesday", p1: "Science", p2: "Maths", p3: "English", p4: "SS", p5: "Gujarati", p6: "Computer", p7: "Board Prep", p8: "PT" },
            { day: "Wednesday", p1: "SS", p2: "Maths", p3: "Science", p4: "English", p5: "Hindi", p6: "Gujarati", p7: "Lab Practical", p8: "Doubt Solving" },
            { day: "Thursday", p1: "Maths", p2: "Science", p3: "English", p4: "Gujarati", p5: "SS", p6: "Sanskrit", p7: "Paper Practice", p8: "Library" },
            { day: "Friday", p1: "Science", p2: "Maths", p3: "SS", p4: "Hindi", p5: "English", p6: "Gujarati", p7: "Board Prep", p8: "Sports" },
            { day: "Saturday", p1: "Mock Test", p2: "Weekly Exam", p3: "Solution", p4: "Paper Check", p5: "Evaluation", p6: "Assembly", p7: "Discussion", p8: "Cleanliness" }
        ],
        "Grade 10-B": [
            { day: "Monday", p1: "Science", p2: "Maths", p3: "English", p4: "SS", p5: "Gujarati", p6: "Sanskrit", p7: "Hindi", p8: "Board Prep" },
            { day: "Tuesday", p1: "Maths", p2: "Science", p3: "SS", p4: "English", p5: "Computer", p6: "Gujarati", p7: "PT", p8: "Board Prep" },
            { day: "Wednesday", p1: "English", p2: "SS", p3: "Maths", p4: "Science", p5: "Gujarati", p6: "Hindi", p7: "Doubt Solving", p8: "Lab Practical" },
            { day: "Thursday", p1: "Science", p2: "Maths", p3: "Gujarati", p4: "English", p5: "SS", p6: "Paper Practice", p7: "Sanskrit", p8: "Library" },
            { day: "Friday", p1: "Maths", p2: "Science", p3: "Hindi", p4: "SS", p5: "Gujarati", p6: "English", p7: "Sports", p8: "Board Prep" },
            { day: "Saturday", p1: "Mock Test", p2: "Weekly Exam", p3: "Solution", p4: "Paper Check", p5: "Evaluation", p6: "Assembly", p7: "Discussion", p8: "Cleanliness" }
        ],
        "Grade 11-Commerce": [
            { day: "Monday", p1: "Accounts", p2: "Stats", p3: "Economics", p4: "B.A.", p5: "English", p6: "SPCC", p7: "Gujarati", p8: "Practical" },
            { day: "Tuesday", p1: "Stats", p2: "Accounts", p3: "B.A.", p4: "Economics", p5: "English", p6: "Computer", p7: "SPCC", p8: "Library" },
            { day: "Wednesday", p1: "Accounts", p2: "Economics", p3: "Stats", p4: "B.A.", p5: "Gujarati", p6: "English", p7: "Career Guiding", p8: "SPCC" },
            { day: "Thursday", p1: "B.A.", p2: "Accounts", p3: "Stats", p4: "Economics", p5: "English", p6: "SPCC", p7: "Computer", p8: "Sports" },
            { day: "Friday", p1: "Stats", p2: "Accounts", p3: "Economics", p4: "B.A.", p5: "English", p6: "Gujarati", p7: "Commerce Lab", p8: "Activity" },
            { day: "Saturday", p1: "Ledger Test", p2: "Stats Exam", p3: "Audit Prep", p4: "Doubts", p5: "Evaluation", p6: "Assembly", p7: "Sports", p8: "Cleanliness" }
        ],
        "Grade 12-Commerce": [
            { day: "Monday", p1: "Accounts", p2: "Stats", p3: "B.A.", p4: "Economics", p5: "English", p6: "SPCC", p7: "Board Audit", p8: "Practice" },
            { day: "Tuesday", p1: "Stats", p2: "Accounts", p3: "Economics", p4: "B.A.", p5: "Computer", p6: "English", p7: "SPCC", p8: "Paper Practice" },
            { day: "Wednesday", p1: "Accounts", p2: "Stats", p3: "B.A.", p4: "Economics", p5: "English", p6: "Gujarati", p7: "Doubt Session", p8: "Board Prep" },
            { day: "Thursday", p1: "Stats", p2: "Accounts", p3: "Economics", p4: "B.A.", p5: "SPCC", p6: "English", p7: "Library", p8: "Paper Sol" },
            { day: "Friday", p1: "Accounts", p2: "Stats", p3: "B.A.", p4: "Economics", p5: "SPCC", p6: "Gujarati", p7: "Board Mock", p8: "Discussion" },
            { day: "Saturday", p1: "Board Exam", p2: "Mock Test", p3: "Checking", p4: "Evaluation", p5: "Guidance", p6: "Assembly", p7: "Counseling", p8: "Cleanliness" }
        ]
    }
};

function getTimetableData() {
    const saved = localStorage.getItem('sav_app_timetables_v3');
    return saved ? JSON.parse(saved) : defaultTimetables;
}

window.loadTimetable = function() {
    let std = document.getElementById('tt-standard-selector').value;

    if (currentRole === 'student' && activeStudentStandard) {
        std = activeStudentStandard;
        document.getElementById('tt-standard-selector').value = std;
    }

    const ttData = getTimetableData();
    const timings = ttData.timings || defaultTimetables.timings;
    const schedule = (ttData.schedules && ttData.schedules[std]) ? ttData.schedules[std] : defaultTimetables.schedules[std];

    const thead = document.getElementById('timetable-header');
    const tbody = document.getElementById('timetable-body');

    if (!isTimetableEditing) {
        thead.innerHTML = `<tr>
            <th>Day</th>
            <th>Prayer<br><small>${timings.prayer}</small></th>
            <th>Period 1<br><small>${timings.p1}</small></th>
            <th>Period 2<br><small>${timings.p2}</small></th>
            <th>Period 3<br><small>${timings.p3}</small></th>
            <th>Period 4<br><small>${timings.p4}</small></th>
            <th>Recess<br><small>${timings.recess}</small></th>
            <th>Period 5<br><small>${timings.p5}</small></th>
            <th>Period 6<br><small>${timings.p6}</small></th>
            <th>Period 7<br><small>${timings.p7}</small></th>
            <th>Period 8<br><small>${timings.p8}</small></th>
        </tr>`;
    } else {
        thead.innerHTML = `<tr>
            <th>Day</th>
            <th>Prayer<br><input type="text" class="tt-time-input" id="time-prayer" value="${timings.prayer}"></th>
            <th>Period 1<br><input type="text" class="tt-time-input" id="time-p1" value="${timings.p1}"></th>
            <th>Period 2<br><input type="text" class="tt-time-input" id="time-p2" value="${timings.p2}"></th>
            <th>Period 3<br><input type="text" class="tt-time-input" id="time-p3" value="${timings.p3}"></th>
            <th>Period 4<br><input type="text" class="tt-time-input" id="time-p4" value="${timings.p4}"></th>
            <th>Recess<br><input type="text" class="tt-time-input" id="time-recess" value="${timings.recess}"></th>
            <th>Period 5<br><input type="text" class="tt-time-input" id="time-p5" value="${timings.p5}"></th>
            <th>Period 6<br><input type="text" class="tt-time-input" id="time-p6" value="${timings.p6}"></th>
            <th>Period 7<br><input type="text" class="tt-time-input" id="time-p7" value="${timings.p7}"></th>
            <th>Period 8<br><input type="text" class="tt-time-input" id="time-p8" value="${timings.p8}"></th>
        </tr>`;
    }

    tbody.innerHTML = '';
    schedule.forEach((row, rIdx) => {
        if (!isTimetableEditing) {
            tbody.innerHTML += `<tr>
                <td><strong>${row.day}</strong></td>
                ${rIdx === 0 ? `<td rowspan="6" class="break-cell">DAILY PRAYER & ASSEMBLY</td>` : ''}
                <td>${row.p1}</td>
                <td>${row.p2}</td>
                <td>${row.p3}</td>
                <td>${row.p4}</td>
                ${rIdx === 0 ? `<td rowspan="6" class="break-cell">RECESS BREAK</td>` : ''}
                <td>${row.p5}</td>
                <td>${row.p6}</td>
                <td>${row.p7}</td>
                <td>${row.p8}</td>
            </tr>`;
        } else {
            tbody.innerHTML += `<tr>
                <td><strong>${row.day}</strong></td>
                ${rIdx === 0 ? `<td rowspan="6" class="break-cell">DAILY PRAYER & ASSEMBLY</td>` : ''}
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p1" value="${row.p1}"></td>
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p2" value="${row.p2}"></td>
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p3" value="${row.p3}"></td>
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p4" value="${row.p4}"></td>
                ${rIdx === 0 ? `<td rowspan="6" class="break-cell">RECESS BREAK</td>` : ''}
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p5" value="${row.p5}"></td>
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p6" value="${row.p6}"></td>
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p7" value="${row.p7}"></td>
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p8" value="${row.p8}"></td>
            </tr>`;
        }
    });
};

window.toggleTimetableEdit = function() {
    if (currentRole !== 'school' && currentRole !== 'teacher') return;

    const btn = document.getElementById('btn-edit-tt');
    const std = document.getElementById('tt-standard-selector').value;

    if (!isTimetableEditing) {
        isTimetableEditing = true;
        btn.innerText = "Save Timetable & Timings";
        btn.className = "btn-3d btn-primary btn-sm staff-only-btn";
        window.loadTimetable();
    } else {
        const fullData = getTimetableData();

        fullData.timings = {
            prayer: document.getElementById('time-prayer').value.trim(),
            p1: document.getElementById('time-p1').value.trim(),
            p2: document.getElementById('time-p2').value.trim(),
            p3: document.getElementById('time-p3').value.trim(),
            p4: document.getElementById('time-p4').value.trim(),
            recess: document.getElementById('time-recess').value.trim(),
            p5: document.getElementById('time-p5').value.trim(),
            p6: document.getElementById('time-p6').value.trim(),
            p7: document.getElementById('time-p7').value.trim(),
            p8: document.getElementById('time-p8').value.trim()
        };

        const updatedSchedule = [];
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        days.forEach((day, rIdx) => {
            updatedSchedule.push({
                day: day,
                p1: document.getElementById(`tt-${rIdx}-p1`).value.trim(),
                p2: document.getElementById(`tt-${rIdx}-p2`).value.trim(),
                p3: document.getElementById(`tt-${rIdx}-p3`).value.trim(),
                p4: document.getElementById(`tt-${rIdx}-p4`).value.trim(),
                p5: document.getElementById(`tt-${rIdx}-p5`).value.trim(),
                p6: document.getElementById(`tt-${rIdx}-p6`).value.trim(),
                p7: document.getElementById(`tt-${rIdx}-p7`).value.trim(),
                p8: document.getElementById(`tt-${rIdx}-p8`).value.trim()
            });
        });

        if (!fullData.schedules) fullData.schedules = {};
        fullData.schedules[std] = updatedSchedule;

        localStorage.setItem('sav_app_timetables_v3', JSON.stringify(fullData));

        isTimetableEditing = false;
        btn.innerText = "Edit Timetable & Timings";
        btn.className = "btn-3d btn-primary btn-sm staff-only-btn";
        window.loadTimetable();
        alert(`Timetable and Timings for ${std} successfully saved!`);
    }
};

// 10. Standard-Targeted Notices & Deletion
const defaultNotices = [
    { id: 101, title: "Quarterly Examination Schedule Published", target: "ALL", date: "20/09/2026", body: "Detailed subject timetables have been pinned to the board. Students must clear library dues." },
    { id: 102, title: "Parent-Teacher Institutional Conference", target: "ALL", date: "18/09/2026", body: "The mandatory PTM for Standards 9, 10 and Commerce is scheduled for Saturday at 09:30 AM." }
];

function getNotices() {
    const data = localStorage.getItem('sav_enterprise_notices_v2');
    return data ? JSON.parse(data) : defaultNotices;
}

function loadNotices() {
    const list = getNotices();
    const container = document.getElementById('notices-feed');
    const homeList = document.getElementById('home-notices-list');
    
    if (container) container.innerHTML = '';
    if (homeList) homeList.innerHTML = '';

    list.forEach(n => {
        if (currentRole === 'student' && activeStudentStandard) {
            if (n.target !== "ALL" && n.target !== activeStudentStandard) {
                return; 
            }
        }

        const formattedDate = formatToDDMMYYYY(n.date);
        const isStaff = (currentRole === 'school' || currentRole === 'teacher');
        const delBtn = isStaff 
            ? `<button class="btn-3d btn-danger btn-sm" onclick="window.deleteNotice(${n.id})">Delete Notice</button>` 
            : '';

        const targetBadge = (n.target === "ALL")
            ? `<span class="badge-role" style="color:#059669; background:#dcfce7; padding:2px 8px; border-radius:10px;">All School</span>`
            : `<span class="badge-role" style="color:#0284c7; background:#e0f2fe; padding:2px 8px; border-radius:10px;">${n.target}</span>`;

        if (container) {
            container.innerHTML += `<div class="notice-item-3d">
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <h4>${n.title}</h4>
                        ${targetBadge}
                    </div>
                    <div class="notice-meta">Published: ${formattedDate} | Authority: Principal Office</div>
                    <p style="color:#334155; font-size:13px; line-height:1.6;">${n.body}</p>
                </div>
                <div class="card-item-footer">
                    <span style="font-size:12px; color:#64748b;">Notice Status: Active</span>
                    ${delBtn}
                </div>
            </div>`;
        }
        if (homeList) {
            homeList.innerHTML += `<li><strong>${n.title}</strong> <small style="color:#0284c7;">(${n.target})</small> <span style="color:#64748b;">(${formattedDate})</span></li>`;
        }
    });
}

window.toggleNoticeForm = function() {
    document.getElementById('notice-publish-form').classList.toggle('hidden-panel');
};

window.publishNotice = function() {
    const title = document.getElementById('notice-title').value.trim();
    const target = document.getElementById('notice-target').value;
    const body = document.getElementById('notice-body').value.trim();
    if (!title || !body) {
        alert('Please fill Notice Title and Body.');
        return;
    }

    const list = getNotices();
    list.unshift({ 
        id: Date.now(),
        title, 
        target, 
        body, 
        date: formatToDDMMYYYY(new Date().toISOString().split('T')[0]) 
    });
    localStorage.setItem('sav_enterprise_notices_v2', JSON.stringify(list));
    
    document.getElementById('notice-title').value = '';
    document.getElementById('notice-body').value = '';
    window.toggleNoticeForm();
    loadNotices();
    alert('Notice published successfully!');
};

window.deleteNotice = function(id) {
    if (confirm('Are you sure you want to delete this notice?')) {
        let list = getNotices();
        list = list.filter(n => n.id !== id);
        localStorage.setItem('sav_enterprise_notices_v2', JSON.stringify(list));
        loadNotices();
    }
};

// 11. Holidays
const defaultHolidays = [
    { id: 1, name: "Gandhi Jayanti", date: "02/10/2026", type: "National Holiday" },
    { id: 2, name: "Navratri Vacation", date: "18/10/2026", type: "State Festival" },
    { id: 3, name: "Diwali Academic Recess", date: "08/11/2026", type: "Institutional Vacation" },
    { id: 4, name: "SAV Foundation Day", date: "04/12/2026", type: "Local School Holiday" }
];

function getHolidays() {
    const data = localStorage.getItem('sav_enterprise_holidays');
    return data ? JSON.parse(data) : defaultHolidays;
}

function loadHolidays() {
    const container = document.getElementById('holiday-roster');
    const homeList = document.getElementById('home-holidays-list');
    if (container) container.innerHTML = '';
    if (homeList) homeList.innerHTML = '';

    const list = getHolidays();
    list.forEach(h => {
        const isStaff = (currentRole === 'school' || currentRole === 'teacher');
        const delBtn = isStaff
            ? `<button class="btn-3d btn-danger btn-sm" onclick="window.deleteHoliday(${h.id})">Delete</button>`
            : '';

        if (container) {
            container.innerHTML += `<div class="holiday-card-3d">
                <div>
                    <h4>${h.name}</h4>
                    <div class="notice-meta">Date: ${formatToDDMMYYYY(h.date)}</div>
                    <span class="badge-role">${h.type}</span>
                </div>
                <div class="card-item-footer">
                    <span>Active Calendar</span>
                    ${delBtn}
                </div>
            </div>`;
        }
        if (homeList) {
            homeList.innerHTML += `<li><strong>${h.name}</strong> <span style="color:#64748b;">(${formatToDDMMYYYY(h.date)})</span></li>`;
        }
    });
}

window.toggleHolidayForm = function() {
    document.getElementById('holiday-add-form').classList.toggle('hidden-panel');
};

window.addHolidayRecord = function() {
    const name = document.getElementById('hld-name').value.trim();
    const date = document.getElementById('hld-date').value.trim();
    const type = document.getElementById('hld-type').value;

    if (!name || !date) {
        alert('Please fill Holiday Name and Date (DD/MM/YYYY).');
        return;
    }

    const list = getHolidays();
    list.push({
        id: Date.now(),
        name,
        date: formatToDDMMYYYY(date),
        type
    });
    localStorage.setItem('sav_enterprise_holidays', JSON.stringify(list));

    document.getElementById('hld-name').value = '';
    document.getElementById('hld-date').value = '';
    window.toggleHolidayForm();
    loadHolidays();
};

window.deleteHoliday = function(id) {
    if (confirm('Are you sure you want to delete this holiday?')) {
        let list = getHolidays().filter(h => h.id !== id);
        localStorage.setItem('sav_enterprise_holidays', JSON.stringify(list));
        loadHolidays();
    }
};

// 12. Govt Circulars
const defaultCircs = [
    { id: 101, num: "GSEB/PARI/2026/842", title: "Commerce Assessment & Accountancy Norms", date: "15/09/2026" },
    { id: 102, num: "EDU-GUJ/STAT/1048", title: "Mandatory Digital Enrollment of Secondary Students", date: "10/09/2026" }
];

function getCirculars() {
    const data = localStorage.getItem('sav_enterprise_circs');
    return data ? JSON.parse(data) : defaultCircs;
}

function loadCirculars() {
    const list = getCirculars();
    const container = document.getElementById('circulars-feed');
    if (!container) return;
    container.innerHTML = '';

    list.forEach(c => {
        const isStaff = (currentRole === 'school' || currentRole === 'teacher');
        const delBtn = isStaff
            ? `<button class="btn-3d btn-danger btn-sm" onclick="window.deleteCircular(${c.id})">Delete</button>`
            : '';

        container.innerHTML += `<div class="circular-item-3d">
            <div>
                <h4>${c.title}</h4>
                <div class="circular-meta">Circular Ref: <code>${c.num}</code> | Date: ${formatToDDMMYYYY(c.date)}</div>
            </div>
            <div class="card-item-footer">
                <button class="btn-3d btn-secondary btn-sm" onclick="alert('Digital Circular Archival Verified.')">Download Verified Order</button>
                ${delBtn}
            </div>
        </div>`;
    });
}

window.toggleCircForm = function() {
    document.getElementById('circ-publish-form').classList.toggle('hidden-panel');
};

window.publishCircular = function() {
    const num = document.getElementById('circ-num').value.trim();
    const title = document.getElementById('circ-title').value.trim();
    const date = document.getElementById('circ-date').value.trim();
    if (!num || !title) return;

    const list = getCirculars();
    list.unshift({
        id: Date.now(),
        num,
        title,
        date: date ? formatToDDMMYYYY(date) : formatToDDMMYYYY(new Date().toISOString().split('T')[0])
    });
    localStorage.setItem('sav_enterprise_circs', JSON.stringify(list));

    document.getElementById('circ-num').value = '';
    document.getElementById('circ-title').value = '';
    document.getElementById('circ-date').value = '';
    window.toggleCircForm();
    loadCirculars();
};

window.deleteCircular = function(id) {
    if (confirm('Confirm deletion of this circular record?')) {
        let list = getCirculars().filter(c => c.id !== id);
        localStorage.setItem('sav_enterprise_circs', JSON.stringify(list));
        loadCirculars();
    }
};

function loadHomeData() {
    loadNotices();
    loadHolidays();
}

// 13. Security Credentials Updater
window.updateUserCredentials = function() {
    const currPass = document.getElementById('cfg-curr-pass').value.trim();
    const newId = document.getElementById('cfg-new-id').value.trim();
    const newPass = document.getElementById('cfg-new-pass').value.trim();

    if (currentRole === 'school') {
        const currentCreds = getAdminCredentials();
        if (currPass !== currentCreds.pass) {
            alert("Current Administrator password is incorrect!");
            return;
        }
        if (!newId || !newPass) {
            alert("New ID and Password are required.");
            return;
        }
        localStorage.setItem('sav_admin_credentials', JSON.stringify({ id: newId, pass: newPass }));
        alert(`Administrator ID and password successfully updated!\nNew ID: ${newId}`);
    } else if (currentRole === 'teacher') {
        const currentCreds = getTeacherCredentials();
        if (currPass !== currentCreds.pass) {
            alert("Current Teacher password is incorrect!");
            return;
        }
        if (!newId || !newPass) {
            alert("New Teacher Employee Code and Password are required.");
            return;
        }
        localStorage.setItem('sav_teacher_credentials', JSON.stringify({ code: newId, pass: newPass, name: currentCreds.name }));
        alert(`Teacher Employee Code and password successfully updated!\nNew Code: ${newId}`);
    }

    document.getElementById('cfg-curr-pass').value = '';
    document.getElementById('cfg-new-id').value = '';
    document.getElementById('cfg-new-pass').value = '';
};

// Initial Setup
refreshSchoolLogos();
window.switchLanguage('en');
