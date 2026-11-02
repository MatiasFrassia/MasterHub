import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2';
import { db } from '../config/db.js';

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

export const obtenerCriaturaPorId = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const [criaturas] = await db.query<RowDataPacket[]>(
            'SELECT * FROM criaturas WHERE id = ?',
            [id]
        );

        if (criaturas.length === 0) {
            res.status(404).json({ mensaje: 'Criatura no encontrada' });
            return;
        }

        const criatura = criaturas[0];

        // Forzar parseo de la galería si MySQL lo devuelve como string
        if (typeof criatura.imagenes_galeria === 'string') {
            try {
                criatura.imagenes_galeria = JSON.parse(criatura.imagenes_galeria);
            } catch (e) {
                criatura.imagenes_galeria = [];
            }
        }

        const [acciones] = await db.query<RowDataPacket[]>(
            'SELECT id, nombre, descripcion, tipo, uso_limitado FROM rasgos_y_acciones WHERE criatura_id = ?',
            [id]
        );

        const [conjuros] = await db.query<RowDataPacket[]>(
            `SELECT c.*, cc.modalidad 
             FROM conjuros c
             JOIN criatura_conjuros cc ON c.id = cc.conjuro_id
             WHERE cc.criatura_id = ?`,
            [id]
        );

        res.json({
            ...criatura,
            acciones,
            conjuros
        });
    } catch (error) {
        console.error('Error al obtener el detalle de la criatura:', error);
        res.status(500).json({ mensaje: 'Error al obtener la criatura' });
    }
};