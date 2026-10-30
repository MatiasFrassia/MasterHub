import { Request, Response } from 'express';
import { db } from '../config/db.js';

export const getConjuros = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT * FROM conjuros ORDER BY nombre ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener conjuros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};