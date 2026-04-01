const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const btnLogin2 = document.querySelector(".btn-login-2");
const container = document.getElementById("toast-container");

// Hàm hiển thị thông báo
const showToast = (type, title, message) => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? '✅' : '❌';
    toast.innerHTML = `
        <div style="font-size: 20px;">${icon}</div>
        <div class="toast-content">
            <span class="toast-title">${title}</span>
            <span class="toast-msg">${message}</span>
        </div>
    `;

    if (container.children.length >= 6) {
        container.removeChild(container.firstChild);
    }
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.transform = "translateX(0)";
        toast.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        toast.style.transform = "translateX(120%)";
        toast.style.opacity = "0";

        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 3000);
};

// Hàm kiểm tra email hợp lệ
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Hàm kiểm tra mật khẩu hợp lệ
const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
};

// Hàm validate dữ liệu đăng nhập
const validateLogin = () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (email === "") {
        showToast("error", "Lỗi", "Vui lòng nhập email!");
        return false;
    }

    if (!isValidEmail(email)) {
        showToast("error", "Lỗi", "Email không hợp lệ, vui lòng kiểm tra lại!");
        return false;
    }

    if (password === "") {
        showToast("error", "Lỗi", "Vui lòng nhập mật khẩu!");
        return false;
    }

    if (password.length < 8) {
        showToast("error", "Lỗi", "Mật khẩu phải có ít nhất 8 ký tự!");
        return false;
    }

    if (!isValidPassword(password)) {
        showToast("error", "Lỗi", "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số!");
        return false;
    }

    const users = JSON.parse(localStorage.getItem('users'));
    let foundUser = null;

    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email && users[i].password === password) {
            foundUser = users[i];
            break;
        }
    }

    if (foundUser) {
        showToast("success", "Thành công", "Đang chuyển hướng...");
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
        return true;
    } else {
        showToast("error", "Lỗi", "Tài khoản hoặc mật khẩu không chính xác!");
        return false;
    }
};

// Sự kiện khi bấm nút Đăng nhập
btnLogin2.addEventListener('click', (e) => {
    e.preventDefault();
    validateLogin();
});
