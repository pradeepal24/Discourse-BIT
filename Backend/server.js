const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const multer = require("multer");
const app = express();
const port = 5000;

app.use(cors());
app.use("/files", express.static("files"));
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "files/");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pradeep",
  database: "discourse",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: ", err);
  } else {
    console.log("Connected to MySQL database.");
  }
});
const upload = multer({ storage: storage });

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Login query error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length > 0) {
      const user = results[0];

      res.json({
        name: user.username,
        role: user.role,
        faculty_id: user.id,
        subject: user.subject,
        department: user.department,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

app.get("/getsubjects", (req, res) => {
  console.log("data from cliet to get the subjest list", req.body);
  const department = req.query.department;

  db.query(
    "SELECT DISTINCT subject FROM questions WHERE department = ?",
    [department],
    (err, result) => {
      if (err) {
        res.status(400).json("error while getting subjects", err);
      }

      res.json(result);
    }
  );
});

app.post("/questions", upload.single("file"), (req, res) => {
  const { question, answer, lessonname, faculty_id } = req.body;
  const file = req.file;
  const filepath = file ? file.path : null;

  const getFacultySql = "SELECT subject, department FROM users WHERE id = ?";
  db.query(getFacultySql, [faculty_id], (err, facultyResults) => {
    if (err) {
      console.error("Faculty query error:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (facultyResults.length === 0) {
      return res.status(404).json({ message: "Faculty not found" });
    }

    const { subject, department } = facultyResults[0];

    const insertSql = `
      INSERT INTO questions (subject, department, question, answer, file_path, faculty_id, lesson)
      VALUES (?, ?, ?, ?, ?, ?, ?) `;
    db.query(
      insertSql,
      [subject, department, question, answer, filepath, faculty_id, lessonname],
      (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Insert error:", insertErr);
          return res.status(500).json({ message: "Failed to upload question" });
        }

        res.json({ message: "Question uploaded successfully" });
      }
    );
  });
});

{
  /*   answer page  */
}
app.get("/answers", (req, res) => {
  console.log("department from client", req.query.department);
  const department = req.query.department;
  console.log(req.query.subject);
  const subject = req.query.subject;
  db.query(
    "SELECT * FROM questions WHERE department = ? AND subject = ? ;",
    [department, subject],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(400).json("error while fetchings answers", err);
      }
      console.log(result);
      res.json(result);
    }
  );
});
app.get("/answers/students", (req, res) => {
  console.log("department from client", req.query.department);
  const department = req.query.department;
  console.log(req.query.subject);
  // const subject = req.query.subject;
  db.query(
    "SELECT * FROM questions WHERE department = ? ",
    [department],
    (err, result) => {
      if (err) {
        return res.status(400).json("error while fetchings answers", err);
      }
      console.log(result);
      res.json(result);
    }
  );
});
app.delete("/questionsdelete/:id", (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    db.query("DELETE FROM questions WHERE id = ? ", [id]);
  } catch (err) {
    res.status(400).json({ err: "error in deleting" });
  }
});

app.post("/addusers", (req, res) => {
  const { username, password, role, department, subject } = req.body;
  console.log(username);
  console.log(password);
  console.log(role);
  console.log(department);
  console.log(subject);

  db.query(
    "INSERT INTO users (username,password,role,department,subject) VALUES (?,?,?,?,?)",
    [username, password, role, department, subject],
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ error: "Error in inserting user", details: err });
      }
      res.status(201).json({ message: "User inserted successfully" });
    }
  );
});

app.get("/users", (req, res) => {
  const role = "faculty";
  db.query("SELECT * FROM users WHERE role = ?", [role], (err, result) => {
    if (err) return res.status(500).json({ err: "errrorr in geting data" });
    res.json(result);
  });
});

app.delete("/deleteuser/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  db.query("DELETE FROM users WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error in deleting user" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No user found to delete" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  });
});

app.post("/doubts", (req, res) => {
  console.log(req.body);
  
  const { username,questionId, replyText, subject, department } = req.body;
  console.log(username);
  db.query(
    "INSERT INTO doubts   (doubts,subject,department,qid,username) VALUES (?,?,?,?,?)",
    [replyText, subject, department, questionId,username],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json("error in posting doubt", err);
      }
      res.status(200).json("successfully uploaded", result);
    }
  );
});
{
  /*  first create a get request for student  based on department */
}
{
  /*  first create a get request for faculty  based on department and subject */
}

app.get("/studentdoubt", (req, res) => {
  const department = req.query.department;
  console.log(department);
  db.query(
    "SELECT q.id, q.question, q.subject, q.department, d.doubts,d.username, d.id as d_id FROM discourse.doubts as d join discourse.questions as q on d.qid = q.id WHERE q.department = ?",
    [department],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          err: "error in backend and getting the doubts for students",
        });
      }
      console.log("result for who posting the doubt",result);
      res.json(result);
    }
  );
});
app.get("/getdoubtquestion", (req, res) => {
  console.log(req.query.question_id);
  const question_id = req.query.question_id;

  db.query(
    "SELECT question FROM questions WHERE id = ?",
    [question_id],
    (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ err: "Error in backend while getting the doubt question" });
      }
      console.log(result);
      res.json(result[0]); // Send just the single question object
    }
  );
});

