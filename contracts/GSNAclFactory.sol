pragma solidity ^0.5.0;

import "./GSNAcl.sol";
import "./utils/GSN.sol";

/**
 * @title ACLFactory enables gas-free interactions with ACL from deployment to rights management.
 * @author Lukas Lukac, Lightstreams, 22.8.2018
 */
contract GSNAclFactory is GSN {
    uint256 constant public aclFunding = 10 ether;

    address[] acls;

    event NewACL(address addr);

    function() payable external {}

    function newACL(address _owner) public returns (address) {
        GSNAcl acl = new GSNAcl(_owner, false);
        address addr = address(acl);

        acl.initialize(_getRelayHub());
        (IRelayHub(_getRelayHub())).depositFor.value(aclFunding)(addr);

        emit NewACL(addr);

        return addr;
    }
}
