require('dotenv').config();
const express = require('express');
const app = express();
const personRoutes = require('./routes/personRoutes');
const rawMaterialRoutes = require('./routes/rawMaterialRoutes');
const roleRoutes = require('./routes/roleRoutes');
app.use(express.json());
app.use('/api/persons', personRoutes);
app.use('/api/raw-materials', rawMaterialRoutes);
app.use('/api/roles', roleRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
