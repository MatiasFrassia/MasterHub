import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // 👈 Importamos path para manejar rutas de archivos
import { fileURLToPath } from 'url'; // 👈 Necesario en ESM para obtener __dirname
import criaturasRouter from './routes/criaturas.routes.js';
import conjurosRoutes from './routes/conjuros.routes.js';
import objetosMagicosRoutes from './routes/objetos-magicos.routes.js';
import aventurerosRoutes from './routes/aventureros.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// 👈 Configuración para servir archivos estáticos (imágenes)
// Todo lo que esté en la carpeta "uploads" en la raíz del backend será accesible en http://localhost:3000/uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/criaturas', criaturasRouter);
app.use('/api/conjuros', conjurosRoutes);
app.use('/api/objetos-magicos', objetosMagicosRoutes); // Asegúrate de tener un router para objetos mágicos
app.use('/api/aventureros', aventurerosRoutes);

app.listen(PORT, () => {
    console.log(`⚔️  Servidor MasterHub corriendo en http://localhost:${PORT}`);
});