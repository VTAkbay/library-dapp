// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Book.sol";
import "./Utils.sol";

contract Library {
    using BookUtils for Book;
    using StringUtils for string;

    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can do that");
        _;
    }

    struct Copy {
        uint256 _id;
        string _isbn;
        bool _isValid;
        address _holder;
    }

    mapping(string => Book) public bookByIsbn;
    string[] public bookIsbns;

    uint256 private _nextCopyId;
    mapping(uint256 => Copy) public copies;

    function getBookIsbnsLength()
        public
        view
        returns (uint256 bookIsbnsLength)
    {
        return bookIsbns.length;
    }

    function addBook(
        string memory title,
        string memory authorFirstName,
        string memory authorLastName,
        string memory isbn
    ) public onlyOwner {
        Book storage book = bookByIsbn[isbn];
        require(!book._isValid, "Already created");
        book._isValid = true;
        book._isbn = isbn;
        book._title = title;
        book._authorFirstName = authorFirstName;
        book._authorLastName = authorLastName;

        bookIsbns.push(isbn);
    }

    function removeBook(string memory isbn) public onlyOwner {
        Book storage book = bookByIsbn[isbn];
        require(book._isValid, "Invalid book");
        require(book.copyIds.length == 0, "Book has copies");
        book._isValid = false;
        delete bookByIsbn[isbn];

        for (uint256 i = 0; i < bookIsbns.length; i++) {
            if (bookIsbns[i].equals(isbn)) {
                bookIsbns[i] = bookIsbns[bookIsbns.length - 1];
                bookIsbns.pop();
                break;
            }
        }
    }

    function addCopy(string memory isbn) public onlyOwner {
        Book storage book = bookByIsbn[isbn];
        require(book._isValid, "Invalid book");
        uint256 copyId = _nextCopyId++;
        Copy storage copy = copies[copyId];
        copy._id = copyId;
        copy._isValid = true;
        copy._isbn = isbn;
        book.copyIds.push(copyId);
    }

    function deleteCopy(string memory isbn, uint256 copyId) public onlyOwner {
        Book storage book = bookByIsbn[isbn];
        require(book._isValid, "Invalid book");
        Copy storage copy = copies[copyId];
        require(copy._isValid, "Invalid copy");
        require(copy._holder == address(0), "Copy is held");
        copy._isValid = false;
        book.removeCopy(copyId);
        delete copies[copyId];
    }

    function getCopyIdsByIsbn(string memory isbn)
        public
        view
        returns (uint256[] memory)
    {
        return bookByIsbn[isbn].copyIds;
    }

    function issueCopy(
        string memory isbn,
        uint256 copyId,
        address holder
    ) public onlyOwner {
        require(holder != address(0), "Invalid holder");
        Book storage book = bookByIsbn[isbn];
        require(book._isValid, "Invalid book");
        Copy storage copy = copies[copyId];
        require(copy._isValid, "Invalid copy");
        require(copy._holder == address(0), "Already held");
        copy._holder = holder;
    }

    function returnCopy(
        string memory isbn,
        uint256 copyId,
        address holder
    ) public onlyOwner {
        require(holder != address(0), "Invalid holder");
        Book storage book = bookByIsbn[isbn];
        require(book._isValid, "Invalid book");
        Copy storage copy = copies[copyId];
        require(copy._isValid, "Invalid copy");
        require(copy._holder == holder, "Holder mismatches");
        copy._holder = address(0);
    }
}
