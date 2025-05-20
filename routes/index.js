var express = require('express');
var router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("../db/databese");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const InfoS = require("../model/InfoS");
const InfoA = require("../model/InfoA");
const pool = require("express");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

const app = express();
const PORT= 5000;
app.use(cors());
app.use(bodyParser.json());





sequelize.sync()
    .then(() => {
      console.log("Sequelize successful", PORT);
    });
app.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  try {
    const existingUser = await User.findOne({where: {name}});
    if (existingUser) {
      return res.status(400).json({message: 'User already exists'}); // Добавлен return
    }
    const hashaedPassword = await bcrypt.hash(password, 10);
    // const infoA = await InfoA.create({name, description});
    // const infoS = await InfoS.create({name, description});
    const user = await User.create({name, email, password: hashaedPassword});
    res.status(200).json({message: 'User registered successfully', user});
  }catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});


app.post('/login', async (req, res) => {
  const { name, password } = req.body;
  try {
    const user = await User.findOne({ where: { name } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Генерация токена
    const token = jwt.sign({ user:name,password:password }, process.env.JWT_SECRET || "WTF", { expiresIn: '1h' });
    console.log('Generated Token:', token); // Логирование сгенерированного токена
    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/users', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).send({message: 'No token provided'});
  }

  try {
    const token = jwt.sign({id: user.name}, process.env.JWT_SECRET, {expiresIn: '1h'});
    console.log('Generated token',token);
    res.json({message: 'User registered successfully.', token});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error: error.message});
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);  // Должно быть в консоли
});



// Дальше идет жесткое добавление и удаление данных

app.put('/InfoA/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    const result = await pool.query(
        'UPDATE infoAs SET name = $1, description = $2,  WHERE id = $3 RETURNING *',
        [name, description, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "InfoA not found" });
    }

    return res.json(result.rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});


app.delete('/InfoA/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM infoAs WHERE id = $1', [req.params.id]);
    res.json({success:true});
  } catch (error) {
    return  res.status(500).json({error: "Server error"});
  }
})

app.get('/InfoA', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM infoAs');
    return res.json(result.rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

app.get('/InfoA/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM infoAs WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "InfoA not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
