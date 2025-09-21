import hre from "hardhat";
async function main() {
  const Factory = await hre.ethers.getContractFactory("DigitalIDRegistry");
  const c = await Factory.deploy();
  await c.waitForDeployment();              
  console.log("DigitalIDRegistry deployed to:", await c.getAddress()); 
}
main().catch((e) => { console.error(e); process.exit(1); });