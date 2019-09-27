pragma solidity ^0.5.0;

import "./utils/GSN.sol";
import "./GSNProfile.sol";

/**
 * @title GSNProfileFactory enables gas-free interactions with Profile from deployment to file management and recovery.
 * @author Lukas Lukac, Lightstreams, 22.9.2019
 */
contract GSNProfileFactory is GSN {
    uint256 constant public profileFunding = 20 ether;

    event NewProfile(address addr, address owner);

    function() payable external {}

    function newProfile(address _owner) public returns (address) {
        GSNProfile profile = new GSNProfile(_owner);
        address addr = address(profile);

        profile.initialize(_getRelayHub());
        (IRelayHub(_getRelayHub())).depositFor.value(profileFunding)(addr);

        emit NewProfile(addr, _owner);

        return addr;
    }
}
