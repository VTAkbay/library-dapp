import { ethers } from "hardhat";

async function main() {
  const BookContract = await ethers.getContractFactory("BookUtils");
  const bookContract = await BookContract.deploy();
  console.log("Deployed Book, waiting for confirmation");

  await bookContract.deployed().then(() => {
    console.log("Book has been confirmed");
  });

  const UtilsContract = await ethers.getContractFactory("StringUtils");
  const utilsContract = await UtilsContract.deploy();
  console.log("Deployed Utils, waiting for confirmation");

  await utilsContract.deployed().then(() => {
    console.log("Utils has been confirmed");
  });

  const Library = await ethers.getContractFactory("Library", {
    libraries: {
      BookUtils: bookContract.address,
      StringUtils: utilsContract.address,
    },
  });
  const library = await Library.deploy();
  console.log("Deployed Library, waiting for confirmation");

  await library.deployed().then(() => {
    console.log("Library has been confirmed");
  });

  console.log("Blog deployed to:", library.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
