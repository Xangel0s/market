"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraficoBarras } from "@/components/grafico-barras"
import { GraficoCircular } from "@/components/grafico-circular"

interface DatosSemanales {
  semana: string
  ventas: number
}

interface DatosCategorias {
  name: string
  value: number
}

// Datos por defecto para mostrar mientras se cargan los reales
const DATOS_SEMANALES_FIJOS: DatosSemanales[] = [
  { semana: "Semana 0", ventas: 50 },
  { semana: "Semana 14", ventas: 960 }
];

const DATOS_CATEGORIAS_FIJOS: DatosCategorias[] = [
  { name: 'cargador ', value: 70.9 },
  { name: 'USB ', value: 18.6 },
  { name: 'pc ', value: 10.5 }
];

const DATOS_SEMANALES_DEFAULT: DatosSemanales[] = [
  { semana: "Semana 1", ventas: 0 },
  { semana: "Semana 2", ventas: 0 },
  { semana: "Semana 3", ventas: 0 },
  { semana: "Semana 4", ventas: 0 },
];

const DATOS_CATEGORIAS_DEFAULT: DatosCategorias[] = [
  { name: "Categoría 1", value: 0 },
  { name: "Categoría 2", value: 0 },
  { name: "Categoría 3", value: 0 },
];

export function DashboardVentas() {
  const isMounted = useRef(true);
  const fetchTimerRef = useRef<NodeJS.Timeout | null>(null); 
  
  const [datosSemanales, setDatosSemanales] = useState<DatosSemanales[]>(DATOS_SEMANALES_DEFAULT);
  const [datosCategorias, setDatosCategorias] = useState<DatosCategorias[]>(DATOS_CATEGORIAS_DEFAULT);
  const [activeTab, setActiveTab] = useState("graficos");
  const [cargando, setCargando] = useState(false);

  // Solo actualizamos los datos si realmente hay diferencias significativas
  const actualizarDatosCategorias = useCallback((nuevosDatos: any[]) => {
    if (!nuevosDatos || nuevosDatos.length === 0) return;
    
    // Convertir los datos al formato esperado por el componente
    const datosFormateados = nuevosDatos.map(item => ({
      name: item.categoria,
      value: parseFloat(item.valor)
    }));
    
    // Solo actualiza si realmente hay cambios significativos
    const hayDiferencias = 
      datosFormateados.length !== datosCategorias.length || 
      datosFormateados.some((item, index) => {
        const itemActual = datosCategorias[index];
        return !itemActual || 
               item.name !== itemActual.name || 
               Math.abs(Number(item.value) - Number(itemActual.value)) > 0.5;
      });
    
    if (hayDiferencias) {
      setDatosCategorias(datosFormateados);
    }
  }, [datosCategorias]);

  const actualizarDatosSemanales = useCallback((nuevosDatos: any[]) => {
    if (!nuevosDatos || nuevosDatos.length === 0) return;
    
    // Convertir los datos al formato esperado por el componente
    const datosFormateados = nuevosDatos.map(item => ({
      semana: `Semana ${item.semana}`,
      ventas: parseFloat(item.ventas)
    }));
    
    // Solo actualiza si hay diferencias significativas
    const hayDiferencias = 
      datosFormateados.length !== datosSemanales.length || 
      datosFormateados.some((item, index) => {
        const itemActual = datosSemanales[index];
        return !itemActual || 
               item.semana !== itemActual.semana || 
               Math.abs(item.ventas - itemActual.ventas) > 0.5;
      });
    
    if (hayDiferencias) {
      setDatosSemanales(datosFormateados);
    }
  }, [datosSemanales]);

  const actualizarDatos = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      // Usamos el estado cargando solo internamente para no afectar la UI
      setCargando(true);
      
      const [ventasRes, categoriasRes] = await Promise.all([
        fetch("/api/ventas"),
        fetch("/api/ventas/Categorias")
      ]);

      const [ventasData, categoriasData] = await Promise.all([
        ventasRes.json(),
        categoriasRes.json()
      ]);

      if (ventasData?.length) {
        actualizarDatosSemanales(ventasData);
      }
      if (categoriasData?.length) {
        actualizarDatosCategorias(categoriasData);
      }
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    } finally {
      if (isMounted.current) {
        setCargando(false);
      }
    }
  }, [actualizarDatosCategorias, actualizarDatosSemanales]);

  useEffect(() => {
    isMounted.current = true;
    
    // Cargar datos iniciales
    actualizarDatos();
    
    // Configurar actualización periódica (cada 5 minutos)
    fetchTimerRef.current = setInterval(actualizarDatos, 5 * 60 * 1000);
    
    // Limpieza al desmontar
    return () => {
      isMounted.current = false;
      if (fetchTimerRef.current) {
        clearInterval(fetchTimerRef.current);
      }
    }
  }, [actualizarDatos]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("graficos")}
              className={`${
                activeTab === "graficos"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Gráficos
            </button>
            <button
              onClick={() => setActiveTab("datos")}
              className={`${
                activeTab === "datos"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Datos
            </button>
          </nav>
        </div>
      </div>

      {activeTab === "graficos" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas Semanales</CardTitle>
              <CardDescription>Distribución de ventas por semana</CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoBarras datos={datosSemanales} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Categoría</CardTitle>
              <CardDescription>Distribución de ventas por categoría de producto</CardDescription>
            </CardHeader>
            <CardContent>
              <GraficoCircular datos={datosCategorias} />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Ventas Semanales</CardTitle>
              <CardDescription>Datos detallados de ventas por semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semana
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ventas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {datosSemanales.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.semana}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          S/.{item.ventas.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Ventas por Categoría</CardTitle>
              <CardDescription>Datos detallados de ventas por categoría</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {datosCategorias.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          S/.{item.value.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
