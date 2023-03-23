const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const configDb = require("../db");

require("dotenv").config();

const hashPassword = async (password) => {
  const salt = process.env.SALT;
  return bcrypt.hash(password, +salt);
};

const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  const hashedPassword = await hashPassword(password);

  configDb.query(
    `SELECT email FROM Users WHERE email = ?`,
    [email],
    async (err, data) => {
      try {
        if (data[0].length > 0) {
          res.status(200).json({
            message: "User already exists",
          });
        } else {
          configDb.query(
            `INSERT INTO Users(fullName, email, password) VALUES (?, ?, ?)`,
            [fullName, email, hashedPassword],
            async (err, data) => {
              res.status(201).json({
                message: "User registered successfully",
                user: data,
              });
            }
          );
        }
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    }
  );
};

const userLogin = async (req, res, next) => {
  const { email, password } = req.body;
  const plainPassword = password;

  configDb.query(
    `SELECT fullName, email, password FROM Users WHERE email=?`,
    [email],
    async (err, result) => {
      console.log(result[0])
      console.log(plainPassword, result[0].password)
      try {
        if (err) throw new err;
        if (!result[0] || !bcrypt.compareSync(plainPassword, result[0].password)) {
          return res.status(401).json({
            message: "Incorrect email and password",
          });
        }
        if (result.length > 0) {
          const { email, password } = result[0];
          if (bcrypt.compareSync(plainPassword, password)) {
            const user = { email, password };
            const token = jwt.sign(
              { data: user },
              process.env.JWT_SECRET,
            );

            res.status(200).json({
              message: "Login successful.",
              token: token,
              data: user,
            });
          }
        } else {
          res.status(403).json({
            message: "User not found",
          });
        }
      } catch (error) {
        return res.status(500).json({
          error: error.message,
        });
      }
      configDb.end;
    }
  );
};

const getUser = (req, res) => {
  configDb.query(`SELECT * FROM Users`, (err, data) => {
    if (data.length === 0) {
      res.status(404).json({
        message: "No users found",
      });
    } else {
      // Hiding each users password from the response
      data.forEach((user) => {
        user.password = undefined
      })
      res.status(200).json({
        datas: data,
      });
    }
  });
};

const getAUser = (req, res) => {
  const id = req.params.id;

  configDb.query(
    `SELECT id, fullName, email, password FROM Users WHERE id=?`,
    [id],
    (err, data) => {
      if (err) {
        res.status(400).json({
          error: err.message,
        });
      } else if (data.length) {
        return res.status(200).json({
          message: "User found",
          data: data,
        });
      } else {
        res.status(400).json({
          message: "User does not exist",
        });
      }
    }
  );
};

module.exports = {
  userLogin,
  registerUser,
  getUser,
  getAUser,
};
