export type CampaignStatus = "Success" | "Pending" | "Failed";

export interface CampaignCreator {
  image: string;
  name: string;
}

export interface CampaignDetails {
  image: string;
  name: string;
  type: string;
}

export interface Campaign {
  id: number;
  creator: CampaignCreator;
  campaign: CampaignDetails;
  status: CampaignStatus;
}

export interface TableFourProps {
  data?: Campaign[];
  className?: string;
}
