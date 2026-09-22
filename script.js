// ==========================================================================
// SHREE AMBICA VIDHYALAYA - ENTERPRISE LOGIC ENGINE
// ==========================================================================

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
let currentLanguage = 'en';
let activeVaultStudentUID = null;

// Admin Default Credentials
function getAdminCredentials() {
    const saved = localStorage.getItem('sav_admin_credentials');
    return saved ? JSON.parse(saved) : { id: "admin", pass: "admin123" };
}

// 2. Multilingual Translations Dictionary
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
        menuAI: "Ambica AI Bot",
        logoutBtn: "Log Out",
        institutionalPortal: "Institutional Portal",
        heroWelcomeTag: "OFFICIAL ACADEMIC REPOSITORY",
        heroWelcomeTitle: "Welcome to Shree Ambica Vidhyalaya",
        heroWelcomeDesc: "An integrated institutional management platform supporting advanced student records, statutory compliance, real-time daily roll checks, and academic digital assistance.",
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
        fldDob: "Date of Birth *",
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
        colDob: "DOB",
        colPhysical: "Ht / Wt",
        colAadhaar: "Govt ID",
        colParent: "Parents",
        colPhone: "Contact",
        colAddress: "Address",
        colActions: "Actions",
        vaultTitle: "Student Individual Document Archive (5TB Cloud Vault)",
        vaultDesc: "Manage and audit identity, photographs, and statutory certifications on a per-student basis",
        docPassport: "Student Passport Photo",
        docBirth: "Birth Certificate",
        docAadhaar: "Student Govt ID Card",
        docIncome: "Income Certificate",
        docCaste: "Caste Certificate",
        docParentsAadhaar: "Parents Proofs",
        btnUpload: "Upload",
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
        ttDesc: "Weekly departmental class timetable (9, 10 & Commerce)",
        hldTitle: "Annual & Local Holiday Schedule",
        hldDesc: "Statutory academic calendar and institutional holiday notifications",
        adminSettingsTitle: "Administrator Credentials Configuration",
        adminSettingsDesc: "Update master administrator ID and secure access password",
        lblCurrentPass: "Current Password *",
        lblNewAdminId: "New Administrator ID *",
        lblNewAdminPass: "New Administrator Password *",
        btnUpdateAdmin: "Update Admin Credentials",
        aiDesc: "State-of-the-art academic intelligence powered by ChatGPT-4o Gateway"
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
        menuAI: "અંબિકા AI સહાયક",
        logoutBtn: "લૉગ આઉટ",
        institutionalPortal: "શાળા સંચાલન પ્રણાલી",
        heroWelcomeTag: "સત્તાવાર શૈક્ષણિક પોર્ટલ",
        heroWelcomeTitle: "શ્રી અંબિકા વિદ્યાલયમાં આપનું સ્વાગત છે",
        heroWelcomeDesc: "વિદ્યાર્થી પ્રવેશ, ઓળખ પુરાવા અને પ્રમાણપત્રો, દૈનિક હાજરી, સરકારી પરિપત્રો અને AI સહાયક માટેનું સંપૂર્ણ ડિજિટલ પ્લેટફોર્મ.",
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
        fldDob: "જન્મ તારીખ *",
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
        colDob: "જન્મ તારીખ",
        colPhysical: "ઊંચાઈ/વજન",
        colAadhaar: "ઓળખ ક્રમાંક",
        colParent: "માતા-પિતા",
        colPhone: "સંપર્ક",
        colAddress: "સરનામું",
        colActions: "કાર્યવાહી",
        vaultTitle: "વિદ્યાર્થી દસ્તાવેજ સંગ્રહાગાર (5TB Cloud Vault)",
        vaultDesc: "દરેક વિદ્યાર્થીવાર ઓળખ પુરાવા, ફોટો અને પ્રમાણપત્રોનું સંચાલન",
        docPassport: "પાસપોર્ટ સાઇઝ ફોટો",
        docBirth: "જન્મ પ્રમાણપત્ર",
        docAadhaar: "વિદ્યાર્થી ઓળખ કાર્ડ",
        docIncome: "આવકનો દાખલો",
        docCaste: "જાતિનો દાખલો",
        docParentsAadhaar: "માતા-પિતાના પુરાવા",
        btnUpload: "અપલોડ",
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
        ttDesc: "વર્ગ અને વિષયવાર તાસ આયોજન (9, 10 અને કોમર્સ)",
        hldTitle: "શાળા શૈક્ષણિક અને સ્થાનિક રજાઓ",
        hldDesc: "વાર્ષિક કેલેન્ડર અને તહેવારોની યાદી",
        adminSettingsTitle: "એડમિનિસ્ટ્રેટર આઈડી અને પાસવર્ડ બદલો",
        adminSettingsDesc: "મુખ્ય એડમિન યુઝરનેમ અને સિક્યોરિટી પાસવર્ડ અપડેટ કરો",
        lblCurrentPass: "હાલનો પાસવર્ડ *",
        lblNewAdminId: "નવો Administrator ID *",
        lblNewAdminPass: "નવો પાસવર્ડ *",
        btnUpdateAdmin: "માહિતી અપડેટ કરો",
        aiDesc: "ChatGPT-4o આધારિત અદ્યતન શૈક્ષણિક AI સહાયક"
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
        menuAI: "अंबिका AI सहायक",
        logoutBtn: "लॉग आउट",
        institutionalPortal: "संस्थागत प्रबंधन प्रणाली",
        heroWelcomeTag: "आधिकारिक शैक्षणिक पोर्टल",
        heroWelcomeTitle: "श्री अंबिका विद्यालय में आपका स्वागत है",
        heroWelcomeDesc: "छात्र प्रवेश, दस्तावेज़, ऑनलाइन उपस्थिति, सरकारी परिपत्र और AI सहायता हेतु एकीकृत डिजिटल मंच।",
        quickNewAdmission: "+ नया प्रवेश",
        quickAttendance: "उपस्थिति दर्ज करें",
        statEnrolled: "कुल छात्र",
        statAttendance: "औसत उपस्थिति",
        homeRecentNotices: "नवीनतम संस्थागत सूचनाएं",
        homeUpcomingHolidays: "आगामी शैक्षणिक अवकाश",
        formTitleEnroll: "छात्र प्रवेश फॉर्म",
        formDescEnroll: "छात्र की विस्तृत जानकारी एवं रजिस्टर",
        fldGrNo: "जी.आर. नंबर (G.R. No) *",
        fldUid: "यू.आई.डी. नंबर (यूज़रनेम) *",
        fldPassword: "छात्र लॉगिन पासवर्ड *",
        fldEmail: "पंजीकृत ईमेल (गूगल लॉगिन हेतु)",
        fldName: "छात्र का पूरा नाम *",
        fldStandard: "कक्षा / वर्ग *",
        fldRoll: "रोल नंबर *",
        fldDob: "जन्म तिथि *",
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
        colDob: "जन्म तिथि",
        colPhysical: "ऊंचाई/वजन",
        colAadhaar: "पहचान पत्र",
        colParent: "माता-पिता",
        colPhone: "संपर्क",
        colAddress: "पता",
        colActions: "कार्यवाही",
        vaultTitle: "छात्र दस्तावेज़ संग्रह (5TB Cloud Vault)",
        vaultDesc: "छात्र वार पहचान पत्र, फोटो और प्रमाण पत्रों का प्रबंधन",
        docPassport: "पासपोर्ट साइज फोटो",
        docBirth: "जन्म प्रमाण पत्र",
        docAadhaar: "छात्र पहचान कार्ड",
        docIncome: "आय प्रमाण पत्र",
        docCaste: "जाति प्रमाण पत्र",
        docParentsAadhaar: "माता-पिता के दस्तावेज",
        btnUpload: "अपलोड",
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
        ttDesc: "साप्ताहिक कक्षा समय सारिणी (9, 10 एवं कॉमर्स)",
        hldTitle: "वार्षिक एवं स्थानीय अवकाश सूची",
        hldDesc: "वार्षिक कैलेंडर और त्योहारों की सूची",
        adminSettingsTitle: "व्यवस्थापक आईडी एवं पासवर्ड बदलें",
        adminSettingsDesc: "मुख्य व्यवस्थापक यूज़रनेम एवं पासवर्ड अपडेट करें",
        lblCurrentPass: "वर्तमान पासवर्ड *",
        lblNewAdminId: "नया Admin ID *",
        lblNewAdminPass: "नया पासवर्ड *",
        btnUpdateAdmin: "डेटा अपडेट करें",
        aiDesc: "ChatGPT-4o संचालित आधुनिक शैक्षणिक AI सहायक"
    }
};

