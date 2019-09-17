pragma solidity ^0.5.0;

import "@openzeppelin/contracts-ethereum-package/contracts/GSN/GSNRecipient.sol";
import "@openzeppelin/upgrades/contracts/Initializable.sol";
import "./GSNAcl.sol";

/**
 * @title ACLFactory enables gas-free interactions with ACL from deployment to rights management.
 * @author Lukas Lukac, Lightstreams, 22.8.2018
 */
contract GSNAclFactory is Initializable, GSNRecipient {
    uint256 constant public aclFunding = 10 ether;

    address[] acls;

    event NewACL(address addr);

    function() payable external {}

    function initialize(address relayHub) public initializer {
        GSNRecipient.initialize();
        _upgradeRelayHub(relayHub);
    }

    function newACL(address _owner) public returns (address) {
        GSNAcl acl = new GSNAcl(_owner, false);
        address addr = address(acl);

        acl.initialize(_getRelayHub());
        (IRelayHub(_getRelayHub())).depositFor.value(aclFunding)(addr);

        emit NewACL(addr);

        return addr;
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
        return 1;
    }
}
