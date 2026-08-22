import { ImageResponse } from "next/og";

// Carte OpenGraph dynamique : /api/og?titre=…&sousTitre=…
export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const titre = (searchParams.get("titre") ?? "SOAM GROUP").slice(0, 140);
  const sousTitre = searchParams.get("sousTitre")?.slice(0, 200) ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(120deg, #060d1f 0%, #0f3490 60%, #1a4fbd 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#27ae60",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            <span>SOAM</span>
            <span style={{ color: "#27ae60" }}>GROUP</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 950 }}>
          <div style={{ fontSize: titre.length > 60 ? 52 : 64, fontWeight: 700, lineHeight: 1.15 }}>
            {titre}
          </div>
          {sousTitre && (
            <div style={{ fontSize: 30, color: "rgba(255,255,255,0.75)", marginTop: 20 }}>
              {sousTitre}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
