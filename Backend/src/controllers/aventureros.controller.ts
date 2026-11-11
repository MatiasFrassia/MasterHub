import { Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { db } from '../config/db.js';

export interface ClaseInput {
    clase: string;
    subclase?: string;
    nivel: number;
}

export const obtenerAventureros = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [filasAventureros] = await db.query<RowDataPacket[]>('SELECT * FROM aventureros ORDER BY id DESC');
        
        // Obtener las clases de todos los aventureros
        const [filasClases] = await db.query<RowDataPacket[]>('SELECT * FROM aventurero_clases');

        const aventureros = filasAventureros.map(adv => {
            // Galería JSON
            let imagenes_galeria: string[] = [];
            if (typeof adv.imagenes_galeria === 'string') {
                try { imagenes_galeria = JSON.parse(adv.imagenes_galeria); } catch (e) { imagenes_galeria = []; }
            } else if (Array.isArray(adv.imagenes_galeria)) {
                imagenes_galeria = adv.imagenes_galeria;
            }

            // Asociar clases
            const clases = filasClases
                .filter(c => c.aventurero_id === adv.id)
                .map(c => ({
                    id: c.id,
                    clase: c.clase,
                    subclase: c.subclase,
                    nivel: c.nivel
                }));

            // Calcular Nivel Total automáticamente
            const nivelTotal = clases.reduce((acc, c) => acc + c.nivel, 0);

            return {
                ...adv,
                nivel: nivelTotal > 0 ? nivelTotal : adv.nivel,
                clases,
                imagenes_galeria
            };
        });

        res.json(aventureros);
    } catch (error) {
        console.error('Error al obtener aventureros:', error);
        res.status(500).json({ mensaje: 'Error al obtener aventureros' });
    }
};

