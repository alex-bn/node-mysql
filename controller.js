const db = require('./dbConnection');
const { signupValidation, loginValidation } = require('./validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// req handler functions
exports.registerUser = (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE LOWER(email) = LOWER(${db.escape(
      req.body.email
    )});`,
    (err, result) => {
      if (result.length) {
        return res.status(409).send({
          msg: 'Email already in use!',
        });
      } else {
        // username is available
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).send({
              msg: err,
            });
          } else {
            // has hashed pw => add to database
            db.query(
              `INSERT INTO users (name, email, password) VALUES ('${
                req.body.name
              }', ${db.escape(req.body.email)}, ${db.escape(hash)})`,
              (err, result) => {
                if (err) {
                  // throw err;
                  return result.status(400).send({
                    msg: err,
                  });
                }
                return res.status(201).send({
                  msg: 'Registration completed!',
                });
              }
            );
          }
        });
      }
    }
  );
};

exports.loginUser = (req, res, next) => {
  db.query(
    `SELECT * FROM users WHERE email = ${db.escape(req.body.email)};`,
    (err, result) => {
      // user does not exist
      if (err) {
        throw err;
        return res.status(400).send({
          msg: err,
        });
      }
      if (!result.length) {
        console.log(result.length);
        return res.status(401).send({
          msg: 'Make sure you typed the correct passwd and email!',
        });
      }

      // check passwd
      bcrypt.compare(
        req.body.password,
        result[0]['password'],
        (bErr, bResult) => {
          // wrong password
          if (bErr) {
            throw bErr;
            return res.status(401).send({
              msg: 'Make sure to type the correct email address and password!',
            });
          }
          if (bResult) {
            const token = jwt.sign(
              { id: result[0].id },
              'the-super-strong-secret-code',
              { expiresIn: '1h' }
            );

            db.query(`
            UPDATE users SET last_login = now() WHERE id = '${result[0].id}'
            `);

            return res.status(200).send({
              msg: 'Logged in!',
              token,
              user: result[0],
            });
          }

          return res.status(401).send({
            msg: 'Make sure to type the correct username and password!',
          });
        }
      );
    }
  );
};

exports.fetchUser = (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer') ||
    !req.headers.authorization.split(' ')[1]
  ) {
    return res.status(401).json({
      msg: 'Please provide the token',
    });
  }
  const theToken = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(theToken, 'the-super-strong-secret-code');
  db.query(
    'SELECT * FROM users WHERE id=?',
    decoded.id,
    function (error, results, fields) {
      if (error) throw error;
      return res.send({
        error: false,
        data: results[0],
        msg: 'fetch completed',
      });
    }
  );
};