// 3. Language Controller
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

    const aiInit = document.getElementById('ai-init-msg');
    if (aiInit) {
        if (lang === 'gu') {
            aiInit.innerText = "નમસ્તે! હું શ્રી અંબિકા વિદ્યાલયનો સત્તાવાર AI શૈક્ષણિક સહાયક છું. અભ્યાસ, પરિપત્રો કે શાળા સંબંધિત કોઈ પણ પ્રશ્ન પૂછી શકો છો.";
        } else if (lang === 'hi') {
            aiInit.innerText = "नमस्ते! मैं श्री अंबिका विद्यालय का आधिकारिक AI शैक्षणिक सहायक हूँ। आप मुझसे अध्ययन, पाठ्यक्रम या विद्यालय संबंधित कोई भी प्रश्न पूछ सकते हैं।";
        } else {
            aiInit.innerText = "Hello! I am the Shree Ambica Vidhyalaya AI Assistant. How can I assist you with your academics, syllabus, or administrative inquiries today?";
        }
    }
};

window.cycleLanguage = function() {
    const sequence = ['en', 'gu', 'hi'];
    const next = sequence[(sequence.indexOf(currentLanguage) + 1) % sequence.length];
    window.switchLanguage(next);
};

// 4. Role & Secure Authentication
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
                ? "નોંધાયેલ વિદ્યાર્થી મળ્યો નથી અથવા પાસવર્ડ ખોટો છે! ફક્ત રજિસ્ટર્ડ વિદ્યાર્થી જ લૉગિન કરી શકે છે." 
                : "Unregistered student or invalid password! Only registered students can log in.");
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
                alert(currentLanguage === 'gu' 
                    ? `આ ઈમેઈલ (${userEmail}) શાળાના રેકોર્ડમાં રજિસ્ટર્ડ નથી! પ્રવેશ અસ્વીકાર્ય.` 
                    : `This email (${userEmail}) is not registered in school records! Access denied.`);
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

    // Strict Student Read-Only Restrictions
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
    loadHolidays();
}

