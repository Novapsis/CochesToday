'use client'; // Convert to client component

import React from 'react';
import { Button } from './ui/button';
import { Heart, CarFront, Layout, ArrowLeft, LogOut, LogIn, UserCircle2, Menu } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import ThemeToggle from '@/components/theme-toggle';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from './logo';
import { useAuth } from './auth/AuthProvider'; // Import our new hook

const Header = ({ isAdminPage = false }) => {
  const { user, signOut } = useAuth(); // Use the hook
  const isAdmin = !!user?.adminUser; // Verificar si tiene registro de AdminUser

  return (
    <header className="fixed inset-x-0 top-6 z-50 flex justify-center px-4">
      <nav className="w-full max-w-6xl rounded-full border border-accent/30 bg-background/95 px-4 py-3 shadow-[0_18px_40px_-24px_rgba(18,35,64,0.45)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-4">
        {/* Left: Logo */}
          <Link href={isAdminPage ? '/admin' : '/'} className="flex items-center gap-2">
            <Logo className="h-10 w-auto" />
            {isAdminPage && (
              <span className="text-xs uppercase tracking-[0.3em] text-foreground/50">
                Admin
              </span>
            )}
          </Link>

        {/* Right: Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
          {/* Mobile menu */}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Abrir menú">
                    <Menu size={20} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <SheetHeader>
                    <SheetTitle>Menú</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 flex flex-col gap-3">
                    <Link href="/cars" className="text-sm text-foreground hover:opacity-80">Coches</Link>
                    <Link href="/saved-cars" className="text-sm text-foreground hover:opacity-80">Mis favoritos</Link>
                    <Link href="/tasacion" className="text-sm text-foreground hover:opacity-80">Tasación profesional</Link>
                    {!user ? (
                      <Link href="/sign-in" className="text-sm text-foreground hover:opacity-80">Iniciar sesión</Link>
                    ) : (
                      <>
                        <Link href="/publish" className="text-sm text-foreground hover:opacity-80">Publicar coche</Link>
                        <Link href="/profile" className="text-sm text-foreground hover:opacity-80">Perfil</Link>
                        <button onClick={signOut} className="text-left text-sm text-red-600 hover:opacity-80">Cerrar sesión</button>
                      </>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          {/* Theme toggle (always visible) */}
            <ThemeToggle />
            {isAdminPage ? (
              <>
                <Link href="/">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowLeft size={18} />
                    <span>Volver a la App</span>
                  </Button>
                </Link>
              </>
            ) : (
            // Authenticated user links
              user && (
                <>
                  <Link href="/tasacion">
                    <Button variant="ghost" className="hidden md:inline-flex items-center gap-2">
                      <span>Tasación</span>
                    </Button>
                  </Link>
                  <Link href="/saved-cars">
                    <Button variant="ghost" className="flex items-center gap-2">
                      <Heart size={18} />
                      <span className="hidden md:inline">Mis favoritos</span>
                    </Button>
                  </Link>
                  <Link href="/publish">
                    <Button className="hidden sm:inline-flex items-center gap-2">
                      <CarFront size={18} />
                      <span>Publicar coche</span>
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="outline" className="flex items-center gap-2">
                        <Layout size={18} />
                        <span className="hidden md:inline">Panel admin</span>
                      </Button>
                    </Link>
                  )}
                </>
              )
            )}

          {/* Auth buttons */}
            {!user ? (
            // Show login if not on admin page and not logged in
              !isAdminPage && (
                <>
                  <Link href="/tasacion" className="hidden sm:inline-flex">
                    <Button variant="ghost" className="items-center gap-2">
                      Tasación
                    </Button>
                  </Link>
                  <Link href="/sign-in">
                    <Button variant="outline" className="flex items-center gap-2">
                      <LogIn size={18} />
                      <span>Iniciar sesión</span>
                    </Button>
                  </Link>
                </>
              )
            ) : (
            // Show avatar dropdown if logged in
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="hidden sm:inline-flex items-center px-1 py-1 rounded-full border border-accent/30 bg-background/80 hover:border-accent/60" aria-label="Abrir menú de usuario">
                    {user?.profile?.avatarUrl ? (
                      <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-1 ring-border">
                        <Image src={user.profile.avatarUrl} alt={user?.profile?.name || user?.email} fill sizes="32px" className="object-cover" />
                      </span>
                    ) : (
                      <UserCircle2 size={26} className="text-muted-foreground" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/publish">Publicar coche</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Panel Admin</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600">Cerrar sesión</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
