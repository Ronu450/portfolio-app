import { useState } from "react";
import { Image as ImageIcon, Plus, Trash2, ExternalLink } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
// Small local image-with-fallback helper to avoid a separate figma/ helper file
import React, { useState as useStateLocal } from "react";

function LocalImageWithFallback(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  const [errored, setErrored] = useStateLocal(false);
  const { src, alt, className, style, ...rest } = props;

  const ERROR_IMG_SRC =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==";

  if (errored) {
    return (
      <div
        className={`inline-block bg-gray-100 text-center align-middle ${
          className ?? ""
        }`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={ERROR_IMG_SRC}
            alt="Error loading image"
            data-original-url={src}
          />
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setErrored(true)}
      {...rest}
    />
  );
}

interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
}

export function Gallery() {
  const [items, setItems] = useState<GalleryItem[]>([
    {
      id: "1",
      title: "Project Screenshot",
      imageUrl:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
      description: "A beautiful web application",
    },
    {
      id: "2",
      title: "Design Mockup",
      imageUrl:
        "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800",
      description: "UI/UX design work",
    },
    {
      id: "3",
      title: "Code Editor",
      imageUrl:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
      description: "Clean and organized code",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    description: "",
  });

  const handleAdd = () => {
    setFormData({ title: "", imageUrl: "", description: "" });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    setItems([...items, { id: Date.now().toString(), ...formData }]);
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Gallery
            </h2>
            <p className="text-muted-foreground">
              My work and creative projects
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Image to Gallery</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Image title"
                  />
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Brief description"
                  />
                </div>
                <Button onClick={handleSave} className="w-full">
                  Add to Gallery
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card
              key={item.id}
              className="border-primary/20 overflow-hidden group relative hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1"
            >
              <div className="aspect-video overflow-hidden bg-gradient-to-br from-primary/5 to-accent/5">
                <LocalImageWithFallback
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="mb-1">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedImage(item)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {items.length === 0 && (
            <Card className="border-dashed border-2 col-span-full">
              <CardContent className="py-12 text-center">
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No images yet. Click "Add Image" to start your gallery!
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Image Preview Dialog */}
        {selectedImage && (
          <Dialog
            open={!!selectedImage}
            onOpenChange={() => setSelectedImage(null)}
          >
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>{selectedImage.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="w-full max-h-[70vh] overflow-hidden rounded-lg bg-muted">
                  <LocalImageWithFallback
                    src={selectedImage.imageUrl}
                    alt={selectedImage.title}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-muted-foreground">
                  {selectedImage.description}
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </section>
  );
}
