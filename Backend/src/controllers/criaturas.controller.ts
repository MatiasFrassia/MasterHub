import { Request, Response } from 'express';

import { RowDataPacket } from 'mysql2';
import { db } from '../config/db.js';

// GET /api/criaturas/buscar?q=
export const buscarCriaturas = async (req: Request, res: Response): Promise<void> => {
    try {
        const termino = (req.query.q as string) || '';
        const [filas] = await db.query<RowDataPacket[]>(
            `SELECT id, nombre, desafio, clase_armadura, puntos_golpe, url_imagen 
             FROM criaturas 
             WHERE nombre LIKE ? 
             LIMIT 10`,
            [`%${termino}%`]
        );

        res.json(filas);
    } catch (error) {
        console.error('Error al buscar criaturas:', error);
        res.status(500).json({ mensaje: 'Error al buscar criaturas' });
    }
};

// GET /api/criaturas/:id
export const obtenerCriaturaPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // 1. Obtener datos base de la criatura
        const [criaturas] = await db.query<RowDataPacket[]>(
            'SELECT * FROM criaturas WHERE id = ?',
            [id]
        );

        if (criaturas.length === 0) {
            res.status(404).json({ mensaje: 'Criatura no encontrada' });
            return;
        }

        // 2. Obtener rasgos y acciones
        const [acciones] = await db.query<RowDataPacket[]>(
            'SELECT id, nombre, descripcion, tipo, uso_limitado FROM rasgos_y_acciones WHERE criatura_id = ?',
            [id]
        );

        // 3. Obtener conjuros vinculados
        const [conjuros] = await db.query<RowDataPacket[]>(
            `SELECT c.*, cc.modalidad 
             FROM conjuros c
             JOIN criatura_conjuros cc ON c.id = cc.conjuro_id
             WHERE cc.criatura_id = ?`,
            [id]
        );

        res.json({
            ...criaturas[0],
            acciones,
            conjuros
        });
    } catch (error) {
        console.error('Error al obtener el detalle de la criatura:', error);
        res.status(500).json({ mensaje: 'Error al obtener la criatura' });
    }
};