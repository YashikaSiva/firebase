
import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    collection,
    addDoc,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Common message function
function showMessage(text) {
    const message = document.getElementById("message");
    if (message) message.textContent = text;
}

// AUTHENTICATION PAGE
const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");

if (registerBtn) {
    registerBtn.onclick = async () => {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.location.replace("home.html");
        } catch (error) {
            showMessage(error.message);
        }
    };
}

if (loginBtn) {
    loginBtn.onclick = async () => {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.replace("home.html");
        } catch (error) {
            showMessage(error.message);
        }
    };
}

// CURRENT PAGE
const isHomePage = document.getElementById("applicationList") !== null;

let currentUser = null;
let editId = null;

// Check authentication and protect the pages
onAuthStateChanged(auth, user => {
    currentUser = user;

    if (isHomePage && !user) {
        window.location.replace("index.html");
        return;
    }

    if (!isHomePage && user) {
        window.location.replace("home.html");
        return;
    }

    if (isHomePage && user) {
        document.getElementById("welcome").textContent =
            "Welcome, " + user.email;

        readApplications();
    }
});

// LOGOUT
const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.onclick = async () => {
        try {
            await signOut(auth);
            window.location.replace("index.html");
        } catch (error) {
            showMessage(error.message);
        }
    };
}

// CREATE AND UPDATE
const saveBtn = document.getElementById("saveBtn");

if (saveBtn) {
    saveBtn.onclick = async () => {
        if (!currentUser) {
            showMessage("Please login first!");
            return;
        }

        const name = document.getElementById("name").value.trim();
        const job = document.getElementById("job").value.trim();
        const qualification =
            document.getElementById("qualification").value.trim();

        if (!name || !job || !qualification) {
            showMessage("Please fill all fields!");
            return;
        }

        const data = {
            name: name,
            job: job,
            qualification: qualification,
            userId: currentUser.uid
        };

        try {
            if (editId === null) {
                // CREATE
                await addDoc(collection(db, "applications"), data);
                showMessage("Application added successfully!");
            } else {
                // UPDATE
                await updateDoc(doc(db, "applications", editId), {
                    name: name,
                    job: job,
                    qualification: qualification
                });
                showMessage("Application updated successfully!");
            }

            clearForm();
            await readApplications();

        } catch (error) {
            showMessage(error.message);
        }
    };
}

// READ
async function readApplications() {
    if (!currentUser || !isHomePage) return;

    try {
        const q = query(
            collection(db, "applications"),
            where("userId", "==", currentUser.uid)
        );

        const snapshot = await getDocs(q);
        const list = document.getElementById("applicationList");

        list.replaceChildren();

        snapshot.forEach(item => {
            const data = item.data();
            const row = document.createElement("tr");

            [data.name, data.job, data.qualification].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value || "";
                row.appendChild(cell);
            });

            const actions = document.createElement("td");

            // EDIT BUTTON
            const editButton = document.createElement("button");
            editButton.textContent = "Edit";

            editButton.onclick = () => {
                editId = item.id;

                document.getElementById("name").value = data.name;
                document.getElementById("job").value = data.job;
                document.getElementById("qualification").value =
                    data.qualification;

                showMessage("Edit details and click Save Application.");
            };

            // DELETE BUTTON
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";

            deleteButton.onclick = async () => {
                if (!confirm("Delete this application?")) return;

                try {
                    await deleteDoc(doc(db, "applications", item.id));
                    showMessage("Application deleted!");
                    await readApplications();
                } catch (error) {
                    showMessage(error.message);
                }
            };

            actions.append(editButton, deleteButton);
            row.appendChild(actions);
            list.appendChild(row);
        });

    } catch (error) {
        showMessage(error.message);
    }
}

// CLEAR FORM
function clearForm() {
    editId = null;

    document.getElementById("name").value = "";
    document.getElementById("job").value = "";
    document.getElementById("qualification").value = "";
}

const clearBtn = document.getElementById("clearBtn");

if (clearBtn) {
    clearBtn.onclick = clearForm;
}
