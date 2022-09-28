// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Book.sol";
import "./Utils.sol";

contract Library {
    using BookUtils for Book;
    using StringUtils for string;

    address owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can do that");
        _;
    }

    struct Copy {
        bool _isValid;
        address holder;
    }

    mapping(string => Book) public bookByIsbn;
    string[] public bookIsbns;

    uint256 private _nextCopyId;
    mapping(uint256 => Copy) public copies;

    function addBook(
        string memory title,
        string memory authorFirstName,
        string memory authorLastName,
        string memory isbn
    ) public onlyOwner {
        Book storage book = bookByIsbn[isbn];
        book._isValid = true;
        book._isbn = isbn;
        book._owner = msg.sender;
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
        copy._isValid = true;
        book.copyIds.push(copyId);
    }

    function deleteBook(uint256 index) public {
        for (uint256 i = index; i < books.length - 1; i++) {
            books[i] = books[i + 1];
        }
        books.pop();
    }
}
