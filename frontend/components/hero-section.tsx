"use client";

import { useEffect, useState } from "react";
import { MapPin, Tags, Search, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState("all");
  const [types, setTypes] = useState<string[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setIsLoadingTypes(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}offers/get_offers.php`);
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        // Extract unique types from the offers
        const uniqueTypes = Array.from(new Set(data.map((o: any) => o.type).filter(Boolean))) as string[];
        setTypes(uniqueTypes);
      }
    } catch (err) {
      console.error("Failed to fetch offer types", err);
    } finally {
      setIsLoadingTypes(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (serviceType && serviceType !== "all") params.set("type", serviceType);
    router.push(`/offers?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

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
              <div className="flex flex-col w-full">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Emplacement
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Lieu, ville, région..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            <div className="hidden h-8 w-px bg-border md:block" />

            {/* Service Type */}
            <div className="flex flex-1 items-center gap-2 px-4 py-2">
              <Tags className="h-4 w-4 shrink-0 text-[#2563eb]" />
              <div className="flex flex-col w-full">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Type de service
                </span>
                {isLoadingTypes ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Chargement...</span>
                  </div>
                ) : (
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full bg-transparent text-sm text-foreground focus:outline-none capitalize cursor-pointer"
                  >
                    <option value="all">Tous les types</option>
                    {types.map((t) => (
                      <option key={t} value={t} className="capitalize">
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Search button */}
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 rounded-full bg-[#2563eb] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1d4ed8] active:scale-95"
            >
              <Search className="h-4 w-4" />
              <span>Recherche</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
