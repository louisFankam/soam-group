import { Img } from "@/components/ui";


export default function PortfolioCard({
  category,
  title,
  description,
  imageSeed,
  imageUrl,
  color,
  featured,
}: {
  category: string;
  title: string;
  description: string;
  imageSeed: string;
  imageUrl?: string | null;
  color: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl overflow-hidden group h-full ${featured ? "min-h-[380px]" : "min-h-[180px]"}`}
    >
      <Img
        seed={imageSeed}
        imageUrl={imageUrl}
        w={800}
        h={600}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            color === "primary"
              ? "linear-gradient(to top, rgba(26,79,189,0.9) 0%, rgba(26,79,189,0.35) 55%, transparent 100%)"
              : color === "green"
                ? "linear-gradient(to top, rgba(39,174,96,0.9) 0%, rgba(39,174,96,0.35) 55%, transparent 100%)"
                : "linear-gradient(to top, rgba(230,126,34,0.9) 0%, rgba(230,126,34,0.35) 55%, transparent 100%)",
        }}
      />
      <div className="absolute top-4 left-4">
        <span className="bg-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-xl">
          {category}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="text-white font-headings font-bold text-lg leading-snug">
          {title}
        </h3>
        <p className="text-white/75 text-sm mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
