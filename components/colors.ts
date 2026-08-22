// ponytail: color en string libre (vient de la DB) ; fallback primary si valeur inconnue.
export type Color = "primary" | "green" | "orange";

export const chipBg = (color: string) =>
  color === "primary"
    ? "bg-secondary text-primary"
    : color === "green"
      ? "bg-accent-green-light text-accent-green"
      : color === "orange"
        ? "bg-accent-orange-light text-accent-orange"
        : "bg-secondary text-primary";

export const textColor = (color: string) =>
  color === "primary"
    ? "text-primary"
    : color === "green"
      ? "text-accent-green"
      : color === "orange"
        ? "text-accent-orange"
        : "text-primary";
