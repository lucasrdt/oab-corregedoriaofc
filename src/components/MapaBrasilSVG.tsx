import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { useSite } from '@/contexts/SiteContext';

// Define a URL do arquivo JSON que está na sua pasta public
const geoUrl = "/brazil-states.json";

// Função para centralizar as siglas nos estados
const getCentroid = (feature: any) => {
  if (!feature?.geometry) return [0, 0];
  const { type, coordinates } = feature.geometry;
  let points = type === "Polygon" ? coordinates[0] : coordinates[0][0];
  if (!points || points.length === 0) return [0, 0];
  const sum = points.reduce((acc: number[], p: number[]) => [acc[0] + p[0], acc[1] + p[1]], [0, 0]);
  return [sum[0] / points.length, sum[1] / points.length];
};

const MapaBrasilSVG = () => {
  const { config } = useSite();
  const statesOn = config?.content?.mapStates || [];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      {/* 1. pointer-events-none: Desativa qualquer clique no mapa.
          2. select-none: Impede a seleção visual.
      */}
      <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center pointer-events-none select-none">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 900, center: [-54, -15] }}
          className="w-full h-full"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const sigla = geo.properties.sigla;
                const isActive = statesOn.includes(sigla);

                return (
                  <React.Fragment key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      fill={isActive ? '#1a4731' : '#e9a84b'}
                      stroke="#fff"
                      strokeWidth={0.5}
                      /* Remove o quadrado preto de seleção e o efeito de hover */
                      style={{
                        default: { outline: "none" },
                        hover: { outline: "none" },
                        pressed: { outline: "none" }
                      }}
                    />
                    {isActive && (
                      <Marker coordinates={getCentroid(geo) as [number, number]}>
                        <rect x="-10" y="-7" width="20" height="14" rx="2" fill="#0f2b1d" />
                        <text
                          textAnchor="middle"
                          y="3.5"
                          style={{
                            fontSize: "8px",
                            fill: "#fff",
                            fontWeight: "bold",
                            pointerEvents: "none"
                          }}
                        >
                          {sigla}
                        </text>
                      </Marker>
                    )}
                  </React.Fragment>
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      <div className="mt-4">
        <span className="text-[#1a4731] font-bold text-xl underline decoration-2 underline-offset-8">
          Estados Ativos
        </span>
      </div>
    </div>
  );
};

export default MapaBrasilSVG;