"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Car,
  Calendar,
  TrendingUp,
  Info,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  DollarSign,
} from "lucide-react";

export function Dashboard({ initialData }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Show error if data fetch failed
  if (!initialData || !initialData.success) {
    return (
      <Alert variant="destructive">
        <Info className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {initialData?.error || "Failed to load dashboard data"}
        </AlertDescription>
      </Alert>
    );
  }

  const { cars, testDrives } = initialData.data;

  return (
    <div className="space-y-6">
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <TabsList className="bg-card border border-accent/20">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="test-drives">Pruebas de conducción</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Coches totales
                </CardTitle>
                <Car className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cars.total}</div>
                <p className="text-xs text-muted-foreground">
                  {cars.available} activos, {cars.sold} vendidos
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pruebas agendadas
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.total}</div>
                <p className="text-xs text-muted-foreground">
                  {testDrives.pending} pendientes, {testDrives.confirmed} confirmadas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ratio de conversión
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {testDrives.conversionRate}%
                </div>
                <p className="text-xs text-muted-foreground">
                  De pruebas a ventas cerradas
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Coches vendidos</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{cars.sold}</div>
                <p className="text-xs text-muted-foreground">
                  {((cars.sold / cars.total) * 100).toFixed(1)}% del inventario
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Overview Content */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del concesionario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/80 border border-accent/15 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2 text-foreground">Inventario disponible</h3>
                    <div className="flex items-center">
                      <div className="w-full bg-accent/15 rounded-full h-2.5">
                        <div
                          className="bg-emerald-500 h-2.5 rounded-full"
                          style={{ width: `${(cars.available / cars.total) * 100}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-foreground">
                        {((cars.available / cars.total) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-foreground/60 mt-2">
                      Coches listos para ser mostrados a clientes
                    </p>
                  </div>

                  <div className="bg-background/80 border border-accent/15 p-4 rounded-lg">
                    <h3 className="font-medium text-sm mb-2 text-foreground">
                      Éxito en pruebas
                    </h3>
                    <div className="flex items-center">
                      <div className="w-full bg-accent/15 rounded-full h-2.5">
                        <div
                          className="bg-accent h-2.5 rounded-full"
                          style={{
                            width: `${
                              (testDrives.completed / (testDrives.total || 1)) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <span className="ml-2 text-sm text-foreground">
                        {(
                          (testDrives.completed / (testDrives.total || 1)) * 100
                        ).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-foreground/60 mt-2">
                      Pruebas completadas con éxito
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-accent">
                      {cars.sold}
                    </span>
                    <p className="text-sm text-foreground/60 mt-1">Ventas cerradas</p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-amber-500">
                      {testDrives.pending + testDrives.confirmed}
                    </span>
                    <p className="text-sm text-foreground/60 mt-1">
                      Pruebas próximas
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-emerald-500">
                      {((cars.available / (cars.total || 1)) * 100).toFixed(0)}%
                    </span>
                    <p className="text-sm text-foreground/60 mt-1">
                      Uso del inventario
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Drives Tab */}
        <TabsContent value="test-drives" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Solicitudes totales
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.pending}</div>
                <p className="text-xs text-muted-foreground">
                  {((testDrives.pending / testDrives.total) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.confirmed}</div>
                <p className="text-xs text-muted-foreground">
                  {((testDrives.confirmed / testDrives.total) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completadas</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.completed}</div>
                <p className="text-xs text-muted-foreground">
                  {((testDrives.completed / testDrives.total) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testDrives.cancelled}</div>
                <p className="text-xs text-muted-foreground">
                  {((testDrives.cancelled / testDrives.total) * 100).toFixed(1)}% del total
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Test Drive Status Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas de pruebas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Conversión a venta Card */}
                  <div className="bg-background/80 border border-accent/15 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Conversión a venta
                    </h3>
                    <div className="text-3xl font-bold text-accent">
                      {testDrives.conversionRate}%
                    </div>
                    <p className="text-sm text-foreground/60 mt-1">
                      Pruebas que terminaron en una venta
                    </p>
                  </div>

                  {/* Test Drive Success Rate */}
                  <div className="bg-background/80 border border-accent/15 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Pruebas completadas
                    </h3>
                    <div className="text-3xl font-bold text-emerald-500">
                      {testDrives.total
                        ? (
                            (testDrives.completed / testDrives.total) *
                            100
                          ).toFixed(1)
                        : 0}
                      %
                    </div>
                    <p className="text-sm text-foreground/60 mt-1">
                      Porcentaje de pruebas finalizadas correctamente
                    </p>
                  </div>
                </div>

                {/* Status Breakdown */}
                <div className="space-y-4 mt-4">
                  <h3 className="font-medium text-foreground">Distribución por estado</h3>

                  {/* Pendientes */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Pendientes</span>
                      <span className="font-medium">
                        {testDrives.pending} (
                        {(
                          (testDrives.pending / testDrives.total) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-accent/15 rounded-full h-2.5">
                      <div
                        className="bg-amber-500 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (testDrives.pending / testDrives.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Confirmadas */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Confirmadas</span>
                      <span className="font-medium">
                        {testDrives.confirmed} (
                        {(
                          (testDrives.confirmed / testDrives.total) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-accent/15 rounded-full h-2.5">
                      <div
                        className="bg-green-500 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (testDrives.confirmed / testDrives.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Completadas */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Completadas</span>
                      <span className="font-medium">
                        {testDrives.completed} (
                        {(
                          (testDrives.completed / testDrives.total) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-accent/15 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (testDrives.completed / testDrives.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Canceladas */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Canceladas</span>
                      <span className="font-medium">
                        {testDrives.cancelled} (
                        {(
                          (testDrives.cancelled / testDrives.total) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-accent/15 rounded-full h-2.5">
                      <div
                        className="bg-red-500 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (testDrives.cancelled / testDrives.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* No Show */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>No Show</span>
                      <span className="font-medium">
                        {testDrives.noShow} (
                        {((testDrives.noShow / testDrives.total) * 100).toFixed(
                          1
                        )}
                        %)
                      </span>
                    </div>
                    <div className="w-full bg-accent/15 rounded-full h-2.5">
                      <div
                        className="bg-background/80 border border-accent/150 h-2.5 rounded-full"
                        style={{
                          width: `${
                            (testDrives.noShow / testDrives.total) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
