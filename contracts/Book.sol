// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

struct Book {
    bool _isValid;
    string _isbn;
    string _title;
    string _authorFirstName;
    string _authorLastName;
    uint256[] copyIds;
}

library BookUtils {
    function getCopyIndex(Book storage book, uint256 copyId)
        public
        view
        returns (uint256, bool)
    {
        for (uint256 i = 0; i < book.copyIds.length; i++) {
            if (book.copyIds[i] == copyId) {
                return (i, true);
            }
        }
        return (0, false);
    }

    function removeCopyByIndex(Book storage book, uint256 copyIndex) public {
        book.copyIds[copyIndex] = book.copyIds[book.copyIds.length - 1];
        book.copyIds.pop();
    }

    function removeCopy(Book storage book, uint256 copyId) public {
        uint256 copyIndex;
        bool copyFound;
        (copyIndex, copyFound) = getCopyIndex(book, copyId);
        require(copyFound, "No matches in copyIds array");
        removeCopyByIndex(book, copyIndex);
    }
}
