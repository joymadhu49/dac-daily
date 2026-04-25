// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IActivityPoints.sol";

contract DailyCheckIn {
    IActivityPoints public immutable points;

    struct UserStats {
        uint64 lastCheckInDay;
        uint64 streak;
        uint64 longestStreak;
        uint64 totalCheckIns;
    }

    mapping(address => UserStats) public stats;

    event CheckedIn(address indexed user, uint64 day, uint64 streak, uint64 totalCheckIns);

    constructor(address pointsContract) {
        points = IActivityPoints(pointsContract);
    }

    function currentDay() public view returns (uint64) {
        return uint64(block.timestamp / 1 days);
    }

    function hasCheckedInToday(address user) external view returns (bool) {
        return stats[user].lastCheckInDay == currentDay();
    }

    function checkIn() external {
        UserStats storage s = stats[msg.sender];
        uint64 today = currentDay();
        require(s.lastCheckInDay < today, "already checked in today");

        if (s.lastCheckInDay + 1 == today) {
            s.streak += 1;
        } else {
            s.streak = 1;
        }

        if (s.streak > s.longestStreak) {
            s.longestStreak = s.streak;
        }

        s.lastCheckInDay = today;
        s.totalCheckIns += 1;

        uint256 reward = 10 + (s.streak >= 30 ? 20 : s.streak >= 7 ? 10 : 0);
        points.award(msg.sender, reward, "daily-check-in");

        emit CheckedIn(msg.sender, today, s.streak, s.totalCheckIns);
    }
}
