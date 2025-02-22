let siswaIdToDelete = null;

function showDeleteModal(siswaId) {
   siswaIdToDelete = siswaId;
   const modal = new bootstrap.Modal(document.getElementById("confirmDeleteModal"));
   modal.show();
}

function editSiswa(siswaId) {
   if (!siswaId) {
      console.error("ID siswa tidak valid!");
      return;
   }
   window.location.href = `/admin/dashboard/edit?siswa_id=${siswaId}`;
}


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

   try {
      const response = await fetch("http://127.0.0.1:5000/admin/siswa", {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         }
      });

      if (!response.ok) {
         throw new Error("Gagal mengambil data dashboard atau siswa!");
      }

      const data = await response.json();
      console.log("Data Siswa & Dashboard:", data.data);

      if (data.status === "success" && Array.isArray(data.data)) {
         renderTable(data.data);
      } else {
         console.error("Data tidak valid:", data.message);
      }
   } catch (error) {
      console.error(error.message);
      localStorage.removeItem("access_token");
      window.location.href = "/login";
   }
}


// ============================================Event listener untuk tombol hapus di modal==================
document.getElementById("confirmDeleteBtn").addEventListener("click", async function () {
   if (!siswaIdToDelete) return;

   const token = localStorage.getItem("access_token");
   if (!token) {
      showAlert("Anda harus login terlebih dahulu!", "danger");
      window.location.href = "/login";
      return;
   }

   try {
      const response = await fetch(`http://127.0.0.1:5000/admin/siswa/${siswaIdToDelete}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
         }
      });

      const data = await response.json();
      if (response.ok) {
         showAlert(data.message, "success");
         fetchDashboard();
      } else {
         showAlert(`Gagal menghapus siswa: ${data.message}`, "danger");
      }
   } catch (error) {
      console.error("Error:", error);
      showAlert("Terjadi kesalahan saat menghapus siswa.", "danger");
   }

   siswaIdToDelete = null;
   const modal = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
   modal.hide();
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


function renderTable(siswaList) {
   const tbody = document.querySelector("#table-body");
   if (!tbody) {
      console.error("Elemen <tbody> tidak ditemukan di HTML!");
      return;
   }

   if (siswaList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center">Data Kosong</td></tr>`;
      return;
   }

   tbody.innerHTML = "";

   siswaList.forEach((siswa, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
         <td>${index + 1}</td>
         <td>${siswa.nama}</td>
         <td>${siswa.nisn}</td>
         <td>${siswa.jenis_kelamin}</td>
         <td>${siswa.alamat_sekolah}</td>
         <td>${siswa.jurusan || "-"}</td>
         <td>${siswa.hasil || "-"}</td>
         <td>
            <button class="btn btn-primary btn-sm" onclick="editSiswa(${siswa.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="showDeleteModal(${siswa.id})">Hapus</button>
         </td>
      `;
      tbody.appendChild(row);
   });

   console.log("Tabel berhasil diperbarui!");
}

document.addEventListener("DOMContentLoaded", fetchDashboard);


//  ================================= edit data siswa ==========================
document.addEventListener("DOMContentLoaded", async function () {
   const urlParams = new URLSearchParams(window.location.search);
   const siswaId = urlParams.get("siswa_id");
   const token = localStorage.getItem("access_token");
   await fetchDashboard();

   if (siswaId) {
      try {
         const response = await fetch(`/admin/siswa/${siswaId}`, {
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`
            }
         });
         const data = await response.json();


         if (response.ok) {
            document.getElementById("nama").value = data.data.nama;
            document.getElementById("nisn").value = data.data.nisn;
            document.getElementById("jenis_kelamin").value = data.data.jenis_kelamin;
            document.getElementById("alamat_sekolah").value = data.data.alamat_sekolah;
         } else {
            console.error("Gagal mengambil data siswa");
         }
      } catch (error) {
         console.error("Error fetching data:", error);
      }
   }
});



document.getElementById("editSiswaForm").addEventListener("submit", function (event) {
   event.preventDefault();


   const siswaId = new URLSearchParams(window.location.search).get("siswa_id");
   const formData = {
      nama: document.getElementById("nama").value,
      nisn: document.getElementById("nisn").value,
      jenis_kelamin: document.getElementById("jenis_kelamin").value,
      alamat_sekolah: document.getElementById("alamat_sekolah").value
   };


   $("#confirmEditModal").modal("show");


   document.getElementById("confirmEditBtn").addEventListener("click", async function () {
      const token = localStorage.getItem("access_token");
      try {
         const response = await fetch(`/admin/siswa/${siswaId}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
         });

         const result = await response.json();
         if (response.ok) {
            
            window.location.href = "/admin/dashboard"; 
            
         } else {
            alert("Gagal memperbarui data: " + result.message);
         }
      } catch (error) {
         console.error("Error:", error);
      }
   });
});
// ================================= end edit data siswa ========================


function logout() {
   localStorage.clear();
   window.location.href = "/login";
}

document.getElementById("logoutBtn").addEventListener("click", logout);
