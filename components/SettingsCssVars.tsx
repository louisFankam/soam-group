import { getSettings } from "@/lib/cms-data";

export async function SettingsCssVars() {
  const settings = await getSettings();
  const appearance = settings.appearance ?? {};
  const logo = settings.logo ?? {};

  const vars: string[] = [];

  if (appearance.couleur_principale) vars.push(`--color-primary: ${appearance.couleur_principale}`);
  if (appearance.couleur_accent) vars.push(`--color-accent-green: ${appearance.couleur_accent}`);
  if (appearance.couleur_secondaire) vars.push(`--color-accent-orange: ${appearance.couleur_secondaire}`);
  if (appearance.couleur_fond) vars.push(`--color-background: ${appearance.couleur_fond}`);
  if (appearance.couleur_texte) vars.push(`--color-foreground: ${appearance.couleur_texte}`);
  if (appearance.rayon_boutons) vars.push(`--radius-xl: ${appearance.rayon_boutons}px`);

  if (appearance.police_titres) {
    const family = String(appearance.police_titres).replace(/_/g, " ");
    vars.push(`--font-headings: "${family}", sans-serif`);
  }
  if (appearance.police_texte) {
    const family = String(appearance.police_texte).replace(/_/g, " ");
    vars.push(`--font-body: "${family}", sans-serif`);
  }

  if (vars.length === 0) return null;

  return (
    <style
      id="settings-css-vars"
      dangerouslySetInnerHTML={{
        __html: `:root { ${vars.join("; ")}; }`,
      }}
    />
  );
}
