"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import AvatarUpload from "./AvatarUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProfileClient({ initialUser }) {
  const [user, setUser] = useState(initialUser);
  const supabase = createClient();
  const profile = user?.profile || {};
  const [form, setForm] = useState({
    name: profile?.name || "",
    avatarUrl: profile?.avatarUrl || "",
    phone: profile?.phone || "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [pwd, setPwd] = useState({ newPassword: "", confirmPassword: "" });
  const [pwdMsg, setPwdMsg] = useState("");

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");
      setUser((u) => ({ ...u, profile: data.profile }));
      setMessage("Perfil actualizado correctamente");
    } catch (err) {
      setMessage(err.message || "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const onPasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg("");
    if (!pwd.newPassword || pwd.newPassword.length < 6) {
      setPwdMsg("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (pwd.newPassword !== pwd.confirmPassword) {
      setPwdMsg("Las contraseñas no coinciden");
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password: pwd.newPassword });
      if (error) throw error;
      setPwd({ newPassword: "", confirmPassword: "" });
      setPwdMsg("Contraseña actualizada correctamente");
    } catch (err) {
      setPwdMsg(err.message || "Error al actualizar la contraseña");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="lg:col-span-1 space-y-6">
        <Card className="border border-accent/25 bg-card/95 text-center">
          <CardContent className="flex flex-col items-center pt-6">
            <AvatarUpload
              currentAvatar={profile?.avatarUrl}
              onUploadSuccess={(url) => {
                setUser((u) => ({ ...u, profile: { ...u.profile, avatarUrl: url } }));
                setForm((f) => ({ ...f, avatarUrl: url }));
              }}
            />
            <h2 className="mt-4 text-xl font-semibold text-foreground">
              {profile?.name || "Sin nombre"}
            </h2>
            <p className="text-sm text-foreground/60">{user?.email}</p>
            <div className="w-full mt-4 space-y-2">
              <Button asChild className="w-full">
                <Link href="/publish">Publicar un coche</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/saved-cars">Mis favoritos</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-accent/25 bg-card/95">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground">Mi cuenta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-foreground/70">Nombre</label>
                <Input name="name" value={form.name} onChange={onChange} />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground/70">Avatar URL</label>
                <Input
                  name="avatarUrl"
                  value={form.avatarUrl}
                  onChange={onChange}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-foreground/70">Teléfono</label>
                <Input name="phone" value={form.phone} onChange={onChange} />
              </div>
              <Button className="w-full" disabled={saving} type="submit">
                {saving ? "Guardando..." : "Guardar cambios"}
              </Button>
              {message && (
                <p className="text-sm text-center text-foreground/70">
                  {message}
                </p>
              )}
            </form>

            <div className="h-px bg-accent/20" />

            <div>
              <h4 className="font-semibold text-foreground mb-3">
                Cambiar contraseña
              </h4>
              <form onSubmit={onPasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm text-foreground/70">
                    Nueva contraseña
                  </label>
                  <Input
                    type="password"
                    name="newPassword"
                    value={pwd.newPassword}
                    onChange={(e) =>
                      setPwd((p) => ({ ...p, newPassword: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-foreground/70">
                    Confirmar contraseña
                  </label>
                  <Input
                    type="password"
                    name="confirmPassword"
                    value={pwd.confirmPassword}
                    onChange={(e) =>
                      setPwd((p) => ({ ...p, confirmPassword: e.target.value }))
                    }
                  />
                </div>
                <Button variant="outline" className="w-full" type="submit">
                  Actualizar contraseña
                </Button>
                {pwdMsg && (
                  <p className="text-sm text-center text-foreground/70">
                    {pwdMsg}
                  </p>
                )}
              </form>
            </div>
          </CardContent>
        </Card>
      </aside>

      <section className="lg:col-span-3 space-y-8">
        {/* Resumen */}
        <Card className="border border-accent/25 bg-card/95">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground">Resumen</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Favoritos" value={user?.savedCars?.length || 0} />
            <Stat label="Publicaciones" value={user?.cars?.length || 0} />
            <Stat label="Servicios" value={user?.orders?.length || 0} />
            <Stat label="Mensajes" value={user?.messagesReceived?.length || 0} />
          </div>
          </CardContent>
        </Card>

        {/* Favoritos */}
        <Card className="border border-accent/25 bg-card/95">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground">Mis favoritos</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(user?.savedCars || []).map((s) => (
              <CarCard key={s.id} car={s.car} />
            ))}
          </div>
          </CardContent>
        </Card>

        {/* Publicaciones */}
        <Card className="border border-accent/25 bg-card/95">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-foreground">Mis publicaciones</CardTitle>
              <Link href="/publish" className="text-sm text-accent hover:underline">
                + Nueva publicación
              </Link>
            </div>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(user?.cars || []).map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
          </CardContent>
        </Card>

        {/* Servicios */}
        <Card className="border border-accent/25 bg-card/95">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-foreground">Mis servicios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-4">
            {(user?.orders || []).map((o) => (
              <div key={o.id} className="border border-accent/25 rounded-lg p-4 bg-background/80">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Servicio {o.tier}</p>
                    <p className="text-sm text-foreground/60">Estado: {o.status}</p>
                  </div>
                  {o.car && (
                    <Link
                      href={`/cars/${o.carId}`}
                      className="text-sm text-accent hover:underline"
                    >
                      Ver coche
                    </Link>
                  )}
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(o.steps || []).map((s) => (
                    <div
                      key={s.id}
                      className="text-xs px-2 py-1 rounded bg-accent/15 text-foreground/80"
                    >
                      {s.step}: {s.status}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-accent/25 bg-background/80 p-4 text-center">
      <p className="text-2xl font-semibold text-foreground">{value}</p>
      <p className="text-xs text-foreground/60 mt-1">{label}</p>
    </div>
  );
}

function CarCard({ car }) {
  const img = car?.images?.[0]?.url || "/placeholder-car.jpg";
  return (
    <Link
      href={`/cars/${car.id}`}
      className="block rounded-xl border border-accent/25 overflow-hidden hover:border-accent/50 transition"
    >
      <div className="relative h-40 w-full">
        <Image src={img} alt={car.title} fill sizes="(min-width: 768px) 240px, 100vw" className="object-cover" />
      </div>
      <div className="p-3 bg-background/80">
        <h4 className="font-medium truncate text-foreground">{car.title}</h4>
        <p className="text-sm text-foreground/60">
          {car.brand?.name} {car.model?.name} • {car.year}
        </p>
        <p className="text-accent font-semibold mt-1">
          € {Number(car.price).toLocaleString()}
        </p>
      </div>
    </Link>
  );
}
