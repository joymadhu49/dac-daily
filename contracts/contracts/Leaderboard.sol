// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ActivityPoints.sol";
import "./DailyCheckIn.sol";

contract Leaderboard {
    ActivityPoints public immutable points;
    DailyCheckIn public immutable checkIn;

    address[] public registered;
    mapping(address => bool) public isRegistered;

    constructor(address pointsAddr, address checkInAddr) {
        points = ActivityPoints(pointsAddr);
        checkIn = DailyCheckIn(checkInAddr);
    }

    function register() external {
        if (!isRegistered[msg.sender]) {
            isRegistered[msg.sender] = true;
            registered.push(msg.sender);
        }
    }

    function totalRegistered() external view returns (uint256) {
        return registered.length;
    }

    struct Entry {
        address user;
        uint256 points;
        uint64 streak;
        uint64 totalCheckIns;
    }

    function page(uint256 start, uint256 size) external view returns (Entry[] memory out) {
        uint256 end = start + size;
        if (end > registered.length) end = registered.length;
        out = new Entry[](end - start);
        for (uint256 i = start; i < end; i++) {
            address u = registered[i];
            (uint64 lastDay, uint64 streak, uint64 longest, uint64 total) = checkIn.stats(u);
            lastDay; longest;
            out[i - start] = Entry({
                user: u,
                points: points.balanceOf(u),
                streak: streak,
                totalCheckIns: total
            });
        }
    }
}
