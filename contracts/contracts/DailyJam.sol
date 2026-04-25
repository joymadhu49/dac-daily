// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IActivityPoints.sol";

contract DailyJam {
    IActivityPoints public immutable points;

    mapping(address => mapping(address => uint64)) public lastJamDay;
    mapping(address => uint256) public jamsSent;
    mapping(address => uint256) public jamsReceived;

    event JamSent(address indexed from, address indexed to, uint64 day, string note);

    constructor(address pointsContract) {
        points = IActivityPoints(pointsContract);
    }

    function currentDay() public view returns (uint64) {
        return uint64(block.timestamp / 1 days);
    }

    function sendJam(address to, string calldata note) external {
        require(to != address(0) && to != msg.sender, "invalid recipient");
        uint64 today = currentDay();
        require(lastJamDay[msg.sender][to] < today, "already jammed today");
        require(bytes(note).length <= 140, "note too long");

        lastJamDay[msg.sender][to] = today;
        jamsSent[msg.sender] += 1;
        jamsReceived[to] += 1;

        points.award(msg.sender, 5, "daily-jam");
        emit JamSent(msg.sender, to, today, note);
    }
}
