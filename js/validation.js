/**
 * Client-Side Form Validation (Task 2 & 4)
 * Validates registration form fields before submission
 */

(function () {
  'use strict';

  const MAX_NAME_LENGTH = 100;

  /**
   * Validate email format using regex
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Show validation error on a field
   */
  function showError(input, message) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');

    let feedback = input.parentElement.querySelector('.invalid-feedback');
    if (!feedback) {
      feedback = document.createElement('div');
      feedback.className = 'invalid-feedback';
      input.parentElement.appendChild(feedback);
    }
    feedback.textContent = message;
  }

  /**
   * Clear validation error from a field
   */
  function clearError(input) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    const feedback = input.parentElement.querySelector('.invalid-feedback');
    if (feedback) feedback.textContent = '';
  }

  /**
   * Validate full name - cannot be empty
   */
  function validateName(input) {
    const value = input.value.trim();
    if (value === '') {
      showError(input, 'Full name cannot be empty.');
      return false;
    }
    if (value.length > MAX_NAME_LENGTH) {
      showError(input, `Name must be ${MAX_NAME_LENGTH} characters or fewer.`);
      return false;
    }
    clearError(input);
    return true;
  }

  /**
   * Validate email - must be valid format
   */
  function validateEmail(input) {
    const value = input.value.trim();
    if (value === '') {
      showError(input, 'Email is required.');
      return false;
    }
    if (!isValidEmail(value)) {
      showError(input, 'Please enter a valid email address.');
      return false;
    }
    clearError(input);
    return true;
  }

  /**
   * Validate age - must be above 18
   */
  function validateAge(input) {
    const value = parseInt(input.value, 10);
    if (isNaN(value)) {
      showError(input, 'Age is required.');
      return false;
    }
    if (value <= 18) {
      showError(input, 'Age must be above 18.');
      return false;
    }
    clearError(input);
    return true;
  }

  /**
   * Validate gender selection
   */
  function validateGender(input) {
    if (!input.value) {
      showError(input, 'Please select a gender.');
      return false;
    }
    clearError(input);
    return true;
  }

  /**
   * Validate course - cannot be empty
   */
  function validateCourse(input) {
    if (input.value.trim() === '') {
      showError(input, 'Course is required.');
      return false;
    }
    clearError(input);
    return true;
  }

  /**
   * Validate password - minimum 8 characters
   */
  function validatePassword(input) {
    const value = input.value;
    if (value.length < 8) {
      showError(input, 'Password must be at least 8 characters.');
      return false;
    }
    clearError(input);
    return true;
  }

  /**
   * Calculate password strength (Task 4)
   * Returns: { level, label, className }
   */
  function getPasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (password.length === 0) return { level: 0, label: '', className: '' };
    if (score <= 1) return { level: 1, label: 'Weak', className: 'weak' };
    if (score <= 2) return { level: 2, label: 'Fair', className: 'fair' };
    if (score <= 3) return { level: 3, label: 'Good', className: 'good' };
    return { level: 4, label: 'Strong', className: 'strong' };
  }

  /**
   * Update password strength indicator UI
   */
  function updateStrengthIndicator(password) {
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');
    if (!fill || !text) return;

    const strength = getPasswordStrength(password);
    fill.className = 'strength-fill ' + strength.className;
    text.textContent = strength.label ? `Strength: ${strength.label}` : '';
    text.style.color =
      strength.className === 'weak'
        ? '#ef476f'
        : strength.className === 'fair'
          ? '#ffd166'
          : strength.className === 'good'
            ? '#17a2b8'
            : '#06d6a0';
  }

  /**
   * Live character counter for name field (Task 4)
   */
  function updateCharCounter(input) {
    const counter = document.getElementById('nameCharCounter');
    if (!counter) return;

    const length = input.value.length;
    counter.textContent = `${length}/${MAX_NAME_LENGTH} characters`;

    counter.classList.remove('warning', 'danger');
    if (length > MAX_NAME_LENGTH * 0.8) counter.classList.add('warning');
    if (length >= MAX_NAME_LENGTH) counter.classList.add('danger');
  }

  /**
   * Toggle password visibility (Task 4)
   */
  function setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    if (!toggleBtn || !passwordInput) return;

    toggleBtn.addEventListener('click', function () {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggleBtn.innerHTML = isPassword
        ? '<i class="bi bi-eye-slash"></i>'
        : '<i class="bi bi-eye"></i>';
      toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

  /**
   * Validate entire form before submission
   */
  function validateForm(form) {
    const name = form.querySelector('#fullName');
    const email = form.querySelector('#email');
    const age = form.querySelector('#age');
    const gender = form.querySelector('#gender');
    const course = form.querySelector('#course');
    const password = form.querySelector('#password');

    const results = [
      validateName(name),
      validateEmail(email),
      validateAge(age),
      validateGender(gender),
      validateCourse(course),
      validatePassword(password),
    ];

    return results.every(Boolean);
  }

  /**
   * Initialize validation event listeners
   */
  function initValidation() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    const nameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const ageInput = document.getElementById('age');
    const genderInput = document.getElementById('gender');
    const courseInput = document.getElementById('course');
    const passwordInput = document.getElementById('password');

    // Live validation on blur
    if (nameInput) {
      nameInput.addEventListener('input', () => updateCharCounter(nameInput));
      nameInput.addEventListener('blur', () => validateName(nameInput));
      updateCharCounter(nameInput);
    }
    if (emailInput) emailInput.addEventListener('blur', () => validateEmail(emailInput));
    if (ageInput) ageInput.addEventListener('blur', () => validateAge(ageInput));
    if (genderInput) genderInput.addEventListener('change', () => validateGender(genderInput));
    if (courseInput) courseInput.addEventListener('blur', () => validateCourse(courseInput));
    if (passwordInput) {
      passwordInput.addEventListener('input', () => {
        updateStrengthIndicator(passwordInput.value);
        if (passwordInput.value.length >= 8) validatePassword(passwordInput);
      });
      passwordInput.addEventListener('blur', () => validatePassword(passwordInput));
    }

    setupPasswordToggle();

    // Expose validateForm for use by students.js (API submission)
    window.registrationValidation = {
      validateForm,
      validateName,
      validateEmail,
      validateAge,
      validateGender,
      validateCourse,
      validatePassword,
    };
  }

  document.addEventListener('DOMContentLoaded', initValidation);
})();
