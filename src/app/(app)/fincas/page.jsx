"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  ChevronDown,
  Tractor,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import dashboardData from "@/data/dashboard-fincas-mock.json";
import { useFincas } from "@/hooks/fincas/useFincas";

export default function FincasDashboardPage() {
  const [alertasOpen, setAlertasOpen] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // "grid" o "list"
  const [currentPage, setCurrentPage] = useState(1);

  // Obtener fincas reales desde el backend
  const { data: fincasReales = [], isLoading, error } = useFincas();

  // Helper: Mezclar datos reales (nombre, contacto) con datos fake aleatorios (métricas visuales)
  const mezclarDatosRealYFake = (fincasReales) => {
    return fincasReales.map((finca) => {
      // Datos REALES del backend
      const nombre = finca.nombre;
      const contacto = finca.empresa_owner?.contacto_principal?.nombre || 'Sin contacto';

      // Datos FAKE aleatorios para métricas visuales
      const estados = [
        {
          estado: 'critico',
          badgeText: 'Crítico',
          badgeColor: 'bg-red-100 text-red-700',
          color: 'text-red-600',
          borderColor: 'border-red-500'
        },
        {
          estado: 'alerta',
          badgeText: 'Alerta',
          badgeColor: 'bg-amber-100 text-amber-700',
          color: 'text-amber-600',
          borderColor: 'border-amber-500'
        },
        {
          estado: 'cumplido',
          badgeText: 'Cumplido',
          badgeColor: 'bg-green-100 text-green-700',
          color: 'text-green-600',
          borderColor: 'border-green-500'
        }
      ];

      const estadoAleatorio = estados[Math.floor(Math.random() * estados.length)];
      const porcentajeAleatorio = Math.floor(Math.random() * 100) + 1;

      const tendencias = [
        { text: '↑ +15% esta semana', color: 'text-green-600' },
        { text: '↑ +10% esta semana', color: 'text-green-600' },
        { text: '↓ -5% esta semana', color: 'text-red-600' },
        { text: '↓ -8% esta semana', color: 'text-red-600' },
        { text: '→ Sin cambios', color: 'text-gray-600' }
      ];
      const tendenciaAleatoria = tendencias[Math.floor(Math.random() * tendencias.length)];

      const infosAdicionales = [
        'Muestras Tardías 5 Días',
        'Muestras Tardías 8 Días',
        'Próxima Visita en 48h',
        'Próxima Visita en 72h',
        'Próxima Visita en 96h'
      ];
      const infoAleatoria = infosAdicionales[Math.floor(Math.random() * infosAdicionales.length)];

      return {
        id: finca._id,
        titulo: nombre,                    // REAL
        contacto: contacto,                // REAL
        descripcion: 'Descripción placeholder',
        ...estadoAleatorio,
        porcentaje: porcentajeAleatorio,
        tendencia: tendenciaAleatoria.text,
        tendenciaColor: tendenciaAleatoria.color,
        infoAdicional: infoAleatoria
      };
    });
  };

  // Memorizar datos mezclados para evitar re-calcular en cada render
  const fincasMezcladas = useMemo(() =>
    mezclarDatosRealYFake(fincasReales),
    [fincasReales]
  );

  // Combinar todas las fincas
  const todasLasFincas = fincasMezcladas;

  // Paginación dinámica según el modo de vista
  const itemsPerPage = viewMode === "grid" ? 9 : 5; // 9 para grid (3x3), 5 para list
  const totalPages = Math.ceil(todasLasFincas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const fincasPaginadas = todasLasFincas.slice(startIndex, endIndex);

  // Dividir fincas paginadas en 3 columnas para vista Grid
  const columna1Grid = fincasPaginadas.filter((_, index) => index % 3 === 0);
  const columna2Grid = fincasPaginadas.filter((_, index) => index % 3 === 1);
  const columna3Grid = fincasPaginadas.filter((_, index) => index % 3 === 2);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Resetear a página 1 cuando cambie el modo de vista
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  // Manejo de estados de carga y error
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando fincas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-600">Error al cargar fincas: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="container mx-auto py-3 px-2 flex-1 flex flex-col space-y-4">
        {/* 4 Cards de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total de Fincas */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Fincas</p>
                <p className="text-3xl font-bold text-gray-900">{fincasReales.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Tractor className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Riesgo Crítico */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Riesgo Crítico</p>
                <p className="text-3xl font-bold text-red-600">8</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Alerta Previa */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Alerta Previa</p>
                <p className="text-3xl font-bold text-amber-600">23</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Tasa de Cumplimiento */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tasa de Cumplimiento</p>
                <p className="text-3xl font-bold text-green-600">92%</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de Acción */}
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            <button className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-900">
              ALL
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-600">
              Crítico (Rojo)
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-600">
              Alerta Previa
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 text-gray-600">
              Cumplidos
            </button>
          </div>

          {/* Toggle View */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-gray-200 text-gray-900"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-gray-200 text-gray-900"
                  : "hover:bg-gray-100 text-gray-600"
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* MOBILE & TABLET - Mantenemos la vista actual (siempre Grid) */}
        <div className="lg:hidden space-y-4 flex-1 overflow-hidden">
          {/* Alertas Colapsables */}
          <div className="bg-white rounded-lg p-4">
            <Collapsible open={alertasOpen} onOpenChange={setAlertasOpen}>
              <CollapsibleTrigger className="w-full flex items-center justify-between">
                <h2 className="text-lg font-semibold text-orange-600">Próximas tareas</h2>
                <ChevronDown
                  className={`h-5 w-5 text-orange-600 transition-transform ${alertasOpen ? 'rotate-180' : ''}`}
                />
              </CollapsibleTrigger>
              <CollapsibleContent>
                {/* Mobile: Scroll horizontal */}
                <div className="md:hidden flex space-x-4 overflow-x-auto pb-2 mt-4">
                  {dashboardData.alertas.map((alerta) => (
                    <Card key={alerta.id} className="min-w-[280px] hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 bg-green-200 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${alerta.badgeColor} mb-2`}>
                              {alerta.badgeText}
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{alerta.titulo}</h3>
                            <p className="text-xs text-gray-500 truncate">{alerta.subtitulo}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {/* Tablet: Scroll horizontal */}
                <div className="hidden md:flex md:space-x-4 md:overflow-x-auto mt-4">
                  {dashboardData.alertas.map((alerta) => (
                    <Card key={alerta.id} className="min-w-[280px] hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-16 h-16 bg-green-200 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${alerta.badgeColor} mb-2`}>
                              {alerta.badgeText}
                            </span>
                            <h3 className="text-sm font-semibold text-gray-900 truncate">{alerta.titulo}</h3>
                            <p className="text-xs text-gray-500 truncate">{alerta.subtitulo}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Fincas Mobile - Stack vertical con scroll */}
          <div className="md:hidden space-y-4 overflow-y-auto flex-1">
            {todasLasFincas.map((finca) => (
              <Card key={finca.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="relative pb-2">
                  <span className={`absolute top-4 left-4 px-2 py-1 text-xs font-medium rounded-full ${finca.badgeColor}`}>
                    {finca.badgeText}
                  </span>
                  <div className="text-xs mb-2 pt-8">
                    <span className={finca.tendenciaColor}>{finca.tendencia}</span>
                  </div>
                  <div className="flex items-center justify-center my-4">
                    <div className={`relative w-20 h-20 rounded-full border-8 ${finca.borderColor} flex items-center justify-center`}>
                      <span className={`text-2xl font-bold ${finca.color}`}>{finca.porcentaje}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Salud del Cultivo</p>
                </CardHeader>
                <CardContent>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{finca.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-2">Contacto: {finca.contacto}</p>
                  <p className="text-xs text-gray-500 mb-4">{finca.infoAdicional}</p>
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      Contacto
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                      Ver más
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Fincas Tablet - 3 columnas con scroll vertical */}
          <div className="hidden md:grid md:grid-cols-3 gap-4 overflow-y-auto flex-1">
            {/* Columna 1 */}
            <div className="space-y-4">
              {dashboardData.fincas.columna1.map((finca) => (
                <Card key={finca.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="relative pb-2">
                    <span className={`absolute top-4 left-4 px-2 py-1 text-xs font-medium rounded-full ${finca.badgeColor}`}>
                      {finca.badgeText}
                    </span>
                    <div className="text-xs mb-2 pt-8">
                      <span className={finca.tendenciaColor}>{finca.tendencia}</span>
                    </div>
                    <div className="flex items-center justify-center my-4">
                      <div className={`relative w-20 h-20 rounded-full border-8 ${finca.borderColor} flex items-center justify-center`}>
                        <span className={`text-2xl font-bold ${finca.color}`}>{finca.porcentaje}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Salud del Cultivo</p>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{finca.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-2">Contacto: {finca.contacto}</p>
                    <p className="text-xs text-gray-500 mb-4">{finca.infoAdicional}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Contacto
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                        Ver más
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Columna 2 */}
            <div className="space-y-4">
              {dashboardData.fincas.columna2.map((finca) => (
                <Card key={finca.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="relative pb-2">
                    <span className={`absolute top-4 left-4 px-2 py-1 text-xs font-medium rounded-full ${finca.badgeColor}`}>
                      {finca.badgeText}
                    </span>
                    <div className="text-xs mb-2 pt-8">
                      <span className={finca.tendenciaColor}>{finca.tendencia}</span>
                    </div>
                    <div className="flex items-center justify-center my-4">
                      <div className={`relative w-20 h-20 rounded-full border-8 ${finca.borderColor} flex items-center justify-center`}>
                        <span className={`text-2xl font-bold ${finca.color}`}>{finca.porcentaje}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Salud del Cultivo</p>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{finca.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-2">Contacto: {finca.contacto}</p>
                    <p className="text-xs text-gray-500 mb-4">{finca.infoAdicional}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Contacto
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                        Ver más
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Columna 3 */}
            <div className="space-y-4">
              {dashboardData.fincas.columna3.map((finca) => (
                <Card key={finca.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="relative pb-2">
                    <span className={`absolute top-4 left-4 px-2 py-1 text-xs font-medium rounded-full ${finca.badgeColor}`}>
                      {finca.badgeText}
                    </span>
                    <div className="text-xs mb-2 pt-8">
                      <span className={finca.tendenciaColor}>{finca.tendencia}</span>
                    </div>
                    <div className="flex items-center justify-center my-4">
                      <div className={`relative w-20 h-20 rounded-full border-8 ${finca.borderColor} flex items-center justify-center`}>
                        <span className={`text-2xl font-bold ${finca.color}`}>{finca.porcentaje}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 text-center">Salud del Cultivo</p>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{finca.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-2">Contacto: {finca.contacto}</p>
                    <p className="text-xs text-gray-500 mb-4">{finca.infoAdicional}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                        Contacto
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                        Ver más
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* DESKTOP: 75% fincas (Grid/List) + 25% alertas */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4 flex-1 overflow-hidden">
          {/* Columna izquierda 75% (3/4) - Vista condicional Grid o List */}
          <div className="col-span-3 flex flex-col">
            {viewMode === "grid" ? (
              // Vista GRID - 3 columnas de cards con paginación
              <div className="flex flex-col h-full">
                <div className="grid grid-cols-3 gap-4 flex-1 overflow-y-auto">
                  {/* Columna 1 */}
                  <div className="space-y-4">
                    {columna1Grid.map((finca) => (
                    <Card key={finca.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="relative pb-2">
                        <span className={`absolute top-4 left-4 px-2 py-1 text-xs font-medium rounded-full ${finca.badgeColor}`}>
                          {finca.badgeText}
                        </span>
                        <div className="text-xs mb-2 pt-8">
                          <span className={finca.tendenciaColor}>{finca.tendencia}</span>
                        </div>
                        <div className="flex items-center justify-center my-4">
                          <div className={`relative w-20 h-20 rounded-full border-8 ${finca.borderColor} flex items-center justify-center`}>
                            <span className={`text-2xl font-bold ${finca.color}`}>{finca.porcentaje}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">Salud del Cultivo</p>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{finca.titulo}</h3>
                        <p className="text-sm text-gray-600 mb-2">Contacto: {finca.contacto}</p>
                        <p className="text-xs text-gray-500 mb-4">{finca.infoAdicional}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Contacto
                          </button>
                          <button className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                            Ver más
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                  {/* Columna 2 */}
                  <div className="space-y-4">
                    {columna2Grid.map((finca) => (
                    <Card key={finca.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="relative pb-2">
                        <span className={`absolute top-4 left-4 px-2 py-1 text-xs font-medium rounded-full ${finca.badgeColor}`}>
                          {finca.badgeText}
                        </span>
                        <div className="text-xs mb-2 pt-8">
                          <span className={finca.tendenciaColor}>{finca.tendencia}</span>
                        </div>
                        <div className="flex items-center justify-center my-4">
                          <div className={`relative w-20 h-20 rounded-full border-8 ${finca.borderColor} flex items-center justify-center`}>
                            <span className={`text-2xl font-bold ${finca.color}`}>{finca.porcentaje}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">Salud del Cultivo</p>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{finca.titulo}</h3>
                        <p className="text-sm text-gray-600 mb-2">Contacto: {finca.contacto}</p>
                        <p className="text-xs text-gray-500 mb-4">{finca.infoAdicional}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Contacto
                          </button>
                          <button className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                            Ver más
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                  {/* Columna 3 */}
                  <div className="space-y-4">
                    {columna3Grid.map((finca) => (
                    <Card key={finca.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="relative pb-2">
                        <span className={`absolute top-4 left-4 px-2 py-1 text-xs font-medium rounded-full ${finca.badgeColor}`}>
                          {finca.badgeText}
                        </span>
                        <div className="text-xs mb-2 pt-8">
                          <span className={finca.tendenciaColor}>{finca.tendencia}</span>
                        </div>
                        <div className="flex items-center justify-center my-4">
                          <div className={`relative w-20 h-20 rounded-full border-8 ${finca.borderColor} flex items-center justify-center`}>
                            <span className={`text-2xl font-bold ${finca.color}`}>{finca.porcentaje}%</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 text-center">Salud del Cultivo</p>
                      </CardHeader>
                      <CardContent>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{finca.titulo}</h3>
                        <p className="text-sm text-gray-600 mb-2">Contacto: {finca.contacto}</p>
                        <p className="text-xs text-gray-500 mb-4">{finca.infoAdicional}</p>
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Contacto
                          </button>
                          <button className="flex-1 px-3 py-2 text-sm bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors">
                            Ver más
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  </div>
                </div>

                {/* Paginación para Grid */}
                <div className="bg-white rounded-lg mt-4">
                  <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      {startIndex + 1} de {todasLasFincas.length}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-1 text-sm rounded-md ${
                            currentPage === i + 1
                              ? "bg-gray-900 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Vista LIST - Tabla
              <div className="bg-white rounded-lg flex flex-col">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          STATUS
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FINCA
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CONTACTO
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PUNTAJE
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          TAREAS PENDIENTE
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {fincasPaginadas.map((finca) => (
                        <tr key={finca.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${finca.badgeColor}`}>
                              {finca.badgeText}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{finca.titulo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">
                                  {finca.contacto.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div className="text-sm text-gray-900">{finca.contacto}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className={`text-lg font-bold ${finca.color}`}>{finca.porcentaje}%</span>
                              <span className={`text-xs ${finca.tendenciaColor}`}>
                                {finca.tendencia.includes('↑') ? '↑' : '↓'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{finca.infoAdicional}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Paginación */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">
                    {startIndex + 1} de {todasLasFincas.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className={`px-3 py-1 text-sm rounded-md ${
                          currentPage === i + 1
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Columna derecha 25% (1/4) - Alertas con fondo blanco y scroll vertical */}
          <div className="col-span-1 bg-white rounded-lg p-4 overflow-y-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Próximas tareas</h2>
            <div className="space-y-4">
              {dashboardData.alertas.map((alerta) => (
                <Card key={alerta.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-16 bg-green-200 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${alerta.badgeColor} mb-2`}>
                          {alerta.badgeText}
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900 mb-1">{alerta.titulo}</h3>
                        <p className="text-xs text-gray-500">{alerta.subtitulo}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
