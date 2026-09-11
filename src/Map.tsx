import { useMemo, useState } from "react";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import worldData from "world-atlas/countries-110m.json";
import "./Map.css";

type ClientLocation = {
  id: string;
  city: string;
  country: string;
  message: string;
  x: number;
  y: number;
};

type WorldFeature = {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: unknown;
};

/*
|--------------------------------------------------------------------------
| VADRIVO CLIENT LOCATIONS
|--------------------------------------------------------------------------
| Change these values whenever you want to add/remove locations.
|
| x/y are ONLY used as a fallback visual position.
| The actual map is generated from real country geometry.
|--------------------------------------------------------------------------
*/

const CLIENT_LOCATIONS: ClientLocation[] = [
  {
    id: "nagpur",
    city: "Nagpur",
    country: "India",
    message: "Digital experience",
    x: 69.2,
    y: 50.2,
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    message: "Web development",
    x: 48.0,
    y: 31.0,
  },
  {
    id: "new-york",
    city: "New York",
    country: "United States",
    message: "Brand website",
    x: 26.2,
    y: 38.0,
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "UAE",
    message: "Luxury business",
    x: 60.5,
    y: 46.0,
  },
  {
    id: "idaho",
    city: "Idaho",
    country: "United States",
    message: "Cafe Shop",
    x: 24.0,
    y: 39.5,
  },
  {
    id: "sydney",
    city: "Sydney",
    country: "Australia",
    message: "Responsive web",
    x: 82.4,
    y: 72.0,
  },
  {
    id: "yellowknife",
    city: "Yellowknife",
    country: "Canada",
    message: "Restaurant Website",
    x: 21.8,
    y: 27.0,
  },
  {
    id: "aguascalientes",
    city: "Aguascalientes",
    country: "Mexico",
    message: "Cafe Website",
    x: 19.8,
    y: 48.8,
  },
];

/*
|--------------------------------------------------------------------------
| REAL WORLD MAP
|--------------------------------------------------------------------------
| world-atlas provides detailed Natural Earth country geometry.
| It is converted to normal GeoJSON features and rendered directly
| into SVG paths.
|--------------------------------------------------------------------------
*/

const countries = feature(
  worldData as any,
  (worldData as any).objects.countries
) as any;

