import { Router } from 'express';
import { getConjuros } from '../controllers/conjuros.controller.js';

const router = Router();

router.get('/', getConjuros);

export default router;