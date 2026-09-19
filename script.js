// પેજ લોડ થાય ત્યારે LocalStorage માંથી ડેટા લાવો
document.addEventListener('DOMContentLoaded', loadStudents);

function getStudentsFromStorage() {
    const students = localStorage.getItem('ambica_students');
    return students ? JSON.parse(students) : [];
}

function loadStudents() {
    const students = getStudentsFromStorage();
    const tbody = document.getElementById('student-table-body');
    tbody.innerHTML = '';

    students.forEach((student, index) => {
        const row = `<tr>
            <td>${index + 1}</td>
            <td>${student.name}</td>
            <td>${student.roll_no}</td>
            <td>${student.standard}</td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function addStudent() {
    const nameInput = document.getElementById('name');
    const rollNoInput = document.getElementById('roll_no');
    const standardInput = document.getElementById('standard');

    const name = nameInput.value.trim();
    const roll_no = rollNoInput.value.trim();
    const standard = standardInput.value.trim();

    if (!name || !roll_no || !standard) {
        alert('કૃપા કરીને બધી વિગતો ભરો.');
        return;
    }

    const students = getStudentsFromStorage();

    // નવો વિદ્યાર્થી એરેમાં ઉમેરો
    students.push({
        name: name,
        roll_no: roll_no,
        standard: standard
    });

    // LocalStorage માં ડેટા સેવ કરો
    localStorage.setItem('ambica_students', JSON.stringify(students));

    // ઇનપુટ બોક્સ ખાલી કરો
    nameInput.value = '';
    rollNoInput.value = '';
    standardInput.value = '';

    // ટેબલ રિફ્રેશ કરો
    loadStudents();
}
