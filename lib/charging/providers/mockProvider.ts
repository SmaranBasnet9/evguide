// ─────────────────────────────────────────────────────────────────────────────
// Mock Charging Provider
//
// Returns realistic UK charging station data from a static dataset.
// Simulates coordinate-based and location-string searches.
//
// TO REPLACE WITH A REAL PROVIDER:
//   1. Create  lib/charging/providers/openChargeMapsProvider.ts
//   2. Implement the ChargingProvider interface
//   3. Update lib/charging/service.ts to import the new provider
//   No frontend changes required.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ChargerStation,
  ChargingProvider,
  ChargingSearchParams,
  ChargingSearchResult,
} from "../types";

// ── Haversine distance (miles) ───────────────────────────────────────────────

function distanceMiles(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Known-location lookup for string-based searches ─────────────────────────

const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  london: { lat: 51.5074, lng: -0.1278 },
  westminster: { lat: 51.4994, lng: -0.1357 },
  "canary wharf": { lat: 51.5054, lng: -0.0235 },
  shoreditch: { lat: 51.5241, lng: -0.0774 },
  camden: { lat: 51.539, lng: -0.1425 },
  brixton: { lat: 51.4613, lng: -0.1156 },
  hammersmith: { lat: 51.4927, lng: -0.2339 },
  richmond: { lat: 51.4613, lng: -0.3037 },
  wimbledon: { lat: 51.4214, lng: -0.2065 },
  stratford: { lat: 51.5414, lng: 0.0044 },
  heathrow: { lat: 51.47, lng: -0.4543 },
  croydon: { lat: 51.3762, lng: -0.0982 },
  wembley: { lat: 51.556, lng: -0.2796 },
  ealing: { lat: 51.513, lng: -0.3089 },
  islington: { lat: 51.5375, lng: -0.1026 },
  hackney: { lat: 51.545, lng: -0.0553 },
  greenwich: { lat: 51.4934, lng: 0.0098 },
  fulham: { lat: 51.4831, lng: -0.1941 },
  battersea: { lat: 51.4811, lng: -0.1498 },
  clapham: { lat: 51.4612, lng: -0.1418 },
  putney: { lat: 51.4646, lng: -0.2164 },
  paddington: { lat: 51.5154, lng: -0.1755 },
  "kings cross": { lat: 51.5308, lng: -0.1238 },
  "london bridge": { lat: 51.5033, lng: -0.0865 },
  manchester: { lat: 53.4808, lng: -2.2426 },
  birmingham: { lat: 52.4862, lng: -1.8904 },
  bristol: { lat: 51.4545, lng: -2.5879 },
  leeds: { lat: 53.8008, lng: -1.5491 },
  edinburgh: { lat: 55.9533, lng: -3.1883 },
  glasgow: { lat: 55.8642, lng: -4.2518 },
};

function resolveLocationToCoords(
  location: string
): { lat: number; lng: number } | null {
  const key = location.toLowerCase().trim();
  // Exact match
  if (LOCATION_COORDS[key]) return LOCATION_COORDS[key];
  // Partial match — check if any known location is contained in the query
  for (const [name, coords] of Object.entries(LOCATION_COORDS)) {
    if (key.includes(name) || name.includes(key)) return coords;
  }
  return null;
}

// ── Mock dataset — 25 realistic UK charging stations ────────────────────────

