# Student Registration System

A complete **Full Stack Student Registration System** built for internship requirements using HTML, CSS, Bootstrap 5, JavaScript, Node.js, Express, and EJS. Uses **in-memory storage only** — no database required.

## Features

| Task | Description |
|------|-------------|
| **Task 1** | Student registration form with EJS server-side rendering and Express routes |
| **Task 2** | Client-side & server-side validation, in-memory array storage |
| **Task 3** | Bootstrap 5 responsive UI with navbar, hero, form, student list, footer |
| **Task 4** | Password strength indicator, show/hide password, live name counter, dynamic toasts |
| **Task 5** | REST API CRUD (GET/POST/PUT/DELETE) with Fetch API and dynamic table updates |

## Folder Structure

```
student-registration-system/
├── server.js              # Express server entry point
├── package.json           # Project dependencies
├── README.md              # This file
├── routes/
│   └── students.js        # REST API routes & validation
├── views/
│   ├── index.ejs          # Home page with form & dynamic student list
│   └── students.ejs       # Server-rendered student records page
└── public/
    ├── css/
    │   └── style.css      # Custom styles, animations, responsive design
    ├── js/
    │   ├── validation.js  # Client-side form validation
    │   └── students.js    # Fetch API CRUD operations
    └── images/            # Placeholder for images
```

## Installation Steps

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)

### Setup

1. **Navigate to the project directory:**

   ```bash
   cd student-registration-system
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Commands to Run the Project

### Start the server

```bash
npm start
```

Or:

```bash
node server.js
```

### Open in browser

Visit: **http://localhost:3000**

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/students` | Get all students |
| `GET` | `/students/:id` | Get student by ID |
| `POST` | `/students` | Create new student |
| `PUT` | `/students/:id` | Update student |
| `DELETE` | `/students/:id` | Delete student |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — registration form + dynamic student table (Fetch API) |
| `/students-page` | Server-rendered list of all registered students |
| `POST /register` | Traditional form submission (EJS redirect to students page) |

## Validation Rules

- **Name:** Cannot be empty (max 100 characters)
- **Email:** Must be valid format
- **Age:** Must be above 18
- **Password:** Minimum 8 characters
- **Gender & Course:** Required selections

## Tech Stack

- **Frontend:** HTML5, CSS3, Bootstrap 5, JavaScript (Fetch API)
- **Backend:** Node.js, Express.js
- **Templating:** EJS
- **Storage:** In-memory arrays (resets on server restart)

## Notes

- Data is stored in memory and will be lost when the server restarts.
- No MongoDB or external database is required.
- Passwords are stored in memory for demo purposes only — not suitable for production.

## License

MIT
