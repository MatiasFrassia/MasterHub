import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import criaturasRouter from './routes/criaturas.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/criaturas', criaturasRouter);

app.listen(PORT, () => {
    console.log(`⚔️  Servidor MasterHub corriendo en http://localhost:${PORT}`);
});