const MOCK_STATIONS: Omit<ChargerStation, "distance_miles">[] = [
  {
    id: "mock-001",
    name: "Westfield London — BP Pulse Hub",
    network: "BP Pulse",
    address: "Ariel Way, White City",
    city: "London",
    postcode: "W12 7GF",
    latitude: 51.5074,
    longitude: -0.2228,
    connector_types: ["CCS", "CHAdeMO", "Type2"],
    power_kw: 150,
    charging_speed: "ultra_rapid",
    price_per_kwh: 0.79,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 8,
    amenities: ["Shopping", "Food & Drink", "Toilets", "WiFi"],
    notes: "Level 1 car park, zone B. Validated parking available with £10+ purchase.",
    last_updated: "2026-04-12T08:00:00Z",
  },
  {
    id: "mock-002",
    name: "Canary Wharf — Gridserve Electric Forecourt",
    network: "Gridserve",
    address: "Churchill Place, Canary Wharf",
    city: "London",
    postcode: "E14 5RB",
    latitude: 51.5054,
    longitude: -0.0235,
    connector_types: ["CCS", "NACS"],
    power_kw: 350,
    charging_speed: "ultra_rapid",
    price_per_kwh: 0.85,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 12,
    amenities: ["Coffee Shop", "Lounge", "Toilets", "WiFi", "Parking"],
    notes: "Flagship Gridserve site. 12 ultra-rapid bays, pre-booking recommended peak hours.",
    last_updated: "2026-04-12T07:30:00Z",
  },
  {
    id: "mock-003",
    name: "Westfield Stratford — Pod Point Hub",
    network: "Pod Point",
    address: "Montfichet Road, Stratford",
    city: "London",
    postcode: "E20 1EJ",
    latitude: 51.5414,
    longitude: 0.0044,
    connector_types: ["Type2", "CCS"],
    power_kw: 22,
    charging_speed: "fast",
    price_per_kwh: 0.45,
    availability: "occupied",
    open_24_hours: false,
    number_of_connectors: 10,
    amenities: ["Shopping", "Food Court", "Toilets"],
    notes: "Mall hours only. Mix of 7kW and 22kW bays on Level 3.",
    last_updated: "2026-04-12T09:15:00Z",
  },
  {
    id: "mock-004",
    name: "Kings Cross — Shell Recharge",
    network: "Shell Recharge",
    address: "Pancras Road, Kings Cross",
    city: "London",
    postcode: "N1C 4TB",
    latitude: 51.5308,
    longitude: -0.1238,
    connector_types: ["CCS", "CHAdeMO", "Type2"],
    power_kw: 100,
    charging_speed: "rapid",
    price_per_kwh: 0.72,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 6,
    amenities: ["Shell Station", "Food & Drink", "Toilets"],
    notes: "Attached to Shell petrol forecourt. 24/7 access.",
    last_updated: "2026-04-12T06:00:00Z",
  },
  {
    id: "mock-005",
    name: "Paddington Station — BP Pulse",
    network: "BP Pulse",
    address: "Praed Street, Paddington",
    city: "London",
    postcode: "W2 1RH",
    latitude: 51.5154,
    longitude: -0.1755,
    connector_types: ["CCS", "Type2"],
    power_kw: 50,
    charging_speed: "rapid",
    price_per_kwh: 0.65,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 4,
    amenities: ["Station", "Food & Drink", "Toilets"],
    notes: "Street-level parking bay adjacent to station entrance.",
    last_updated: "2026-04-12T07:00:00Z",
  },
  {
    id: "mock-006",
    name: "Camden Market — GeniePoint",
    network: "GeniePoint",
    address: "Chalk Farm Road, Camden",
    city: "London",
    postcode: "NW1 8AH",
    latitude: 51.539,
    longitude: -0.1425,
    connector_types: ["Type2"],
    power_kw: 7,
    charging_speed: "slow",
    price_per_kwh: 0.39,
    availability: "available",
    open_24_hours: false,
    number_of_connectors: 2,
    amenities: ["Street Parking", "Market Nearby"],
    notes: "On-street charger, 2-hour maximum during market hours.",
    last_updated: "2026-04-11T20:00:00Z",
  },
  {
    id: "mock-007",
    name: "Brixton — Ubitricity Lamppost Charger",
    network: "Ubitricity",
    address: "Atlantic Road, Brixton",
    city: "London",
    postcode: "SW9 8HX",
    latitude: 51.4613,
    longitude: -0.1156,
    connector_types: ["Type2"],
    power_kw: 5.5,
    charging_speed: "slow",
    price_per_kwh: 0.44,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 2,
    amenities: ["Street Parking"],
    notes: "Lamppost-integrated charger. Requires Ubitricity app or RFID card.",
    last_updated: "2026-04-12T05:00:00Z",
  },
  {
    id: "mock-008",
    name: "Hammersmith Broadway — Osprey Rapid",
    network: "Osprey",
    address: "King Street, Hammersmith",
    city: "London",
    postcode: "W6 9JU",
    latitude: 51.4927,
    longitude: -0.2339,
    connector_types: ["CCS", "CHAdeMO"],
    power_kw: 75,
    charging_speed: "rapid",
    price_per_kwh: 0.68,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 4,
    amenities: ["Car Park", "Shops Nearby", "Toilets"],
    notes: "Ground floor of Lyric Square car park. No height restriction.",
    last_updated: "2026-04-12T08:45:00Z",
  },
  {
    id: "mock-009",
    name: "Richmond Park & Ride — ChargePoint",
    network: "ChargePoint",
    address: "Petersham Road, Richmond",
    city: "London",
    postcode: "TW10 6UX",
    latitude: 51.4613,
    longitude: -0.3037,
    connector_types: ["Type2", "CCS"],
    power_kw: 22,
    charging_speed: "fast",
    price_per_kwh: 0.49,
    availability: "unknown",
    open_24_hours: false,
    number_of_connectors: 6,
    amenities: ["Park & Ride", "Outdoor"],
    notes: "Operates during park hours only. Free parking with active charge session.",
    last_updated: "2026-04-11T18:00:00Z",
  },
  {
    id: "mock-010",
    name: "Wimbledon Centre Court — Pod Point",
    network: "Pod Point",
    address: "Church Road, Wimbledon",
    city: "London",
    postcode: "SW19 5AE",
    latitude: 51.4214,
    longitude: -0.2065,
    connector_types: ["Type2"],
    power_kw: 7,
    charging_speed: "slow",
    price_per_kwh: 0.42,
    availability: "available",
    open_24_hours: false,
    number_of_connectors: 4,
    amenities: ["Car Park", "Tennis Club Nearby"],
    notes: "Members and visitors welcome. 3-hour charge limit during events.",
    last_updated: "2026-04-12T07:15:00Z",
  },
  {
    id: "mock-011",
    name: "Heathrow T5 — BP Pulse Ultra-Rapid",
    network: "BP Pulse",
    address: "Terminal 5, Heathrow Airport",
    city: "London",
    postcode: "TW6 2GA",
    latitude: 51.4775,
    longitude: -0.4862,
    connector_types: ["CCS", "NACS", "CHAdeMO"],
    power_kw: 250,
    charging_speed: "ultra_rapid",
    price_per_kwh: 0.89,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 16,
    amenities: ["Airport Terminal", "Food & Drink", "Toilets", "WiFi", "Shopping"],
    notes: "Short stay car park, Zone D. Pay on exit. First 15 min free.",
    last_updated: "2026-04-12T09:00:00Z",
  },
  {
    id: "mock-012",
    name: "Croydon Centrale — Osprey",
    network: "Osprey",
    address: "North End, Croydon",
    city: "London",
    postcode: "CR0 1TY",
    latitude: 51.3762,
    longitude: -0.0982,
    connector_types: ["CCS", "CHAdeMO"],
    power_kw: 100,
    charging_speed: "rapid",
    price_per_kwh: 0.69,
    availability: "out_of_service",
    open_24_hours: true,
    number_of_connectors: 4,
    amenities: ["Shopping Centre", "Toilets", "Food & Drink"],
    notes: "Currently one bay out of service — 3 of 4 available.",
    last_updated: "2026-04-12T08:00:00Z",
  },
  {
    id: "mock-013",
    name: "Wembley Stadium — Shell Recharge",
    network: "Shell Recharge",
    address: "Olympic Way, Wembley",
    city: "London",
    postcode: "HA9 0WS",
    latitude: 51.556,
    longitude: -0.2796,
    connector_types: ["CCS", "Type2"],
    power_kw: 50,
    charging_speed: "rapid",
    price_per_kwh: 0.71,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 8,
    amenities: ["Stadium Parking", "Outdoor"],
    notes: "Open to all, not just event-goers. Extra demand on match days.",
    last_updated: "2026-04-12T07:00:00Z",
  },
  {
    id: "mock-014",
    name: "Shoreditch High Street — Mer",
    network: "Mer",
    address: "Shoreditch High Street, E1",
    city: "London",
    postcode: "E1 6JJ",
    latitude: 51.5241,
    longitude: -0.0774,
    connector_types: ["Type2", "CCS"],
    power_kw: 22,
    charging_speed: "fast",
    price_per_kwh: 0.52,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 4,
    amenities: ["Street Parking", "Cafés Nearby"],
    notes: "Street-level bays, no height restriction. Parking charge applies.",
    last_updated: "2026-04-12T06:30:00Z",
  },
  {
    id: "mock-015",
    name: "Hackney Wick — Zap-Map Community",
    network: "Zap-Map Community",
    address: "Wallis Road, Hackney",
    city: "London",
    postcode: "E9 5LN",
    latitude: 51.545,
    longitude: -0.0553,
    connector_types: ["Type2"],
    power_kw: 7,
    charging_speed: "slow",
    price_per_kwh: 0.38,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 2,
    amenities: ["Residential Area", "Street Parking"],
    notes: "Community-maintained charger. Report issues via Zap-Map app.",
    last_updated: "2026-04-11T22:00:00Z",
  },
  {
    id: "mock-016",
    name: "Greenwich Peninsula — Tesla Supercharger",
    network: "Tesla",
    address: "Drawdock Road, Greenwich",
    city: "London",
    postcode: "SE10 0SQ",
    latitude: 51.4934,
    longitude: 0.0098,
    connector_types: ["NACS", "CCS"],
    power_kw: 250,
    charging_speed: "ultra_rapid",
    price_per_kwh: 0.77,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 10,
    amenities: ["Retail Park", "Food & Drink", "Toilets"],
    notes: "Non-Tesla vehicles can charge using CCS adaptor. Magic Dock enabled.",
    last_updated: "2026-04-12T08:00:00Z",
  },
  {
    id: "mock-017",
    name: "Battersea Power Station — BP Pulse",
    network: "BP Pulse",
    address: "Circus Road West, Battersea",
    city: "London",
    postcode: "SW11 8DD",
    latitude: 51.4811,
    longitude: -0.1498,
    connector_types: ["CCS", "Type2"],
    power_kw: 150,
    charging_speed: "ultra_rapid",
    price_per_kwh: 0.79,
    availability: "occupied",
    open_24_hours: true,
    number_of_connectors: 6,
    amenities: ["Shopping", "Restaurants", "Cinema", "Toilets"],
    notes: "Underground car park Level B2. Height limit 2.1m.",
    last_updated: "2026-04-12T09:30:00Z",
  },
  {
    id: "mock-018",
    name: "Clapham South — Ubitricity",
    network: "Ubitricity",
    address: "Clapham South Road, SW12",
    city: "London",
    postcode: "SW12 9BD",
    latitude: 51.4612,
    longitude: -0.1418,
    connector_types: ["Type2"],
    power_kw: 5.5,
    charging_speed: "slow",
    price_per_kwh: 0.44,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 2,
    amenities: ["Residential Street", "Tube Nearby"],
    notes: "On-street lamppost charger. Available to all vehicles.",
    last_updated: "2026-04-11T20:00:00Z",
  },
  {
    id: "mock-019",
    name: "Putney Exchange — Pod Point",
    network: "Pod Point",
    address: "High Street, Putney",
    city: "London",
    postcode: "SW15 1SY",
    latitude: 51.4646,
    longitude: -0.2164,
    connector_types: ["Type2", "CCS"],
    power_kw: 22,
    charging_speed: "fast",
    price_per_kwh: 0.47,
    availability: "available",
    open_24_hours: false,
    number_of_connectors: 4,
    amenities: ["Retail Car Park", "Shopping"],
    notes: "Free to park up to 3 hours with active charge.",
    last_updated: "2026-04-12T07:45:00Z",
  },
  {
    id: "mock-020",
    name: "Ealing Broadway — Osprey",
    network: "Osprey",
    address: "The Broadway, Ealing",
    city: "London",
    postcode: "W5 2NP",
    latitude: 51.513,
    longitude: -0.3089,
    connector_types: ["CCS", "CHAdeMO"],
    power_kw: 75,
    charging_speed: "rapid",
    price_per_kwh: 0.68,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 4,
    amenities: ["Town Centre", "Cafés Nearby"],
    notes: "Adjacent to NCP car park. 24hr access from street.",
    last_updated: "2026-04-12T08:00:00Z",
  },
  {
    id: "mock-021",
    name: "Islington Angel — ChargePoint",
    network: "ChargePoint",
    address: "Upper Street, Islington",
    city: "London",
    postcode: "N1 2TX",
    latitude: 51.5375,
    longitude: -0.1026,
    connector_types: ["CCS", "Type2"],
    power_kw: 50,
    charging_speed: "rapid",
    price_per_kwh: 0.62,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 4,
    amenities: ["Parking Bay", "Restaurants"],
    notes: "Pay via ChargePoint app. Free 15-min arrival window.",
    last_updated: "2026-04-12T07:00:00Z",
  },
  {
    id: "mock-022",
    name: "Fulham Wharf — Tesla Supercharger",
    network: "Tesla",
    address: "Townmead Road, Fulham",
    city: "London",
    postcode: "SW6 2RZ",
    latitude: 51.4831,
    longitude: -0.1941,
    connector_types: ["NACS", "CCS"],
    power_kw: 250,
    charging_speed: "ultra_rapid",
    price_per_kwh: 0.77,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 8,
    amenities: ["Riverside Walk", "Cafés Nearby"],
    notes: "Open to all EVs with CCS. River view while you charge.",
    last_updated: "2026-04-12T08:00:00Z",
  },
  {
    id: "mock-023",
    name: "Westminster Bridge — Mer",
    network: "Mer",
    address: "Westminster Bridge Road, SE1",
    city: "London",
    postcode: "SE1 7PB",
    latitude: 51.4994,
    longitude: -0.1357,
    connector_types: ["CCS", "Type2"],
    power_kw: 22,
    charging_speed: "fast",
    price_per_kwh: 0.54,
    availability: "unknown",
    open_24_hours: true,
    number_of_connectors: 4,
    amenities: ["Tourist Area", "Parking Bays"],
    notes: "On-street bays subject to parking restrictions. Check signs.",
    last_updated: "2026-04-12T05:00:00Z",
  },
  {
    id: "mock-024",
    name: "Paddington Basin — Gridserve",
    network: "Gridserve",
    address: "Sheldon Square, Paddington",
    city: "London",
    postcode: "W2 6EZ",
    latitude: 51.5175,
    longitude: -0.178,
    connector_types: ["CCS", "NACS", "Type2"],
    power_kw: 150,
    charging_speed: "ultra_rapid",
    price_per_kwh: 0.82,
    availability: "available",
    open_24_hours: true,
    number_of_connectors: 6,
    amenities: ["Office District", "Coffee", "Toilets"],
    notes: "Canopy-covered hub. Ideal for business travellers near Paddington station.",
    last_updated: "2026-04-12T08:30:00Z",
  },
  {
    id: "mock-025",
    name: "London Bridge — Shell Recharge",
    network: "Shell Recharge",
    address: "Borough High Street, London Bridge",
    city: "London",
    postcode: "SE1 1LB",
    latitude: 51.5033,
    longitude: -0.0865,
    connector_types: ["CCS", "CHAdeMO"],
    power_kw: 100,
    charging_speed: "rapid",
    price_per_kwh: 0.73,
    availability: "occupied",
    open_24_hours: true,
    number_of_connectors: 4,
    amenities: ["Borough Market", "Food & Drink", "Toilets"],
    notes: "High demand location — arrive before 8am for guaranteed bay.",
    last_updated: "2026-04-12T09:00:00Z",
  },
];

