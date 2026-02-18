"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Star,
  Heart,
  MapPin,
  SlidersHorizontal,
  Search,
  ChevronDown,
} from "lucide-react";
import Image from "next/image";

const allOffers = [
  {
    id: 1,
    image:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/39/b9/f8/novotel-orisha-cotonou.jpg?w=1200&h=-1&s=1",
    badge: "Durée illimité",
    badgeColor: "bg-[#2563eb]",
    discount: "-30% OFF",
    rating: 4.8,
    reviews: 726,
    name: "Novotel",
    location: "Benin, Cotonou",
    oldPrice: 450,
    newPrice: 315,
    unit: "/night",
    category: "stays",
  },
  {
    id: 2,
    image:
      "https://media-cdn.tripadvisor.com/media/photo-s/24/89/9d/93/riviera-hotel-benin.jpg",
    badge: "Disponible",
    badgeColor: "bg-[#2563eb]",
    discount: null,
    rating: 4.0,
    reviews: 842,
    name: "Riveira Hotel",
    location: "Bénin, Cotonou",
    oldPrice: 120,
    newPrice: 89,
    unit: "/tour",
    category: "stays",
  },
  {
    id: 3,
    image:
      "https://images.trvl-media.com/lodging/1000000/40000/34700/34666/b1ad1ab1.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    badge: "New Deal",
    badgeColor: "bg-[#2563eb]",
    discount: "-20% OFF",
    rating: 4.9,
    reviews: 318,
    name: "Marina Hotel",
    location: "Bénin",
    oldPrice: 280,
    newPrice: 224,
    unit: "/night",
    category: "stays",
  },
  {
    id: 4,
    image:
      "https://s.rfi.fr/media/display/dbdcd1a0-b894-11ef-8b56-005056bfb2b6/w:1280/p:3x4/Sofitel_Cotonou_Sunset_Pool.jpg",
    badge: "Popular",
    badgeColor: "bg-amber-500",
    discount: "-15% OFF",
    rating: 4.7,
    reviews: 1024,
    name: "Sofitel",
    location: "Cotonou Bénin",
    oldPrice: 95,
    newPrice: 81,
    unit: "/person",
    category: "stays",
  },
  {
    id: 5,
    image:
      "https://lbcdn.airpaz.com/hotelimages/6233674/azalai-hotel-cotonou-ea1f775e1f01936e63c32308003fba52.jpg",
    badge: "Best Seller",
    badgeColor: "bg-emerald-500",
    discount: "-25% OFF",
    rating: 4.6,
    reviews: 543,
    name: "Azalaï Hotel de la Plage",
    location: "Bénin",
    oldPrice: 200,
    newPrice: 150,
    unit: "/night",
    category: "stays",
  },
  {
    id: 6,
    image:
      "https://www.gouv.bj/upload/images/albums/381940806628001709282859.jpg",
    badge: "Flash Sale",
    badgeColor: "bg-red-500",
    discount: "-40% OFF",
    rating: 4.5,
    reviews: 389,
    name: "Hotel Tata Somba",
    location: "Bénin",
    oldPrice: 180,
    newPrice: 108,
    unit: "/person",
    category: "experiences",
  },
  {
    id: 7,
    image:
      "https://destinationafrique.io/wp-content/uploads/2020/11/Destination-Afrique-lieux-tourisme-au-Benin.jpg",
    badge: "Exclusive",
    badgeColor: "bg-[#2563eb]",
    discount: "-10% OFF",
    rating: 4.9,
    reviews: 215,
    name: "Chutte de Kota",
    location: "Bénin",
    oldPrice: 380,
    newPrice: 342,
    unit: "/night",
    category: "experiences",
  },
  {
    id: 8,
    image:
      "https://critikmag.com/wp-content/uploads/2024/12/Tourisme-au-Benin-20-endroits-a-absolument-visiter.png",
    badge: "Limited Time",
    badgeColor: "bg-[#2563eb]",
    discount: "-20% OFF",
    rating: 4.4,
    reviews: 672,
    name: "Place de l'Amazone",
    location: "Ouidah, Bénin",
    oldPrice: 75,
    newPrice: 60,
    unit: "/person",
    category: "experiences",
  },
  {
    id: 9,
    image:
      "https://waafrica.travel/wp-content/uploads/2024/12/abomey_benin-768x1024.jpg",
    badge: "New",
    badgeColor: "bg-emerald-500",
    discount: null,
    rating: 4.8,
    reviews: 128,
    name: "Place Goho d'Abomey",
    location: "Abomey, Bénin",
    oldPrice: 420,
    newPrice: 350,
    unit: "/night",
    category: "experiences",
  },
];

const categories = [
  { id: "all", label: "Toutes les offres" },
  { id: "stays", label: "Hébergements" },
  { id: "experiences", label: "Expériences" },
];

