'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useMemo, useState, useEffect } from 'react';

const COLORS = ['#2196F3', '#4CAF50', '#FFC107', '#FF5722', '#9C27B0'];

interface DatosCategoria {
  categoria: string;
  valor: number;
}

export default function GraficoCircular({ datos }: { datos: DatosCategoria[] }) {
  // Mantenemos datos anteriores para transiciones suaves
  const [datosEstables, setDatosEstables] = useState<DatosCategoria[]>(datos || []);
  
  // Procesamos los datos numéricos una sola vez
  const datosNumericos = useMemo(() => {
    if (!datosEstables || datosEstables.length === 0) return [];
    
    return datosEstables.map(item => ({
      ...item,
      valor: typeof item.valor === 'string' ? parseFloat(item.valor) : item.valor
    }));
  }, [datosEstables]);
  
  // Actualizamos los datos estables solo cuando hay cambios significativos
  useEffect(() => {
    if (!datos || datos.length === 0) return;
    
    // Verificamos si hay cambios significativos para prevenir renderizados innecesarios
    const hayDiferencias = 
      datos.length !== datosEstables.length || 
      datos.some((item, index) => {
        if (index >= datosEstables.length) return true;
        return item.categoria !== datosEstables[index].categoria ||
               Math.abs(Number(item.valor) - Number(datosEstables[index].valor)) > 0.1;
      });
    
    if (hayDiferencias) {
      setDatosEstables(datos);
    }
  }, [datos, datosEstables]);

  if (datosNumericos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 400, position: 'relative' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={datosNumericos}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            outerRadius={120}
            innerRadius={60}
            fill="#8884d8"
            dataKey="valor"
            nameKey="categoria"
            isAnimationActive={false}
          >
            {datosNumericos.map((entry, index) => (
              <Cell 
                key={`cell-${index}-${entry.categoria}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `${value.toFixed(1)}%`}
            contentStyle={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '8px 12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: 'none'
            }}
            animationDuration={0}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
