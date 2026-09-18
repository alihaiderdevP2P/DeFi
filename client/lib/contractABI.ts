export const CROWDFUNDING_ABI = [
  "function campaignCount() view returns (uint256)",
  "function campaigns(uint256) view returns (address owner,string title,string description,uint256 goal,uint256 pledged,uint256 deadline,string imageUrl,bool withdrawn)",
  "function createCampaign(string title,string description,uint256 goal,uint256 deadline,string imageUrl) returns (uint256)",
  "function donateToCampaign(uint256 campaignId) payable",
  "function withdrawFunds(uint256 campaignId)",
  "function refundDonors(uint256 campaignId)",
  "function checkGoalReached(uint256 campaignId) view returns (bool)",
  "event CampaignCreated(uint256 indexed campaignId,address indexed owner,uint256 goal,uint256 deadline)",
  "event DonationReceived(uint256 indexed campaignId,address indexed donor,uint256 amount)",
] as const;