export const crearAventurero = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, raza, alineamiento, clase_armadura, hp_actual, hp_maximo, descripcion, clases: clasesRaw } = req.body;

        // Parsear array de clases recibido por FormData
        let clases: ClaseInput[] = [];
        if (typeof clasesRaw === 'string') {
            try { clases = JSON.parse(clasesRaw); } catch (e) { clases = []; }
        } else if (Array.isArray(clasesRaw)) {
            clases = clasesRaw;
        }

        if (clases.length === 0) {
            res.status(400).json({ mensaje: 'El aventurero debe tener al menos una clase' });
            return;
        }

        const nivelTotal = clases.reduce((acc, c) => acc + (Number(c.nivel) || 1), 0);

        // Procesar imágenes
        const files = req.files as Express.Multer.File[] | undefined;
        let imagenesGaleria: string[] = [];
        if (files && files.length > 0) {
            imagenesGaleria = files.map(file => `http://localhost:3000/uploads/aventureros/${file.filename}`);
        }

        const url_imagen = imagenesGaleria.length > 0 ? imagenesGaleria[0] : (req.body.url_imagen?.trim() || null);
        const jsonGaleria = imagenesGaleria.length > 0 ? JSON.stringify(imagenesGaleria) : null;

        // 1. Insertar Aventurero
        const [resAdv] = await db.query<ResultSetHeader>(
            `INSERT INTO aventureros (nombre, raza, alineamiento, url_imagen, imagenes_galeria, nivel, clase_armadura, hp_actual, hp_maximo, descripcion)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nombre, 
                raza, 
                alineamiento, 
                url_imagen, 
                jsonGaleria, 
                nivelTotal, 
                clase_armadura, 
                hp_actual, 
                hp_maximo, 
                descripcion?.trim() || null
            ]
        );

        const aventureroId = resAdv.insertId;

        // 2. Insertar Clases Relacionadas
        for (const item of clases) {
            await db.query(
                `INSERT INTO aventurero_clases (aventurero_id, clase, subclase, nivel) VALUES (?, ?, ?, ?)`,
                [aventureroId, item.clase.trim(), item.subclase?.trim() || null, item.nivel || 1]
            );
        }

        res.status(201).json({
            id: aventureroId,
            nombre,
            raza,
            alineamiento,
            url_imagen,
            imagenes_galeria: imagenesGaleria,
            nivel: nivelTotal,
            clases,
            clase_armadura,
            hp_actual,
            hp_maximo,
            descripcion
        });
    } catch (error) {
        console.error('Error al crear aventurero:', error);
        res.status(500).json({ mensaje: 'Error al crear aventurero' });
    }
};

export const actualizarHpAventurero = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { hp_actual } = req.body;

        await db.query('UPDATE aventureros SET hp_actual = ? WHERE id = ?', [hp_actual, id]);
        res.json({ mensaje: 'HP actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar HP:', error);
        res.status(500).json({ mensaje: 'Error al actualizar HP' });
    }
};

export const eliminarAventurero = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM aventureros WHERE id = ?', [id]);
        res.json({ mensaje: 'Aventurero eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar aventurero:', error);
        res.status(500).json({ mensaje: 'Error al eliminar aventurero' });
    }
};

export const actualizarAventurero = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { 
            nombre, 
            raza, 
            alineamiento, 
            clase_armadura, 
            hp_actual, 
            hp_maximo, 
            descripcion, 
            clases: clasesRaw, 
            imagenes_existentes: imagenesExistentesRaw 
        } = req.body;

        // 1. Parsear clases
        let clases: ClaseInput[] = [];
        if (typeof clasesRaw === 'string') {
            try { clases = JSON.parse(clasesRaw); } catch (e) { clases = []; }
        } else if (Array.isArray(clasesRaw)) {
            clases = clasesRaw;
        }

        if (clases.length === 0) {
            res.status(400).json({ mensaje: 'El aventurero debe tener al menos una clase' });
            return;
        }

        const nivelTotal = clases.reduce((acc, c) => acc + (Number(c.nivel) || 1), 0);

        // 2. Parsear imágenes existentes conservadas
        let imagenesExistentes: string[] = [];
        if (typeof imagenesExistentesRaw === 'string') {
            try { imagenesExistentes = JSON.parse(imagenesExistentesRaw); } catch (e) { imagenesExistentes = []; }
        } else if (Array.isArray(imagenesExistentesRaw)) {
            imagenesExistentes = imagenesExistentesRaw;
        }

        // 3. Procesar nuevas imágenes subidas por Multer
        const files = req.files as Express.Multer.File[] | undefined;
        let nuevasImagenes: string[] = [];
        if (files && files.length > 0) {
            nuevasImagenes = files.map(file => `http://localhost:3000/uploads/aventureros/${file.filename}`);
        }

        // 4. Combinar la galería final
        const galeriaFinal = [...imagenesExistentes, ...nuevasImagenes];
        const url_imagen = galeriaFinal.length > 0 ? galeriaFinal[0] : null;
        const jsonGaleria = galeriaFinal.length > 0 ? JSON.stringify(galeriaFinal) : null;

        // 5. Actualizar aventurero en DB
        await db.query(
            `UPDATE aventureros 
             SET nombre = ?, raza = ?, alineamiento = ?, url_imagen = ?, imagenes_galeria = ?, nivel = ?, clase_armadura = ?, hp_actual = ?, hp_maximo = ?, descripcion = ?
             WHERE id = ?`,
            [nombre, raza, alineamiento, url_imagen, jsonGaleria, nivelTotal, clase_armadura, hp_actual, hp_maximo, descripcion?.trim() || null, id]
        );

        // 6. Actualizar clases
        await db.query('DELETE FROM aventurero_clases WHERE aventurero_id = ?', [id]);
        for (const item of clases) {
            await db.query(
                `INSERT INTO aventurero_clases (aventurero_id, clase, subclase, nivel) VALUES (?, ?, ?, ?)`,
                [id, item.clase.trim(), item.subclase?.trim() || null, item.nivel || 1]
            );
        }

        res.json({ mensaje: 'Aventurero actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar aventurero:', error);
        res.status(500).json({ mensaje: 'Error al actualizar aventurero' });
    }
};