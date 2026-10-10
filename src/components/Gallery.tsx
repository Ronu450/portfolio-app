import { Camera, Heart, Navigation, Quote, Users } from "lucide-react";
import type { ComponentType } from "react";

import bikePic from "../assets/bike.jpg";
import bearPic from "../assets/beer.jpg";
import dogPic from "../assets/dog.jpg";
import groupPic from "../assets/group.jpg";

interface GalleryTile {
  id: string;
  category: string;
  title: string;
  quote: string;
  icon: ComponentType<{ className?: string }>;
  imageSrc: string;
  imageFit: "cover" | "contain";
}

const tiles: GalleryTile[] = [
  {
    id: "jackie",
    category: "Companion",
    title: "Jackie",
    quote:
      "Jackie is a constant source of unconditional joy and daily inspiration.",
    icon: Heart,
    imageSrc: dogPic,
    imageFit: "contain",
  },
  {
    id: "bike",
    category: "Adventure",
    title: "My Bike",
    quote:
      "Chasing horizons and finding absolute freedom on two wheels. The road is my canvas.",
    icon: Navigation,
    imageSrc: bikePic,
    imageFit: "cover",
  },
  {
    id: "undergrad",
    category: "Memories",
    title: "Undergraduation Group",
    quote:
      "Where the journey began — lifelong friendships forged, lessons learned, and dreams shared.",
    icon: Users,
    imageSrc: groupPic,
    imageFit: "cover",
  },
  {
    id: "bear",
    category: "Photography",
    title: "Bear in the Wild",
    quote:
      "A rare moment captured in the wild — witnessing nature's raw majesty and quiet power.",
    icon: Camera,
    imageSrc: bearPic,
    imageFit: "cover",
  },
];

export function Gallery() {
  return (
    <section className="bg-background px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Beyond the work
          </p>
          <h2 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
            My Gallery
          </h2>
          <p className="max-w-xl leading-relaxed text-muted-foreground">
            A visual diary of my inspirations, adventures, and the moments that
            shape my journey.
          </p>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-7 sm:grid-cols-2 lg:gap-8">
          {tiles.map((tile, index) => (
            <figure
              key={tile.id}
              className="group flex h-full flex-col rounded-xl bg-[#252a24] p-2.5 shadow-[0_12px_28px_rgba(0,0,0,0.2)] ring-1 ring-inset ring-white/10 transition-transform duration-300 hover:-translate-y-1 sm:p-3"
            >
              <div className="flex h-full flex-col rounded-md bg-[#e7e9e2] p-3 sm:p-4">
                <div
                  className={`relative aspect-[4/3] shrink-0 overflow-hidden rounded-[2px] ${tile.imageFit === "contain" ? "bg-[#d6dbd1]" : "bg-muted"}`}
                >
                  <img
                    src={tile.imageSrc}
                    alt={
                      tile.id === "jackie"
                        ? "Jackie sitting on grass"
                        : `${tile.title}, ${tile.category.toLowerCase()}`
                    }
                    loading="lazy"
                    decoding="async"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={`h-full w-full ${tile.imageFit === "contain" ? "object-contain" : "object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"}`}
                  />
                  <span className="absolute left-3 top-3 rounded-sm bg-black/65 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <figcaption className="flex flex-1 flex-col px-1 pb-1 pt-4 sm:px-2 sm:pt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#536340]">
                        <tile.icon className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>{tile.category}</span>
                      </div>
                      <h3 className="text-lg font-semibold leading-snug text-[#1c211b] sm:text-xl">
                        {tile.title}
                      </h3>
                    </div>
                  </div>

                  <blockquote className="mt-3 flex flex-1 items-start gap-2 border-t border-[#343b31]/15 pt-3">
                    <Quote
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#687650]"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-relaxed text-[#4b5148]">
                      {tile.quote}
                    </p>
                  </blockquote>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
