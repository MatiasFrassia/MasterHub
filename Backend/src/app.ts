import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import criaturasRouter from './routes/criaturas.routes.js';
import conjurosRoutes from './routes/conjuros.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/criaturas', criaturasRouter);
app.use('/api/conjuros', conjurosRoutes);

app.listen(PORT, () => {
    console.log(`⚔️  Servidor MasterHub corriendo en http://localhost:${PORT}`);
});