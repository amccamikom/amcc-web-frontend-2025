// Seleksi Semua Elemen DOM dari 3 Halaman Berbeda
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const todoForm = document.getElementById("todo-form");
const taskListContainer = document.getElementById("task-list");
const loadingText = document.getElementById("loading");
const errorBox = document.getElementById("error-message");
const successBox = document.getElementById("success-message");
const btnLogout = document.getElementById("btn-logout");

// Fungsi pembantu: Mengambil token JWT yang tersimpan di browser
const getToken = () => localStorage.getItem("amcc_token");

/**
 * ==========================================
 * ALUR PROSES 1: PENDAFTARAN AKUN (REGISTER)
 * ==========================================
 */
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("reg-name").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const btnReg = document.getElementById("btn-register");

        btnReg.innerText = "Mendaftarkan...";
        btnReg.disabled = true;
        errorBox.classList.add("hidden");
        successBox.classList.add("hidden");

        try {
            const response = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || `Gagal Register (Status: ${response.status})`);
            }

            successBox.innerText = "🎉 Pendaftaran sukses! Mengalihkan ke login dalam 2 detik...";
            successBox.classList.remove("hidden");
            registerForm.reset();

            setTimeout(() => { window.location.href = "index.html"; }, 2000);

        } catch (error) {
            errorBox.innerText = error.message;
            errorBox.classList.remove("hidden");
        } finally {
            btnReg.innerText = "Daftar Akun";
            btnReg.disabled = false;
        }
    });
}

/**
 * ==========================================
 * ALUR PROSES 2: AUTENTIKASI MASUK (LOGIN)
 * ==========================================
 */
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const btnLog = document.getElementById("btn-login");

        btnLog.innerText = "Mengecek Kredensial...";
        btnLog.disabled = true;
        errorBox.classList.add("hidden");

        try {
            const response = await fetch(`${BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Email atau password salah!");
            }

            // SIMPAN TOKEN KE LOCALSTORAGE (Sesuai struktur respons data dari API Swagger)
            // Catatan: Jika token berada langsung di result.token atau result.data.token, sesuaikan jalurnya.
            const token = result.token || (result.data && result.data.token);
            if (!token) throw new Error("Token tidak dikirim oleh server!");

            localStorage.setItem("amcc_token", token);
            
            // Alihkan paksa mahasiswa masuk ke ruang dashboard utama
            window.location.href = "dashboard.html";

        } catch (error) {
            errorBox.innerText = `🚨 Login Gagal: ${error.message}`;
            errorBox.classList.remove("hidden");
        } finally {
            btnLog.innerText = "Masuk";
            btnLog.disabled = false;
        }
    });
}

/**
 * ==========================================
 * ALUR PROSES 3: MANAJEMEN DATA AMAN (CRUD TASKS)
 * ==========================================
 */
if (window.location.pathname.includes("dashboard.html")) {
    // PROTEKSI HALAMAN: Jika tidak ada token, tendang kembali ke login
    if (!getToken()) {
        window.location.href = "index.html";
    }

    // Aksi Tombol Keluar (Logout)
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("amcc_token"); // Hapus token dari memori browser
            window.location.href = "index.html";
        });
    }

    // Fungsi Mengambil Data Tugas yang Terkunci Token (GET) 
    async function getTasks() {
        loadingText.classList.remove("hidden");
        taskListContainer.innerHTML = "";
        errorBox.classList.add("hidden");

        try {
            
            
        } catch (error) {
            errorBox.innerText = `🚨 Error: ${error.message}`;
            errorBox.classList.remove("hidden");
        } finally {
            loadingText.classList.add("hidden");
        }
    }

    // Fungsi Render Tampilan Kartu Tugas
    function renderTasks(tasks) {
        if (!tasks || tasks.length === 0) {
            taskListContainer.innerHTML = `<div class="text-center py-10 text-slate-400 text-sm bg-white rounded-2xl border border-dashed border-slate-200">Belum ada catatan tugas tersedia.</div>`;
            return;
        }

        tasks.forEach(task => {
            const card = document.createElement("div");
            card.className = "bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center hover:border-indigo-100 transition duration-300";
            const badgeStyle = task.is_completed ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100";
            const statusText = task.is_completed ? "Selesai" : "Pending";

            card.innerHTML = `
                <div class="flex-1 pr-4">
                    <h3 class="font-semibold text-slate-800 text-base leading-snug">${task.name || 'Tanpa Judul'}</h3>
                </div>
                <div class="flex-shrink-0">
                    <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}">${statusText}</span>
                </div>
            `;
            taskListContainer.appendChild(card);
        });
    }

    // Fungsi Menambahkan Data Tugas Baru (POST) dengan Menyertakan Token
    todoForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const taskTitleInput = document.getElementById("task-title").value;
        const btnSubmit = document.getElementById("btn-submit");

        btnSubmit.innerText = "Menyimpan...";
        btnSubmit.disabled = true;
        errorBox.classList.add("hidden");

        try {
            const response = await fetch(`${BASE_URL}/tasks`, {
                method: "POST",
                headers: {
                    // WAJIB SERTAKAN TOKEN LAGI SETIAP KALI MENGIRIM / MODIFIKASI DATA
                    "Authorization": `Bearer ${getToken()}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: taskTitleInput })
            });

            if (!response.ok) throw new Error(`Gagal menyimpan catatan. Status: ${response.status}`);

            todoForm.reset();
            await getTasks(); // Ambil data segar terbaru

        } catch (error) {
            errorBox.innerText = `🚨 Gagal Menyimpan: ${error.message}`;
            errorBox.classList.remove("hidden");
        } finally {
            btnSubmit.innerText = "Tambah Catatan";
            btnSubmit.disabled = false;
        }
    });

    // Inisialisasi awal saat dashboard terbuka
    getTasks();
}