import { expect } from "chai";
import { ethers } from "hardhat";

describe("Crowdfunding", () => {
  async function setup() {
    const [owner, donor] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("Crowdfunding");
    const contract = await Factory.deploy();
    await contract.waitForDeployment();
    return { contract, owner, donor };
  }

  it("creates a campaign and accepts donations", async () => {
    const { contract, donor } = await setup();
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    const deadline = now + 3600;
    const goal = ethers.parseEther("1");

    await contract.createCampaign(
      "Save Reef",
      "Ocean campaign",
      goal,
      deadline,
      "",
    );
    await contract
      .connect(donor)
      .donateToCampaign(0, { value: ethers.parseEther("0.5") });

    const campaign = await contract.campaigns(0);
    expect(campaign.pledged).to.equal(ethers.parseEther("0.5"));
  });

  it("allows owner to withdraw when goal is reached", async () => {
    const { contract, owner, donor } = await setup();
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    const deadline = now + 3600;
    const goal = ethers.parseEther("1");

    await contract.createCampaign("Goal", "Desc", goal, deadline, "");
    await contract.connect(donor).donateToCampaign(0, { value: goal });

    await expect(contract.connect(owner).withdrawFunds(0)).to.not.be.reverted;
  });

  it("allows donors to refund after failed campaign deadline", async () => {
    const { contract, donor } = await setup();
    const now = (await ethers.provider.getBlock("latest"))!.timestamp;
    const deadline = now + 10;
    const goal = ethers.parseEther("1");

    await contract.createCampaign("Refund", "Desc", goal, deadline, "");
    await contract
      .connect(donor)
      .donateToCampaign(0, { value: ethers.parseEther("0.2") });

    await ethers.provider.send("evm_increaseTime", [20]);
    await ethers.provider.send("evm_mine", []);

    await expect(contract.connect(donor).refundDonors(0)).to.not.be.reverted;
  });
});
