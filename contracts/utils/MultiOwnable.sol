pragma solidity ^0.5.0;

/**
 * @title MultiOwnable manages ownership
 * @author Lukas Lukac, Lightstreams, 11.7.2018
 */
contract MultiOwnable {
    address[] owners;

    event OwnerAdded(address newOwner, address byOwner);
    event OwnerRemoved(address removedOwner, address byOwner);

    modifier isOwner(address _owner) {
        require(hasOwner(_owner) == true);
        _;
    }

    modifier isNotOwner(address _owner) {
        require(hasOwner(_owner) == false);
        _;
    }

    constructor(address _owner) public {
        owners.push(_owner);
    }

    function addOwner(address _newOwner) public isOwner(msg.sender) isNotOwner(_newOwner) {
        owners.push(_newOwner);

        emit OwnerAdded(_newOwner, msg.sender);
    }

    function removeOwner(address _owner) public isOwner(msg.sender) {
        require(owners.length > 1);

        (uint256 ownerIndex, bool exists) = getOwnerIndex(_owner);
        require(exists == true);

        owners[ownerIndex] = owners[owners.length - 1];
        owners.length--;

        emit OwnerRemoved(_owner, msg.sender);
    }

    function hasOwner(address _owner) view public returns (bool) {
        (, bool exists) = getOwnerIndex(_owner);

        return exists;
    }

    function getOwners() view public returns (address[] memory) {
        return owners;
    }

    function getOwnerIndex(address _owner) internal view returns (uint256 index, bool exists) {
        for (uint i = 0; i <= owners.length -1; i++) {
            if (owners[i] == _owner) {
                return (i, true);
            }
        }

        return (0, false);
    }
}
