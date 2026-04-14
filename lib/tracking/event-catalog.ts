import type { UserEventType } from "@/types";

export const ALLOWED_TRACKED_EVENTS: UserEventType[] = [
  "page_view",
  "car_view",
  "vehicle_view",
  "engagement_milestone",
  "recommendation_started",
  "recommendation_completed",
  "emi_used",
  "compare_clicked",
  "price_filter_used",
  "filter_used",
  "loan_offer_clicked",
  "repeat_visit",
  "consultation_started",
  "consultation_submitted",
  "test_drive_clicked",
  "finance_apply_clicked",
  "reserve_clicked",
  "sort_changed",
  "save_clicked",
  "tier_section_viewed",
  "search_used",
  // EV-native events (added with EV intelligence features)
  "range_check_used",
  "tco_calculated",
  "vehicle_saved",
  "vehicle_unsaved",
  "charging_info_viewed",
  "grant_viewed",
  "salary_sacrifice_viewed",
  // Charging station discovery
  "charger_search",
  "charger_location_used",
  "charger_details_viewed",
  "charger_directions_clicked",
  "charger_filters_applied",
];

export const FINANCIAL_PROFILE_SIGNAL_EVENTS: UserEventType[] = [
  "emi_used",
  "price_filter_used",
  "filter_used",
  "loan_offer_clicked",
];

export const STRONG_CTA_EVENTS: UserEventType[] = [
  "test_drive_clicked",
  "finance_apply_clicked",
  "reserve_clicked",
];
