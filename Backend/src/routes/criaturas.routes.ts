import { Router } from 'express';
import { buscarCriaturas, obtenerCriaturaPorId } from '../controllers/criaturas.controller.js';

const router = Router();

router.get('/buscar', buscarCriaturas);
router.get('/:id', obtenerCriaturaPorId);

export default router;