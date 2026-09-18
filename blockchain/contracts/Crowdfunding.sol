// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Crowdfunding {
    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 goal;
        uint256 pledged;
        uint256 deadline;
        string imageUrl;
        bool withdrawn;
    }

    uint256 public campaignCount;
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => mapping(address => uint256)) public donations;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed owner,
        uint256 goal,
        uint256 deadline
    );
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed owner, uint256 amount);
    event FundsWithdrawed(uint256 indexed campaignId, address indexed owner, uint256 amount);
    event RefundIssued(uint256 indexed campaignId, address indexed donor, uint256 amount);

    modifier campaignExists(uint256 campaignId) {
        require(campaignId < campaignCount, "Campaign does not exist");
        _;
    }

    modifier onlyOwner(uint256 campaignId) {
        require(campaigns[campaignId].owner == msg.sender, "Only campaign owner");
        _;
    }

    function createCampaign(
        string calldata title,
        string calldata description,
        uint256 goal,
        uint256 deadline,
        string calldata imageUrl
    ) external returns (uint256 campaignId) {
        require(bytes(title).length > 0, "Title required");
        require(goal > 0, "Goal must be > 0");
        require(deadline > block.timestamp, "Deadline must be in future");

        campaignId = campaignCount;
        campaignCount++;

        campaigns[campaignId] = Campaign({
            owner: msg.sender,
            title: title,
            description: description,
            goal: goal,
            pledged: 0,
            deadline: deadline,
            imageUrl: imageUrl,
            withdrawn: false
        });

        emit CampaignCreated(campaignId, msg.sender, goal, deadline);
    }

    function donateToCampaign(uint256 campaignId) external payable campaignExists(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        require(block.timestamp < campaign.deadline, "Campaign ended");
        require(msg.value > 0, "Donation must be > 0");

        campaign.pledged += msg.value;
        donations[campaignId][msg.sender] += msg.value;

        emit DonationReceived(campaignId, msg.sender, msg.value);
    }

    function checkGoalReached(uint256 campaignId) external view campaignExists(campaignId) returns (bool) {
        return campaigns[campaignId].pledged >= campaigns[campaignId].goal;
    }

    function withdrawFunds(uint256 campaignId)
        external
        campaignExists(campaignId)
        onlyOwner(campaignId)
    {
        Campaign storage campaign = campaigns[campaignId];
        require(block.timestamp >= campaign.deadline || campaign.pledged >= campaign.goal, "Not withdrawable yet");
        require(campaign.pledged >= campaign.goal, "Goal not reached");
        require(!campaign.withdrawn, "Already withdrawn");

        campaign.withdrawn = true;
        uint256 amount = campaign.pledged;
        campaign.pledged = 0;

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        require(sent, "Transfer failed");

        emit FundsWithdrawn(campaignId, campaign.owner, amount);
        emit FundsWithdrawed(campaignId, campaign.owner, amount);
    }

    function refundDonors(uint256 campaignId) external campaignExists(campaignId) {
        Campaign storage campaign = campaigns[campaignId];
        require(block.timestamp > campaign.deadline, "Deadline not passed");
        require(campaign.pledged < campaign.goal, "Goal reached; no refunds");

        uint256 donatedAmount = donations[campaignId][msg.sender];
        require(donatedAmount > 0, "No donation found");

        donations[campaignId][msg.sender] = 0;
        campaign.pledged -= donatedAmount;

        (bool sent, ) = payable(msg.sender).call{value: donatedAmount}("");
        require(sent, "Refund failed");

        emit RefundIssued(campaignId, msg.sender, donatedAmount);
    }

    function refund(uint256 campaignId) external {
        refundDonors(campaignId);
    }
}

