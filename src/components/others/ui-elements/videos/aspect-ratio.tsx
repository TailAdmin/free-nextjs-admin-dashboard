import ComponentCard from "@/components/common/component-card";
import { Video } from "@/components/ui/video";

export default function VideoAspectRatioPreviews() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:gap-6 xl:grid-cols-2">
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Video Ratio 16:9">
          <Video videoId="dQw4w9WgXcQ" />
        </ComponentCard>
        <ComponentCard title="Video Ratio 4:3">
          <Video videoId="dQw4w9WgXcQ" aspectRatio="4:3" />
        </ComponentCard>
      </div>
      <div className="space-y-5 sm:space-y-6">
        <ComponentCard title="Video Ratio 21:9">
          <Video videoId="dQw4w9WgXcQ" aspectRatio="21:9" />
        </ComponentCard>
        <ComponentCard title="Video Ratio 1:1">
          <Video videoId="dQw4w9WgXcQ" aspectRatio="1:1" />
        </ComponentCard>
      </div>
    </div>
  );
}
