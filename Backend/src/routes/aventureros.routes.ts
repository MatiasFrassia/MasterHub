import { Router } from 'express';
import { 
    obtenerAventureros, 
    crearAventurero, 
    actualizarAventurero,
    actualizarHpAventurero, 
    eliminarAventurero 
} from '../controllers/aventureros.controller.js';
import { uploadAventurero } from '../config/multer.config.js';

const router = Router();

router.get('/', obtenerAventureros);
router.post('/', uploadAventurero.array('imagenes', 10), crearAventurero);
router.put('/:id', uploadAventurero.array('imagenes', 10), actualizarAventurero); // <-- NUEVA RUTA DE EDICIÓN
router.patch('/:id/hp', actualizarHpAventurero);
router.delete('/:id', eliminarAventurero);

export default router;