import Image from "next/image";

export default function ThreeColumnImageGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      <div>
        <Image
          src="/images/grid-image/image-04.png"
          alt=" grid"
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800"
          width={338}
          height={192}
        />
      </div>

      <div>
        <Image
          src="/images/grid-image/image-05.png"
          alt=" grid"
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800"
          width={338}
          height={192}
        />
      </div>

      <div>
        <Image
          src="/images/grid-image/image-06.png"
          alt=" grid"
          className="w-full rounded-xl border border-gray-200 dark:border-gray-800"
          width={338}
          height={192}
        />
      </div>
    </div>
  );
}
