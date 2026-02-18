import { MapPin, CalendarDays, Users, Search } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden lg:min-h-[540px]">
      {/* Background image */}
      <Image
        src="/images/hero-mountains.png"
        alt="Beautiful mountain landscape with turquoise lake"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-20 text-center">
        <h1 className="text-balance text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Organisez Votre Séjour Haut de Gamme Sans Stress
        </h1>
        <p className="mt-4 max-w-xl text-pretty text-base text-white/80 md:text-lg">
          Découvrez des expériences uniques et des trésors cachés avec nos
          services premium
        </p>

        {/* Search bar */}
        <div className="mt-8 w-full max-w-2xl">
          <div className="flex flex-col items-stretch gap-3 rounded-2xl bg-card p-3 shadow-xl md:flex-row md:items-center md:gap-0 md:rounded-full md:p-2">
            {/* Location */}
            <div className="flex flex-1 items-center gap-2 px-4 py-2">
              <MapPin className="h-4 w-4 shrink-0 text-[#2563eb]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Emplacement
                </span>
                <input
                  type="text"
                  placeholder="Où vas-tu ?"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="hidden h-8 w-px bg-border md:block" />

            {/* Dates */}
            <div className="flex flex-1 items-center gap-2 px-4 py-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-[#2563eb]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Dates
                </span>
                <input
                  type="text"
                  placeholder="Ajouter des dates"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="hidden h-8 w-px bg-border md:block" />

            {/* Service Type */}
            <div className="flex flex-1 items-center gap-2 px-4 py-2">
              <Users className="h-4 w-4 shrink-0 text-[#2563eb]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Type de service
                </span>
                <select className="w-full bg-transparent text-sm text-foreground focus:outline-none">
                  <option>Hébergements</option>
                  <option>Excursions</option>
                  <option>Vols</option>
                  <option>Expériences</option>
                </select>
              </div>
            </div>

            {/* Search button */}
            <button className="flex items-center justify-center gap-2 rounded-full bg-[#2563eb] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8]">
              <Search className="h-4 w-4" />
              <span>Recherche</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
