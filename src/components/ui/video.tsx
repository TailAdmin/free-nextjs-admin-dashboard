type AspectRatio = "16:9" | "4:3" | "21:9" | "1:1";

interface VideoProps {
  videoId: string;
  aspectRatio?: AspectRatio;
  title?: string;
  className?: string;
}

export function Video({
  videoId,
  aspectRatio = "16:9",
  title = "YouTube video",
  className = "",
}: VideoProps) {
  const aspectRatioClass = {
    "16:9": "aspect-video",
    "4:3": "aspect-4/3",
    "21:9": "aspect-21/9",
    "1:1": "aspect-square",
  }[aspectRatio];

  return (
    <div
      className={`overflow-hidden rounded-lg ${aspectRatioClass} ${className}`}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      ></iframe>
    </div>
  );
}