// ── Provider implementation ──────────────────────────────────────────────────

export const mockProvider: ChargingProvider = {
  name: "mock",

  async search(params: ChargingSearchParams): Promise<ChargingSearchResult> {
    const { lat, lng, location, radius = 10 } = params;

    let searchCoords: { lat: number; lng: number } | undefined;
    let locationUsed = location ?? "London";

    // Resolve coordinates
    if (lat !== undefined && lng !== undefined) {
      searchCoords = { lat, lng };
      locationUsed = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    } else if (location) {
      const resolved = resolveLocationToCoords(location);
      if (resolved) {
        searchCoords = resolved;
      } else {
        // Unknown location — fall back to London centre
        searchCoords = LOCATION_COORDS["london"];
      }
    } else {
      searchCoords = LOCATION_COORDS["london"];
    }

    // Attach distance and filter by radius
    let results: ChargerStation[] = MOCK_STATIONS.map((s) => ({
      ...s,
      distance_miles: searchCoords
        ? parseFloat(
            distanceMiles(searchCoords.lat, searchCoords.lng, s.latitude, s.longitude).toFixed(1)
          )
        : undefined,
    })).filter((s) => s.distance_miles === undefined || s.distance_miles <= radius);

    // Apply additional filters from params
    if (params.network) {
      results = results.filter((s) =>
        s.network.toLowerCase().includes(params.network!.toLowerCase())
      );
    }
    if (params.connector) {
      results = results.filter((s) =>
        s.connector_types.includes(params.connector as ChargerStation["connector_types"][number])
      );
    }
    if (params.minPower) {
      results = results.filter((s) => s.power_kw >= params.minPower!);
    }
    if (params.maxPrice) {
      results = results.filter(
        (s) => s.price_per_kwh === undefined || s.price_per_kwh <= params.maxPrice!
      );
    }
    if (params.availableNow) {
      results = results.filter((s) => s.availability === "available");
    }
    if (params.open24Hours) {
      results = results.filter((s) => s.open_24_hours);
    }

    // Sort by distance ascending
    results.sort((a, b) => (a.distance_miles ?? 999) - (b.distance_miles ?? 999));

    return {
      stations: results,
      total: results.length,
      location_used: locationUsed,
      search_coords: searchCoords,
    };
  },
};
