import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        WEEK(fecha) AS semana, 
        ROUND(SUM(total * cantidad), 2) AS ventas
      FROM ventas
      GROUP BY WEEK(fecha)
      ORDER BY semana;
    `);
    
    // Verificar si hay datos
    if (!rows || (Array.isArray(rows) && rows.length === 0)) {
      return NextResponse.json([
        { semana: 1, ventas: 0 }
      ]);
    }
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error en la consulta de ventas semanales:', error);
    // En caso de error, devuelve datos estáticos para mantener la UI funcionando
    return NextResponse.json([
      { semana: 1, ventas: 0 },
      { semana: 2, ventas: 0 },
      { semana: 3, ventas: 0 },
      { semana: 4, ventas: 0 }
    ]);
  }
}; 