export function GlobalMap() {
  const [activeLocation, setActiveLocation] =
    useState<ClientLocation | null>(null);

  const projection = useMemo(() => {
    return geoMercator()
      .scale(145)
      .center([10, 10])
      .translate([500, 250]);
  }, []);

  const pathGenerator = useMemo(() => {
    return geoPath(projection);
  }, [projection]);

  /*
  |--------------------------------------------------------------------------
  | Location coordinates
  |--------------------------------------------------------------------------
  | These coordinates are longitude / latitude.
  |
  | This makes the markers independent from the SVG size.
  |--------------------------------------------------------------------------
  */

  const coordinates: Record<string, [number, number]> = {
    nagpur: [79.0882, 21.1458],
    london: [-0.1276, 51.5072],
    "new-york": [-74.006, 40.7128],
    dubai: [55.2708, 25.2048],
    singapore: [103.8198, 1.3521],
    sydney: [151.2093, -33.8688],
    yellowknife: [-114.3718, 62.4540],
    idaho: [-114.7420, 44.0682],
    aguascalientes: [-102.2916, 21.8853],
  };

  return (
    <div className="vadrivo-global-map">
      <div className="vadrivo-map-stage">

        {/* Decorative top information */}
        <div className="vadrivo-map-meta">
          <span>VADRIVO / GLOBAL NETWORK</span>
          <span>08 LOCATIONS</span>
        </div>

        <svg
          className="vadrivo-world-svg"
          viewBox="0 0 1000 500"
          role="img"
          aria-label="Vadrivo global client network"
        >
          <defs>

            {/* Subtle map glow */}
            <filter
              id="vadrivo-map-glow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Marker glow */}
            <filter
              id="vadrivo-marker-glow"
              x="-300%"
              y="-300%"
              width="600%"
              height="600%"
            >
              <feGaussianBlur stdDeviation="5" />
            </filter>

            {/* Very subtle map gradient */}
            <linearGradient
              id="vadrivo-land-gradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#181a1f" />
              <stop offset="100%" stopColor="#0d0f13" />
            </linearGradient>

          </defs>

          {/* =========================================================
              BACKGROUND GRID
          ========================================================= */}

          <g className="vadrivo-map-grid">
            {[...Array(11)].map((_, index) => (
              <line
                key={`horizontal-${index}`}
                x1="0"
                y1={index * 50}
                x2="1000"
                y2={index * 50}
              />
            ))}

            {[...Array(21)].map((_, index) => (
              <line
                key={`vertical-${index}`}
                x1={index * 50}
                y1="0"
                x2={index * 50}
                y2="500"
              />
            ))}
          </g>

          {/* =========================================================
              COUNTRY MAP
          ========================================================= */}

          <g
            className="vadrivo-countries"
            filter="url(#vadrivo-map-glow)"
          >
            {countries.features.map(
              (country: WorldFeature, index: number) => {
                const path = pathGenerator(country as any);

                if (!path) return null;

                return (
                  <path
                    key={`country-${index}`}
                    d={path}
                    className="vadrivo-country"
                  />
                );
              }
            )}
          </g>

          {/* =========================================================
              COUNTRY BORDER DETAIL
          ========================================================= */}

          <g className="vadrivo-country-borders">
            {countries.features.map(
              (country: WorldFeature, index: number) => {
                const path = pathGenerator(country as any);

                if (!path) return null;

                return (
                  <path
                    key={`border-${index}`}
                    d={path}
                    className="vadrivo-country-border"
                  />
                );
              }
            )}
          </g>

          {/* =========================================================
              CLIENT CONNECTION LINES
          ========================================================= */}

          <g className="vadrivo-network-lines">
            {CLIENT_LOCATIONS.slice(0, -1).map((location, index) => {
              const current = coordinates[location.id];
              const next = coordinates[CLIENT_LOCATIONS[index + 1].id];

              if (!current || !next) return null;

              const start = projection(current);
              const end = projection(next);

              if (!start || !end) return null;

              return (
                <line
                  key={`connection-${location.id}-${CLIENT_LOCATIONS[index + 1].id}`}
                  className="vadrivo-network-line"
                  x1={start[0]}
                  y1={start[1]}
                  x2={end[0]}
                  y2={end[1]}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </g>

          {/* =========================================================
              LOCATION MARKERS
          ========================================================= */}

          {CLIENT_LOCATIONS.map((location) => {
            const coordinate = coordinates[location.id];

            if (!coordinate) return null;

            const point = projection(coordinate);

            if (!point) return null;

            const [cx, cy] = point;

            const isActive =
              activeLocation?.id === location.id;

            return (
              <g
                key={location.id}
                className={`vadrivo-location ${
                  isActive ? "is-active" : ""
                }`}
                transform={`translate(${cx}, ${cy})`}
                tabIndex={0}
                role="button"
                aria-label={`${location.city}, ${location.country}`}
                onMouseEnter={() =>
                  setActiveLocation(location)
                }
                onMouseLeave={() =>
                  setActiveLocation(null)
                }
                onFocus={() =>
                  setActiveLocation(location)
                }
                onBlur={() =>
                  setActiveLocation(null)
                }
                onClick={() =>
                  setActiveLocation(
                    isActive ? null : location
                  )
                }
              >

                {/* Large soft glow */}
                <circle
                  className="vadrivo-marker-glow"
                  r="10"
                  filter="url(#vadrivo-marker-glow)"
                />

                {/* Animated outer pulse */}
                <circle
                  className="vadrivo-marker-pulse"
                  r="7"
                />

                {/* Marker ring */}
                <circle
                  className="vadrivo-marker-ring"
                  r="4.5"
                />

                {/* Core */}
                <circle
                  className="vadrivo-marker-core"
                  r="2.2"
                />

                {/* Tooltip */}
                {isActive && (
                  <g
                    className="vadrivo-map-tooltip"
                    transform="translate(12,-55)"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="175"
                      height="65"
                      rx="0"
                    />

                    <text
                      x="14"
                      y="21"
                      className="tooltip-city"
                    >
                      {location.city.toUpperCase()}
                    </text>

                    <text
                      x="14"
                      y="37"
                      className="tooltip-country"
                    >
                      {location.country}
                    </text>

                    <line
                      x1="14"
                      y1="47"
                      x2="161"
                      y2="47"
                    />

                    <text
                      x="14"
                      y="58"
                      className="tooltip-message"
                    >
                      {location.message}
                    </text>
                  </g>
                )}

              </g>
            );
          })}

          {/* =========================================================
              MAP CENTER DECORATION
          ========================================================= */}

          <g className="vadrivo-map-crosshair">
            <line x1="500" y1="226" x2="500" y2="274" />
            <line x1="476" y1="250" x2="524" y2="250" />
          </g>

        </svg>

        {/* =========================================================
            LIVE LOCATION CARD
        ========================================================= */}

        

        {/* Bottom information */}
        <div className="vadrivo-map-footer">
          <span>INTERACTIVE NETWORK</span>
          <span>HOVER / TAP LOCATIONS</span>
          <span>2026</span>
        </div>

      </div>
    </div>
  );
}

export default GlobalMap;
