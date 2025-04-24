"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DatosVentasSemanales {
  semana: string;
  ventas: number;
}

interface GraficoBarrasProps {
  datos: DatosVentasSemanales[];
}

export function GraficoBarras({ datos }: GraficoBarrasProps) {
  if (!datos?.length) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        No hay datos disponibles para mostrar
      </div>
    );
  }

  // Calcular el total de ventas
  const totalVentas = datos.reduce((sum, item) => sum + item.ventas, 0);

  return (
    <div className="flex flex-col">
      <div className="h-[400px] w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={datos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="stroke-gray-200" 
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="semana" 
              className="text-sm text-gray-600"
              tick={{ fill: '#4B5563' }}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              className="text-sm text-gray-600"
              tick={{ fill: '#4B5563' }}
              tickFormatter={(value) => `S/.${value.toLocaleString()}`}
              axisLine={{ stroke: '#E5E7EB' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip 
              formatter={(value: number) => [`S/.${value.toLocaleString()}`, 'Ventas']}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '0.375rem',
                padding: '0.5rem'
              }}
            />
            <Bar 
              dataKey="ventas" 
              fill="#F97316" 
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="py-2 px-4 text-center text-green-600 font-medium bg-white rounded-md shadow-sm border border-gray-100 mx-auto">
        Total: S/.{totalVentas.toLocaleString()}
      </div>
    </div>
  );
}
