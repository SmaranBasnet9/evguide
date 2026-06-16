"use client";

import { useState, useCallback } from "react";
import { evModels } from "@/data/evModels";
import type { UserRoute, Season, EVRangeFitResult } from "@/lib/range-fit/types";
import { rankEVsForRoutes, getLocationDistanceMiles, resolveLocationFromCoords, searchLocationSuggestions } from "@/lib/range-fit/engine";
import RouteStep from "./RouteStep";
import RangeFitResults from "./RangeFitResults";

export default function RangeFitWizard() {
  const [step, setStep] = useState<"form" | "results">("form");
  const [results, setResults] = useState<EVRangeFitResult[]>([]);
  const [routes, setRoutes] = useState<UserRoute[]>([]);
  const [season, setSeason] = useState<Season>("average");
  const [loading, setLoading] = useState(false);

  const handleAnalyse = useCallback(
    async (inputRoutes: UserRoute[], selectedSeason: Season) => {
      setLoading(true);
      try {
        const ranked = rankEVsForRoutes(evModels, inputRoutes, selectedSeason);
        setRoutes(inputRoutes);
        setSeason(selectedSeason);
        setResults(ranked);
        setStep("results");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  if (step === "results") {
    return (
      <RangeFitResults
        results={results}
        routes={routes}
        season={season}
        onReset={() => setStep("form")}
      />
    );
  }

  return (
    <RouteStep
      onSubmit={handleAnalyse}
      loading={loading}
      getDistance={getLocationDistanceMiles}
      resolveCoords={resolveLocationFromCoords}
      searchSuggestions={searchLocationSuggestions}
    />
  );
}
