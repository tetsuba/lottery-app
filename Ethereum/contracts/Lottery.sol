// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

contract Lottery {

    string public network;
    address public manager;
    address payable[] public players;

    constructor(string memory _network) {
        manager = msg.sender;
        network = _network;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(payable(msg.sender));
    }

    function random() private view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
    }

    modifier restricted() {
        // Only the manager can pick a winner
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}



