"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import AvatarUpload from "./AvatarUpload";

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
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <AvatarUpload 
            currentAvatar={profile?.avatarUrl} 
            onUploadSuccess={(url) => {
              setUser((u) => ({ ...u, profile: { ...u.profile, avatarUrl: url } }));
              setForm((f) => ({ ...f, avatarUrl: url }));
            }}
          />
          <h2 className="mt-4 text-xl font-semibold">{profile?.name || "Sin nombre"}</h2>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          <Link href="/publish" className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700">Publicar un coche</Link>
          <Link href="/saved-cars" className="mt-2 inline-flex items-center justify-center px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50">Mis favoritos</Link>
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Mi Cuenta</h3>
          <form onSubmit={onSave} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombre</label>
              <input name="name" value={form.name} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Avatar URL</label>
              <input name="avatarUrl" value={form.avatarUrl} onChange={onChange} className="w-full border rounded-lg px-3 py-2" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
              <input name="phone" value={form.phone} onChange={onChange} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <button disabled={saving} className="w-full bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            {message && <p className="text-sm text-center text-gray-600">{message}</p>}
          </form>
          <div className="h-px bg-gray-100 my-6" />
          <h4 className="font-semibold mb-3">Cambiar contraseña</h4>
          <form onSubmit={onPasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nueva contraseña</label>
              <input type="password" name="newPassword" value={pwd.newPassword} onChange={(e)=>setPwd((p)=>({...p, newPassword:e.target.value}))} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Confirmar contraseña</label>
              <input type="password" name="confirmPassword" value={pwd.confirmPassword} onChange={(e)=>setPwd((p)=>({...p, confirmPassword:e.target.value}))} className="w-full border rounded-lg px-3 py-2" />
            </div>
            <button className="w-full border rounded-lg py-2 hover:bg-gray-50">Actualizar contraseña</button>
            {pwdMsg && <p className="text-sm text-center text-gray-600">{pwdMsg}</p>}
          </form>
        </div>
      </aside>

      <section className="lg:col-span-3 space-y-8">
        {/* Resumen */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Resumen</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Stat label="Favoritos" value={user?.savedCars?.length || 0} />
            <Stat label="Publicaciones" value={user?.cars?.length || 0} />
            <Stat label="Servicios" value={user?.orders?.length || 0} />
            <Stat label="Mensajes" value={user?.messagesReceived?.length || 0} />
          </div>
        </div>

        {/* Favoritos */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Mis favoritos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(user?.savedCars || []).map((s) => (
              <CarCard key={s.id} car={s.car} />
            ))}
          </div>
        </div>

        {/* Publicaciones */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Mis publicaciones</h3>
            <Link href="/publish" className="text-sm text-blue-600 hover:underline">+ Nueva publicación</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {(user?.cars || []).map((c) => (
              <CarCard key={c.id} car={c} />
            ))}
          </div>
        </div>

        {/* Servicios */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold mb-4">Mis servicios</h3>
          <div className="space-y-4">
            {(user?.orders || []).map((o) => (
              <div key={o.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Servicio {o.tier}</p>
                    <p className="text-sm text-gray-500">Estado: {o.status}</p>
                  </div>
                  {o.car && <Link href={`/cars/${o.carId}`} className="text-blue-600 text-sm hover:underline">Ver coche</Link>}
                </div>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {(o.steps || []).map((s) => (
                    <div key={s.id} className="text-xs px-2 py-1 rounded bg-gray-100">{s.step}: {s.status}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border p-4 text-center">
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

function CarCard({ car }) {
  const img = car?.images?.[0]?.url || "/placeholder-car.jpg";
  return (
    <Link href={`/cars/${car.id}`} className="block rounded-xl border overflow-hidden hover:shadow-md transition">
      <div className="relative h-40 w-full">
        <Image src={img} alt={car.title} fill className="object-cover" />
      </div>
      <div className="p-3">
        <h4 className="font-medium truncate">{car.title}</h4>
        <p className="text-sm text-gray-500">{car.brand?.name} {car.model?.name} • {car.year}</p>
        <p className="text-blue-700 font-semibold mt-1">€ {Number(car.price).toLocaleString()}</p>
      </div>
    </Link>
  );
}
