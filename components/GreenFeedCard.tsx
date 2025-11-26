export default function GreenFeedCard({
  title,
  image,
  excerpt,
}: {
  title: string;
  image: string;
  excerpt?: string;
}) {
  return (
    <div className="rounded-lg overflow-hidden shadow-md">
      <div className="relative">
        {/* eslint-disable @next/next/no-img-element */}
        <img src={image} alt={title} className="w-full object-cover h-48" />
        {/* eslint-enable @next/next/no-img-element */}

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-lg  font-numeric font-semibold">{title}</h3>
          {excerpt && <p className="text-sm mt-1 line-clamp-2">{excerpt}</p>}
        </div>
      </div>
    </div>
  );
}
