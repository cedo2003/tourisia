"use client";

import { Plane, Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname(); // ← on récupère le chemin actuel

  // Fonction helper pour savoir si le lien est actif
  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    // Pour les autres chemins, on vérifie le début (utile si sous-routes plus tard)
    return pathname === path;
    // Alternative plus permissive : pathname.startsWith(path)
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <Image
            src="/images/Logo-Tourisia--Principal.png"
            alt="Traveler"
            width={160}
            height={60}
            priority
          />
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="/"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              isActive("/")
                ? "font-bold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Explorer
          </a>
          <a
            href="/offers"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              isActive("/offers")
                ? "font-bold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Offres
          </a>
          <a
            href="/destinations"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              isActive("/destinations")
                ? "font-bold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Destinations
          </a>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/devenir_partenaire"
            className={`rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted ${
              isActive("/devenir_partenaire") ? "font-bold bg-muted/70" : ""
            }`}
          >
            Devenir Partenaire
          </Link>
          <Link
            href="/login"
            className={`text-sm font-medium transition-colors hover:text-foreground ${
              isActive("/login")
                ? "font-bold text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Se Connecter
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[#2563eb] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]"
          >
            S'inscrire
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6 text-foreground" />
          ) : (
            <Menu className="h-6 w-6 text-foreground" />
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <a
              href="/"
              className={`text-sm font-medium ${
                isActive("/")
                  ? "font-bold text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Explorer
            </a>
            <a
              href="/offers"
              className={`text-sm font-medium ${
                isActive("/offers")
                  ? "font-bold text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Offres
            </a>
            <a
              href="/destinations"
              className={`text-sm font-medium ${
                isActive("/destinations")
                  ? "font-bold text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Destinations
            </a>
            <hr className="border-border" />
            <Link
              href="/devenir_partenaire"
              className={`rounded-lg border border-border px-4 py-2 text-sm font-medium ${
                isActive("/devenir_partenaire") ? "font-bold bg-muted/50" : ""
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Devenir Partenaire
            </Link>
            <Link
              href="/login"
              className={`text-sm font-medium ${
                isActive("/login")
                  ? "font-bold text-foreground"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Se Connecter
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[#2563eb] px-4 py-2 text-center text-sm font-medium text-white"
              onClick={() => setMobileOpen(false)}
            >
              S'inscrire
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
