pragma solidity 0.4.26;

import "./utils/MultiOwnable.sol";
import "./Acl.sol";

/**
 * @title Profile groups together all user's SmartVault activities and enables data control recovery
 * @author Lukas Lukac, Lightstreams, 7.8.2019
 */
contract Profile is MultiOwnable {
    // @dev Base58 decoded CID is stored WITHOUT the leading "Qm" to optimise storage space for 32 bytes as SmartVault only uses CID v0.
    bytes32[] files;
    address[] acls;

    event FileAdded(address owner, bytes32 cid, address acl);
    event FileRemoved(address owner, bytes32 cid, address acl);
    event FileRecovered(bytes32 cid, address acl, address newOwner, address byOwner);
    event OwnerRecovered(address newOwner, address byOwner);

    modifier fileExists(bytes32 _cid) {
        require(hasFile(_cid) == true);
        _;
    }

    modifier fileNotExists(bytes32 _cid) {
        require(hasFile(_cid) == false);
        _;
    }

    constructor(address _owner, address _recoveryAccount) public MultiOwnable(_owner) {
        addOwner(_recoveryAccount);
    }

    function addFile(bytes32 _cid, address _acl) public isOwner(msg.sender) fileNotExists(_cid) {
        require(ACL(_acl).hasAdmin(address(this)));

        files.push(_cid);
        acls.push(_acl);

        emit FileAdded(msg.sender, _cid, _acl);
    }

    function removeFile(bytes32 _cid) public isOwner(msg.sender) fileExists(_cid) {
        (uint256 fileIndex, bool exists) = getFileIndex(_cid);
        require(exists == true);

        address acl = acls[fileIndex];

        files[fileIndex] = files[files.length - 1];
        acls[fileIndex] = acls[files.length - 1];
        files.length--;
        acls.length--;

        emit FileRemoved(msg.sender, _cid, acl);
    }

    function hasFile(bytes32 _cid) view public returns (bool) {
        (, bool exists) = getFileIndex(_cid);

        return exists;
    }

    function getFiles() view public returns (bytes32[]) {
        return files;
    }

    function getFileAcl(bytes32 _cid) public view returns (address) {
        (uint256 fileIndex, bool exists) = getFileIndex(_cid);
        require(exists == true);

        return acls[fileIndex];
    }

    function recover(address _newOwner) public isOwner(msg.sender) {
        addOwner(_newOwner);

        if (acls.length > 0) {
            for (uint i = 0; i <= acls.length - 1; i++) {
                ACL(acls[i]).grantAdmin(_newOwner);
                emit FileRecovered(files[i], acls[i], _newOwner, msg.sender);
            }
        }

        emit OwnerRecovered(_newOwner, msg.sender);
    }

    function getFileIndex(bytes32 _cid) internal view returns (uint256 index, bool exists) {
        if (files.length == 0) {
            return (0, false);
        }

        for (uint i = 0; i <= files.length - 1; i++) {
            if (files[i] == _cid) {
                return (i, true);
            }
        }

        return (0, false);
    }
}
