const token = localStorage.getItem("access_token");
console.log("Token:", token);

// ================================= Fetch data hasil prediksi siswa ===============
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const siswaId = urlParams.get("siswa_id");

    if (!siswaId) {
        document.getElementById("hasilContainer").innerHTML = "<p>Data siswa tidak ditemukan.</p>";
        return;
    }

    // Simpan siswa_id terakhir ke localStorage
    localStorage.setItem("last_siswa_id", siswaId);

    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:5000/siswa/hasil/${siswaId}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                document.getElementById("namaSiswa").textContent = data.nama_siswa;
                document.getElementById("nisnSiswa").textContent = data.nisn;
                document.getElementById("jenisKelamin").textContent = data.jenis_kelamin;
                document.getElementById("deskripsiBakat").textContent = data.deskripsi_bakat;
                document.getElementById("jurusanUtama").textContent = data.jurusan_utama;

                const tabelRekomendasi = document.getElementById("tabelRekomendasi");
                data.rekomendasi
                    .forEach(item => {
                        const row = document.createElement("tr");
                        row.innerHTML = `
                        <td>${item.jurusan}</td>
                        <td>${item.skor}</td>
                    `;
                        tabelRekomendasi.appendChild(row);
                    });
            } else {
                document.getElementById("hasilContainer").innerHTML = "<p>Gagal memuat hasil rekomendasi.</p>";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("hasilContainer").innerHTML = "<p>Terjadi kesalahan saat mengambil data.</p>";
        });
});


// =========================== print hasil rekomendasi ===================
async function generatePDF() {
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });

    const margin = 20;
    let y = margin;
    const labelX = margin;
    const colonX = 60; // Jarak horizontal untuk isi setelah titik dua

    // Ambil data dari DOM
    const nama = document.getElementById("namaSiswa").textContent;
    const nisn = document.getElementById("nisnSiswa").textContent;
    const jenisKelamin = document.getElementById("jenisKelamin").textContent;
    const deskripsiBakat = document.getElementById("deskripsiBakat").textContent;
    const jurusanUtama = document.getElementById("jurusanUtama").textContent;

    const rekomendasi = [];
    document.querySelectorAll("#tabelRekomendasi tr").forEach(row => {
        const cols = row.querySelectorAll("td");
        if (cols.length === 2) {
            rekomendasi.push([cols[0].textContent, `${cols[1].textContent}%`]);
        }
    });

    // Judul
    pdf.setFont("times", "bold");
    pdf.setFontSize(16);
    pdf.text("Laporan Hasil Rekomendasi Jurusan SMK Senopati", pdf.internal.pageSize.getWidth() / 2, y, { align: "center" });
    y += 15;

    // Data Siswa
    pdf.setFontSize(12);

    pdf.setFont("times", "bold");
    pdf.text("Nama", labelX, y);
    pdf.setFont("times", "normal");
    pdf.text(`: ${nama}`, colonX, y);
    y += 7;

    pdf.setFont("times", "bold");
    pdf.text("NISN", labelX, y);
    pdf.setFont("times", "normal");
    pdf.text(`: ${nisn}`, colonX, y);
    y += 7;

    pdf.setFont("times", "bold");
    pdf.text("Jenis Kelamin", labelX, y);
    pdf.setFont("times", "normal");
    pdf.text(`: ${jenisKelamin}`, colonX, y);
    y += 7;

    pdf.setFont("times", "bold");
    pdf.text("Jurusan Utama", labelX, y);
    pdf.setFont("times", "normal");
    pdf.text(`: ${jurusanUtama}`, colonX, y);
    y += 10;

    // Deskripsi Bakat
    pdf.setFont("times", "bold");
    pdf.text("Deskripsi Bakat:", labelX, y);
    y += 7;
    pdf.setFont("times", "normal");
    const splitDeskripsi = pdf.splitTextToSize(deskripsiBakat, 170);
    pdf.text(splitDeskripsi, labelX, y);
    y += splitDeskripsi.length * 6 + 5;

    // Tabel Rekomendasi Jurusan
    pdf.setFont("times", "bold");
    pdf.text("Top 5 Rekomendasi Jurusan:", labelX, y);
    y += 5;

    pdf.autoTable({
        startY: y + 5,
        head: [["Jurusan", "Skor"]],
        body: rekomendasi,
        styles: {
            font: "times",
            fontSize: 11,
            halign: 'left',
            cellPadding: 3,
        },
        theme: 'grid',
        headStyles: {
            fillColor: [200, 200, 200],
            textColor: 0,
            halign: 'center'
        },
        margin: { left: margin, right: margin },
    });

    // Footer
    pdf.setFont("times", "normal");
    pdf.setFontSize(10);
    pdf.text("Sistem Rekomendasi Jurusan SMK Senopati", margin, 287);
    pdf.text("Halaman 1", pdf.internal.pageSize.getWidth() - margin, 287, { align: "right" });

    // Simpan PDF
    pdf.save("laporan_rekomendasi_jurusan.pdf");
}






