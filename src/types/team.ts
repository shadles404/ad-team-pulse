export interface TeamMember {
  id: string;
  description: string;
  phone: string;
  salary: number;
  targetVideos: number;
  progressChecks: boolean[]; // Array of checkboxes for each target video
  advertisementTypes: string[]; // Array of advertisement types
  platform: string;
  notes: string;
  contractType: string;
}

export const AD_TYPES = [
  "Milk Ad",
  "Cream Ad",
  "Makeup Ad",
  "Skincare Ad",
  "Perfume Ad",
  "Other"
] as const;

export const PLATFORMS = [
  "Facebook",
  "Instagram",
  "TikTok",
  "YouTube"
] as const;

export const CONTRACT_TYPES = [
  "1 Year",
  "6 Months",
  "3 Months",
  "1 Month"
] as const;
