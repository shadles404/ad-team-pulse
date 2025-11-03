export interface TeamMember {
  id: string;
  description: string;
  phone: string;
  salary: number;
  targetVideos: number;
  completedVideos: number;
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
