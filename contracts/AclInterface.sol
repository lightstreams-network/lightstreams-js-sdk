pragma solidity ^0.5.0;

import "./utils/Ownable.sol";

/**
 * @title Permissioned manages access rights, Interface
 */
interface PermissionedInterface {

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

    function grantRead(address account) external;

    function grantWrite(address account) external;

    function grantAdmin(address account) external;

    function revokeAccess(address account) external;

    function hasRead(address account) external view returns (bool hasReadAccess);

    function hasAdmin(address account) external view returns (bool hasAdminAccess);
}
