import { Card } from "./ui/card";
import { Camera, Heart, Navigation, Users } from "lucide-react";

import dogPic from "../assets/dog.jpg";
import bikePic from "../assets/bike.jpg";
import groupPic from "../assets/group.jpg";
import bearPic from "../assets/beer.jpg";

interface GalleryTile {
  id: string;
  category: string;
  title: string;
  quote: string;
  icon: React.ComponentType<{ className?: string }>;
  imageSrc: string;
  gradient: string;
}

export function Gallery() {
  const tiles: GalleryTile[] = [
    {
      id: "dog",
      category: "Companion",
      title: "My Dog",
      quote: "My companion for my motivation — a constant source of unconditional joy and daily inspiration.",
      icon: Heart,
      imageSrc: dogPic,
      gradient: "from-amber-500/10 to-orange-500/10 border-orange-500/20",
    },
    {
      id: "bike",
      category: "Adventure",
      title: "My Bike",
      quote: "Chasing horizons and finding absolute freedom on two wheels. The road is my canvas.",
      icon: Navigation,
      imageSrc: bikePic,
      gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
    },
    {
      id: "undergrad",
      category: "Memories",
      title: "Undergraduation Group",
      quote: "Where the journey began — lifelong friendships forged, lessons learned, and dreams shared.",
      icon: Users,
      imageSrc: groupPic,
      gradient: "from-purple-500/10 to-pink-500/10 border-purple-500/20",
    },
    {
      id: "bear",
      category: "Photography",
      title: "Bear in the Wild",
      quote: "A rare moment captured in the wild — witnessing nature's raw majesty and quiet power.",
      icon: Camera,
      imageSrc: bearPic,
      gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
            My Gallery
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            A visual diary of my inspirations, adventures, and the moments that shape my journey.
          </p>
        </div>

        {/* Gallery Grid Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tiles.map((tile) => (
            <Card
              key={tile.id}
              className={`overflow-hidden border bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group`}
            >
              <div className="grid sm:grid-cols-2 h-full">
                
                {/* Image Tile */}
                <div className="aspect-square sm:aspect-auto relative overflow-hidden bg-muted">
                  <img
                    src={tile.imageSrc}
                    alt={tile.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Subtle category tag on image */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white border border-white/10 flex items-center gap-1.5 shadow-lg">
                    <tile.icon className="w-3 h-3 text-primary-foreground" />
                    <span>{tile.category}</span>
                  </div>
                </div>

                {/* Quote details Tile */}
                <div className="p-8 flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-border bg-card/50">
                  <span className="text-xs font-bold text-primary uppercase tracking-widest mb-2 block">
                    {tile.category}
                  </span>
                  <h3 className="text-xl font-bold mb-4 text-foreground">
                    {tile.title}
                  </h3>
                  <div className="relative">
                    <span className="text-4xl text-primary/20 font-serif absolute -top-4 -left-2">“</span>
                    <p className="text-muted-foreground leading-relaxed italic relative z-10 pl-4">
                      {tile.quote}
                    </p>
                  </div>
                </div>

              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
