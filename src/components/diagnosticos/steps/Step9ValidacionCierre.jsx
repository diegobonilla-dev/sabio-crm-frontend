"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { validacionCierreSchema } from "@/lib/validations/diagnostico.schema";
import { CheckCircle2, Clock, FileCheck, UserCheck, AlertCircle, FileText } from "lucide-react";

export default function Step9ValidacionCierre({ data, onChange }) {
  const {
    register,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(validacionCierreSchema),
    defaultValues: data?.validacion_cierre || {
      firma_tecnico: {},
      firma_productor: {},
      resumen: {
        diagnosticos_completos: 1,
        muestras_enviadas: 0
      }
    }
  });

  const formValues = watch();
  const aceptaTerminos = watch("acepta_terminos");

  // Referencias para los canvas
  const canvasTecnicoRef = useRef(null);
  const canvasProductorRef = useRef(null);

  // Estados para saber si se está dibujando
  const [isDibujandoTecnico, setIsDibujandoTecnico] = useState(false);
  const [isDibujandoProductor, setIsDibujandoProductor] = useState(false);

  // Estados para controlar si hay firma
  const [hayFirmaTecnico, setHayFirmaTecnico] = useState(false);
  const [hayFirmaProductor, setHayFirmaProductor] = useState(false);

  // Auto-save on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange({ validacion_cierre: formValues });
    }, 300);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues]);

  // Inicializar canvas cuando el componente se monta
  useEffect(() => {
    inicializarCanvas(canvasTecnicoRef);
    inicializarCanvas(canvasProductorRef);

    // Cargar firmas existentes si las hay
    if (formValues.firma_tecnico?.firma_digital) {
      cargarFirmaEnCanvas(canvasTecnicoRef, formValues.firma_tecnico.firma_digital);
      setHayFirmaTecnico(true);
    }
    if (formValues.firma_productor?.firma_digital) {
      cargarFirmaEnCanvas(canvasProductorRef, formValues.firma_productor.firma_digital);
      setHayFirmaProductor(true);
    }
  }, [formValues.firma_tecnico?.firma_digital, formValues.firma_productor?.firma_digital]);

  // Calcular resumen automáticamente
  useEffect(() => {
    // Contar muestras enviadas
    let muestrasEnviadas = 0;
    if (data?.observaciones_seguimiento?.muestra_forraje) muestrasEnviadas++;
    if (data?.observaciones_seguimiento?.muestra_agua) muestrasEnviadas++;
    if (data?.observaciones_seguimiento?.muestras_suelo_lotes) {
      muestrasEnviadas += data.observaciones_seguimiento.muestras_suelo_lotes.filter(m => m.seleccionado).length;
    }

    setValue("resumen.diagnosticos_completos", 1);
    setValue("resumen.muestras_enviadas", muestrasEnviadas);
  }, [data, setValue]);

  const inicializarCanvas = (canvasRef) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Configurar canvas
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Fondo blanco
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const cargarFirmaEnCanvas = (canvasRef, firmaBase64) => {
    if (!canvasRef.current || !firmaBase64) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };

    img.src = firmaBase64;
  };

  const iniciarDibujo = (e, canvasRef, setIsDibujando) => {
    e.preventDefault();
    setIsDibujando(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    let x, y;
    if (e.type === "touchstart") {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const dibujar = (e, canvasRef, isDibujando, setHayFirma) => {
    e.preventDefault();
    if (!isDibujando) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    let x, y;
    if (e.type === "touchmove") {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    setHayFirma(true);
  };

  const finalizarDibujo = (canvasRef, setIsDibujando, campo) => {
    setIsDibujando(false);

    // Guardar firma en formato base64
    const canvas = canvasRef.current;
    const firmaBase64 = canvas.toDataURL("image/png");
    setValue(`${campo}.firma_digital`, firmaBase64);
  };

  const limpiarFirma = (canvasRef, setHayFirma, campo) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Limpiar canvas
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setHayFirma(false);
    setValue(`${campo}.firma_digital`, "");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* HEADER */}

      {/* SECCIÓN 1: HORA DE FINALIZACIÓN */}
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Hora de Finalización</CardTitle>
          </div>
          <CardDescription>
            Registre la fecha y hora de finalización del diagnóstico
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_finalizacion" className="text-sm font-medium">
                Fecha de Finalización
              </Label>
              <Input
                id="fecha_finalizacion"
                type="date"
                {...register("fecha_finalizacion")}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="hora_finalizacion" className="text-sm font-medium">
                Hora de Finalización
              </Label>
              <Input
                id="hora_finalizacion"
                type="time"
                {...register("hora_finalizacion")}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 2: REVISIÓN DEL DÍA A DÍA */}
      <Card className="border-purple-200">
        <CardHeader className="bg-purple-50">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">Revisión del día a día</CardTitle>
          </div>
          <CardDescription>
            Evaluación breve de la visita realizada
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div>
            <Label htmlFor="revision_visita" className="text-sm font-medium">
              ¿Cómo estuvo el día a día de la visita?
            </Label>
            <Textarea
              id="revision_visita"
              placeholder="Describa brevemente cómo se desarrolló la visita, impresiones generales, colaboración del productor, etc..."
              {...register("revision_visita")}
              className="mt-1 min-h-[100px]"
            />
            {errors.revision_visita && (
              <p className="text-sm text-red-600 mt-1">{errors.revision_visita.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 3: FIRMAS DE VALIDACIÓN */}
      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-green-600" />
            <CardTitle className="text-lg">Firmas de Validación</CardTitle>
          </div>
          <CardDescription>
            Firmas digitales del técnico responsable y del productor/cliente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Grid de firmas - Responsive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* FIRMA TÉCNICO RESPONSABLE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Técnico Responsable</h3>
                  <p className="text-xs text-gray-600">Firma del técnico de SaBio</p>
                </div>
              </div>

              {/* Datos del técnico */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="firma_tecnico_nombre" className="text-sm">
                    Nombre completo del técnico
                  </Label>
                  <Input
                    id="firma_tecnico_nombre"
                    type="text"
                    placeholder="Nombre completo"
                    {...register("firma_tecnico.nombre_completo")}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="firma_tecnico_cedula" className="text-sm">
                    Cédula / Documento
                  </Label>
                  <Input
                    id="firma_tecnico_cedula"
                    type="text"
                    placeholder="Número de documento"
                    {...register("firma_tecnico.cedula")}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Canvas de firma */}
              <div className="space-y-2">
                <Label className="text-sm">Firma digital</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
                  <canvas
                    ref={canvasTecnicoRef}
                    width={400}
                    height={200}
                    className="w-full h-[200px] touch-none cursor-crosshair border border-gray-200 rounded"
                    onMouseDown={(e) => iniciarDibujo(e, canvasTecnicoRef, setIsDibujandoTecnico)}
                    onMouseMove={(e) => dibujar(e, canvasTecnicoRef, isDibujandoTecnico, setHayFirmaTecnico)}
                    onMouseUp={() => finalizarDibujo(canvasTecnicoRef, setIsDibujandoTecnico, "firma_tecnico")}
                    onMouseLeave={() => setIsDibujandoTecnico(false)}
                    onTouchStart={(e) => iniciarDibujo(e, canvasTecnicoRef, setIsDibujandoTecnico)}
                    onTouchMove={(e) => dibujar(e, canvasTecnicoRef, isDibujandoTecnico, setHayFirmaTecnico)}
                    onTouchEnd={() => finalizarDibujo(canvasTecnicoRef, setIsDibujandoTecnico, "firma_tecnico")}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">Dibuje su firma arriba</p>
                  {hayFirmaTecnico && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => limpiarFirma(canvasTecnicoRef, setHayFirmaTecnico, "firma_tecnico")}
                      className="text-red-600 hover:text-red-700"
                    >
                      Limpiar firma
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* FIRMA PRODUCTOR/CLIENTE */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Productor / Cliente</h3>
                  <p className="text-xs text-gray-600">Firma del propietario de la finca</p>
                </div>
              </div>

              {/* Datos del productor */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="firma_productor_nombre" className="text-sm">
                    Nombre completo del productor
                  </Label>
                  <Input
                    id="firma_productor_nombre"
                    type="text"
                    placeholder="Nombre completo"
                    {...register("firma_productor.nombre_completo")}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="firma_productor_cedula" className="text-sm">
                    Cédula / Documento
                  </Label>
                  <Input
                    id="firma_productor_cedula"
                    type="text"
                    placeholder="Número de documento"
                    {...register("firma_productor.cedula")}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Canvas de firma */}
              <div className="space-y-2">
                <Label className="text-sm">Firma digital</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
                  <canvas
                    ref={canvasProductorRef}
                    width={400}
                    height={200}
                    className="w-full h-[200px] touch-none cursor-crosshair border border-gray-200 rounded"
                    onMouseDown={(e) => iniciarDibujo(e, canvasProductorRef, setIsDibujandoProductor)}
                    onMouseMove={(e) => dibujar(e, canvasProductorRef, isDibujandoProductor, setHayFirmaProductor)}
                    onMouseUp={() => finalizarDibujo(canvasProductorRef, setIsDibujandoProductor, "firma_productor")}
                    onMouseLeave={() => setIsDibujandoProductor(false)}
                    onTouchStart={(e) => iniciarDibujo(e, canvasProductorRef, setIsDibujandoProductor)}
                    onTouchMove={(e) => dibujar(e, canvasProductorRef, isDibujandoProductor, setHayFirmaProductor)}
                    onTouchEnd={() => finalizarDibujo(canvasProductorRef, setIsDibujandoProductor, "firma_productor")}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-gray-500">Dibuje su firma arriba</p>
                  {hayFirmaProductor && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => limpiarFirma(canvasProductorRef, setHayFirmaProductor, "firma_productor")}
                      className="text-red-600 hover:text-red-700"
                    >
                      Limpiar firma
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 4: RESUMEN DE VALIDACIÓN */}
      <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 to-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg text-indigo-900">Resumen de Validación</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Diagnósticos completos */}
            <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-indigo-200">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                <FileCheck className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">Diagnósticos completos / finca posible</p>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-indigo-900 mt-1">
                  {formValues.resumen?.diagnosticos_completos || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Todos los campos requeridos han sido completados
                </p>
              </div>
            </div>

            {/* Muestras enviadas */}
            <div className="flex items-start gap-4 p-4 bg-white rounded-lg border border-indigo-200">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-600">Muestras enviadas</p>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-purple-900 mt-1">
                  {formValues.resumen?.muestras_enviadas || 0}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Muestras documentadas en observaciones y seguimiento
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECCIÓN 5: TÉRMINOS Y CONDICIONES */}
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg text-amber-900">Términos y Condiciones</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-amber-200 max-h-[200px] overflow-y-auto">
            <p className="text-sm text-gray-700 leading-relaxed">
              Al firmar este documento, ambas partes confirman que:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mt-2">
              <li>La información registrada durante la visita técnica es veraz y corresponde a las condiciones observadas.</li>
              <li>Las recomendaciones y medidas de control sugeridas están basadas en el diagnóstico realizado.</li>
              <li>Las muestras tomadas y documentadas serán enviadas al laboratorio conforme a los protocolos establecidos.</li>
              <li>Los datos recopilados serán utilizados únicamente para fines técnicos y de seguimiento del programa de asistencia técnica.</li>
              <li>Ambas partes se comprometen a mantener la confidencialidad de la información sensible compartida durante la visita.</li>
              <li>El productor autoriza el uso de fotografías y registros para fines de seguimiento técnico y reportes internos.</li>
            </ul>
          </div>

          <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border-2 border-amber-300">
            <Checkbox
              id="acepta_terminos"
              checked={aceptaTerminos || false}
              onCheckedChange={(checked) => setValue("acepta_terminos", checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <Label htmlFor="acepta_terminos" className="cursor-pointer font-medium text-gray-900">
                Acepto las recomendaciones y observaciones realizadas durante la visita
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                Al marcar esta casilla, confirmo que he leído y acepto los términos descritos arriba.
              </p>
            </div>
          </div>

          {errors.acepta_terminos && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {errors.acepta_terminos.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Información de Errores */}
      {Object.keys(errors).length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Por favor, complete todos los campos requeridos antes de finalizar:
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 mt-2 space-y-1">
                  {errors.revision_visita && <li>Revisión de la visita es requerida</li>}
                  {errors.acepta_terminos && <li>Debe aceptar los términos y condiciones</li>}
                  {!hayFirmaTecnico && <li>Firma del técnico responsable es requerida</li>}
                  {!hayFirmaProductor && <li>Firma del productor/cliente es requerida</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
