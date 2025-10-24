<<<<<<< HEAD
// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/levels', require('./routes/levelRoutes'));
app.use('/api/attempts', require('./routes/attemptRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
=======
// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/levels', require('./routes/levelRoutes'));
app.use('/api/attempts', require('./routes/attemptRoutes'));

const PORT = process.env.PORT || 8000;
app.listen(8000, () => console.log(`Backend running on port ${PORT}`));
============
app.listen(process.env.PORT || 1000);
>>>>>>> main