 function validateAccountForm() {
        const firstname = document.getElementById('firstname').value.trim();
        const lastname = document.getElementById('lastname').value.trim();
        const email = document.getElementById('email').value.trim();
        let errors = [];
        
        if (!firstname) {
            errors.push('First name is required');
        }
        
        if (!lastname) {
            errors.push('Last name is required');
        }
        
        if (!email) {
            errors.push('Email is required');
        } else if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errors.push('Please enter a valid email address');
        }
        
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return false;
        }
        return true;
    }
    
    function validatePasswordForm() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;
        let errors = [];
        
        if (!password) {
            errors.push('Password is required');
        } else if (password.length < 12) {
            errors.push('Password must be at least 12 characters long');
        } else if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least 1 uppercase letter');
        } else if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least 1 lowercase letter');
        } else if (!/[0-9]/.test(password)) {
            errors.push('Password must contain at least 1 number');
        } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least 1 special character');
        }
        
        if (password !== confirmPassword) {
            errors.push('Passwords do not match');
        }
        
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return false;
        }
        return true;
    }