"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraficoBarras } from "@/components/grafico-barras"
import GraficoCircular from "@/components/grafico-circular"

interface DatosSemanales {
  semana: string
  ventas: number
}

interface DatosCategorias {
  categoria: string
  valor: number
}

// Datos por defecto para mostrar mientras se cargan los reales
const DATOS_SEMANALES_FIJOS: DatosSemanales[] = [
  { semana: "Semana 0", ventas: 50 },
  { semana: "Semana 14", ventas: 960 }
];

const DATOS_CATEGORIAS_FIJOS: DatosCategorias[] = [
  { categoria: 'cargador ', valor: 70.9 },
  { categoria: 'USB ', valor: 18.6 },
  { categoria: 'pc ', valor: 10.5 }
];

export default function DashboardVentas() {
  const isMounted = useRef(true);
  const fetchTimerRef = useRef<NodeJS.Timeout | null>(null); 
  
  const [datosSemanales, setDatosSemanales] = useState<DatosSemanales[]>(DATOS_SEMANALES_FIJOS);
  const [datosCategorias, setDatosCategorias] = useState<DatosCategorias[]>(DATOS_CATEGORIAS_FIJOS);
  const [cargando, setCargando] = useState(false);

  // Solo actualizamos los datos si realmente hay diferencias significativas
  const actualizarDatosCategorias = useCallback((nuevosDatos: DatosCategorias[]) => {
    if (!nuevosDatos || nuevosDatos.length === 0) return;
    
    // Solo actualiza si realmente hay cambios significativos
    const hayDiferencias = 
      nuevosDatos.length !== datosCategorias.length || 
      nuevosDatos.some((item, index) => {
        const itemActual = datosCategorias[index];
        return !itemActual || 
               item.categoria !== itemActual.categoria || 
               Math.abs(Number(item.valor) - Number(itemActual.valor)) > 0.5;
      });
    
    if (hayDiferencias) {
      setDatosCategorias(nuevosDatos);
    }
  }, [datosCategorias]);

  const actualizarDatosSemanales = useCallback((nuevosDatos: DatosSemanales[]) => {
    if (!nuevosDatos || nuevosDatos.length === 0) return;
    
    // Solo actualiza si hay diferencias significativas
    const hayDiferencias = 
      nuevosDatos.length !== datosSemanales.length || 
      nuevosDatos.some((item, index) => {
        const itemActual = datosSemanales[index];
        return !itemActual || 
               item.semana !== itemActual.semana || 
               Math.abs(item.ventas - itemActual.ventas) > 0.5;
      });
    
    if (hayDiferencias) {
      setDatosSemanales(nuevosDatos);
    }
  }, [datosSemanales]);

  const fetchData = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      // Usamos el estado cargando solo internamente para no afectar la UI
      setCargando(true);
      
      // Carga datos semanales
      try {
        const resVentas = await fetch("/api/ventas");
        if (resVentas.ok) {
          const dataVentas = await resVentas.json();
          if (Array.isArray(dataVentas) && dataVentas.length > 0) {
            const transformados = dataVentas.map((item: any) => ({
              semana: `Semana ${item.semana}`,
              ventas: item.ventas
            }));
            actualizarDatosSemanales(transformados);
          }
        }
      } catch (err) {
        console.error("Error fetching ventas data:", err);
      }
      
      // Carga datos por categoría
      try {
        const resCategorias = await fetch("/api/ventas/Categorias");
        if (resCategorias.ok) {
          const dataCategorias = await resCategorias.json();
          if (Array.isArray(dataCategorias) && dataCategorias.length > 0) {
            actualizarDatosCategorias(dataCategorias);
          }
        }
      } catch (err) {
        console.error("Error fetching categorias data:", err);
      }
    } catch (error) {
      console.error("Error general:", error);
    } finally {
      if (isMounted.current) {
        setCargando(false);
      }
    }
  }, [actualizarDatosSemanales, actualizarDatosCategorias]);

  useEffect(() => {
    isMounted.current = true;
    
    // Cargar datos iniciales
    fetchData();
    
    // Limpieza al desmontar
    return () => {
      isMounted.current = false;
      if (fetchTimerRef.current) {
        clearTimeout(fetchTimerRef.current);
      }
    }
  }, [fetchData]);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard de Ventas</h1>
        <p className="text-muted-foreground">Análisis de ventas semanales y distribución por categoría</p>
      </div>

      <Tabs defaultValue="graficos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          <TabsTrigger value="datos">Datos</TabsTrigger>
        </TabsList>

        <TabsContent value="graficos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ventas por Semana</CardTitle>
                <CardDescription>Total de ventas registradas por semana</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <GraficoBarras datos={datosSemanales} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución de Ventas</CardTitle>
                <CardDescription>Porcentaje de ventas por categoría de producto</CardDescription>
              </CardHeader>
              <CardContent style={{ height: '400px', padding: '1rem' }}>
                <GraficoCircular datos={datosCategorias} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="datos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Datos de Ventas Semanales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {datosSemanales.map((item) => (
                    <div key={item.semana} className="flex justify-between items-center border-b pb-2">
                      <span className="font-medium">{item.semana}</span>
                      <span className="text-green-600 font-semibold">S/.{item.ventas.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Datos de Ventas por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {datosCategorias.map((item) => (
                    <div key={item.categoria} className="flex justify-between items-center border-b pb-2">
                      <span className="font-medium">{item.categoria}</span>
                      <span className="text-green-600 font-semibold">{item.valor}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
