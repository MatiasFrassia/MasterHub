import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { db } from '../config/db.js';

export const getObjetosMagicos = async (req: Request, res: Response): Promise<void> => {
    try {
        const [filas] = await db.query<RowDataPacket[]>(
            'SELECT id, nombre, tipo, rareza, sintonizacion, descripcion FROM objetos_magicos ORDER BY nombre ASC'
        );
        console.log('Objetos mágicos obtenidos:', filas); // Agrega este log para depuración
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
            'SELECT * FROM objetos_magicos WHERE id = ?',
            [id]
        );

        if (filas.length === 0) {
            res.status(404).json({ mensaje: 'Objeto mágico no encontrado' });
            return;
        }

        res.json(filas[0]);
    } catch (error) {
        console.error('Error al obtener el objeto mágico:', error);
        res.status(500).json({ mensaje: 'Error al obtener el objeto mágico' });
    }
};