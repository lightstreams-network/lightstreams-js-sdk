pragma solidity ^0.5.0;

import "@openzeppelin/upgrades/contracts/Initializable.sol";

import "./utils/GSNMultiOwnableRecipient.sol";
import "./bondingcurve/ArtistToken.sol";
import "./Acl.sol";

/**
 * @title Profile groups together all user's SmartVault activities and enables data control recovery
 * @author Lukas Lukac, Lightstreams, 24.9.2019
 */
contract GSNProfile is Initializable, GSNMultiOwnableRecipient {
    // @dev Base58 decoded CID is stored WITHOUT the leading "Qm" to optimise storage space for 32 bytes as SmartVault only uses CID v0.
    bytes32[] files;
    address[] acls;

    event FileAdded(address owner, bytes32 cid, address acl);
    event FileRemoved(address owner, bytes32 cid, address acl);
    event FileRecovered(bytes32 cid, address acl, address newOwner, address byOwner);
    event OwnerRecovered(address newOwner, address byOwner);

    event Withdraw(address beneficiary, uint256 withdrawn);
    event WithdrawToken(address tokenAddr, address beneficiary, uint256 withdrawn);

    modifier fileExists(bytes32 _cid) {
        require(hasFile(_cid) == true);
        _;
    }

    modifier fileNotExists(bytes32 _cid) {
        require(hasFile(_cid) == false);
        _;
    }

    constructor(address _owner) public GSNMultiOwnableRecipient(_owner) {
    }

    function() payable external {}

    function addFile(bytes32 _cid, address _acl) public isOwner(_msgSender()) fileNotExists(_cid) {
        require(ACL(_acl).hasAdmin(address(this)));

        files.push(_cid);
        acls.push(_acl);

        emit FileAdded(_msgSender(), _cid, _acl);
    }

    function removeFile(bytes32 _cid) public isOwner(_msgSender()) fileExists(_cid) {
        (uint256 fileIndex, bool exists) = getFileIndex(_cid);
        require(exists == true);

        address acl = acls[fileIndex];

        files[fileIndex] = files[files.length - 1];
        acls[fileIndex] = acls[files.length - 1];
        files.length--;
        acls.length--;

        emit FileRemoved(_msgSender(), _cid, acl);
    }

    function recover(address _newOwner) public isOwner(_msgSender()) {
        addOwner(_newOwner);

        if (acls.length > 0) {
            for (uint i = 0; i <= acls.length - 1; i++) {
                ACL(acls[i]).grantAdmin(_newOwner);
                emit FileRecovered(files[i], acls[i], _newOwner, _msgSender());
            }
        }

        emit OwnerRecovered(_newOwner, _msgSender());
    }

    function withdraw(address payable _beneficiary, uint256 _amount) public isOwner(_msgSender()) {
        require(_beneficiary != address(0), "Invalid beneficiary address");

//        uint256 _withdrawable = address(this).balance;
//        if (_amount > _withdrawable) {
//            revert("There is not sufficient funds");
//        }

        _beneficiary.transfer(_amount);
        emit Withdraw(_beneficiary, _amount);
    }

    function withdrawArtistTokens(address _tokenAddr, address payable _beneficiary, uint256 _amount) public isOwner(_msgSender()) {
        require(_beneficiary != address(0), "Invalid beneficiary address");
        require(_tokenAddr != address(0), "Token was not added");

        ArtistToken tokenInstance = ArtistToken(_tokenAddr);
//        uint256 _withdrawable = tokenInstance.balanceOf(address(this));
//        if (_amount > _withdrawable) {
//            revert("There is not sufficient funds");
//        }

        tokenInstance.transfer(_beneficiary, _amount);
        emit WithdrawToken(_tokenAddr, _beneficiary, _amount);
    }

    /*
     * READ-ONLY METHODS
     */

    function hasFile(bytes32 _cid) view public returns (bool) {
        (, bool exists) = getFileIndex(_cid);

        return exists;
    }

    function getFiles() view public returns (bytes32[] memory) {
        return files;
    }

    function getFileAcl(bytes32 _cid) public view returns (address) {
        (uint256 fileIndex, bool exists) = getFileIndex(_cid);
        require(exists == true);

        return acls[fileIndex];
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

    // GSN ACTIVATION
    function initialize(address relayHub) public initializer {
        GSNRecipient.initialize();
        _upgradeRelayHub(relayHub);
    }

    function acceptRelayedCall(
        address,
        address,
        bytes calldata,
        uint256,
        uint256,
        uint256,
        uint256,
        bytes calldata,
        uint256
    ) external view returns (uint256, bytes memory) {
        return _approveRelayedCall();
    }

    function getRecipientBalance() public view returns (uint) {
        return IRelayHub(getHubAddr()).balanceOf(address(this));
    }

    function version() public pure returns (uint256) {
        return 3;
    }
}