app.get("/facultydoubt", (req, res) => {
  const department = req.query.department;
  const subject = req.query.subject;

  db.query(
    "SELECT * FROM doubts WHERE department = ? AND  subject = ? ",
    [department, subject],
    (err, result) => {
      if (err)
        return res.status(500).json({
          err: "error in backend and getting the doubts for students",
        });
      console.log(result);
      res.json(result);
    }
  );
});

app.post("/doubtsanswer", (req, res) => {
  const { doubtsanswer } = req.body;
  const subject = req.query.subject;
  const department = req.query.department;
  const qid = req.query.qid;
  const did = req.query.did;
  const username = req.query.username;

  db.query(
    "INSERT INTO doubtsanswer (danswer, subject, department, qid, did,username) VALUES (?,?,?,?,?,?)",
    [doubtsanswer, subject, department, qid, did,username],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json(
            err,
            "error while posting doubtsanswer and subject and department"
          );
      res.status(200).json({ message: "successsfully posted doubtanswers" });
    }
  );
});

{
  /*get request for faculty based on the subject and department */
}
app.get("/getdoubtanswerfaculty", (req, res) => {
  const subject = req.query.subject;
  const department = req.query.department;
  db.query(
    "SELECT * FROM doubtsanswer WHERE   subject = ? AND department = ? ",
    [subject, department],
    (err, result) => {
      if (err)
        return res
          .status(500)
          .json(err, "error while getting doubt answers for faculty");
      console.log(result);
      res.json(result);
    }
  );
});
{
  /* get request for stduent based on the department  */
}
app.get("/getdoubtanswerstudent", (req, res) => {
  const department = req.query.department;
  console.log(department);
  db.query(
    "SELECT * FROM doubtsanswer WHERE department = ? ",
    [department],
    (err, result) => {
      if (err) return res.status(500).json(err, "while getting to student for");
      console.log(result);
      res.json(result);
    }
  );
});


app.put('/editquestions/:id', (req, res) => {
  const { id } = req.params;
  const { name, password, subject, department, role } = req.body;

  const sql = `
    UPDATE users 
    SET name = ?, password = ?, subject = ?, department = ?, role = ? 
    WHERE id = ?
  `;

  db.query(sql, [name, password, subject, department, role, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated successfully', result });
  });
});

app.get('/getquestionshistory',(req,res)=>{
  const subject = req.query.subject;
  db.query("SELECT * FROM questions WHERE subject = ? ",[subject],(err,result)=>{
    if (err) return res.status(500).json(err, "while getting to questions history for faculty");
    console.log(err);
      console.log(result);
      res.json(result);
  })
})
{/*faculty deleting student reply */}
app.delete('/deletedoubt', (req, res) => {
  const { doubtId, department } = req.query;
console.log("checking doubt id fromm the front end",doubtId);
  if (!doubtId ) {
    return res.status(400).json({ message: 'Missing doubtId or department' });
  }

  const deleteQuery = 'DELETE FROM doubts WHERE id = ?';

  db.query(deleteQuery, [doubtId], (err, result) => {
    if (err) {
      console.error('Error deleting doubt:', err);
      return res.status(500).json({ message: 'Error deleting doubt', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Doubt not found' });
    }

    res.status(200).json({ message: 'Doubt deleted successfully' });
  });
});

{/* delete the 2nd reply  */}
app.delete('/deletedoubtanswer', (req, res) => {
  const { answerId, department } = req.query;
  console.log("checking doubt id fromm the front end",answerId);
  if (!answerId ) {
    return res.status(400).json({ message: 'Missing answerId or department' });
  }

  const deleteQuery = 'DELETE FROM doubtsanswer WHERE id = ?';

  db.query(deleteQuery, [answerId], (err, result) => {
    if (err) {
      console.error('Error deleting reply:', err);
      return res.status(500).json({ message: 'Error deleting reply', error: err });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    res.status(200).json({ message: 'Reply deleted successfully' });
  });
});

// Google login
app.post('/google-login', (req, res) => {
  const { name, email, picture } = req.body;

  // First check if user already exists
  const checkSql = 'SELECT * FROM auth WHERE email = ?';
  db.query(checkSql, [email], (err, results) => {
    if (err) {
      console.error('Check user error:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (results.length > 0) {
      // User exists, no need to insert again
      res.json({ message: 'Google user logged in successfully.' });
    } else {
      // Insert new Google user into auth table with a default password
      const insertSql = 'INSERT INTO auth (username, email, password, role) VALUES (?, ?, ?, ?)';
      db.query(insertSql, [name, email, 'googleuser', 'student'], (err, result) => {
        if (err) {
          console.error('Insert Google user error:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        res.json({ message: 'Google user registered and logged in successfully.' });
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
