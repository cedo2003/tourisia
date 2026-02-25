"use client"

import { Plane, Menu, X, User, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ fullname: string } | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === "/";
    }
    return pathname === path;
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
            className={`text-sm font-medium transition-colors hover:text-foreground ${isActive("/")
              ? "font-bold text-foreground"
              : "text-muted-foreground"
              }`}
          >
            Explorer
          </a>
          <a
            href="/offers"
            className={`text-sm font-medium transition-colors hover:text-foreground ${isActive("/offers")
              ? "font-bold text-foreground"
              : "text-muted-foreground"
              }`}
          >
            Offres
          </a>
          <a
            href="/destinations"
            className={`text-sm font-medium transition-colors hover:text-foreground ${isActive("/destinations")
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
            className={`rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted ${isActive("/devenir_partenaire") ? "font-bold bg-muted/70" : ""
              }`}
          >
            Devenir Partenaire
          </Link>

          {user ? (
            <div className="flex items-center gap-4 ml-2 pl-4 border-l border-border">
              <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2563eb]/10 text-[#2563eb]">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">
                  {user.fullname}
                </span>
              </Link>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    title="Déconnexion"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Vous allez être déconnecté de votre compte Tourisia.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleLogout}
                      className="bg-destructive text-white hover:bg-destructive/90"
                    >
                      Déconnexion
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className={`text-sm font-medium transition-colors hover:text-foreground ${isActive("/login")
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
            </>
          )}
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
              className={`text-sm font-medium ${isActive("/")
                ? "font-bold text-foreground"
                : "text-muted-foreground"
                }`}
              onClick={() => setMobileOpen(false)}
            >
              Explorer
            </a>
            <a
              href="/offers"
              className={`text-sm font-medium ${isActive("/offers")
                ? "font-bold text-foreground"
                : "text-muted-foreground"
                }`}
              onClick={() => setMobileOpen(false)}
            >
              Offres
            </a>
            <a
              href="/destinations"
              className={`text-sm font-medium ${isActive("/destinations")
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
              className={`rounded-lg border border-border px-4 py-2 text-sm font-medium ${isActive("/devenir_partenaire") ? "font-bold bg-muted/50" : ""
                }`}
              onClick={() => setMobileOpen(false)}
            >
              Devenir Partenaire
            </Link>

            {user ? (
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 hover:bg-muted/80 transition-colors"
                >
                  <User className="h-4 w-4 text-[#2563eb]" />
                  <span className="text-sm font-medium">{user.fullname}</span>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-destructive">
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-[calc(100%-2rem)]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Déconnexion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Voulez-vous vraiment vous déconnecter ?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleLogout}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Déconnecter
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm font-medium ${isActive("/login")
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
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
