// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ActivityPoints {
    string public constant name = "DAC Activity Points";
    string public constant symbol = "DACP";
    uint8 public constant decimals = 0;

    address public owner;
    mapping(address => bool) public isMinter;
    mapping(address => uint256) public balanceOf;
    uint256 public totalSupply;

    event Awarded(address indexed user, uint256 amount, string reason);
    event MinterSet(address indexed minter, bool enabled);

    modifier onlyOwner() { require(msg.sender == owner, "not owner"); _; }
    modifier onlyMinter() { require(isMinter[msg.sender], "not minter"); _; }

    constructor(address _owner) { owner = _owner; }

    function setMinter(address m, bool e) external onlyOwner {
        isMinter[m] = e;
        emit MinterSet(m, e);
    }

    function award(address u, uint256 a, string calldata r) external onlyMinter {
        balanceOf[u] += a;
        totalSupply += a;
        emit Awarded(u, a, r);
    }
}
