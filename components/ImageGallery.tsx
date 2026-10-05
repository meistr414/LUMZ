"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type GalleryImage = { src: string; alt: string };

type ImageGalleryProps = {
  images: GalleryImage[];
};

function ZoomableImage({
  image,
  priority,
}: {
  image: GalleryImage;
  priority: boolean;
}) {
  const [origin, setOrigin] = useState("50% 50%");
  const [zoomed, setZoomed] = useState(false);

  return (
    <div
      className="relative aspect-4/5 w-full shrink-0 snap-center overflow-hidden rounded-lg bg-muted"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setOrigin(`${x}% ${y}%`);
      }}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority={priority}
        className="object-cover transition-transform duration-200 ease-out md:cursor-zoom-in"
        style={
          zoomed
            ? { transform: "scale(1.8)", transformOrigin: origin }
            : undefined
        }
      />
    </div>
  );
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset the active index whenever the image set changes (colour swap) —
  // pure state derivation, safe to do during render.
  const [lastImages, setLastImages] = useState(images);
  if (lastImages !== images) {
    setLastImages(images);
    setActiveIndex(0);
  }

  // Scrolling the carousel back to the start is a DOM side effect, so it
  // belongs in an effect (refs aren't safe to read/write during render).
  useEffect(() => {
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [images]);

  function scrollToIndex(index: number) {
    const el = scrollerRef.current?.children[index];
    if (el instanceof HTMLElement) {
      el.scrollIntoView({
        behavior: "smooth",
        inline: "start",
        block: "nearest",
      });
    }
    setActiveIndex(index);
  }

  if (images.length === 0) {
    return <div className="aspect-4/5 w-full rounded-lg bg-muted" />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory overflow-x-auto rounded-lg"
        aria-label="Product images"
      >
        {images.map((image, i) => (
          <ZoomableImage key={image.src} image={image} priority={i === 0} />
        ))}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              onClick={() => scrollToIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === activeIndex}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-md border-2",
                i === activeIndex ? "border-foreground" : "border-transparent"
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
