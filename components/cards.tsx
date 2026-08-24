import Link from "next/link";
import Icon, { Img } from "@/components/ui";
import { chipBg } from "@/components/colors";


export function SectionHeader({
  badge,
  title,
  subtitle,
  align = "center",
}: {
  badge: string;
  title: string;
  subtitle?: string | null;
  align?: "center" | "left";
}) {
  return (
    <div
      className={`mb-10 ${align === "center" ? "text-center mx-auto max-w-2xl" : ""}`}
    >
      <span className="text-primary text-xs font-semibold uppercase tracking-wide mb-4 block">
        {badge}
      </span>
      <h2 className="font-headings font-bold text-3xl lg:text-4xl text-foreground mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground font-body text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function ExpertiseCard({
  slug,
  icon,
  title,
  description,
  color,
  imageSeed,
  imageUrl,
}: {
  slug: string;
  icon: string;
  title: string;
  description: string;
  color: string;
  imageSeed: string;
  imageUrl?: string | null;
}) {
  return (
    <Link
      href={`/expertises/${slug}`}
      className="bg-card border border-card-border rounded-xl p-5 flex flex-col items-start transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 group h-full"
    >
      <Icon i={icon} size={26} className={`block mb-4 ${chipBg(color)}`} />
      <h3 className="font-headings font-semibold text-sm text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-xs leading-relaxed">
        {description}
      </p>
      <Img
        seed={imageSeed}
        imageUrl={imageUrl}
        w={400}
        h={240}
        alt={title}
        className="w-full h-24 object-cover rounded-lg mt-4 opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-[1.03]"
      />
    </Link>
  );
}

export function SoftwareCard({
  slug,
  name,
  tagline,
  description,
  features,
  color,
  imageSeed,
  imageUrl,
}: {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  color: string;
  imageSeed: string;
  imageUrl?: string | null;
}) {
  return (
    <div className="bg-card border border-card-border rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10 group">
      <div className="relative h-44">
        <Img seed={imageSeed} imageUrl={imageUrl} w={640} h={360} alt={name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-5 right-5">
          <h3 className="text-white font-headings font-bold text-xl">{name}</h3>
          <p className="text-white/80 text-xs mt-0.5">{tagline}</p>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
          {description}
        </p>
        <ul className="space-y-2 mb-5">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-foreground">
              <Icon i="check" size={15} className={chipBg(color)} />
              {f}
            </li>
          ))}
        </ul>
        <Link
          href={`/logiciels/${slug}`}
          className={`mt-auto inline-flex items-center gap-1.5 text-sm font-medium ${
            color === "primary"
              ? "text-primary"
              : color === "green"
                ? "text-accent-green"
                : "text-accent-orange"
          }`}
        >
          En savoir plus <Icon i="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export function TestimonialCard({
  quote,
  name,
  role,
  company,
}: {
  quote: string;
  name: string;
  role: string;
  company: string;
}) {
  const initials = name
    .replace("Dr. ", "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="bg-card border border-card-border rounded-2xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10">
      <Icon i="message-circle" size={28} className="text-secondary-foreground opacity-60 mb-4" />
      <p className="text-foreground text-base leading-relaxed italic mb-6">
        “{quote}”
      </p>
      <div className="mt-auto flex items-center gap-3">
        <div className="w-11 h-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-headings font-bold text-sm">
          {initials}
        </div>
        <div>
          <div className="font-headings font-semibold text-sm text-foreground">
            {name}
          </div>
          <div className="text-muted-foreground text-xs">
            {role} — {company}
          </div>
        </div>
      </div>
    </div>
  );
}

export function NewsCard({
  category,
  date,
  title,
  excerpt,
  imageSeed,
  imageUrl,
}: {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  imageSeed: string;
  imageUrl?: string | null;
}) {
  return (
    <article className="bg-card border border-card-border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 flex flex-col group">
      <Img seed={imageSeed} imageUrl={imageUrl} w={640} h={360} alt={title} className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-105" />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-primary text-xs font-semibold">
            {category}
          </span>
          <span className="text-muted-foreground text-xs">{date}</span>
        </div>
        <h3 className="font-headings font-semibold text-lg text-foreground leading-snug mb-2">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {excerpt}
        </p>
      </div>
    </article>
  );
}
