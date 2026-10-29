import Image from "next/image";

export default function ResponsiveImage() {
  return (
    <div className="relative">
      <div className="overflow-hidden">
        <Image
          src="/images/grid-image/image-01.png"
          alt="Cover"
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800"
          width={1054}
          height={600}
        />
      </div>
    </div>
  );
}
