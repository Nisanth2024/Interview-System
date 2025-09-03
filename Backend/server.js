// Entry point for the backend server
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const morgan = require('morgan');
const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(morgan('combined'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));



// Routes
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');
const profileRoutes = require('./routes/profile');
const candidateRoutes = require('./routes/candidates');
const assignedInterviewersRoutes = require('./routes/assignedInterviewers');
const interviewsRoutes = require('./routes/interviews');

const interviewQuestionsRoutes = require('./routes/interviewQuestions');
const sectionsRoutes = require('./routes/sections');


app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api', profileRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/assigned-interviewers', assignedInterviewersRoutes);
app.use('/api/interviews', interviewsRoutes);

app.use('/api/interview-questions', interviewQuestionsRoutes);
app.use('/api/sections', sectionsRoutes);


// Basic route
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
