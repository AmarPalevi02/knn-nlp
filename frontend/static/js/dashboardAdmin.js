const token = localStorage.getItem("access_token");
console.log("Token:", token);


async function fetchDashboard() {
   const token = localStorage.getItem("access_token");
   const username = localStorage.getItem("username")
   const role = localStorage.getItem("role")
   const email = localStorage.getItem("email")

   if (!token) {
      console.error("Token tidak ditemukan!");
      window.location.href = "/login";
      return;
   }

   document.getElementById("welcome-user").innerText = `Welcome, ${username}`;
   document.querySelectorAll(".user").forEach(el => el.innerText = username);
   document.querySelectorAll(".role").forEach(el => el.innerText = role);
   document.querySelectorAll(".email").forEach(el => el.innerText = email);

   const response = await fetch("http://127.0.0.1:5000/admin/dashboard", {
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

function logout() {
   localStorage.removeItem("access_token");
   localStorage.removeItem("role");
   localStorage.removeItem("email");
   localStorage.removeItem("username");
   window.location.href = "/login";
}

document.getElementById("logoutBtn").addEventListener("click", logout);


