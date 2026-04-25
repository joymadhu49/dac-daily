// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IActivityPoints {
    function award(address user, uint256 amount, string calldata reason) external;
}
