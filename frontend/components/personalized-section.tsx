import Image from "next/image";

const categories = [
  {
    id: 1,
    image: "/images/sofitel.jpg",
    category: "City Break",
    name: "Sofitel",
  },
  {
    id: 2,
    image: "/images/golden.jpg",
    category: "City Break",
    name: "Golden Tulip",
  },
  {
    id: 3,
    image: "/images/azalai.jpg",
    category: "City Break",
    name: "Aalai Hotel",
  },
  {
    id: 4,
    image: "/images/jaba.jpg",
    category: "Nature",
    name: "Jaaba grill & bar",
  },
];

export function PersonalizedSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <h2 className="text-2xl font-bold text-foreground">
        Personnalisé pour vous
      </h2>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {categories.map((item) => (
          <a
            key={item.id}
            href="#"
            className="group relative aspect-[3/4] overflow-hidden rounded-xl"
          >
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                {item.category}
              </span>
              <h3 className="mt-0.5 text-sm font-bold text-white md:text-base">
                {item.name}
              </h3>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
