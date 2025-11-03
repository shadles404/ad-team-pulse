export interface TeamMember {
  id: string;
  description: string;
  phone: string;
  salary: number;
  targetVideos: number;
  progressChecks: boolean[]; // Array of checkboxes for each target video
  advertisementType: string;
  platform: string;
  notes: string;
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
