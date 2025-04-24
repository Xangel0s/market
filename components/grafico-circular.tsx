'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface DatosCategorias {
  name: string;
  value: number;
}

interface GraficoCircularProps {
  datos: DatosCategorias[];
}

// Definir la interfaz para los props del label
interface PieChartLabelProps {
  name: string;
  percent: number;
}

export function GraficoCircular({ datos }: GraficoCircularProps) {
  if (!datos?.length) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        No hay datos disponibles para mostrar
      </div>
    );
  }

  const total = datos.reduce((sum, item) => sum + item.value, 0);

  // Ordenar las categorías por porcentaje (de mayor a menor)
  const datosOrdenados = [...datos].sort((a, b) => b.value - a.value);

  // Añadir porcentaje al nombre para la leyenda
  const datosConPorcentaje = datosOrdenados.map(item => ({
    ...item,
    porcentaje: (item.value / total) * 100,
    nombreConPorcentaje: `${item.name} (${((item.value / total) * 100).toFixed(1)}%)`
  }));

  // Función para renderizar las etiquetas con el porcentaje
  const renderLabel = (props: PieChartLabelProps): string => {
    return `${(props.percent * 100).toFixed(0)}%`;
  };

  // Crear un resumen de recomendación basado en los porcentajes
  const categoriasPrincipales = datosConPorcentaje
    .filter(item => item.porcentaje >= 10) // Solo categorías con más del 10%
    .map(item => item.name)
    .join(', ');

  const recomendacion = categoriasPrincipales 
    ? `Principales: ${categoriasPrincipales}`
    : 'No hay categorías destacadas';

  return (
    <div className="flex flex-col">
      <div className="h-[400px] w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={datosConPorcentaje}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={140}
              fill="#8884d8"
              dataKey="value"
              nameKey="nombreConPorcentaje"
              paddingAngle={1}
            >
              {datosConPorcentaje.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props: any) => {
                const porcentaje = ((value / total) * 100).toFixed(1);
                return [`S/.${value.toLocaleString()} (${porcentaje}%)`, props.payload.name];
              }}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '0.375rem',
                padding: '0.5rem'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="py-2 px-4 text-center text-green-600 font-medium bg-white rounded-md shadow-sm border border-gray-100 mx-auto">
        Total: 100% | {recomendacion}
      </div>
    </div>
  );
}
