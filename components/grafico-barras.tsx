"use client"

import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

interface DatosVentasSemanales {
  semana: string
  ventas: number
}

interface GraficoBarrasProps {
  datos: DatosVentasSemanales[]
}

export function GraficoBarras({ datos }: GraficoBarrasProps) {
  if (!datos.length) return <p>Cargando gráfico de barras...</p>;

  return (
    <div style={{ width: "100%", height:  300 }}>
      <ResponsiveContainer>
        <BarChart
          data={datos}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="semana" />
          <YAxis tickFormatter={(value) => `S/.${value}`} />
          <Tooltip formatter={(value: number) => `S/.${value.toLocaleString()}`} />
          <Bar dataKey="ventas" fill="#ff7514 " radius={[1, 1, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
