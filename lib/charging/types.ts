// ─────────────────────────────────────────────────────────────────────────────
// Charging Station — Core Types
// Kept in lib/charging/ so the frontend imports from here rather than
// depending on any specific provider shape. Swap the provider, not the types.
// ─────────────────────────────────────────────────────────────────────────────

/** Connector standards in use across the UK & EU */
export type ConnectorType = "CCS" | "CHAdeMO" | "Type2" | "Type1" | "NACS" | "3-Pin";

/** Speed band derived from power_kw */
export type ChargingSpeed = "slow" | "fast" | "rapid" | "ultra_rapid";

/** Real-time availability state */
export type ChargerAvailability = "available" | "occupied" | "out_of_service" | "unknown";

export interface ChargerStation {
  id: string;
  name: string;
  network: string;
  address: string;
  city: string;
  postcode: string;
  latitude: number;
  longitude: number;
  /** Populated after a coordinate-based or location search */
  distance_miles?: number;
  connector_types: ConnectorType[];
  /** Headline power in kW (the fastest connector available) */
  power_kw: number;
  charging_speed: ChargingSpeed;
  /** £ per kWh — undefined if the network doesn't publish pricing */
  price_per_kwh?: number;
  availability: ChargerAvailability;
  open_24_hours: boolean;
  number_of_connectors: number;
  amenities?: string[];
  notes?: string;
  last_updated?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Search & Filter Contracts
// ─────────────────────────────────────────────────────────────────────────────

export interface ChargingFilters {
  radius: number;      // miles
  network: string;     // "" = all networks
  connector: string;   // "" = any connector
  minPower: number;    // 0 = no minimum
  maxPrice: number;    // 0 = no maximum
  availableNow: boolean;
  open24Hours: boolean;
}

export const DEFAULT_CHARGING_FILTERS: ChargingFilters = {
  radius: 10,
  network: "",
  connector: "",
  minPower: 0,
  maxPrice: 0,
  availableNow: false,
  open24Hours: false,
};

/** Params accepted by the API route and forwarded to the provider */
export interface ChargingSearchParams {
  lat?: number;
  lng?: number;
  location?: string;
  radius?: number;
  network?: string;
  connector?: string;
  minPower?: number;
  maxPrice?: number;
  availableNow?: boolean;
  open24Hours?: boolean;
}

export interface ChargingSearchResult {
  stations: ChargerStation[];
  total: number;
  location_used: string;
  /** Coordinates that were actually used for distance calculations */
  search_coords?: { lat: number; lng: number };
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider Interface — swap implementations without touching the frontend
// ─────────────────────────────────────────────────────────────────────────────

export interface ChargingProvider {
  /** Human-readable provider name (e.g. "mock", "openchargemaps") */
  name: string;
  search(params: ChargingSearchParams): Promise<ChargingSearchResult>;
}
