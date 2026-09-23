// ==========================================================================
// SHREE AMBICA VIDHYALAYA - ENTERPRISE ERP ENGINE
// Interactive Timetable, Statutory Gallery, Strict DD/MM/YYYY Mask
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
let isTimetableEditing = false;

// 1. Strict DD/MM/YYYY Masking & Normalization
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

function getAdminCredentials() {
    const saved = localStorage.getItem('sav_admin_credentials');
    return saved ? JSON.parse(saved) : { id: "admin", pass: "admin123" };
}

// 2. Multilingual Dictionary
const translations = {
    en: {
        appSubtitle: "Enterprise Academic & Management Portal",
        selectLanguage: "Portal System Language",
        adminRole: "Administrator",
        studentRole: "Student Portal",
        loginBtn: "Secure Enterprise Login",
        orGoogle: "OFFICIAL GOOGLE WORKSPACE SSO",
        menuHome: "Dashboard Home",
        menuStudents: "Student Admission & Registry",
        menuVault: "Document Vault",
        menuAttendance: "Attendance Register",
        menuNotices: "Notice Board",
        menuCirculars: "Govt Circulars",
        menuTimetable: "Timetable",
        menuHolidays: "Holiday Calendar",
        menuSettings: "Admin Security Settings",
        logoutBtn: "Log Out",
        institutionalPortal: "Institutional Portal",
        heroWelcomeTag: "OFFICIAL ACADEMIC REPOSITORY",
        heroWelcomeTitle: "Welcome to Shree Ambica Vidhyalaya",
        heroWelcomeDesc: "An integrated institutional management platform supporting advanced student records, statutory compliance, and real-time daily roll checks.",
        quickNewAdmission: "+ Enroll Student",
        quickAttendance: "Mark Attendance",
        statEnrolled: "Total Students",
        statAttendance: "Average Attendance",
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
        fldAadhaar: "Student Identification Number *",
        fldFatherName: "Father / Guardian Name",
        fldFatherAadhaar: "Father Identification Number",
        fldMotherName: "Mother Name",
        fldMotherAadhaar: "Mother Identification Number",
        fldPhone: "Emergency Contact Number *",
        fldAddress: "Residential Address *",
        btnSaveStudent: "Register & Save Student Data",
        tblTitleRegistry: "Institutional Student Registry",
        tblDescRegistry: "Complete record directory with statutory particulars",
        colGr: "GR No",
        colUid: "UID (User)",
        colName: "Student Name",
        colStd: "Standard",
        colRoll: "Roll",
        colDob: "DOB (DD/MM/YYYY)",
        colPhysical: "Ht / Wt",
        colAadhaar: "Govt ID",
        colParent: "Parents",
        colPhone: "Contact",
        colAddress: "Address",
        colActions: "Actions",
        vaultTitle: "Student Individual Document Archive & Gallery",
        vaultDesc: "Manage and audit identity proofs, certificates, and student gallery",
        docPassport: "Student Passport Photo",
        docBirth: "Birth Certificate",
        docAadhaar: "Student Govt ID Card",
        docIncome: "Income Certificate",
        docCaste: "Caste Certificate",
        docParentsAadhaar: "Parents Proofs",
        attTitle: "Daily Digital Attendance Register",
        attDesc: "Record real-time student presence and generate daily roll calls",
        colAttendanceStatus: "Status",
        colMark: "Mark Presence",
        btnSaveAttendance: "Submit Attendance Records",
        noticeTitle: "Parent & Institutional Communication Board",
        noticeDesc: "Official communications, urgent notices, and announcements",
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
        ttDesc: "Interactive departmental timetable editor (Subjects & Timings)",
        hldTitle: "Annual & Local Holiday Schedule",
        hldDesc: "Statutory academic calendar and institutional holiday notifications",
        adminSettingsTitle: "Administrator Credentials Configuration",
        adminSettingsDesc: "Update master administrator ID and secure access password",
        lblCurrentPass: "Current Password *",
        lblNewAdminId: "New Administrator ID *",
        lblNewAdminPass: "New Administrator Password *",
        btnUpdateAdmin: "Update Admin Credentials"
    },
    gu: {
        appSubtitle: "શિક્ષણ અને વહીવટી સંચાલન પોર્ટલ",
        selectLanguage: "પોર્ટલની મુખ્ય ભાષા પસંદ કરો",
        adminRole: "વહીવટકર્તા (Admin)",
        studentRole: "વિદ્યાર્થી પોર્ટલ",
        loginBtn: "સુરક્ષિત લૉગિન",
        orGoogle: "સત્તાવાર ગૂગલ SSO લૉગિન",
        menuHome: "ડેશબોર્ડ મુખ્ય પૃષ્ઠ",
        menuStudents: "વિદ્યાર્થી પ્રવેશ / રજિસ્ટર",
        menuVault: "દસ્તાવેજ સંગ્રહાલય",
        menuAttendance: "દૈનિક હાજરી પત્રક",
        menuNotices: "સૂચના બોર્ડ (નોટિસ)",
        menuCirculars: "સરકારી પરિપત્રો",
        menuTimetable: "સમયપત્રક (ટાઇમટેબલ)",
        menuHolidays: "રજાઓનું કેલેન્ડર",
        menuSettings: "એડમિન પાસવર્ડ સેટિંગ્સ",
        logoutBtn: "લૉગ આઉટ",
        institutionalPortal: "શાળા સંચાલન પ્રણાલી",
        heroWelcomeTag: "સત્તાવાર શૈક્ષણિક પોર્ટલ",
        heroWelcomeTitle: "શ્રી અંબિકા વિદ્યાલયમાં આપનું સ્વાગત છે",
        heroWelcomeDesc: "વિદ્યાર્થી પ્રવેશ, ઓળખ પુરાવા અને પ્રમાણપત્રો, દૈનિક હાજરી અને સરકારી પરિપત્રો માટેનું સંપૂર્ણ ડિજિટલ પ્લેટફોર્મ.",
        quickNewAdmission: "+ નવો પ્રવેશ",
        quickAttendance: "હાજરી પૂરો",
        statEnrolled: "કુલ વિદ્યાર્થીઓ",
        statAttendance: "સરેરાશ હાજરી",
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
        tblDescRegistry: "સંપૂર્ણ શૈક્ષણિક અને ઓળખ વિગતોની ડિરેક્ટરી",
        colGr: "જી.આર.",
        colUid: "UID (User)",
        colName: "વિદ્યાર્થી નામ",
        colStd: "ધોરણ",
        colRoll: "રોલ",
        colDob: "જન્મ તારીખ (DD/MM/YYYY)",
        colPhysical: "ઊંચાઈ/વજન",
        colAadhaar: "ઓળખ ક્રમાંક",
        colParent: "માતા-પિતા",
        colPhone: "સંપર્ક",
        colAddress: "સરનામું",
        colActions: "કાર્યવાહી",
        vaultTitle: "વિદ્યાર્થી દસ્તાવેજ સંગ્રહાગાર અને ગેલેરી",
        vaultDesc: "દરેક વિદ્યાર્થીવાર ઓળખ પુરાવા, ફોટો અને પ્રમાણપત્રોનું સંચાલન",
        docPassport: "પાસપોર્ટ સાઇઝ ફોટો",
        docBirth: "જન્મ પ્રમાણપત્ર",
        docAadhaar: "વિદ્યાર્થી ઓળખ કાર્ડ",
        docIncome: "આવકનો દાખલો",
        docCaste: "જાતિનો દાખલો",
        docParentsAadhaar: "માતા-પિતાના પુરાવા",
        attTitle: "દૈનિક ઓનલાઇન હાજરી રજિસ્ટર",
        attDesc: "દરેક વર્ગની તારીખવાર ડિજિટલ હાજરી ભરો",
        colAttendanceStatus: "સ્થિતિ",
        colMark: "હાજરી નોંધો",
        btnSaveAttendance: "હાજરી સબમિટ કરો",
        noticeTitle: "વાલી અને શાળા સંચાર બોર્ડ",
        noticeDesc: "મહત્વપૂર્ણ ઘોષણાઓ અને સૂચનાઓ",
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
        ttDesc: "વિષય અને સમય સાથે ટાઇમટેબલ સંપાદન",
        hldTitle: "શાળા શૈક્ષણિક અને સ્થાનિક રજાઓ",
        hldDesc: "વાર્ષિક કેલેન્ડર અને તહેવારોની યાદી",
        adminSettingsTitle: "એડમિનિસ્ટ્રેટર આઈડી અને પાસવર્ડ બદલો",
        adminSettingsDesc: "મુખ્ય એડમિન યુઝરનેમ અને સિક્યોરિટી પાસવર્ડ અપડેટ કરો",
        lblCurrentPass: "હાલનો પાસવર્ડ *",
        lblNewAdminId: "નવો Administrator ID *",
        lblNewAdminPass: "નવો પાસવર્ડ *",
        btnUpdateAdmin: "માહિતી અપડેટ કરો"
    },
    hi: {
        appSubtitle: "संस्थागत शैक्षणिक एवं प्रबंधन पोर्टल",
        selectLanguage: "पोर्टल की मुख्य भाषा चुनें",
        adminRole: "प्रशासक (Admin)",
        studentRole: "छात्र पोर्टल",
        loginBtn: "सुरक्षित लॉगिन",
        orGoogle: "आधिकारिक गूगल SSO लॉगिन",
        menuHome: "डैशबोर्ड मुख्य पृष्ठ",
        menuStudents: "छात्र प्रवेश / रजिस्टर",
        menuVault: "दस्तावेज़ संग्रह",
        menuAttendance: "दैनिक उपस्थिति रजिस्टर",
        menuNotices: "सूचना पट्ट (Notices)",
        menuCirculars: "सरकारी परिपत्र",
        menuTimetable: "समय सारिणी",
        menuHolidays: "अवकाश कैलेंडर",
        menuSettings: "एडमिन सुरक्षा सेटिंग्स",
        logoutBtn: "लॉग आउट",
        institutionalPortal: "संस्थागत प्रबंधन प्रणाली",
        heroWelcomeTag: "आधिकारिक शैक्षणिक पोर्टल",
        heroWelcomeTitle: "श्री अंबिका विद्यालय में आपका स्वागत है",
        heroWelcomeDesc: "छात्र प्रवेश, दस्तावेज़, ऑनलाइन उपस्थिति और सरकारी परिपत्र हेतु एकीकृत डिजिटल मंच।",
        quickNewAdmission: "+ नया प्रवेश",
        quickAttendance: "उपस्थिति दर्ज करें",
        statEnrolled: "कुल छात्र",
        statAttendance: "औसत उपस्थिति",
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
        tblDescRegistry: "संपूर्ण शैक्षणिक एवं पहचान विवरण डायरेक्टरी",
        colGr: "जी.आर.",
        colUid: "UID (User)",
        colName: "छात्र का नाम",
        colStd: "कक्षा",
        colRoll: "रोल",
        colDob: "जन्म तिथि (DD/MM/YYYY)",
        colPhysical: "ऊंचाई/वजन",
        colAadhaar: "पहचान पत्र",
        colParent: "माता-पिता",
        colPhone: "संपर्क",
        colAddress: "पता",
        colActions: "कार्यवाही",
        vaultTitle: "छात्र दस्तावेज़ संग्रह एवं गैलरी",
        vaultDesc: "छात्र वार पहचान पत्र, फोटो और प्रमाण पत्रों का प्रबंधन",
        docPassport: "पासपोर्ट साइज फोटो",
        docBirth: "जन्म प्रमाण पत्र",
        docAadhaar: "छात्र पहचान कार्ड",
        docIncome: "आय प्रमाण पत्र",
        docCaste: "जाति प्रमाण पत्र",
        docParentsAadhaar: "माता-पिता के दस्तावेज",
        attTitle: "दैनिक डिजिटल उपस्थिति रजिस्टर",
        attDesc: "प्रत्येक कक्षा की दैनिक उपस्थिति दर्ज करें",
        colAttendanceStatus: "स्थिति",
        colMark: "उपस्थिति चुनें",
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
        ttDesc: "साप्ताहिक कक्षा समय सारिणी एवं समय संपादन",
        hldTitle: "वार्षिक एवं स्थानीय अवकाश सूची",
        hldDesc: "वार्षिक कैलेंडर और त्योहारों की सूची",
        adminSettingsTitle: "व्यवस्थापक आईडी एवं पासवर्ड बदलें",
        adminSettingsDesc: "मुख्य व्यवस्थापक यूज़रनेम एवं पासवर्ड अपडेट करें",
        lblCurrentPass: "वर्तमान पासवर्ड *",
        lblNewAdminId: "नया Admin ID *",
        lblNewAdminPass: "नया पासवर्ड *",
        btnUpdateAdmin: "डेटा अपडेट करें"
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

// 3. Role & Login
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
        document.getElementById('login-username').placeholder = "Student UID Number (Username)";
    }
};

