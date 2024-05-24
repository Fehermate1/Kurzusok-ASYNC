const url = "https://vvri.pythonanywhere.com/api/courses";

async function fetchCourses() {
    try{
    const response= await fetch(url)
    const data=await response.json()
            const courseList = document.getElementById("course-list");
            courseList.innerHTML = '';
            data.forEach(course => {
                const button = document.createElement("button");
                button.className = "list-group-item list-group-item-action";
                button.textContent = course.name;
                button.addEventListener("click", () => {
                    getCourseDetails(course.id);
                });
                courseList.appendChild(button);
            });   
    }
        catch(error){console.error("Hiba történt: " + error)};
}

async function getCourseDetails(courseId) {
    try{
    const response = await fetch(url)
    const data = await response.json()
        .then(data => {
            const courseDetails = document.getElementById("course-details");
            courseDetails.innerHTML = `
                <h2>${data.name}</h2>
                <p>${data.description || ''}</p>
                <button class="btn btn-danger" onclick="deleteCourse(${data.id})">Kurzus törlése</button>
                <h3>Diákok:</h3>
                <ul id="student-list" class="list-group"></ul>
            `;
            courseDetails.dataset.courseId = courseId;

            const studentList = document.getElementById("student-list");
            studentList.innerHTML = '';
            data.students.forEach(student => {
                const studentListItem = document.createElement("li");
                studentListItem.className = "list-group-item list-group-item-action";
                studentListItem.textContent = student.name;
                studentListItem.addEventListener("click", () => {
                    getStudentDetails(student.id);
                });
                studentList.appendChild(studentListItem);
            });
        })
    }
        catch(error){console.error("Hiba történt: " + error)};
}

document.getElementById("new-course-btn").addEventListener("click", () => {
    const courseName = prompt("Add meg a kurzus nevét:");
    if (courseName) {
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: courseName })
        })
            .then(response => response.json())
            .then(data => {
                console.log("Új kurzus létrehozva:", data);
                fetchCourses();
            })
            .catch(error => console.log("Hiba történt: " + error));
    }
});

document.getElementById("assign-student-btn").addEventListener("click", () => {
    const studentName = document.getElementById("student-name").value;
    const courseId = document.getElementById("course-details").dataset.courseId;
    if (studentName && courseId) {
        fetch(`https://vvri.pythonanywhere.com/api/students`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: studentName, course_id: courseId })
        })
            .then(response => response.json())
            .then(student => {
                console.log("Új diák hozzárendelve:", student);
                getCourseDetails(courseId);
            })
            .catch(error => console.log("Hiba történt: " + error));
    } else {
        alert("Add meg a diák nevét és válassz egy kurzust!");
    }
});

async function getStudentDetails(studentId) {
    try{
    fetch(`https://vvri.pythonanywhere.com/api/students/${studentId}`)
    const studentId = await response.json()
        .then(student => {
            const studentDetails = document.getElementById("student-details");
            studentDetails.innerHTML = `
                <h4>${student.name}</h4>
                <button class="btn btn-warning" onclick="editStudent(${student.id})">Szerkesztés</button>
                <button class="btn btn-danger" onclick="deleteStudent(${student.id})">Törlés</button>
            `;
        })
    }
        catch(error){console.error("Hiba történt: " + error)};
}

async function editStudent(studentId) {
    try{
    const newName = prompt("Add meg az új nevet:");
    if (newName) {
        fetch(`https://vvri.pythonanywhere.com/api/students/${studentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newName })
        })
            .then(response => response.json())
            .then(updatedStudent => {
                console.log("Diák adatai frissítve:", updatedStudent);
                const courseId = document.getElementById("course-details").dataset.courseId;
                getCourseDetails(courseId);
                getStudentDetails(studentId);
            })
        }
    }
    catch(error){console.log("Hiba történt: " + error)};
}

async function deleteStudent(studentId) {
    try{
    if (confirm("Biztosan törölni szeretnéd ezt a diákot?")) {
        fetch(`https://vvri.pythonanywhere.com/api/students/${studentId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Diák törölve");
                    const courseId = document.getElementById("course-details").dataset.courseId;
                    getCourseDetails(courseId);
                    document.getElementById("student-details").innerHTML = '';
                } else {
                    console.log("Hiba történt a diák törlésekor");
                }
            })
    }
    }
    catch(error){console.log("Hiba történt: " + error)};
}

async function deleteCourse(courseId) {
    try{
    if (confirm("Biztosan törölni szeretnéd ezt a kurzust?")) {
        fetch(`${url}/${courseId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (response.ok) {
                    console.log("Kurzus törölve");
                    fetchCourses();
                    document.getElementById("course-details").innerHTML = '';
                } else {
                    console.log("Hiba történt a kurzus törlésekor");
                }
            })
        }
    }
    catch(error){console.log("Hiba történt: " + error)};
}
fetchCourses();
