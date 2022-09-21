// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Library {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    struct Book {
        address owner;
        string title;
        string authorFirstName;
        string authorLastName;
        string isbn;
    }

    Book[] public books;

    function addBook(
        string memory title,
        string memory authorFirstName,
        string memory authorLastName,
        string memory isbn
    ) public {
        books.push(Book(owner, title, authorFirstName, authorLastName, isbn));
    }

    function deleteBook(uint256 index) public {
        for (uint256 i = index; i < books.length - 1; i++) {
            books[i] = books[i + 1];
        }
        books.pop();
    }
}
