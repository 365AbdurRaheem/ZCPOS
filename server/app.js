require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();
const processingStageRoutes = require('./routes/processingStageRoutes');
const personRoutes = require('./routes/personRoutes');
const roleRoutes = require('./routes/roleRoutes');
app.use(cors({
  origin: 'http://localhost:5173',  // or use '*' for dev only
  credentials: true, // if you're sending cookies or auth headers
}));
app.use(express.json());
app.use('/api/processing-stages', processingStageRoutes);
app.use('/api/persons', personRoutes);
app.use('/api/roles', roleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
