import { ethers } from "hardhat";
import { expect } from "chai";
import { Library } from "../typechain-types";
import { PromiseOrValue } from "../typechain-types/common";

describe("Test Library contract", function () {
  let contract: Library;
  let owner: { address: PromiseOrValue<string> };

  beforeEach(async function () {
    // Create the smart contract object to test from
    [owner] = await ethers.getSigners();
    const LibraryContract = await ethers.getContractFactory("Library");
    contract = await LibraryContract.deploy();
  });

  async function addBook() {
    const addBookTest = await contract.addBook(
      "Test Title",
      "Turab",
      "Akbay",
      "978-3-16-148410-0"
    );

    // Wait until the transaction is mined
    await addBookTest.wait();
  }

  it("Add book should work", async function () {
    addBook();

    const book = await contract.books([0]);

    expect(book.owner).to.equal(owner.address);
    expect(book.title).to.equal("Test Title");
    expect(book.authorFirstName).to.equal("Turab");
    expect(book.authorLastName).to.equal("Akbay");
    expect(book.isbn).to.equal("978-3-16-148410-0");
  });

  it("Delete book should work", async function () {
    addBook();

    const deleteBook = await contract.deleteBook("0");

    await deleteBook.wait();

    try {
      await contract.books(0);
    } catch (error: any) {
      expect(error.data).to.equal("0x");
    }
  });
});
