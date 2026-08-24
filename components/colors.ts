// ponytail: plus aucun fond derrière icônes/badges — couleur seule.
export const textColor = (color: string) =>
  color === "primary"
    ? "text-primary"
    : color === "green"
      ? "text-accent-green"
      : color === "orange"
        ? "text-accent-orange"
        : "text-primary";

// chipBg conservé pour ne pas renommer 30 usages ; alias de textColor.
export const chipBg = textColor;
