/* eslint-disable no-console */
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const chillerRoute = require('./routes/chiller');
const sensorRoute = require('./routes/sensor');
const renameRoute = require('./routes/rename');
const predRoute = require('./routes/pred');

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());
app.options('*', cors());
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/chiller', chillerRoute);
app.use('/api/sensor', sensorRoute);
app.use('/api/rename', renameRoute);
app.use('/api/pred', predRoute);

app.get('/', (req, res) => {
  res.send('Hello to todo-app API');
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() =>
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
  )
  .catch((err) => console.log(err.message));
