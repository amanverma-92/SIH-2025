// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DigitalIDRegistry {
    struct DigitalID {
        bytes32 contentHash;
        address issuer;
        uint256 issuedAt;
        uint256 validTo;
        bool revoked;
    }

    mapping(uint256 => DigitalID) public ids;
    uint256 public idCounter;

    event Issued(uint256 indexed id, bytes32 contentHash, address indexed issuer, uint256 validTo);
    event Revoked(uint256 indexed id, address indexed issuer);

    function issue(bytes32 contentHash, address subject, uint256 validTo) external returns (uint256) {
        idCounter++;
        ids[idCounter] = DigitalID(contentHash, msg.sender, block.timestamp, validTo, false);
        emit Issued(idCounter, contentHash, msg.sender, validTo);
        return idCounter;
    }

    function revoke(uint256 id) external {
        require(ids[id].issuer == msg.sender, "Not issuer");
        ids[id].revoked = true;
        emit Revoked(id, msg.sender);
    }

    function get(uint256 id) external view returns (DigitalID memory) {
        return ids[id];
    }
}
