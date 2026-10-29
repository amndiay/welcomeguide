import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ImageIcon } from "lucide-react";
import { getImageUrl } from "@/lib/properties.functions";
import { cn } from "@/lib/utils";

/** Resolves a private storage path into a signed URL before rendering. */
export function PropertyImage({
  path,
  alt,
  className,
}: {
  path: string | null | undefined;
  alt: string;
  className?: string;
}) {
  const resolve = useServerFn(getImageUrl);
  const { data } = useQuery({
    queryKey: ["property-image", path],
    queryFn: () => resolve({ data: { path: path as string } }),
    enabled: Boolean(path),
    staleTime: 30 * 60 * 1000,
  });

  if (!path || !data?.url) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-secondary text-muted-foreground",
          className,
        )}
      >
        <ImageIcon className="size-5" aria-hidden />
      </div>
    );
  }

  return <img src={data.url} alt={alt} className={cn("object-cover", className)} />;
}
