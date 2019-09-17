pragma solidity ^0.5.0;

import "./utils/GSNOwnableRecipient.sol";
import "./utils/Initializable.sol";

/**
 * @title Permissioned manages access rights
 * @author Lukas Lukac, Lightstreams, 11.7.2018
 */
contract Permissioned is GSNOwnableRecipient {
    /**
     * The higher permission automatically contains all lower permissions.
     *
     * E.g, granting WRITE, automatically grants READ permission.
     *
     * Do NOT shuffle these values as business logic in Go codebase is based on their order.
     *
     * @see go-lightstreams/lethacl/permission.go
     *
     * NO_ACCESS uint value is 0
     * READ      uint value is 1
     * WRITE     uint value is 2
     * ADMIN     uint value is 3
    */
    enum Level {NO_ACCESS, READ, WRITE, ADMIN}

    struct Permission {
        Level level;
    }

    mapping(address => Permission) permissions;
    bool public isPublic = false;

    event PermissionGranted(address account, Level level);

    constructor(address _owner, bool _isPublic) GSNOwnableRecipient(_owner) public {
        isPublic = _isPublic;

        permissions[_owner] = Permission({
            level: Level.ADMIN
        });
    }

    modifier onlyAdmin {
        require(permissions[_msgSender()].level >= Level.ADMIN, "Only user with Admin permission lvl can call this function.");
        _;
    }

    function grantPublicAccess() onlyAdmin public {
        isPublic = true;
    }

    function revokePublicAccess() onlyAdmin public {
        isPublic = false;
    }

    function grantRead(address account) onlyAdmin public {
        permissions[account] = Permission({
            level: Level.READ
        });

        emit PermissionGranted(account, Level.READ);
    }

    function grantWrite(address account) onlyAdmin public {
        permissions[account] = Permission({
            level: Level.WRITE
        });

        emit PermissionGranted(account, Level.WRITE);
    }

    function grantAdmin(address account) onlyAdmin public {
        permissions[account] = Permission({
            level: Level.ADMIN
        });

        emit PermissionGranted(account, Level.ADMIN);
    }

    function revokeAccess(address account) onlyAdmin public {
        permissions[account] = Permission({
            level: Level.NO_ACCESS
            });

        emit PermissionGranted(account, Level.NO_ACCESS);
    }

    function hasRead(address account) public view returns (bool hasReadAccess) {
        return isPublic || permissions[account].level >= Level.READ;
    }

    function hasAdmin(address account) public view returns (bool hasAdminAccess) {
        return permissions[account].level >= Level.ADMIN;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}

/**
 * @title ACL enables access control and management for every Smart Vault file
 * @author Lukas Lukac, Lightstreams, 11.7.2018
 */
contract ACL is Initializable, Permissioned {
    constructor(address _owner, bool _isPublic) public Permissioned(_owner, _isPublic) {
    }

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
