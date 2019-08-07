pragma solidity ^0.5.0;

contract HelloBlockchainWorld {
    constructor() public {
    }

    function sayHello() public pure returns (string memory message) {
        return "hello";
    }
}