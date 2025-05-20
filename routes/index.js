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
    // const infoA = await InfoA.create({name, description, img});
    // const infoS = await InfoS.create({name, description, img});
    const user = await User.create({name, email, password: hashaedPassword});
    res.status(200).json({message: 'User registered successfully', user});
  }catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});


app.post('/login', async (req, res) => {
  const {name, password} = req.body;
  try {
    const user = await User.findOne({where:{name}});
    if (!user) {
      return res.status(400).send({message: 'User does not exist'});
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).send({message: 'User does not match'});
    }
    const token = jwt.sign({password: user.password}, process.env.JWT_SECRET, {expiresIn: '1d'});
    console.log({message: 'Login successfully.', token});
  } catch (error) {
    console.log(error);
    res.status(500).json({error: error.message});
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

module.exports = router;
