

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); // Load from backend/.env

console.log('MONGO_URI:', process.env.MONGO_URI); // Debugging output

const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

