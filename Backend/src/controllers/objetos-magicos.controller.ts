import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { db } from '../config/db.js';

export const getObjetosMagicos = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [filas] = await db.query<RowDataPacket[]>(
            `SELECT id, nombre, tipo, rareza, sintonizacion, descripcion, 
                    cargas_maximas, recuperacion_cargas 
             FROM objetos_magicos 
             ORDER BY nombre ASC`
        );
        res.json(filas);
    } catch (error) {
        console.error('Error al obtener los objetos mágicos:', error);
        res.status(500).json({ mensaje: 'Error al obtener los objetos mágicos' });
    }
};

export const getObjetoMagicoPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const [filas] = await db.query<RowDataPacket[]>(
            `SELECT id, nombre, tipo, rareza, sintonizacion, descripcion, 
                    cargas_maximas, recuperacion_cargas 
             FROM objetos_magicos 
             WHERE id = ?`,
            [id]
        );

        if (filas.length === 0) {
            res.status(404).json({ mensaje: 'Objeto mágico no encontrado' });
            return;
        }

        const objeto = filas[0];

        const [habilidades] = await db.query<RowDataPacket[]>(
            `SELECT id, objeto_id, nombre, coste_cargas, tipo_accion, descripcion
             FROM objeto_habilidades
             WHERE objeto_id = ?
             ORDER BY coste_cargas ASC, nombre ASC`,
            [id]
        );

        const [conjuros] = await db.query<RowDataPacket[]>(
            `SELECT c.*, oc.coste_cargas, oc.notas
             FROM conjuros c
             JOIN objeto_conjuros oc ON c.id = oc.conjuro_id
             WHERE oc.objeto_id = ?
             ORDER BY oc.coste_cargas ASC, c.nombre ASC`,
            [id]
        );

        res.json({
            ...objeto,
            habilidades,
            conjuros
        });
    } catch (error) {
        console.error('Error al obtener el objeto mágico:', error);
        res.status(500).json({ mensaje: 'Error al obtener el objeto mágico' });
    }
};