// ============================= Get siswa ====================
async function fetchDashboard() {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");

    if (!token) {
        console.error("Token tidak ditemukan!");
        window.location.href = "/";
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
        window.location.href = "/";
    }
}

fetchDashboard();


// =================== history siswa ==============================
document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("access_token");

    fetch(`http://127.0.0.1:5000/siswa/my-bakat-history`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.status === "success") {
                const historyContainer = document.getElementById("historyContainer");
                data.data.forEach(item => {
                    const card = document.createElement("div");
                    card.className = "card";
                    card.innerHTML = `
                        <h3>${item.nama_siswa}</h3>
                        <p><strong>NISN:</strong> ${item.nisn}</p>
                        <p><strong>Deskripsi Bakat:</strong> ${item.deskripsi_bakat}</p>
                        <p><strong>Jurusan Utama:</strong> ${item.jurusan_utama}</p>
                        <h4>Rekomendasi:</h4>
                        <ul>
                            ${item.rekomendasi.map(rec => `<li>${rec.jurusan} (Skor: ${rec.skor})</li>`).join('')}
                        </ul>
                    `;
                    historyContainer.appendChild(card);
                });
            } else {
                document.getElementById("historyContainer").innerHTML = "<p>Gagal memuat riwayat bakat siswa.</p>";
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("historyContainer").innerHTML = "<p>Terjadi kesalahan saat mengambil data.</p>";
        });
});







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


    confirmSaveBtn.addEventListener("click", function () {
        const siswa_id = selectElement.value;
        const deskripsi_bakat = document.getElementById("bakat").value;

        // Tutup modal konfirmasi
        const confirmModal = bootstrap.Modal.getInstance(document.getElementById('confirmSaveModal'));
        confirmModal.hide();

        // Tampilkan modal loading
        const loadingModal = new bootstrap.Modal(document.getElementById('loadingModal'));
        loadingModal.show();

        // Kirim POST request
        fetch("http://localhost:5000/siswa/jurusan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                siswa_id: siswa_id,
                deskripsi_bakat: deskripsi_bakat
            })
        })
            .then(response => response.json())
            .then(data => {
                loadingModal.hide();

                if (data.status === "success") {
                    // Simpan data ke localStorage (opsional)
                    localStorage.setItem("hasil_rekomendasi", JSON.stringify({
                        nama: data.nama_siswa,
                        jurusan: data.jurusan
                    }));
                    
                    // // Simpan siswa_id terakhir
                    localStorage.setItem("last_siswa_id", data.siswa);
                    // Arahkan ke halaman hasil
                    window.location.href = `/dashboard/hasil?siswa_id=${data.siswa}`;
                } else {
                    showAlert("Gagal menambahkan jurusan: " + data.message, "danger");
                }
            })
            .catch(error => {
                loadingModal.hide();
                showAlert("Terjadi kesalahan saat menyimpan data.", "danger");
                console.error("Error:", error);
            });
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
    window.location.href = "/";
}

document.getElementById("logoutBtn").addEventListener("click", logout);


