import { ethers } from "hardhat";

async function main() {
  const Library = await ethers.getContractFactory("Library");
  const library = await Library.deploy();
  console.log("Deployed Library, waiting for confirmation");

  await library.deployed().then(() => {
    console.log("Library has been confirmed");
  });

  console.log("Library deployed to:", library.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