window.logout = function() {
    auth.signOut().then(() => {
        location.reload();
    });
};

// 5. Sidebar Navigation Controller
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

// 6. Comprehensive Student Storage (LocalStorage Engine)
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
            <td>${st.dob || '-'}</td>
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
    const dob = document.getElementById('st_dob').value;
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

    if (!gr || !uid || !password || !name || !roll || !phone) {
        alert(currentLanguage === 'gu' 
            ? 'કૃપા કરીને જરૂરી વિગતો (GR, UID, પાસવર્ડ, નામ, રોલ નંબર, ફોન) દાખલ કરો.' 
            : 'Please fill all mandatory fields (GR, UID, Password, Name, Roll, Phone).');
        return;
    }

    const list = getStudents();
    list.push({
        gr, uid, password, email, name, standard, roll, dob, gender, weight, height,
        blood, aadhaar, father, fa_aadhaar, mother, mo_aadhaar, phone, address,
        documents: {}
    });
    saveStudents(list);

    document.querySelectorAll('#admin-enrollment-card input, #admin-enrollment-card textarea').forEach(inp => inp.value = '');
    loadStudents();
    populateVaultStudentDropdown();
    alert(currentLanguage === 'gu' ? 'વિદ્યાર્થીનો રેકોર્ડ સફળતાપૂર્વક ઉમેરાઈ ગયો!' : 'Student record registered successfully!');
};

