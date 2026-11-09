import { Router } from 'express';
import { getObjetosMagicos, getObjetoMagicoPorId } from '../controllers/objetos-magicos.controller.js';

const router = Router();

router.get('/', getObjetosMagicos);
router.get('/:id', getObjetoMagicoPorId);

export default router;