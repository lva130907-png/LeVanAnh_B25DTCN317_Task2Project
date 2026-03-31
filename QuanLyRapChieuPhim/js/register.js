const fullnameInput = document.querySelector("#fullname-input");
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const confirmPasswordInput = document.querySelector("#confirm-password-input");
const togglePasswordButtons = document.querySelectorAll(".toggle-password-btn");
const termsCheckbox = document.querySelector("#terms-checkbox");
const registerButton = document.querySelector(".btn-login-2");
const toastContainer = document.getElementById('toast-container');

//Dữ liệu mẫu
if (!localStorage.getItem('users')) {
    const defaultUsers = [
        {
            id: 1,
            fullName: "Admin Chính",
            email: "LQTuan@rikkei.edu.vn",
            password: "Admin123456",
            role: "admin",
            createdAt: "2026-03-03T12:26:21.617Z",
            isActive: true
        },
        {
            id: 2,
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            password: "MatKhau123",
            role: "user",
            createdAt: "2026-03-01T12:26:21.617Z",
            isActive: true
        },
        {
            id: 3,
            fullName: "Trần Thị B",
            email: "tranthib@example.com",
            password: "12345678",
            role: "user",
            createdAt: "2026-03-03T12:26:21.617Z",
            isActive: false
        }
    ];
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// Hiển thị thông báo bên phải màn hình ( thành công / lỗi )
const showNotification = (type, title, message) => {
    const notification = document.createElement('div');
    notification.className = `toast ${type}`;

    const icon = type === 'success' ? '✅' : '❌';
    notification.innerHTML = `
        <div style="font-size: 20px;">${icon}</div>
        <div class="toast-content">
            <span class="toast-title">${title}</span>
            <span class="toast-msg">${message}</span>
        </div>
    `;

    if (toastContainer.children.length >= 6) {
        toastContainer.removeChild(toastContainer.firstChild);
    }

    toastContainer.appendChild(notification);

    setTimeout(() => {
        notification.style.transform = "translateX(0)";
        notification.style.opacity = "1";
    }, 100);

    setTimeout(() => {
        notification.style.transform = "translateX(120%)";
        notification.style.opacity = "0";

        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 3000);
};

// Hiển thị mật khẩu khi click vào
togglePasswordButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const passwordField = index === 0 ? passwordInput : confirmPasswordInput;
        
        if (passwordField.type === 'password') {
            passwordField.type = 'text';
            button.style.opacity = '1';
        } else {
            passwordField.type = 'password';
            button.style.opacity = '0.7';
        }
    });
});

// Kiểm tra email
const isValidEmail = (email) => {
    if (email === "") {
        return { valid: false, message: "Vui lòng nhập email!" };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, message: "Email không hợp lệ!" };
    }
    
    return { valid: true };
};

// Kiểm tra mật khẩu
const isValidPassword = (password) => {
    if (password === "") {
        return { valid: false, message: "Vui lòng nhập mật khẩu!" };
    }
    
    if (password.length < 8) {
        return { valid: false, message: "Mật khẩu phải có ít nhất 8 ký tự!" };
    }
    
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
        return { valid: false, message: "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số!" };
    }
    
    return { valid: true };
};

// Check email đã tồn tại
const isEmailExists = (email) => {
    const users = JSON.parse(localStorage.getItem('users'));
    
    for (let i = 0; i < users.length; i++) {
        if (users[i].email === email) {
            return true;
        }
    }
    
    return false;
};

// Hàm lấy ngày giờ hiện tại
const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const hour = today.getHours();
    const minute = today.getMinutes();
    const second = today.getSeconds();
    
    return year + "-" + month + "-" + day + "T" + hour + ":" + minute + ":" + second + ".000Z";
};

// HÀM VALIDATE ĐĂNG KÝ
const handleRegister = () => {
    const fullName = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();

    if (fullName === "") {
        showNotification("error", "Lỗi", "Vui lòng nhập họ và tên!");
        return false;
    }

    const emailValidation = isValidEmail(email);
    if (!emailValidation.valid) {
        showNotification("error", "Lỗi", emailValidation.message);
        return false;
    }

    if (isEmailExists(email)) {
        showNotification("error", "Lỗi", "Email này đã được đăng ký!");
        return false;
    }

    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
        showNotification("error", "Lỗi", passwordValidation.message);
        return false;
    }

    if (confirmPassword === "") {
        showNotification("error", "Lỗi", "Vui lòng xác nhận mật khẩu!");
        return false;
    }

    if (password !== confirmPassword) {
        showNotification("error", "Lỗi", "Mật khẩu xác nhận không trùng khớp!");
        return false;
    }

    if (!termsCheckbox.checked) {
        showNotification("error", "Lỗi", "Vui lòng đồng ý với điều khoản!");
        return false;
    }

    //Đăng ký thành công thì...
    const users = JSON.parse(localStorage.getItem('users'));
    
    // Tìm id max
    let maxId = 0;
    for (let i = 0; i < users.length; i++) {
        if (users[i].id > maxId) {
            maxId = users[i].id;
        }
    }
    
    // Lấy ngày giờ hiện tại
    const currentDate = getCurrentDate();
    
    // Tạo user mới
    const newUser = {
        id: maxId + 1,
        fullName: fullName,
        email: email,
        password: password,
        role: "user",
        createdAt: currentDate,
        isActive: true
    };

    // Lưu user mới
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showNotification("success", "Thành công", "Đang chuyển hướng...");
    setTimeout(() => {
        window.location.href = "./login.html";
    }, 1500);
    
    return true;
};

// Sự kiện click nút đăng nhập
registerButton.addEventListener('click', (event) => {
    event.preventDefault();
    handleRegister();
});