const sortOptions = [
  { id: "recommended", label: "Recommandé" },
  { id: "price-low", label: "Prix ​​: du plus bas au plus élevé" },
  { id: "price-high", label: "Prix ​​: du plus élevé au plus bas" },
  { id: "rating", label: "Les mieux notés" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${star <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : star <= rating
                ? "fill-amber-400/50 text-amber-400"
                : "fill-muted text-muted"
            }`}
        />
      ))}
    </div>
  );
}

export default function OffersPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSort, setShowSort] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  };

  const filtered = allOffers
    .filter((o) => activeCategory === "all" || o.category === activeCategory)
    .filter(
      (o) =>
        o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.newPrice - b.newPrice;
        case "price-high":
          return b.newPrice - a.newPrice;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero banner */}
        <section className="relative overflow-hidden bg-[#2563eb]">
          <div className="absolute inset-0 bg-[url('/images/hero-mountains.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
            <h1 className="text-center text-3xl font-bold text-white sm:text-4xl lg:text-5xl text-balance">
              Offres et promotions exclusives
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-base text-white/80 leading-relaxed">
              Faites de grosses économies sur des séjours, des circuits et des
              expériences triés sur le volet. Ces offres à durée limitée sont
              mises à jour chaque semaine.
            </p>

            {/* Search bar */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher des offres par nom ou destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border-0 bg-card py-3.5 pl-12 pr-4 text-sm text-foreground shadow-lg placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters bar */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-4 sm:flex-row sm:items-center lg:px-8">
            {/* Category tabs */}
            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeCategory === cat.id
                      ? "bg-[#2563eb] text-white"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                    }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                <SlidersHorizontal className="h-4 w-4" />
                {sortOptions.find((s) => s.id === sortBy)?.label}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showSort ? "rotate-180" : ""}`}
                />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full z-10 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        setSortBy(opt.id);
                        setShowSort(false);
                      }}
                      className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted ${sortBy === opt.id
                          ? "bg-[#2563eb]/5 font-medium text-[#2563eb]"
                          : "text-foreground"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Results count */}
        <section className="mx-auto max-w-7xl px-4 pt-8 lg:px-8">
          <p className="text-sm text-muted-foreground">
            Affichage{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            Offres
          </p>
        </section>

        {/* Offers grid */}
        <section className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((offer) => (
              <div
                key={offer.id}
                className="group overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={offer.image}
                    alt={offer.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span
                    className={`absolute top-3 left-3 rounded-md ${offer.badgeColor} px-2.5 py-1 text-xs font-semibold text-white`}
                  >
                    {offer.badge}
                  </span>
                  {offer.discount && (
                    <span className="absolute bottom-3 left-3 rounded-md bg-foreground/80 px-2 py-1 text-xs font-semibold text-white">
                      {offer.discount}
                    </span>
                  )}
                  <button
                    onClick={() => toggleFavorite(offer.id)}
                    className={`absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${favorites.includes(offer.id)
                        ? "bg-red-500 text-white"
                        : "bg-card/60 text-foreground hover:bg-card/80"
                      }`}
                    aria-label={`Save ${offer.name} to favorites`}
                  >
                    <Heart
                      className={`h-4 w-4 ${favorites.includes(offer.id) ? "fill-current" : ""}`}
                    />
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <StarRating rating={offer.rating} />
                    <span className="text-xs text-muted-foreground">
                      ({offer.reviews} reviews)
                    </span>
                  </div>
                  <h3 className="mt-2 font-semibold text-foreground">
                    {offer.name}
                  </h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {offer.location}
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-muted-foreground line-through">
                        ${offer.oldPrice}
                      </span>
                      <span className="text-lg font-bold text-[#2563eb]">
                        ${offer.newPrice}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {offer.unit}
                      </span>
                    </div>
                    <button className="rounded-lg bg-[#2563eb] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1d4ed8]">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <Search className="mx-auto h-12 w-12 text-muted-foreground/40" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                Aucune offre trouvée
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Essayez de modifier vos critères de recherche ou de filtrage.
              </p>
            </div>
          )}
        </section>

        {/* Newsletter banner */}
        <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
          <div className="rounded-2xl bg-[#2563eb] px-6 py-12 text-center sm:px-12">
            <h2 className="text-2xl font-bold text-white">
              Ne ratez jamais une bonne affaire
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/80 leading-relaxed">
              Abonnez-vous pour recevoir chaque semaine des offres exclusives et
              des idées de voyage directement dans votre boîte mail.
            </p>
            <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 rounded-lg border-0 bg-white/15 px-4 py-3 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/40"
              />
              <button className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#2563eb] transition-colors hover:bg-white/90">
                S'abonner
              </button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
