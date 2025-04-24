import { pool } from '@/lib/db';
import { NextResponse } from 'next/server';

export const GET = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        WEEK(fecha) AS semana, 
        SUM(total) AS ventas
      FROM ventas
      GROUP BY WEEK(fecha)
      ORDER BY semana;
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener ventas semanales' }, { status: 500 });
  }
};