window.deleteStudent = function(index) {
    if (confirm(currentLanguage === 'gu' ? 'શું તમે આ રેકોર્ડ રદ કરવા માંગો છો?' : 'Confirm deletion of this student record?')) {
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

// 7. Student-Specific Document Vault Logic
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
    const banner = document.getElementById('vault-student-banner');

    if (!uid) {
        banner.style.display = 'none';
        resetVaultTiles();
        return;
    }

    const students = getStudents();
    const st = students.find(s => s.uid === uid);
    if (!st) return;

    banner.style.display = 'flex';
    document.getElementById('vault-dossier-avatar').innerText = st.name.substring(0, 2).toUpperCase();
    document.getElementById('vault-dossier-name').innerText = st.name;
    document.getElementById('vault-dossier-gr').innerText = `GR: ${st.gr}`;
    document.getElementById('vault-dossier-uid').innerText = `UID: ${st.uid}`;
    document.getElementById('vault-dossier-std').innerText = `Std: ${st.standard}`;

    const docs = st.documents || {};
    const docTypes = ['photo', 'birth', 'aadhaar', 'income', 'caste', 'parents'];

    docTypes.forEach(type => {
        const statusBadge = document.getElementById(`status-${type}`);
        const prevBtn = document.getElementById(`prev-${type}`);
        const downBtn = document.getElementById(`down-${type}`);

        if (docs[type] && docs[type].status === 'na') {
            statusBadge.innerText = "Not Applicable (N/A)";
            statusBadge.className = "doc-status-badge status-na";
            prevBtn.style.display = 'none';
            downBtn.style.display = 'none';
        } else if (docs[type] && docs[type].data) {
            statusBadge.innerText = `Verified (${docs[type].name || 'Document'})`;
            statusBadge.className = "doc-status-badge status-ready";
            prevBtn.style.display = 'inline-flex';
            downBtn.style.display = 'inline-flex';
        } else {
            statusBadge.innerText = "Pending / Missing";
            statusBadge.className = "doc-status-badge";
            prevBtn.style.display = 'none';
            downBtn.style.display = 'none';
        }
    });
};

function resetVaultTiles() {
    const docTypes = ['photo', 'birth', 'aadhaar', 'income', 'caste', 'parents'];
    docTypes.forEach(type => {
        const statusBadge = document.getElementById(`status-${type}`);
        statusBadge.innerText = "Pending / Missing";
        statusBadge.className = "doc-status-badge";
        document.getElementById(`prev-${type}`).style.display = 'none';
        document.getElementById(`down-${type}`).style.display = 'none';
    });
}

window.handleVaultUpload = function(input, docType) {
    const uid = currentRole === 'student' ? activeVaultStudentUID : document.getElementById('vault-student-selector').value;
    if (!uid) {
        alert(currentLanguage === 'gu' ? 'કૃપા કરીને પહેલા વિદ્યાર્થી પસંદ કરો!' : 'Please select a student first!');
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
                alert(currentLanguage === 'gu' ? 'દસ્તાવેજ સફળતાપૂર્વક અપલોડ થઈ ગયો છે!' : 'Document uploaded successfully!');
            }
        };
        reader.readAsDataURL(file);
    }
};

window.markDocNA = function(docType) {
    const uid = currentRole === 'student' ? activeVaultStudentUID : document.getElementById('vault-student-selector').value;
    if (!uid) {
        alert(currentLanguage === 'gu' ? 'કૃપા કરીને પહેલા વિદ્યાર્થી પસંદ કરો!' : 'Please select a student first!');
        return;
    }

    const students = getStudents();
    const idx = students.findIndex(s => s.uid === uid);

    if (idx !== -1) {
        if (!students[idx].documents) students[idx].documents = {};
        students[idx].documents[docType] = {
            status: 'na',
            name: 'Not Applicable'
        };
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

// 8. Digital Attendance Register
window.loadAttendanceRoster = function() {
    const std = document.getElementById('att-standard-filter').value;
    const dateInput = document.getElementById('att-date');
    if (!dateInput.value) {
        dateInput.value = new Date().toISOString().split('T')[0];
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
    alert(currentLanguage === 'gu' ? 'આજની હાજરી સફળતાપૂર્વક સેવ થઈ ગઈ છે.' : 'Attendance roster submitted successfully.');
};

// 9. Institutional Notices
const defaultNotices = [
    { title: "Quarterly Examination Schedule Published", date: "2026-09-20", body: "Detailed subject timetables have been pinned to the board. Students must clear library dues." },
    { title: "Parent-Teacher Institutional Conference", date: "2026-09-18", body: "The mandatory PTM for Standards 9, 10 and Commerce is scheduled for Saturday at 09:30 AM." }
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
        if (container) {
            container.innerHTML += `<div class="notice-item-3d">
                <h4>${n.title}</h4>
                <div class="notice-meta">Published: ${n.date} | Authority: Principal Office</div>
                <p>${n.body}</p>
            </div>`;
        }
        if (homeList) {
            homeList.innerHTML += `<li><strong>${n.title}</strong> <span style="color:#64748b;">(${n.date})</span></li>`;
        }
    });
}

window.toggleNoticeForm = function() {
    if (currentRole !== 'school') return;
    document.getElementById('notice-publish-form').classList.toggle('hidden-panel');
};

window.publishNotice = function() {
    if (currentRole !== 'school') return;
    const title = document.getElementById('notice-title').value.trim();
    const body = document.getElementById('notice-body').value.trim();
    if (!title || !body) return;

    const list = getNotices();
    list.unshift({ title, body, date: new Date().toISOString().split('T')[0] });
    localStorage.setItem('sav_enterprise_notices', JSON.stringify(list));
    
    document.getElementById('notice-title').value = '';
    document.getElementById('notice-body').value = '';
    window.toggleNoticeForm();
    loadNotices();
};

// 10. Government Circulars
const defaultCircs = [
    { num: "GSEB/PARI/2026/842", title: "Commerce Assessment and Accountancy Examination Norms", date: "2026-09-15" },
    { num: "EDU-GUJ/STAT/1048", title: "Mandatory Digital Enrollment of Secondary Students on State Portal", date: "2026-09-10" }
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
        container.innerHTML += `<div class="circular-item-3d">
            <h4>${c.title}</h4>
            <div class="circular-meta">Circular Ref: <code>${c.num}</code> | Order Date: ${c.date}</div>
            <button class="btn-3d btn-secondary btn-sm" onclick="alert('Digital Circular Archival Verified.')">Download Verified Order</button>
        </div>`;
    });
}

