const connection = require("../db/connection")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


// CREATE TABLE users (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     name VARCHAR(255) NOT NULL,
//     email VARCHAR(255) NOT NULL,
//     password VARCHAR(255) NOT NULL,
//     role ENUM('customer', 'seller') NOT NULL DEFAULT 'customer'
//   );
exports.createUser = async (req, res) => {
    try {
      let { name, email, password } = req.body;
  
      const bcryptedPassword = await bcrypt.hash(password, 10);
      console.log(bcryptedPassword);

      const createdUser = {
        name:name,
        email:email,
        password:bcryptedPassword
      }
  
      const query = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
      await connection.promise().query(query, [name, email, bcryptedPassword, 'customer']);
  
      return res.status(201).json({
        status: true,
        data:createdUser,
        message: "User created successfully",
      });
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ status: true, error: error.message });
    }
  };
  
  exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email)
        return res
          .status(400)
          .json({ status: false, message: "Plz provide email" });
  
      if (!password)
        return res
          .status(400)
          .json({ status: false, message: "Plz provide password" });
  
      const query = "select * from users where email = ?";
  
      const [rows] = await connection.promise().query(query, [email]);
  
      if (rows.length == 0) {
        return res.status(404).json({ status: false, message: "user not found" });
      }
  
      const user = rows[0];
      const passwordMatch = bcrypt.compare(password, user.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ status: false, message: "Password is incorrect" });
      }
  
      let token = jwt.sign({ email: email }, "secret_key");
  
      return res.status(200).send({ status: true, data:token, message: "user successfully login" });
    } catch (error) {
      return res.status(500).json({ status: true, error: error.message });
    }
  };

  
//getuser by id for searching the specific user
exports.getUser = async (req, res) => {
    const userId = req.params.id;
  
    try {
      const query = "SELECT * FROM users WHERE id = ?";
  
      const [user] = await mysqlConnection.promise().query(query, [userId]);
  
      if (user.length == 0)
        return res.status(404).json({ error: "User not found" });
  
      return res.status(200).json({ user });
    } catch (error) {
      console.error("Error retrieving user:", error);
      return res.status(500).json({ status: true, error: error.message });
    }
  };
  
  //get all user
  
  exports.getAllUsers = async (req, res) => {
    try {
      const query = "SELECT * FROM users";
      const [users] = await mysqlConnection.promise().query(query);
  
      return res.status(200).json({ status: true, data: users });
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  };
  
  //update one user by id
  
  exports.updateOneuser = async (req, res) => {
    try {
      const userId = req.params.id;
      const { name, email } = req.body;
  
      const query = "update users set name=?, email= ? where id = ?";
  
      const [user, fields] = await mysqlConnection
        .promise()
        .query(query, [name, email, userId]);
  
      if (user.affectedRows == 0) {
        return res.status(404).send({ status: false, message: "user not found" });
      }
      return res
        .status(200)
        .json({ status: true, data: user, message: "user updated successfully" });
    } catch (error) {
      return res.status(500).json({ status: true, error: error.message });
    }
  };
  
  exports.deleteoneuser = async (req, res) => {
    try {
      const userId = req.params.id;
      const query = "delete from users where id = ?";
  
      const [result] = await mysqlConnection.promise().query(query, [userId]);
  
      if (result.affectedRows == 0) {
        return res.status(404).send({ status: false, message: "user not found" });
      }
  
      return res
        .status(200)
        .json({ status: true, message: "user deleted successfully" });
    } catch (error) {
      return res.status(500).json({ status: false, error: error.message });
    }
  };
  