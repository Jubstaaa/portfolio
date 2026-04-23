import Image from "next/image";

import { cn } from "@/lib/utils";

export interface ProjectGalleryProps {
  images: ReadonlyArray<{ src: string; alt: string; caption?: string | undefined }>;
  className?: string;
}

export function ProjectGallery({ images, className }: ProjectGalleryProps) {
  if (images.length === 0) return null;
  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      {images.map((img, index) => (
        <div
          key={img.src}
          className="hairline relative aspect-[16/10] overflow-hidden rounded-md border"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority={index === 0}
            sizes="(min-width: 1024px) 900px, 100vw"
            className="object-cover"
          />
        </div>
      ))}
    </figure>
  );
}
