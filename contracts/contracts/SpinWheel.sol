// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IActivityPoints.sol";

contract SpinWheel {
    IActivityPoints public immutable points;
    mapping(address => uint64) public lastSpinDay;
    mapping(address => uint256) public totalWon;

    event Spun(address indexed user, uint64 day, uint256 reward, uint8 segment);

    constructor(address pointsContract) {
        points = IActivityPoints(pointsContract);
    }

    function currentDay() public view returns (uint64) {
        return uint64(block.timestamp / 1 days);
    }

    function spin() external returns (uint256 reward, uint8 segment) {
        uint64 today = currentDay();
        require(lastSpinDay[msg.sender] < today, "already spun today");
        lastSpinDay[msg.sender] = today;

        uint256 r = uint256(keccak256(abi.encodePacked(
            block.prevrandao, msg.sender, today, blockhash(block.number - 1)
        )));
        segment = uint8(r % 8);
        uint16[8] memory rewards = [uint16(2), 5, 10, 3, 25, 5, 50, 7];
        reward = rewards[segment];

        totalWon[msg.sender] += reward;
        points.award(msg.sender, reward, "spin-wheel");
        emit Spun(msg.sender, today, reward, segment);
    }
}
