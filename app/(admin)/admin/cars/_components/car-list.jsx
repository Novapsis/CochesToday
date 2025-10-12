"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Search,
  MoreHorizontal,
  Star,
  StarOff,
  Trash2,
  Eye,
  Loader2,
  Car as CarIcon,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import useFetch from "@/hooks/use-fetch";
import { getCars, deleteCar, updateCarStatus } from "@/actions/cars";
import { sendMessageToUser } from "@/actions/admin-management";
import { formatCurrency } from "@/lib/helpers";
import Image from "next/image";

export const CarsList = () => {
  const router = useRouter();

  // State for search and dialogs
  const [search, setSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [carToMessage, setCarToMessage] = useState(null);
  const [messageContent, setMessageContent] = useState("");

  // Custom hooks for API calls
  const {
    loading: loadingCars,
    fn: fetchCars,
    data: carsData,
    error: carsError,
  } = useFetch(getCars);

  const {
    loading: deletingCar,
    fn: deleteCarFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteCar);

  const {
    loading: updatingCar,
    fn: updateCarStatusFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateCarStatus);

  const {
    loading: sendingMessage,
    fn: sendMessageFn,
    data: sendMessageResult,
    error: sendMessageError,
  } = useFetch(sendMessageToUser);

  // Initial fetch and refetch on search changes
  useEffect(() => {
    fetchCars(search);
  }, [search]);

  // Handle errors
  useEffect(() => {
    if (carsError) {
      toast.error("No se pudieron cargar los coches");
    }

    if (deleteError) {
      toast.error("No se pudo eliminar el coche");
    }

    if (updateError) {
      toast.error("No se pudo actualizar el coche");
    }
    if (sendMessageError) {
      toast.error(sendMessageError.message || "No se pudo enviar el mensaje");
    }
  }, [carsError, deleteError, updateError, sendMessageError]);

  // Handle successful operations
  useEffect(() => {
    if (deleteResult?.success) {
      toast.success("Coche eliminado correctamente");
      fetchCars(search);
    }

    if (updateResult?.success) {
      toast.success("Coche actualizado correctamente");
      fetchCars(search);
    }
    if (sendMessageResult?.success) {
      toast.success("Mensaje enviado");
      setMessageContent("");
      setCarToMessage(null);
      setMessageDialogOpen(false);
    } else if (sendMessageResult && !sendMessageResult.success) {
      toast.error(sendMessageResult.error || "No se pudo enviar el mensaje");
    }
  }, [deleteResult, updateResult, sendMessageResult, search]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCars(search);
  };

  // Handle delete car
  const handleDeleteCar = async () => {
    if (!carToDelete) return;

    await deleteCarFn(carToDelete.id);
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };

  // Handle toggle featured status
  const handleToggleFeatured = async (car) => {
    await updateCarStatusFn(car.id, { featured: !car.featured });
  };

  // Handle status change
  const handleStatusUpdate = async (car, newStatus) => {
    await updateCarStatusFn(car.id, { status: newStatus });
  };

  const handleSendMessage = async () => {
    if (!carToMessage || !carToMessage.owner) {
      toast.error("No se encontró el propietario del coche");
      return;
    }
    const trimmed = messageContent.trim();
    if (!trimmed) {
      toast.error("Escribe un mensaje antes de enviarlo");
      return;
    }
    await sendMessageFn({ userId: carToMessage.owner.id, content: trimmed });
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    const normalized = status?.toLowerCase?.() ?? "";
    switch (normalized) {
      case "activo":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
            Activo
          </Badge>
        );
      case "reservado":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            Reservado
          </Badge>
        );
      case "vendido":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Vendido
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-accent/40 text-foreground">
            {status || "Desconocido"}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Actions and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Button
          onClick={() => router.push("/admin/cars/create")}
          className="flex items-center"
        >
          <Plus className="h-4 w-4" />
          Añadir coche
        </Button>

        {/* Simple Search Form */}
        <form onSubmit={handleSearchSubmit} className="flex w-full sm:w-auto">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/40" />
            <Input
              type="search"
              placeholder="Buscar por marca, modelo o color..."
              className="pl-9 w-full sm:w-60"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
      </div>

      {/* Cars Table */}
      <Card>
        <CardContent className="p-0">
          {loadingCars && !carsData ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-foreground/40" />
            </div>
          ) : carsData?.success && carsData.data.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Coche</TableHead>
                    <TableHead>Año</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Destacado</TableHead>
                    <TableHead>Propietario</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carsData.data.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div className="w-10 h-10 rounded-md overflow-hidden">
                          {car.images && car.images.length > 0 ? (
                            <Image
                              src={car.images[0]}
                              alt={`${car.make} ${car.model}`}
                              height={40}
                              width={40}
                              className="w-full h-full object-cover"
                              priority
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <CarIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {car.make} {car.model}
                      </TableCell>
                      <TableCell>{car.year}</TableCell>
                      <TableCell>{formatCurrency(car.price)}</TableCell>
                      <TableCell>{getStatusBadge(car.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-9 w-9"
                          onClick={() => handleToggleFeatured(car)}
                          disabled={updatingCar}
                        >
                          {car.featured ? (
                            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                          ) : (
                            <StarOff className="h-5 w-5 text-foreground/30" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {car.owner ? (
                          <div className="flex flex-col items-start">
                            <span className="text-sm font-medium text-foreground">
                              {car.owner.name}
                            </span>
                            <span className="text-xs text-foreground/60">
                              {car.owner.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-foreground/50">
                            Sin propietario
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => router.push(`/cars/${car.id}`)}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver ficha pública
                            </DropdownMenuItem>
                            {car.owner && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setCarToMessage(car);
                                  setMessageDialogOpen(true);
                                }}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                Enviar mensaje
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Estado</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(car, "activo")
                              }
                              disabled={
                                car.status?.toLowerCase() === "activo" ||
                                updatingCar
                              }
                            >
                              Marcar como activo
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusUpdate(car, "reservado")
                              }
                              disabled={
                                car.status?.toLowerCase() === "reservado" ||
                                updatingCar
                              }
                            >
                              Marcar como reservado
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(car, "vendido")}
                              disabled={
                                car.status?.toLowerCase() === "vendido" ||
                                updatingCar
                              }
                            >
                              Marcar como vendido
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => {
                                setCarToDelete(car);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <CarIcon className="h-12 w-12 text-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">
                No hay coches para mostrar
              </h3>
              <p className="text-foreground/60 mb-4 max-w-md">
                {search
                  ? "No hay coches que coincidan con la búsqueda actual."
                  : "Tu inventario aún está vacío. Añade un coche para comenzar."}
              </p>
              <Button onClick={() => router.push("/admin/cars/create")}>
                Añadir un coche
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Seguro que deseas eliminar {carToDelete?.make}{" "}
              {carToDelete?.model} ({carToDelete?.year})? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deletingCar}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCar}
              disabled={deletingCar}
            >
              {deletingCar ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar coche"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Message Dialog */}
      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enviar mensaje al propietario</DialogTitle>
            <DialogDescription>
              Escribe un mensaje que será enviado directamente al usuario dueño del coche.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg border border-accent/25 bg-background/60 p-3 text-sm text-foreground/80">
              <p className="font-medium text-foreground">
                {carToMessage?.make} {carToMessage?.model} ({carToMessage?.year})
              </p>
              <p className="text-foreground/60">
                Destinatario: {carToMessage?.owner?.name} ({carToMessage?.owner?.email})
              </p>
            </div>
            <Textarea
              rows={4}
              placeholder="Escribe tu mensaje..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setMessageDialogOpen(false);
                setMessageContent("");
                setCarToMessage(null);
              }}
              disabled={sendingMessage}
            >
              Cancelar
            </Button>
            <Button onClick={handleSendMessage} disabled={sendingMessage}>
              {sendingMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Enviar mensaje
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