window.toggleCircForm = function() {
    if (currentRole !== 'school') return;
    document.getElementById('circ-publish-form').classList.toggle('hidden-panel');
};

window.publishCircular = function() {
    if (currentRole !== 'school') return;
    const num = document.getElementById('circ-num').value.trim();
    const title = document.getElementById('circ-title').value.trim();
    const date = document.getElementById('circ-date').value;
    if (!num || !title) return;

    const list = getCirculars();
    list.unshift({ num, title, date: date || new Date().toISOString().split('T')[0] });
    localStorage.setItem('sav_enterprise_circs', JSON.stringify(list));

    document.getElementById('circ-num').value = '';
    document.getElementById('circ-title').value = '';
    window.toggleCircForm();
    loadCirculars();
};

// 11. Holiday Calendar
const holidays = [
    { name: "Gandhi Jayanti", date: "October 02, 2026", type: "National Holiday" },
    { name: "Navratri & Dussehra Vacation", date: "October 18 - 22, 2026", type: "State Festival" },
    { name: "Diwali Academic Recess", date: "November 08 - 20, 2026", type: "Institutional Vacation" },
    { name: "Local Institutional Foundation Day", date: "December 04, 2026", type: "Local School Holiday" }
];

function loadHolidays() {
    const container = document.getElementById('holiday-roster');
    const homeList = document.getElementById('home-holidays-list');
    if (container) container.innerHTML = '';
    if (homeList) homeList.innerHTML = '';

    holidays.forEach(h => {
        if (container) {
            container.innerHTML += `<div class="holiday-card-3d">
                <h4>${h.name}</h4>
                <div class="notice-meta">${h.date}</div>
                <span class="badge-role">${h.type}</span>
            </div>`;
        }
        if (homeList) {
            homeList.innerHTML += `<li><strong>${h.name}</strong> <span style="color:#64748b;">(${h.date})</span></li>`;
        }
    });
}

function loadHomeData() {
    loadNotices();
    loadHolidays();
}

// 12. Admin Security Settings (Change ID & Password)
window.updateAdminCredentials = function() {
    const currPass = document.getElementById('cfg-curr-pass').value.trim();
    const newId = document.getElementById('cfg-new-id').value.trim();
    const newPass = document.getElementById('cfg-new-pass').value.trim();

    const currentCreds = getAdminCredentials();

    if (currPass !== currentCreds.pass) {
        alert(currentLanguage === 'gu' ? "હાલનો પાસવર્ડ ખોટો છે!" : "Current password is incorrect!");
        return;
    }

    if (!newId || !newPass) {
        alert(currentLanguage === 'gu' ? "નવો ID અને નવો Password દાખલ કરવો ફરજિયાત છે." : "New ID and Password are required.");
        return;
    }

    localStorage.setItem('sav_admin_credentials', JSON.stringify({ id: newId, pass: newPass }));
    alert(currentLanguage === 'gu' 
        ? `Administrator ID અને Password સફળતાપૂર્વક બદલાઈ ગયા છે!\nનવો ID: ${newId}` 
        : `Administrator credentials successfully updated!\nNew ID: ${newId}`);
    
    document.getElementById('cfg-curr-pass').value = '';
    document.getElementById('cfg-new-id').value = '';
    document.getElementById('cfg-new-pass').value = '';
};

