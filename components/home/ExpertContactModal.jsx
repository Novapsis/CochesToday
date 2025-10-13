"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const WEBHOOK_URL = "https://n8n.novapsis.site/webhook/cochestoday";

export default function ExpertContactModal({ triggerVariant = "default", triggerClassName = "px-6" }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [thread, setThread] = useState([]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSend = async () => {
    if (!form.message.trim()) {
      setError("Escribe un mensaje antes de enviar.");
      return;
    }
    setError("");
    const userMessage = {
      role: "user",
      text: form.message.trim(),
      timestamp: new Date().toISOString(),
    };
    setThread((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "cochestoday-web",
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message.trim(),
          history: [...thread, userMessage].map(({ role, text }) => ({ role, text })),
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      let assistantText = "";

      if (contentType.includes("application/json")) {
        const data = await response.json();
        assistantText = data.reply || data.message || data.answer || JSON.stringify(data);
      } else {
        assistantText = await response.text();
      }

      setThread((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            assistantText ||
            "Nuestro equipo ha recibido tu mensaje y te contactará enseguida.",
          timestamp: new Date().toISOString(),
        },
      ]);
      setForm((prev) => ({ ...prev, message: "" }));
    } catch (err) {
      setThread((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "No pudimos enviar tu mensaje. Intenta de nuevo en unos minutos.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setForm({ name: "", email: "", phone: "", message: "" });
    setThread([]);
    setError("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetState();
      }}
    >
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={triggerClassName}>
          Hablar con un experto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Contacta con un experto CochesToday</DialogTitle>
          <DialogDescription>
            Comparte tus dudas y un agente inteligente te responderá al instante. También puedes dejarnos tus datos para una llamada personalizada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="expert-name">Nombre</Label>
              <Input
                id="expert-name"
                placeholder="Tu nombre"
                value={form.name}
                onChange={handleChange("name")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expert-email">Email</Label>
              <Input
                id="expert-email"
                type="email"
                placeholder="tu@email.com"
                value={form.email}
                onChange={handleChange("email")}
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="expert-phone">Teléfono (opcional)</Label>
              <Input
                id="expert-phone"
                placeholder="+34 600 123 456"
                value={form.phone}
                onChange={handleChange("phone")}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expert-message">Mensaje</Label>
            <Textarea
              id="expert-message"
              placeholder="Cuéntanos en qué podemos ayudarte"
              value={form.message}
              onChange={handleChange("message")}
              className="min-h-32"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          {thread.length > 0 && (
            <div className="max-h-48 overflow-y-auto rounded-2xl border border-accent/20 bg-card/80 p-3 space-y-3 text-sm">
              {thread.map((entry, index) => (
                <div
                  key={`${entry.timestamp}-${index}`}
                  className={cn(
                    "rounded-xl px-3 py-2",
                    entry.role === "user"
                      ? "bg-accent/10 text-foreground"
                      : "bg-background/90 border border-accent/20"
                  )}
                >
                  <p className="font-medium text-xs text-foreground/60 uppercase">
                    {entry.role === "user" ? "Tú" : "CochesToday"}
                  </p>
                  <p className="text-sm text-foreground/80 whitespace-pre-wrap">
                    {entry.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            className="sm:order-1"
            onClick={handleSend}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar mensaje"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
