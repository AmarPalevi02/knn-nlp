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

// ======================= get siswa al by user ===================================
// document.addEventListener("DOMContentLoaded", function () {
//     const token = localStorage.getItem("access_token");
//     const selectElement = document.getElementById("siswa-id-select");
//     fetch("http://localhost:5000/siswa/getall", {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             if (data.status === "success") {
//                 data.data.forEach(siswa => {
//                     let option = document.createElement("option");
//                     option.value = siswa.id;
//                     option.textContent = `${siswa.nama} - ${siswa.nisn}`;
//                     selectElement.appendChild(option);
//                 });
//             } else {
//                 console.error("Gagal mengambil data siswa:", data.message);
//             }
//         })
//         .catch(error => console.error("Error:", error));
// });

document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("access_token");
    const selectElement = document.getElementById("siswa-id-select");
    const form = document.getElementById("createJurusan");
    const confirmSaveBtn = document.getElementById("confirmSaveBtn");

    // Ambil data siswa untuk mengisi dropdown
    fetch("http://localhost:5000/siswa/getall", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                selectElement.innerHTML = `<option value="" disabled selected>Pilih siswa</option>`;
                data.data.forEach(siswa => {
                    let option = document.createElement("option");
                    option.value = siswa.id;
                    option.textContent = `${siswa.nama} - ${siswa.nisn}`;
                    selectElement.appendChild(option);
                });
            } else {
                console.error("Gagal mengambil data siswa:", data.message);
            }
        })
        .catch(error => console.error("Error:", error));

    // Tangani klik tombol konfirmasi simpan
    confirmSaveBtn.addEventListener("click", function () {
        const siswa_id = selectElement.value;
        const jurusan = document.getElementById("jurusan").value;
        const deskripsi_bakat = document.getElementById("bakat").value;

        fetch("http://localhost:5000/siswa/jurusan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                siswa_id: siswa_id,
                jurusan: jurusan,
                deskripsi_bakat: deskripsi_bakat
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    showAlert("Jurusan berhasil ditambahkan!", "success");
                    form.reset();
                    setTimeout(() => {
                        location.reload();
                    }, 1500);
                } else {
                    showAlert("Gagal menambahkan jurusan: " + data.message, "danger");
                }
            })
            .catch(error => {
                showAlert("Terjadi kesalahan saat menyimpan data.", "danger");
                console.error("Error:", error);
            });

        // Tutup modal setelah klik simpan
        let confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmSaveModal'));
        confirmModal.hide();
    });

    // Fungsi untuk menampilkan alert Bootstrap
    function showAlert(message, type) {
        const alertContainer = document.getElementById("alertContainer");
        const alertDiv = document.createElement("div");
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertContainer.appendChild(alertDiv);

        // Hapus alert setelah 3 detik
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
});






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
        showAlert(`${data.message}`, "danger");
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


