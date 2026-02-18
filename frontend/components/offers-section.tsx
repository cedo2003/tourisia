import { Star, Heart, MapPin } from "lucide-react";
import Image from "next/image";

const offers = [
  {
    id: 1,
    image: "/images/ganvie.jpg",
    badge: "Disponible",
    badgeColor: "bg-[#2563eb]",
    discount: "-30% OFF",
    rating: 4.8,
    reviews: 726,
    name: "Cité lacustre de Ganvié",
    location: "Benin, Calavi",
    oldPrice: "$450",
    newPrice: "$315",
    unit: "/tour",
  },
  {
    id: 2,
    image: "/images/amazone.jpg",
    badge: "Top Rated",
    badgeColor: "bg-[#2563eb]",
    discount: null,
    rating: 4.0,
    reviews: 842,
    name: "Place de l'amazone",
    location: "Benin, Cotonou",
    oldPrice: "$120",
    newPrice: "$89",
    unit: "/tour",
  },
  {
    id: 3,
    image: "/images/porte.jpg",
    badge: "New Deal",
    badgeColor: "bg-[#2563eb]",
    discount: "-20% OFF",
    rating: 4.9,
    reviews: 318,
    name: "Porte du Non Retour",
    location: "Bénin, Ouidah",
    oldPrice: "$280",
    newPrice: "$224",
    unit: "/visite",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= Math.floor(rating)
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

export function OffersSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Offres de la semaine
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Offres exclusives pour une durée limitée seulement.
          </p>
        </div>
        <a
          href="#"
          className="hidden text-sm font-medium text-[#2563eb] transition-colors hover:text-[#1d4ed8] sm:inline-flex items-center gap-1"
        >
          Voir toutes les offres &rarr;
        </a>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="group overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-lg"
          >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={offer.image}
                alt={offer.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            </div>

            {/* Content */}
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
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-muted-foreground line-through">
                    {offer.oldPrice}
                  </span>
                  <span className="text-lg font-bold text-[#2563eb]">
                    {offer.newPrice}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {offer.unit}
                  </span>
                </div>
                <button
                  className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-[#2563eb]"
                  aria-label={`Save ${offer.name} to favorites`}
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <a
        href="#"
        className="mt-6 block text-center text-sm font-medium text-[#2563eb] sm:hidden"
      >
        Voir toutes les offres &rarr;
      </a>
    </section>
  );
}
