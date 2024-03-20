const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const PORT = 5001;

// MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Add your MySQL password here
    database: 'student_db'
});

// Connect to MySQL
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database');
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Update this with your frontend URL
    credentials: true
}));
// Route to fetch all students
app.get("/api/students", (req, res) => {
  const { studentName } = req.query;

  const sql = `SELECT * FROM students WHERE studentName LIKE ?`;
  const searchValue = `%${studentName}%`;

  connection.query(sql, [searchValue], (err, result) => {
    if (err) {
      console.error("Error fetching students:", err);
      res.status(500).json({ error: "Error fetching students" });
      return;
    }
    res.json(result);
  });
});

// Route to add a new student
app.post('/api/students', (req, res) => {
    const {
        studentName,
        fathersName,
        mothersName,
        age,
        homeAddress,
        registrationDate
    } = req.body;

    const sql = `INSERT INTO students (studentName, fathersName, mothersName, age, homeAddress, registrationDate) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [studentName, fathersName, mothersName, age, homeAddress, registrationDate];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            res.status(500).json({ error: 'Error adding student' });
            return;
        }
        console.log('Student added:', result);
        res.json({ message: 'Student added successfully' });
    });
});






// Route to fetch total number of students
app.get('/api/totalStudents', (req, res) => {
    const sql = 'SELECT COUNT(*) AS totalStudents FROM students';
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching total students:', err);
            res.status(500).json({ error: 'Error fetching total students' });
            return;
        }
        res.json(result[0]); // Assuming result is an array with a single object
    });
});







// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

