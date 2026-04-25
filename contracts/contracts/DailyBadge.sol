// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IActivityPoints.sol";

contract DailyBadge {
    string public constant name = "DAC Daily Badge";
    string public constant symbol = "DACBADGE";

    IActivityPoints public immutable points;

    uint256 public nextId;
    mapping(uint256 => address) public ownerOf;
    mapping(address => uint256) public balanceOf;
    mapping(address => uint64) public lastMintDay;
    mapping(uint256 => uint64) public mintedDay;

    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event BadgeMinted(address indexed user, uint256 indexed tokenId, uint64 day);

    constructor(address p) { points = IActivityPoints(p); }

    function currentDay() public view returns (uint64) { return uint64(block.timestamp / 1 days); }

    function mintDaily() external returns (uint256 tokenId) {
        uint64 today = currentDay();
        require(lastMintDay[msg.sender] < today, "minted today");
        lastMintDay[msg.sender] = today;
        tokenId = ++nextId;
        ownerOf[tokenId] = msg.sender;
        balanceOf[msg.sender] += 1;
        mintedDay[tokenId] = today;
        emit Transfer(address(0), msg.sender, tokenId);
        points.award(msg.sender, 7, "daily-badge");
        emit BadgeMinted(msg.sender, tokenId, today);
    }

    function tokenURI(uint256 tokenId) external view returns (string memory) {
        require(ownerOf[tokenId] != address(0), "no token");
        return string(abi.encodePacked("https://inception.dachain.io/badge/", _u(tokenId)));
    }

    function _u(uint256 v) internal pure returns (string memory) {
        if (v == 0) return "0";
        uint256 n = v; uint256 len;
        while (n != 0) { len++; n /= 10; }
        bytes memory b = new bytes(len);
        while (v != 0) { len--; b[len] = bytes1(uint8(48 + v % 10)); v /= 10; }
        return string(b);
    }
}
