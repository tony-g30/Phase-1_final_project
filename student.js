const apiUrl = 'http://localhost:3000/students';
const courseUrl = 'http://localhost:3000/courses';
const progressUrl = 'http://localhost:3000/progress';

document.addEventListener('DOMContentLoaded', () => {
    const studentForm = document.getElementById('student-form');
    const studentsList = document.getElementById('students');
    const courseSelect = document.getElementById('course');
    const progressSelect = document.getElementById('current-progress');
    const clearButton = document.getElementById('clear-button');

    // Fetch and populate dropdowns
    fetchCourses();
    fetchProgress();

    // Fetch students and render them
    fetchStudents();

    studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(studentForm);
        const studentData = {
            id: formData.get('id') || Date.now().toString(),  // Generate a new ID if not present
            name: formData.get('name'),
            course: formData.get('course'),
            currentProgress: formData.get('currentProgress'),
            email: formData.get('email'),
            dob: formData.get('dob'),
            contact: formData.get('contact')
        };

        if (studentData.id && studentData.id !== Date.now().toString()) {
            updateStudent(studentData);
        } else {
            addStudent(studentData);
        }
    });

    clearButton.addEventListener('click', () => {
        studentForm.reset(); // Clear form fields
        document.getElementById('student-id').value = ''; // Ensure the hidden ID field is also cleared
    });

    function fetchStudents() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(students => {
                renderStudents(students);
            })
            .catch(error => console.error('Error fetching students:', error));
    }

    function fetchCourses() {
        fetch(courseUrl)
            .then(response => response.json())
            .then(courses => {
                populateDropdown(courseSelect, courses, 'name');
            })
            .catch(error => console.error('Error fetching courses:', error));
    }

    function fetchProgress() {
        fetch(progressUrl)
            .then(response => response.json())
            .then(progressStatuses => {
                populateDropdown(progressSelect, progressStatuses, 'status');
            })
            .catch(error => console.error('Error fetching progress statuses:', error));
    }

    function populateDropdown(selectElement, items, labelKey) {
        selectElement.innerHTML = '';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.name || item.status;
            option.textContent = item[labelKey];
            selectElement.appendChild(option);
        });
    }

    function renderStudents(students) {
        studentsList.innerHTML = '';
        students.forEach(student => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${student.name}</strong><br>
                <em>Course:</em> ${student.course}<br>
                <em>Current Progress:</em> ${student.currentProgress}<br>
                <em>Email:</em> ${student.email}<br>
                <em>Date of Birth:</em> ${student.dob}<br>
                <em>Contact:</em> ${student.contact}<br>
            `;
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit';
            editButton.addEventListener('click', () => fillFormForEdit(student));
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
            deleteButton.addEventListener('click', () => deleteStudent(student.id));
            li.appendChild(editButton);
            li.appendChild(deleteButton);
            studentsList.appendChild(li);
        });
    }

    function addStudent(studentData) {
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        })
        .then(response => response.json())
        .then(newStudent => {
            fetchStudents(); // Refresh the student list
            studentForm.reset();
        })
        .catch(error => console.error('Error adding student:', error));
    }

    function updateStudent(studentData) {
        fetch(`${apiUrl}/${studentData.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        })
        .then(response => response.json())
        .then(updatedStudent => {
            fetchStudents(); // Refresh the student list
            studentForm.reset();
        })
        .catch(error => console.error('Error updating student:', error));
    }

    function deleteStudent(id) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            fetchStudents(); // Refresh the student list
        })
        .catch(error => console.error('Error deleting student:', error));
    }

    function fillFormForEdit(student) {
        document.getElementById('student-id').value = student.id;
        document.getElementById('student-name').value = student.name;
        document.getElementById('course').value = student.course;
        document.getElementById('current-progress').value = student.currentProgress;
        document.getElementById('student-email').value = student.email;
        document.getElementById('student-dob').value = student.dob;
        document.getElementById('student-contact').value = student.contact;
    }
});
