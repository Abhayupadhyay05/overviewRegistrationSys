/**
 * Student REST API routes
 * Handles CRUD operations with in-memory storage
 */

const express = require('express');
const router = express.Router();

// Reference to in-memory student store (shared from server.js)
let storeRef = null;

/**
 * Initialize store reference from server
 */
function initStore(ref) {
  storeRef = ref;
}

/**
 * Server-side validation for student data
 * Returns { valid: boolean, errors: string[] }
 */
function validateStudent(data, isUpdate = false) {
  const errors = [];
  const { fullName, email, age, gender, course, password } = data;

  if (!isUpdate || fullName !== undefined) {
    if (!fullName || fullName.trim() === '') {
      errors.push('Full name cannot be empty.');
    } else if (fullName.trim().length > 100) {
      errors.push('Full name must be 100 characters or fewer.');
    }
  }

  if (!isUpdate || email !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
      errors.push('Please provide a valid email address.');
    }
  }

  if (!isUpdate || age !== undefined) {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 18) {
      errors.push('Age must be above 18.');
    }
  }

  if (!isUpdate || gender !== undefined) {
    const validGenders = ['male', 'female', 'other'];
    if (!gender || !validGenders.includes(gender.toLowerCase())) {
      errors.push('Please select a valid gender.');
    }
  }

  if (!isUpdate || course !== undefined) {
    if (!course || course.trim() === '') {
      errors.push('Course cannot be empty.');
    }
  }

  if (!isUpdate || password !== undefined) {
    if (!password || password.length < 8) {
      errors.push('Password must be at least 8 characters.');
    }
  }

  return { valid: errors.length === 0, errors };
}

// GET /students - Retrieve all students
router.get('/', (req, res) => {
  const safeStudents = storeRef.students.map(({ password, ...rest }) => rest);
  res.json({ success: true, data: safeStudents });
});

// GET /students/:id - Retrieve single student
router.get('/:id', (req, res) => {
  const student = storeRef.students.find((s) => s.id === parseInt(req.params.id, 10));
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }
  const { password, ...safeStudent } = student;
  res.json({ success: true, data: safeStudent });
});

// POST /students - Create new student
router.post('/', (req, res) => {
  const validation = validateStudent(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  const duplicate = storeRef.students.find(
    (s) => s.email.toLowerCase() === req.body.email.trim().toLowerCase()
  );
  if (duplicate) {
    return res.status(409).json({ success: false, message: 'Email already registered.' });
  }

  const newStudent = {
    id: storeRef.nextId++,
    fullName: req.body.fullName.trim(),
    email: req.body.email.trim().toLowerCase(),
    age: parseInt(req.body.age, 10),
    gender: req.body.gender.toLowerCase(),
    course: req.body.course.trim(),
    password: req.body.password,
    registeredAt: new Date().toISOString(),
  };

  storeRef.students.push(newStudent);
  const { password, ...safeStudent } = newStudent;
  res.status(201).json({ success: true, message: 'Student registered successfully!', data: safeStudent });
});

// PUT /students/:id - Update existing student
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = storeRef.students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }

  const validation = validateStudent(req.body, true);
  if (!validation.valid) {
    return res.status(400).json({ success: false, errors: validation.errors });
  }

  const existing = storeRef.students[index];
  const updatedEmail = req.body.email ? req.body.email.trim().toLowerCase() : existing.email;
  const duplicate = storeRef.students.find(
    (s) => s.id !== id && s.email.toLowerCase() === updatedEmail
  );
  if (duplicate) {
    return res.status(409).json({ success: false, message: 'Email already in use.' });
  }

  storeRef.students[index] = {
    ...existing,
    fullName: req.body.fullName !== undefined ? req.body.fullName.trim() : existing.fullName,
    email: updatedEmail,
    age: req.body.age !== undefined ? parseInt(req.body.age, 10) : existing.age,
    gender: req.body.gender !== undefined ? req.body.gender.toLowerCase() : existing.gender,
    course: req.body.course !== undefined ? req.body.course.trim() : existing.course,
    password: req.body.password !== undefined ? req.body.password : existing.password,
    updatedAt: new Date().toISOString(),
  };

  const { password, ...safeStudent } = storeRef.students[index];
  res.json({ success: true, message: 'Student updated successfully!', data: safeStudent });
});

// DELETE /students/:id - Remove student
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = storeRef.students.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }

  const deleted = storeRef.students.splice(index, 1)[0];
  const { password, ...safeStudent } = deleted;
  res.json({ success: true, message: 'Student deleted successfully.', data: safeStudent });
});

module.exports = { router, initStore, validateStudent };
