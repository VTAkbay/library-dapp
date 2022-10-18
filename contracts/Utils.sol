// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library StringUtils {
    function equals(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }
}
