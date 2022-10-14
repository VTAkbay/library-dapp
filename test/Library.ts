import { ethers } from "hardhat";
import { expect } from "chai";
import { Library } from "../typechain-types";
import { PromiseOrValue } from "../typechain-types/common";

const data = {
  book: {
    title: "Test Title",
    authorFirstName: "Turab",
    authorLastName: "Akbay",
    isbn: "978-3-16-148410-0",
  },
  defaultHolder: "0x0000000000000000000000000000000000000000",
};

let contract: Library;
let owner: { address: PromiseOrValue<string> };

describe("Test Library contract", function () {
  before(async function () {
    [owner] = await ethers.getSigners();

    const BookContract = await ethers.getContractFactory("BookUtils");
    const bookContract = await BookContract.deploy();
    await bookContract.deployed();

    const UtilsContract = await ethers.getContractFactory("StringUtils");
    const utilsContract = await UtilsContract.deploy();
    await utilsContract.deployed();

    const LibraryContract = await ethers.getContractFactory("Library", {
      libraries: {
        BookUtils: bookContract.address,
        StringUtils: utilsContract.address,
      },
    });
    contract = await LibraryContract.deploy();
  });

  it("Add book should work", async function () {
    // Add book
    const addBookTest = await contract.addBook(
      data.book.title,
      data.book.authorFirstName,
      data.book.authorLastName,
      data.book.isbn
    );
    await addBookTest.wait();

    // Check if book has been added
    const book = await contract.bookByIsbn(data.book.isbn);

    // Check the book if the values are correct
    expect(book._isValid).to.equal(true);
    expect(book._isbn).to.equal(data.book.isbn);
    expect(book._title).to.equal(data.book.title);
    expect(book._authorFirstName).to.equal(data.book.authorFirstName);
    expect(book._authorLastName).to.equal(data.book.authorLastName);
  });

  it("Add copy should work", async function () {
    // Add copy for book
    const addCopy = await contract.addCopy(data.book.isbn);
    await addCopy.wait();

    // Check if the copy has been created
    const copy = await contract.copies(0);
    expect(copy._isValid).to.equal(true);
    expect(copy._isbn).to.equal(data.book.isbn);
  });

  it("Issue copy should work", async function () {
    // Issue copy
    const issueCopy = await contract.issueCopy(
      data.book.isbn,
      0,
      owner.address
    );
    await issueCopy.wait();

    // Check if the copy has been issued
    const copy = await contract.copies(0);
    expect(copy._holder).to.equal(owner.address);
  });

  it("Return copy should work", async function () {
    // Return the copy
    const returnCopy = await contract.returnCopy(
      data.book.isbn,
      0,
      owner.address
    );
    await returnCopy.wait();

    // Check if the copy has been returned
    const copy = await contract.copies(0);
    expect(copy._holder).to.equal(data.defaultHolder);
  });

  it("Delete copy should work", async function () {
    // Delete copy of book
    const deleteCopy = await contract.deleteCopy(data.book.isbn, 0);
    await deleteCopy.wait();

    // Check if the copy has been deleted
    const copy = await contract.copies(0);
    expect(copy._isValid).to.equal(false);
  });

  it("Remove book should work", async function () {
    // Remove book
    const removeBook = await contract.removeBook(data.book.isbn);
    await removeBook.wait();

    // Check if book is removed
    const book = await contract.bookByIsbn(data.book.isbn);
    expect(book._isValid).to.equal(false);
  });
});