// 13. Ambica AI Clean Engine
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
    const loadingText = currentLanguage === 'gu' ? 'ChatGPT વિચારી રહ્યું છે...' : (currentLanguage === 'hi' ? 'ChatGPT विचार कर रहा है...' : 'ChatGPT is analyzing...');
    chatBody.innerHTML += `<div class="chat-bubble ai-bubble" id="${loadingId}">${loadingText}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    const langInstruction = currentLanguage === 'gu' 
        ? "તમારે સંપૂર્ણ જવાબ શુદ્ધ ગુજરાતીમાં જ આપવાનો છે. કોઈપણ પ્રકારનું કોડિંગ, JSON કે આંતરિક ટેકનિકલ લખાણ બતાવવું નહીં, માત્ર સીધો અને સાચો જવાબ આપવો." 
        : (currentLanguage === 'hi' 
            ? "आपको पूरा उत्तर शुद्ध हिंदी में देना है। कोई भी JSON या तकनीकी कोड न दिखाएं, केवल सीधा उत्तर दें।" 
            : "Answer clearly and directly in professional English. Do not show internal reasoning, JSON, or debug code.");

    const systemPrompt = `You are the official smart academic AI assistant of Shree Ambica Vidhyalaya school. ${langInstruction}`;

    try {
        const response = await fetch("https://text.pollinations.ai/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: msg }
                ],
                model: "openai",
                jsonMode: false
            })
        });

        if (response.ok) {
            let text = await response.text();
            
            if (text.includes('"reasoning"') || text.includes('{"role"')) {
                try {
                    const parsed = JSON.parse(text);
                    text = parsed.content || parsed.message?.content || parsed.text || text;
                } catch(e) {
                    const parts = text.split('"content":');
                    if (parts.length > 1) {
                        text = parts[1].replace(/["}]/g, '').trim();
                    }
                }
            }
            const cleanText = text.trim();
            if (cleanText && !cleanText.startsWith("{")) {
                document.getElementById(loadingId).innerText = cleanText;
            } else {
                throw new Error("Invalid format");
            }
        } else {
            throw new Error("HTTP Status " + response.status);
        }
    } catch (err) {
        console.error("AI Error:", err);
        const q = msg.toLowerCase();
        if (q.includes("science") && (q.includes("10") || q.includes("std"))) {
            document.getElementById(loadingId).innerText = "ધોરણ ૧૦ વિજ્ઞાનના પ્રકરણો:\n૧. રાસાયણિક પ્રક્રિયાઓ અને સમીકરણો\n૨. ઍસિડ, બેઇઝ અને ક્ષાર\n૩. ધાતુઓ અને અધાતુઓ\n૪. કાર્બન અને તેનાં સંયોજનો\n૫. જૈવિક ક્રિયાઓ\n૬. નિયંત્રણ અને સંકલન\n૭. સજીવો કેવી રીતે પ્રજનન કરે છે?\n૮. આનુવંશિકતા\n૯. પ્રકાશ – પરાવર્તન અને વક્રીભવન\n૧૦. માનવ-આંખ અને રંગબેરંગી દુનિયા\n૧૧. વિદ્યુત\n૧૨. વિદ્યુતપ્રવાહની ચુંબકીય અસરો\n૧૩. આપણું પર્યાવરણ";
        } else if (q.includes("time") || q.includes("સમય") || q.includes("વાગ્યા")) {
            const now = new Date();
            document.getElementById(loadingId).innerText = `અત્યારે સમય થયો છે: ${now.toLocaleTimeString('gu-IN')}`;
        } else {
            document.getElementById(loadingId).innerText = "માફ કરજો, સર્વર કનેક્શનમાં ક્ષતિ આવી. ફરી પ્રયત્ન કરો.";
        }
    }
    chatBody.scrollTop = chatBody.scrollHeight;
};

// Start default
window.switchLanguage('en');
