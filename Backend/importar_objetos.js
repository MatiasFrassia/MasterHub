import fs from 'fs';
import csv from 'csv-parser';
import mysql from 'mysql2/promise';

(async () => {
    const db = await mysql.createConnection({
        host: 'localhost',
        user: 'root', 
        password: 'hpb-214-FI', 
        database: 'MASTERHUB_DB'
    });

    const objetos = [];
    console.log('Procesando Artefactos magicos.csv...');

    fs.createReadStream('Artefactos magicos.csv')
        .pipe(csv({ separator: ';' })) 
        .on('data', (row) => {
            // Buscamos la clave del nombre sin importar si tiene espacios o mayúsculas ocultas
            const keys = Object.keys(row);
            const claveNombre = keys.find(k => k.toLowerCase().includes('nombre'));
            const claveTipo = keys.find(k => k.toLowerCase().includes('tipo'));
            const claveRareza = keys.find(k => k.toLowerCase().includes('rareza'));
            const claveSintonizacion = keys.find(k => k.toLowerCase().includes('sintonizacion') || k.toLowerCase().includes('sintonización'));
            const claveDesc = keys.find(k => k.toLowerCase().includes('description') || k.toLowerCase().includes('descripción'));

            const nombre = claveNombre ? row[claveNombre]?.trim() : null;

            if (nombre) {
                objetos.push({
                    nombre: nombre,
                    tipo: claveTipo ? row[claveTipo]?.trim() || '' : '',
                    rareza: claveRareza ? row[claveRareza]?.trim() || '' : '',
                    sintonizacion: claveSintonizacion ? row[claveSintonizacion]?.trim() || '' : '',
                    descripcion: claveDesc ? row[claveDesc]?.trim() || '' : ''
                });
            }
        })
        .on('end', async () => {
            if (objetos.length === 0) {
                console.log('❌ Error: No se encontraron objetos válidos en el CSV.');
                await db.end();
                return;
            }

            console.log(`Se leyeron ${objetos.length} objetos del CSV. Guardando en la base de datos...`);

            let insertados = 0;
            const sql = `
                INSERT INTO objetos_magicos (nombre, tipo, rareza, sintonizacion, descripcion) 
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    tipo = VALUES(tipo),
                    rareza = VALUES(rareza),
                    sintonizacion = VALUES(sintonizacion),
                    descripcion = VALUES(descripcion);
            `;

            try {
                for (const obj of objetos) {
                    await db.query(sql, [
                        obj.nombre,
                        obj.tipo,
                        obj.rareza,
                        obj.sintonizacion,
                        obj.descripcion
                    ]);
                    insertados++;
                }
                console.log(`¡Éxito! Se procesaron e insertaron/actualizaron ${insertados} objetos mágicos correctamente.`);
            } catch (error) {
                console.error('Error al insertar en la base de datos:', error);
            } finally {
                await db.end();
            }
        });
})();