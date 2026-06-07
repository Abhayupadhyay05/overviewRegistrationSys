/**
 * Student CRUD Operations via Fetch API (Task 5)
 * Dynamic DOM updates without page refresh
 */

(function () {
  'use strict';

  const API_BASE = '/students';
  let editModal = null;

  /**
   * Display dynamic success toast message (Task 4)
   */
  function showSuccessMessage(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-custom p-3 mb-2';
    toast.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-check-circle-fill text-success me-2 fs-5"></i>
        <div>
          <strong>Success!</strong>
          <div class="small text-muted">${message}</div>
        </div>
        <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
      </div>
    `;

    toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  }

  /**
   * Display error toast message
   */
  function showErrorMessage(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-custom p-3 mb-2';
    toast.style.borderLeftColor = '#ef476f';
    toast.innerHTML = `
      <div class="d-flex align-items-center">
        <i class="bi bi-exclamation-circle-fill text-danger me-2 fs-5"></i>
        <div>
          <strong>Error</strong>
          <div class="small text-muted">${message}</div>
        </div>
        <button type="button" class="btn-close ms-auto" aria-label="Close"></button>
      </div>
    `;

    toast.querySelector('.btn-close').addEventListener('click', () => toast.remove());
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 5000);
  }

  /**
   * Format date for display
   */
  function formatDate(isoString) {
    if (!isoString) return '—';
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Get gender badge HTML
   */
  function genderBadge(gender) {
    const g = (gender || '').toLowerCase();
    return `<span class="badge-gender badge-${g}">${g}</span>`;
  }

  /**
   * Render student table rows dynamically (Task 4 & 5)
   */
  function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    const emptyState = document.getElementById('emptyState');
    const studentCount = document.getElementById('studentCount');
    const heroStudentCount = document.getElementById('heroStudentCount');

    if (!tbody) return;

    if (studentCount) studentCount.textContent = students.length;
    if (heroStudentCount) heroStudentCount.textContent = students.length;

    if (students.length === 0) {
      tbody.innerHTML = '';
      if (emptyState) emptyState.classList.remove('d-none');
      return;
    }

    if (emptyState) emptyState.classList.add('d-none');

    tbody.innerHTML = students
      .map(
        (student) => `
      <tr data-id="${student.id}">
        <td>${student.id}</td>
        <td><strong>${escapeHtml(student.fullName)}</strong></td>
        <td>${escapeHtml(student.email)}</td>
        <td>${student.age}</td>
        <td>${genderBadge(student.gender)}</td>
        <td>${escapeHtml(student.course)}</td>
        <td>${formatDate(student.registeredAt)}</td>
        <td>
          <button class="btn btn-action btn-edit me-1" onclick="StudentManager.editStudent(${student.id})" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-action btn-delete" onclick="StudentManager.deleteStudent(${student.id})" title="Delete">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `
      )
      .join('');
  }

  /**
   * Prevent XSS in dynamic HTML
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * GET /students - Fetch all students
   */
  async function fetchStudents() {
    try {
      const response = await fetch(API_BASE);
      const result = await response.json();

      if (result.success) {
        renderStudentTable(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch students:', error);
      showErrorMessage('Failed to load student records.');
    }
  }

  /**
   * POST /students - Create new student via API
   */
  async function createStudent(formData) {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSuccessMessage(result.message || 'Student registered successfully!');
        document.getElementById('registrationForm').reset();
        document.getElementById('nameCharCounter').textContent = '0/100 characters';
        document.getElementById('strengthFill').className = 'strength-fill';
        document.getElementById('strengthText').textContent = '';
        await fetchStudents();
        return true;
      }

      const errorMsg = result.errors ? result.errors.join(' ') : result.message || 'Registration failed.';
      showErrorMessage(errorMsg);
      return false;
    } catch (error) {
      console.error('Create failed:', error);
      showErrorMessage('Network error. Please try again.');
      return false;
    }
  }

  /**
   * PUT /students/:id - Update student
   */
  async function updateStudent(id, formData) {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSuccessMessage(result.message || 'Student updated successfully!');
        if (editModal) editModal.hide();
        await fetchStudents();
        return true;
      }

      const errorMsg = result.errors ? result.errors.join(' ') : result.message || 'Update failed.';
      showErrorMessage(errorMsg);
      return false;
    } catch (error) {
      console.error('Update failed:', error);
      showErrorMessage('Network error. Please try again.');
      return false;
    }
  }

  /**
   * DELETE /students/:id - Remove student
   */
  async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student record?')) return;

    try {
      const response = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
      const result = await response.json();

      if (response.ok && result.success) {
        showSuccessMessage(result.message || 'Student deleted successfully.');
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
          row.style.transition = 'opacity 0.3s';
          row.style.opacity = '0';
          setTimeout(() => fetchStudents(), 300);
        } else {
          await fetchStudents();
        }
      } else {
        showErrorMessage(result.message || 'Delete failed.');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      showErrorMessage('Network error. Please try again.');
    }
  }

  /**
   * Open edit modal with student data
   */
  async function editStudent(id) {
    try {
      const response = await fetch(`${API_BASE}/${id}`);
      const result = await response.json();

      if (!result.success) {
        showErrorMessage('Student not found.');
        return;
      }

      const student = result.data;
      document.getElementById('editId').value = student.id;
      document.getElementById('editFullName').value = student.fullName;
      document.getElementById('editEmail').value = student.email;
      document.getElementById('editAge').value = student.age;
      document.getElementById('editGender').value = student.gender;
      document.getElementById('editCourse').value = student.course;
      document.getElementById('editPassword').value = '';

      if (editModal) editModal.show();
    } catch (error) {
      console.error('Fetch student failed:', error);
      showErrorMessage('Failed to load student data.');
    }
  }

  /**
   * Handle registration form submit via Fetch API
   */
  function setupFormSubmit() {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      // Run client-side validation first
      if (window.registrationValidation && !window.registrationValidation.validateForm(form)) {
        showErrorMessage('Please fix the validation errors before submitting.');
        return;
      }

      const formData = {
        fullName: form.fullName.value.trim(),
        email: form.email.value.trim(),
        age: form.age.value,
        gender: form.gender.value,
        course: form.course.value.trim(),
        password: form.password.value,
      };

      await createStudent(formData);
    });
  }

  /**
   * Handle edit form submit
   */
  function setupEditForm() {
    const editForm = document.getElementById('editForm');
    if (!editForm) return;

    editForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const id = document.getElementById('editId').value;
      const formData = {
        fullName: document.getElementById('editFullName').value.trim(),
        email: document.getElementById('editEmail').value.trim(),
        age: document.getElementById('editAge').value,
        gender: document.getElementById('editGender').value,
        course: document.getElementById('editCourse').value.trim(),
      };

      const password = document.getElementById('editPassword').value;
      if (password) formData.password = password;

      await updateStudent(id, formData);
    });
  }

  /**
   * Initialize Bootstrap modal and event listeners
   */
  function init() {
    const modalEl = document.getElementById('editModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
      editModal = new bootstrap.Modal(modalEl);
    }

    setupFormSubmit();
    setupEditForm();
    fetchStudents();
  }

  // Expose public API for inline onclick handlers
  window.StudentManager = {
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    editStudent,
  };

  document.addEventListener('DOMContentLoaded', init);
})();