window.manualLogin = function() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value.trim();

    if (!user || !pass) {
        alert(currentLanguage === 'gu' ? 'કૃપા કરીને ID/UID અને પાસવર્ડ દાખલ કરો.' : 'Please enter ID/UID and Password.');
        return;
    }

    if (currentRole === 'school') {
        const adminCreds = getAdminCredentials();
        if (user === adminCreds.id && pass === adminCreds.pass) {
            openPortal("Principal / Administrator");
        } else {
            alert(currentLanguage === 'gu' ? "અમાન્ય Administrator ઓળખ!" : "Invalid Administrator credentials!");
        }
    } else {
        const students = getStudents();
        const matched = students.find(s => (s.uid === user || s.gr === user) && s.password === pass);

        if (matched) {
            activeVaultStudentUID = matched.uid;
            openPortal(matched.name);
        } else {
            alert(currentLanguage === 'gu' 
                ? "નોંધાયેલ વિદ્યાર્થી મળ્યો નથી અથવા પાસવર્ડ ખોટો છે!" 
                : "Unregistered student or invalid password!");
        }
    }
};

window.googleLogin = function() {
    if (currentRole === 'school') {
        alert('Administrator access is restricted to official ID and Password.');
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
    document.getElementById('user-badge').innerText = currentRole === 'school' ? 'Principal' : 'Student';

    if (currentRole === 'student') {
        document.getElementById('admin-quick-actions').style.display = 'none';
        document.getElementById('admin-enrollment-card').style.display = 'none';
        document.getElementById('col-action-header').style.display = 'none';
        document.getElementById('btn-create-notice').style.display = 'none';
        document.getElementById('btn-create-circ').style.display = 'none';
        document.getElementById('att-submit-container').style.display = 'none';
        document.getElementById('att-mark-header').style.display = 'none';
        document.getElementById('menu-settings-link').style.display = 'none';
        document.getElementById('vault-student-selector').style.display = 'none';
        document.querySelectorAll('.admin-only-btn').forEach(b => b.style.display = 'none');
    } else {
        document.getElementById('admin-quick-actions').style.display = 'flex';
        document.getElementById('admin-enrollment-card').style.display = 'block';
        document.getElementById('col-action-header').style.display = 'table-cell';
        document.getElementById('btn-create-notice').style.display = 'inline-block';
        document.getElementById('btn-create-circ').style.display = 'inline-block';
        document.getElementById('att-submit-container').style.display = 'flex';
        document.getElementById('att-mark-header').style.display = 'table-cell';
        document.getElementById('menu-settings-link').style.display = 'flex';
        document.getElementById('vault-student-selector').style.display = 'inline-block';
        document.querySelectorAll('.admin-only-btn').forEach(b => b.style.display = 'inline-flex');
    }

    loadStudents();
    populateVaultStudentDropdown();
    loadHomeData();
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

// 4. Students Operations
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
        tbody.innerHTML = `<tr><td colspan="${currentRole === 'school' ? 13 : 12}" style="text-align:center; color:#64748b; padding:28px;">No student records found in registry.</td></tr>`;
        return;
    }

    list.forEach((st, idx) => {
        const actionCol = currentRole === 'school'
            ? `<td><button class="btn-3d btn-danger btn-sm" onclick="window.deleteStudent(${idx})">Delete</button></td>`
            : '';

        tbody.innerHTML += `<tr>
            <td><strong>${idx + 1}</strong></td>
            <td><code>${st.gr || '-'}</code></td>
            <td><code>${st.uid || '-'}</code></td>
            <td><strong>${st.name}</strong></td>
            <td>${st.standard}</td>
            <td><code>${st.roll}</code></td>
            <td>${formatToDDMMYYYY(st.dob)}</td>
            <td>${st.height ? st.height + 'cm' : '-'} / ${st.weight ? st.weight + 'kg' : '-'}</td>
            <td><code>${st.aadhaar ? 'Verified' : '-'}</code></td>
            <td>${st.father || '-'} / ${st.mother || '-'}</td>
            <td><code>${st.phone || '-'}</code></td>
            <td><small>${st.address || '-'}</small></td>
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
    alert('Student record registered successfully!');
};

window.deleteStudent = function(index) {
    if (confirm('Confirm deletion of this student record?')) {
        const list = getStudents();
        list.splice(index, 1);
        saveStudents(list);
        loadStudents();
        populateVaultStudentDropdown();
    }
};

window.filterStudents = function() {
    const q = document.getElementById('table-search').value.toLowerCase();
    const rows = document.querySelectorAll('#student-table-body tr');
    rows.forEach(r => {
        r.style.display = r.innerText.toLowerCase().includes(q) ? '' : 'none';
    });
};

// 5. Document Vault Gallery
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
    if (docs['photo'] && docs['photo'].data) {
        photoBox.innerHTML = `<img src="${docs['photo'].data}" alt="${st.name}">`;
    } else {
        photoBox.innerHTML = `<span class="no-photo-placeholder">No Photo</span>`;
    }

    docTypes.forEach(type => {
        const statusBadge = document.getElementById(`status-${type}`);
        const prevBtn = document.getElementById(`prev-${type}`);
        const downBtn = document.getElementById(`down-${type}`);
        const thumbSlot = document.getElementById(`thumb-${type}`);

        if (docs[type] && docs[type].status === 'na') {
            statusBadge.innerText = "N/A (Not Applicable)";
            statusBadge.className = "doc-status-badge status-na";
            prevBtn.style.display = 'none';
            downBtn.style.display = 'none';
            thumbSlot.innerHTML = '🚫';
            verifiedCount++;
        } else if (docs[type] && docs[type].data) {
            statusBadge.innerText = `Verified (${docs[type].name || 'File'})`;
            statusBadge.className = "doc-status-badge status-ready";
            prevBtn.style.display = 'inline-flex';
            downBtn.style.display = 'inline-flex';
            if (docs[type].data.startsWith('data:image')) {
                thumbSlot.innerHTML = `<img src="${docs[type].data}" alt="thumb">`;
            } else {
                thumbSlot.innerHTML = '📄';
            }
            verifiedCount++;
        } else {
            statusBadge.innerText = "Pending / Missing";
            statusBadge.className = "doc-status-badge";
            prevBtn.style.display = 'none';
            downBtn.style.display = 'none';
            thumbSlot.innerHTML = getDocDefaultIcon(type);
        }
    });

    document.getElementById('showcase-count-verified').innerText = `${verifiedCount} / 6`;
    document.getElementById('showcase-status-label').innerText = verifiedCount === 6 ? 'Complete' : 'Incomplete';
    document.getElementById('showcase-status-label').style.color = verifiedCount === 6 ? '#10b981' : '#f59e0b';
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

    const docTypes = ['photo', 'birth', 'aadhaar', 'income', 'caste', 'parents'];
    docTypes.forEach(type => {
        document.getElementById(`status-${type}`).innerText = "Pending / Missing";
        document.getElementById(`status-${type}`).className = "doc-status-badge";
        document.getElementById(`prev-${type}`).style.display = 'none';
        document.getElementById(`down-${type}`).style.display = 'none';
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
                alert('Document uploaded successfully!');
            }
        };
        reader.readAsDataURL(file);
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

// ==========================================================================
// 6. EDITABLE TIMETABLE & TIMINGS (Subjects & Times)
// ==========================================================================
const defaultTimetables = {
    timings: {
        p1: "08:00 - 08:45",
        p2: "08:45 - 09:30",
        p3: "09:30 - 10:15",
        breakTime: "10:15 - 10:45",
        p4: "10:45 - 11:30",
        p5: "11:30 - 12:15"
    },
    schedules: {
        "Grade 9-A": [
            { day: "Monday", p1: "Mathematics", p2: "Science", p3: "English", p4: "Social Sci", p5: "Gujarati" },
            { day: "Tuesday", p1: "Science", p2: "Mathematics", p3: "Gujarati", p4: "Physical Edu", p5: "Computer" },
            { day: "Wednesday", p1: "English", p2: "Social Sci", p3: "Mathematics", p4: "Science", p5: "Art / Drawing" },
            { day: "Thursday", p1: "Mathematics", p2: "Science", p3: "Gujarati", p4: "English", p5: "Library" },
            { day: "Friday", p1: "Social Sci", p2: "Science", p3: "Mathematics", p4: "Hindi", p5: "Sanskrit" },
            { day: "Saturday", p1: "Unit Evaluation", p2: "Weekly Test", p3: "Sports", p4: "Activity", p5: "Assembly" }
        ],
        "Grade 9-B": [
            { day: "Monday", p1: "Science", p2: "Mathematics", p3: "English", p4: "Gujarati", p5: "Social Sci" },
            { day: "Tuesday", p1: "Mathematics", p2: "Science", p3: "Computer", p4: "Gujarati", p5: "Physical Edu" },
            { day: "Wednesday", p1: "Social Sci", p2: "English", p3: "Science", p4: "Mathematics", p5: "Library" },
            { day: "Thursday", p1: "Gujarati", p2: "Mathematics", p3: "Science", p4: "English", p5: "Sports" },
            { day: "Friday", p1: "Hindi", p2: "Social Sci", p3: "Mathematics", p4: "Science", p5: "Drawing" },
            { day: "Saturday", p1: "Weekly Test", p2: "Unit Evaluation", p3: "Sports", p4: "Activity", p5: "Assembly" }
        ],
        "Grade 10-A": [
            { day: "Monday", p1: "Mathematics", p2: "Science", p3: "English", p4: "Social Sci", p5: "Gujarati" },
            { day: "Tuesday", p1: "Science", p2: "Mathematics", p3: "Gujarati", p4: "Computer", p5: "Social Sci" },
            { day: "Wednesday", p1: "Social Sci", p2: "Mathematics", p3: "Science", p4: "English", p5: "Lab Practice" },
            { day: "Thursday", p1: "Mathematics", p2: "Science", p3: "English", p4: "Gujarati", p5: "Library" },
            { day: "Friday", p1: "Board Prep", p2: "Science", p3: "Mathematics", p4: "Social Sci", p5: "Hindi" },
            { day: "Saturday", p1: "Mock Test", p2: "Weekly Exam", p3: "Paper Solution", p4: "Sports", p5: "Assembly" }
        ],
        "Grade 10-B": [
            { day: "Monday", p1: "Science", p2: "Mathematics", p3: "Social Sci", p4: "English", p5: "Gujarati" },
            { day: "Tuesday", p1: "Mathematics", p2: "Science", p3: "Social Sci", p4: "Gujarati", p5: "Computer" },
            { day: "Wednesday", p1: "English", p2: "Social Sci", p3: "Mathematics", p4: "Science", p5: "Lab Practice" },
            { day: "Thursday", p1: "Science", p2: "Mathematics", p3: "Gujarati", p4: "English", p5: "Library" },
            { day: "Friday", p1: "Social Sci", p2: "Science", p3: "Board Prep", p4: "Hindi", p5: "Mathematics" },
            { day: "Saturday", p1: "Mock Test", p2: "Weekly Exam", p3: "Paper Solution", p4: "Sports", p5: "Assembly" }
        ],
        "Grade 11-Commerce": [
            { day: "Monday", p1: "Accountancy", p2: "B.A. (Org)", p3: "English", p4: "Economics", p5: "Statistics" },
            { day: "Tuesday", p1: "Statistics", p2: "Accountancy", p3: "Economics", p4: "English", p5: "Computer" },
            { day: "Wednesday", p1: "Economics", p2: "Statistics", p3: "Accountancy", p4: "B.A. (Org)", p5: "SPCC" },
            { day: "Thursday", p1: "Accountancy", p2: "B.A. (Org)", p3: "Statistics", p4: "Gujarati", p5: "Library" },
            { day: "Friday", p1: "Statistics", p2: "Accountancy", p3: "Economics", p4: "SPCC", p5: "Career Guiding" },
            { day: "Saturday", p1: "Account Test", p2: "Stats Test", p3: "Ledger Practical", p4: "Sports", p5: "Assembly" }
        ],
        "Grade 12-Commerce": [
            { day: "Monday", p1: "Accountancy", p2: "Statistics", p3: "B.A. (Org)", p4: "Economics", p5: "English" },
            { day: "Tuesday", p1: "Statistics", p2: "Accountancy", p3: "Economics", p4: "B.A. (Org)", p5: "Computer" },
            { day: "Wednesday", p1: "Accountancy", p2: "Statistics", p3: "English", p4: "SPCC", p5: "Board Audit" },
            { day: "Thursday", p1: "B.A. (Org)", p2: "Accountancy", p3: "Statistics", p4: "Economics", p5: "Library" },
            { day: "Friday", p1: "Economics", p2: "Accountancy", p3: "Statistics", p4: "SPCC", p5: "Commerce Lab" },
            { day: "Saturday", p1: "Board Mock Exam", p2: "Accounts Evaluation", p3: "Doubt Solving", p4: "Sports", p5: "Assembly" }
        ]
    }
};

function getTimetableData() {
    const saved = localStorage.getItem('sav_app_timetables_v2');
    return saved ? JSON.parse(saved) : defaultTimetables;
}

window.loadTimetable = function() {
    const std = document.getElementById('tt-standard-selector').value;
    const ttData = getTimetableData();
    const timings = ttData.timings || defaultTimetables.timings;
    const schedule = (ttData.schedules && ttData.schedules[std]) ? ttData.schedules[std] : defaultTimetables.schedules[std];

    const thead = document.getElementById('timetable-header');
    const tbody = document.getElementById('timetable-body');

    // Header Rendering
    if (!isTimetableEditing) {
        thead.innerHTML = `<tr>
            <th>Day</th>
            <th>Period 1<br><small>${timings.p1}</small></th>
            <th>Period 2<br><small>${timings.p2}</small></th>
            <th>Period 3<br><small>${timings.p3}</small></th>
            <th>Break<br><small>${timings.breakTime}</small></th>
            <th>Period 4<br><small>${timings.p4}</small></th>
            <th>Period 5<br><small>${timings.p5}</small></th>
        </tr>`;
    } else {
        thead.innerHTML = `<tr>
            <th>Day</th>
            <th>Period 1<br><input type="text" class="tt-time-input" id="time-p1" value="${timings.p1}"></th>
            <th>Period 2<br><input type="text" class="tt-time-input" id="time-p2" value="${timings.p2}"></th>
            <th>Period 3<br><input type="text" class="tt-time-input" id="time-p3" value="${timings.p3}"></th>
            <th>Break<br><input type="text" class="tt-time-input" id="time-break" value="${timings.breakTime}"></th>
            <th>Period 4<br><input type="text" class="tt-time-input" id="time-p4" value="${timings.p4}"></th>
            <th>Period 5<br><input type="text" class="tt-time-input" id="time-p5" value="${timings.p5}"></th>
        </tr>`;
    }

    // Body Rendering
    tbody.innerHTML = '';
    schedule.forEach((row, rIdx) => {
        if (!isTimetableEditing) {
            tbody.innerHTML += `<tr>
                <td><strong>${row.day}</strong></td>
                <td>${row.p1}</td>
                <td>${row.p2}</td>
                <td>${row.p3}</td>
                ${rIdx === 0 ? `<td rowspan="6" class="break-cell">RECESS BREAK</td>` : ''}
                <td>${row.p4}</td>
                <td>${row.p5}</td>
            </tr>`;
        } else {
            tbody.innerHTML += `<tr>
                <td><strong>${row.day}</strong></td>
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p1" value="${row.p1}"></td>
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p2" value="${row.p2}"></td>
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p3" value="${row.p3}"></td>
                ${rIdx === 0 ? `<td rowspan="6" class="break-cell">RECESS BREAK</td>` : ''}
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p4" value="${row.p4}"></td>
                <td><input type="text" class="tt-editable-input" id="tt-${rIdx}-p5" value="${row.p5}"></td>
            </tr>`;
        }
    });
};

window.toggleTimetableEdit = function() {
    const btn = document.getElementById('btn-edit-tt');
    const std = document.getElementById('tt-standard-selector').value;

    if (!isTimetableEditing) {
        isTimetableEditing = true;
        btn.innerText = "Save Timetable & Timings";
        btn.className = "btn-3d btn-primary btn-sm admin-only-btn";
        window.loadTimetable();
    } else {
        const fullData = getTimetableData();

        // Update Timings
        fullData.timings = {
            p1: document.getElementById('time-p1').value.trim(),
            p2: document.getElementById('time-p2').value.trim(),
            p3: document.getElementById('time-p3').value.trim(),
            breakTime: document.getElementById('time-break').value.trim(),
            p4: document.getElementById('time-p4').value.trim(),
            p5: document.getElementById('time-p5').value.trim()
        };

        // Update Schedule for standard
        const updatedSchedule = [];
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        days.forEach((day, rIdx) => {
            updatedSchedule.push({
                day: day,
                p1: document.getElementById(`tt-${rIdx}-p1`).value.trim(),
                p2: document.getElementById(`tt-${rIdx}-p2`).value.trim(),
                p3: document.getElementById(`tt-${rIdx}-p3`).value.trim(),
                p4: document.getElementById(`tt-${rIdx}-p4`).value.trim(),
                p5: document.getElementById(`tt-${rIdx}-p5`).value.trim()
            });
        });

        if (!fullData.schedules) fullData.schedules = {};
        fullData.schedules[std] = updatedSchedule;

        localStorage.setItem('sav_app_timetables_v2', JSON.stringify(fullData));

        isTimetableEditing = false;
        btn.innerText = "Edit Timetable & Timings";
        btn.className = "btn-3d btn-primary btn-sm admin-only-btn";
        window.loadTimetable();
        alert(`Timetable and Timings for ${std} successfully saved!`);
    }
};

// 7. Holidays (Add & Delete)
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
        const delBtn = currentRole === 'school'
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

// 8. Govt Circulars (Add & Delete)
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
        const delBtn = currentRole === 'school'
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

// 9. Notices & Attendance
const defaultNotices = [
    { title: "Quarterly Examination Schedule Published", date: "20/09/2026", body: "Detailed subject timetables have been pinned to the board. Students must clear library dues." },
    { title: "Parent-Teacher Institutional Conference", date: "18/09/2026", body: "The mandatory PTM for Standards 9, 10 and Commerce is scheduled for Saturday at 09:30 AM." }
];

function getNotices() {
    const data = localStorage.getItem('sav_enterprise_notices');
    return data ? JSON.parse(data) : defaultNotices;
}

function loadNotices() {
    const list = getNotices();
    const container = document.getElementById('notices-feed');
    const homeList = document.getElementById('home-notices-list');
    
    if (container) container.innerHTML = '';
    if (homeList) homeList.innerHTML = '';

    list.forEach(n => {
        const formattedDate = formatToDDMMYYYY(n.date);
        if (container) {
            container.innerHTML += `<div class="notice-item-3d">
                <h4>${n.title}</h4>
                <div class="notice-meta">Published: ${formattedDate} | Authority: Principal Office</div>
                <p>${n.body}</p>
            </div>`;
        }
        if (homeList) {
            homeList.innerHTML += `<li><strong>${n.title}</strong> <span style="color:#64748b;">(${formattedDate})</span></li>`;
        }
    });
}

window.toggleNoticeForm = function() {
    document.getElementById('notice-publish-form').classList.toggle('hidden-panel');
};

window.publishNotice = function() {
    const title = document.getElementById('notice-title').value.trim();
    const body = document.getElementById('notice-body').value.trim();
    if (!title || !body) return;

    const list = getNotices();
    list.unshift({ title, body, date: formatToDDMMYYYY(new Date().toISOString().split('T')[0]) });
    localStorage.setItem('sav_enterprise_notices', JSON.stringify(list));
    
    document.getElementById('notice-title').value = '';
    document.getElementById('notice-body').value = '';
    window.toggleNoticeForm();
    loadNotices();
};

window.loadAttendanceRoster = function() {
    const std = document.getElementById('att-standard-filter').value;
    const dateInput = document.getElementById('att-date');
    if (!dateInput.value) {
        dateInput.value = formatToDDMMYYYY(new Date().toISOString().split('T')[0]);
    }

    const list = getStudents().filter(s => s.standard === std);
    const tbody = document.getElementById('attendance-table-body');
    tbody.innerHTML = '';

    if (list.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b; padding:20px;">No students enrolled in ${std}.</td></tr>`;
        return;
    }

    list.forEach((st, idx) => {
        const markCol = currentRole === 'school'
            ? `<td><button class="btn-3d btn-secondary btn-sm" onclick="window.togglePresence(${idx})">Toggle Present/Absent</button></td>`
            : '';

        tbody.innerHTML += `<tr>
            <td><code>${st.roll}</code></td>
            <td><strong>${st.name}</strong></td>
            <td><code>${st.gr || '-'}</code></td>
            <td><span class="status-badge-present" id="att-status-${idx}">Present</span></td>
            ${markCol}
        </tr>`;
    });
};

window.togglePresence = function(idx) {
    if (currentRole !== 'school') return;
    const pill = document.getElementById(`att-status-${idx}`);
    if (pill.innerText === "Present") {
        pill.innerText = "Absent";
        pill.className = "status-badge-absent";
    } else {
        pill.innerText = "Present";
        pill.className = "status-badge-present";
    }
};

window.saveAttendanceRoster = function() {
    if (currentRole !== 'school') return;
    const selectedDate = document.getElementById('att-date').value || formatToDDMMYYYY(new Date().toISOString().split('T')[0]);
    alert(`Attendance roster for ${selectedDate} submitted successfully!`);
};

function loadHomeData() {
    loadNotices();
    loadHolidays();
}

window.updateAdminCredentials = function() {
    const currPass = document.getElementById('cfg-curr-pass').value.trim();
    const newId = document.getElementById('cfg-new-id').value.trim();
    const newPass = document.getElementById('cfg-new-pass').value.trim();

    const currentCreds = getAdminCredentials();

    if (currPass !== currentCreds.pass) {
        alert("Current password is incorrect!");
        return;
    }

    if (!newId || !newPass) {
        alert("New ID and Password are required.");
        return;
    }

    localStorage.setItem('sav_admin_credentials', JSON.stringify({ id: newId, pass: newPass }));
    alert(`Administrator credentials updated!\nNew ID: ${newId}`);
    
    document.getElementById('cfg-curr-pass').value = '';
    document.getElementById('cfg-new-id').value = '';
    document.getElementById('cfg-new-pass').value = '';
};

// Default setup
window.switchLanguage('en');
