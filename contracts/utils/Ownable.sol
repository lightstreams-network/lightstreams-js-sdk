pragma solidity 0.4.26;

contract Ownable {
    address public owner;

    constructor(address _owner) public {
        owner = _owner;
    }

    modifier onlyOwner {
        require(isOwner());
        _;
    }

    function isOwner() public view returns (bool) {
        return msg.sender == owner;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0));

        owner = _newOwner;
    }
}