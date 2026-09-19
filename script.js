// પેજ લોડ થાય ત્યારે વિદ્યાર્થીઓનું લિસ્ટ ફેચ કરો
document.addEventListener('DOMContentLoaded', loadStudents);

function loadStudents() {
    fetch('/get_students')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('student-table-body');
            tbody.innerHTML = '';
            data.forEach(student => {
                const row = `<tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.roll_no}</td>
                    <td>${student.standard}</td>
                </tr>`;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error('Error loading students:', error));
}

// નવો વિદ્યાર્થી ડેટાબેઝમાં એડ કરવા માટે
function addStudent() {
    const name = document.getElementById('name').value.trim();
    const roll_no = document.getElementById('roll_no').value.trim();
    const standard = document.getElementById('standard').value.trim();

    if (!name || !roll_no || !standard) {
        alert('કૃપા કરીને બધી વિગતો ભરો.');
        return;
    }

    fetch('/add_student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            roll_no: roll_no,
            standard: standard
        })
    })
    .then(response => response.json())
    .then(result => {
        // ઇનપુટ બોક્સ ખાલી કરવા
        document.getElementById('name').value = '';
        document.getElementById('roll_no').value = '';
        document.getElementById('standard').value = '';
        // લિસ્ટ ફરી રિફ્રેશ કરવું
        loadStudents();
    })
    .catch(error => console.error('Error adding student:', error));
}