import React from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const geoUrl =
  "https://cdn.jsdelivr.net/gh/tbrugz/geodata-br@master/geojson/geojs-21-mun.json";

// ─── Utilitários ──────────────────────────────────────────────────────────────

const normalize = (str: string) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const getCentroid = (feature: any): [number, number] => {
  if (!feature?.geometry) return [0, 0];
  const { type, coordinates } = feature.geometry;
  const points: number[][] =
    type === "Polygon" ? coordinates[0] : coordinates[0]?.[0] ?? [];
  if (!points || points.length === 0) return [0, 0];
  const sum = points.reduce(
    (acc: number[], p: number[]) => [acc[0] + p[0], acc[1] + p[1]],
    [0, 0]
  );
  return [sum[0] / points.length, sum[1] / points.length];
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface MapaMaranhaoSVGProps {
  activeCities?: string[];
}

// ─── Componente ───────────────────────────────────────────────────────────────

const MapaMaranhaoSVG: React.FC<MapaMaranhaoSVGProps> = ({ activeCities = [] }) => {
  const normalizedActive = React.useMemo(
    () => activeCities.map(normalize),
    [activeCities]
  );

  const hasSubsection = (name: string) => {
    const n = normalize(name);
    return normalizedActive.some(
      (a) => n === a || n.startsWith(a) || a.startsWith(n)
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center select-none pointer-events-none">
      <div className="relative w-full" style={{ maxWidth: "520px", aspectRatio: "1 / 1.12" }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-44.5, -5.2], scale: 3400 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => (
              <>
                {/* ── Polígonos dos municípios ── */}
                {geographies.map((geo) => {
                  const name: string = geo.properties.name ?? "";
                  const active = hasSubsection(name);

                  return (
                    <Geography
                      key={`geo-${geo.rsmKey}`}
                      geography={geo}
                      fill={active ? "#f0b429" : "#aec8e0"}
                      stroke="#3a6a94"
                      strokeWidth={active ? 1.2 : 0.28}
                      strokeOpacity={0.7}
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                })}

                {/* ── Ponto marcador apenas nas cidades com subseção ── */}
                {geographies
                  .filter((geo) => hasSubsection(geo.properties.name ?? ""))
                  .map((geo) => {
                    const centroid = getCentroid(geo);
                    return (
                      <Marker key={`pin-${geo.rsmKey}`} coordinates={centroid}>
                        {/* Glow ao redor do ponto */}
                        <circle r={9} fill="#e8a000" opacity={0.30} />
                        <circle r={5} fill="#e8a000" opacity={0.20} />
                        {/* Ponto principal */}
                        <circle
                          r={4}
                          fill="#b85c00"
                          stroke="#ffffff"
                          strokeWidth={1}
                        />
                      </Marker>
                    );
                  })}
              </>
            )}
          </Geographies>
        </ComposableMap>
      </div>

      {/* ── Legenda ── */}
      <div className="mt-3 flex items-center gap-6 flex-wrap justify-center">
        <div className="flex items-center gap-2">
          <svg width="14" height="14">
            <rect width="14" height="14" rx="2" fill="#aec8e0" stroke="#3a6a94" strokeWidth="0.8" />
          </svg>
          <span className="text-xs font-semibold text-muted-foreground">Municípios</span>
        </div>
        <div className="flex items-center gap-2">
          <svg width="14" height="14">
            <rect width="14" height="14" rx="2" fill="#f0b429" stroke="#3a6a94" strokeWidth="0.8" />
          </svg>
          <span className="text-xs font-semibold text-muted-foreground">
            Subseção registrada
            {activeCities.length > 0 && (
              <span className="ml-1 text-primary font-bold">({activeCities.length})</span>
            )}
          </span>
        </div>
      </div>

      {activeCities.length === 0 && (
        <p className="mt-2 text-xs text-muted-foreground/55 italic">
          As cidades com subseções cadastradas aparecerão destacadas automaticamente.
        </p>
      )}
    </div>
  );
};

export default MapaMaranhaoSVG;
