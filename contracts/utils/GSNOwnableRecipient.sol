pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";

contract GSNOwnableRecipient is GSNRecipient {
    address public owner;

    constructor(address _owner) public {
        owner = _owner;
    }

    modifier onlyOwner {
        require(_msgSender() == owner);
        _;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0));

        owner = _newOwner;
    }
}
