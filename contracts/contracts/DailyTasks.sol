// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IActivityPoints.sol";

contract DailyTasks {
    IActivityPoints public immutable points;
    uint8 public constant TASK_COUNT = 16;

    mapping(address => mapping(uint64 => uint32)) public completedBitmap;

    event TaskCompleted(address indexed user, uint8 indexed taskId, uint64 day, string payload);

    constructor(address p) { points = IActivityPoints(p); }

    function currentDay() public view returns (uint64) { return uint64(block.timestamp / 1 days); }

    function taskReward(uint8 id) public pure returns (uint16) {
        uint8[16] memory r = [3,5,8,5,4,3,4,6,5,4,3,6,4,3,5,4];
        return r[id];
    }

    function taskName(uint8 id) external pure returns (string memory) {
        if (id == 0) return "Wave hello";
        if (id == 1) return "Send micro-tip";
        if (id == 2) return "Daily quiz";
        if (id == 3) return "Vote on poll";
        if (id == 4) return "Daily affirmation";
        if (id == 5) return "Sign daily message";
        if (id == 6) return "Burn dust";
        if (id == 7) return "Daily haiku";
        if (id == 8) return "Roll dice";
        if (id == 9) return "Drop pixel";
        if (id == 10) return "Mood check";
        if (id == 11) return "Daily prediction";
        if (id == 12) return "Fortune cookie";
        if (id == 13) return "Tap-to-earn";
        if (id == 14) return "Daily wish";
        if (id == 15) return "Quantum ping";
        revert("bad id");
    }

    function isCompleted(address u, uint8 id, uint64 d) public view returns (bool) {
        return (completedBitmap[u][d] >> id) & 1 == 1;
    }

    function todayBitmap(address u) external view returns (uint32) {
        return completedBitmap[u][currentDay()];
    }

    function completeTask(uint8 id, string calldata payload) external {
        require(id < TASK_COUNT, "bad");
        uint64 today = currentDay();
        uint32 bm = completedBitmap[msg.sender][today];
        require((bm >> id) & 1 == 0, "done");
        completedBitmap[msg.sender][today] = bm | uint32(1 << id);
        points.award(msg.sender, taskReward(id), "task");
        emit TaskCompleted(msg.sender, id, today, payload);
    }
}
