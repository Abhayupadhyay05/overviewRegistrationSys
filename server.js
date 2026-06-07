/**
 * Student Registration System - Main Server
 * Express server with EJS rendering and REST API
 */

const express = require('express');
const path = require('path');
const studentRoutes = require('./routes/students');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for student records (no database required)
const store = {
  students: [],
  nextId: 1,
};

// Initialize API routes with shared store
studentRoutes.initStore(store);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// EJS view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mount REST API routes
app.use('/students', studentRoutes.router);

// Home page - registration form with hero section
app.get('/', (req, res) => {
  res.render('index', {
    title: 'Student Registration System',
    page: 'home',
  });
});

// Students page - displays submitted data (server-rendered fallback)
app.get('/students-page', (req, res) => {
  const safeStudents = store.students.map(({ password, ...rest }) => rest);
  res.render('students', {
    title: 'Registered Students',
    page: 'students',
    students: safeStudents,
  });
});

// Traditional form POST route (Task 1 & 2 - server-side rendering)
app.post('/register', (req, res) => {
  const validation = studentRoutes.validateStudent(req.body);

  if (!validation.valid) {
    return res.status(400).render('index', {
      title: 'Student Registration System',
      page: 'home',
      errors: validation.errors,
      formData: req.body,
    });
  }

  const duplicate = store.students.find(
    (s) => s.email.toLowerCase() === req.body.email.trim().toLowerCase()
  );
  if (duplicate) {
    return res.status(409).render('index', {
      title: 'Student Registration System',
      page: 'home',
      errors: ['Email already registered.'],
      formData: req.body,
    });
  }

  const newStudent = {
    id: store.nextId++,
    fullName: req.body.fullName.trim(),
    email: req.body.email.trim().toLowerCase(),
    age: parseInt(req.body.age, 10),
    gender: req.body.gender.toLowerCase(),
    course: req.body.course.trim(),
    password: req.body.password,
    registeredAt: new Date().toISOString(),
  };

  store.students.push(newStudent);

  const { password, ...safeStudent } = newStudent;
  res.render('students', {
    title: 'Registration Successful',
    page: 'students',
    students: store.students.map(({ password: pw, ...rest }) => rest),
    successMessage: `Welcome, ${safeStudent.fullName}! Your registration was successful.`,
    newStudent: safeStudent,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n  Student Registration System`);
  console.log(`  Server running at http://localhost:${PORT}`);
  console.log(`  API endpoints: GET/POST/PUT/DELETE /students\n`);
});
