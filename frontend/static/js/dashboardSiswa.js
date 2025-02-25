const token = localStorage.getItem("access_token");
console.log("Token:", token);

// ============================= Get siswa ====================
async function fetchDashboard() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    if (!token) {
        console.error("Token tidak ditemukan!");
        window.location.href = "/login";
        return;
    }

    document.getElementById("welcome-user").innerText = `Welcome, ${username}`;
    document.querySelectorAll(".user").forEach(el => el.innerText = username);
    document.querySelectorAll(".role").forEach(el => el.innerText = role);
    document.querySelectorAll(".email").forEach(el => el.innerText = email);

    const response = await fetch("http://127.0.0.1:5000/siswa/dashboard", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        credentials: "include"
    });

    console.log(response)

    if (response.ok) {
        const data = await response.json();
        console.log("Dashboard Data:", data);
    } else {
        console.error("Gagal mengambil data dashboard!");
        localStorage.removeItem("access_token");
        window.location.href = "/login";
    }
}

fetchDashboard();


function showAlert(message, type) {
    const alertContainer = document.getElementById("alertContainer");
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} alert-dismissible fade show shadow`;
    alert.innerHTML = `
       ${message}
       <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.classList.remove("show");
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}


// ====================== simpan data siswa ===========================
async function createSiswa() {
    const nama = document.getElementById("nama").value;
    const nisn = document.getElementById("nisn").value;
    const jenis_kelamin = document.getElementById("jenis_kelamin").value;
    const alamat_sekolah = document.getElementById("alamat_sekolah").value;

    if (!nama || !nisn || !jenis_kelamin || !alamat_sekolah) {
        showAlert("Harap isi semua field!", "danger");
        return;
    }

    const response = await fetch("http://127.0.0.1:5000/siswa/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ nama, nisn, jenis_kelamin, alamat_sekolah })
    });

    const data = await response.json();

    if (response.ok) {
        showAlert("Data siswa berhasil ditambahkan!", "success");
        setTimeout(() => {
            window.location.reload();
        }, 2000);
    } else {
        showAlert( `${data.message}`, "danger");
    }
}

document.getElementById("confirmSaveBtn").addEventListener("click", function () {
    createSiswa();
    const modal = bootstrap.Modal.getInstance(document.getElementById("confirmSaveModal"));
    modal.hide();
});


function logout() {
    localStorage.clear();
    window.location.href = "/login";
 }
 
 document.getElementById("logoutBtn").addEventListener("click", logout);


