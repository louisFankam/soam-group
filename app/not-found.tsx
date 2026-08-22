import Link from "next/link";
import Icon from "@/components/ui";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-hero-dark flex flex-col items-center justify-center text-center px-6">
      <p className="font-headings font-bold text-7xl text-primary mb-4">404</p>
      <h1 className="font-headings font-bold text-2xl text-white mb-3">
        Page introuvable
      </h1>
      <p className="text-white/60 max-w-md mb-8">
        La page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-deep transition-colors text-white font-semibold px-7 py-3 rounded-xl"
      >
        Retour à l&apos;accueil <Icon i="arrow-right" size={18} />
      </Link>
    </main>
  );
}
