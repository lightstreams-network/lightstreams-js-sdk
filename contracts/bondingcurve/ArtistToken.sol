pragma solidity ^0.5.0;

import "./CommonsToken.sol";
import "./vendor/access/Ownable.sol";

contract ArtistToken is CommonsToken, Ownable {
    string public name;   // e.g: Armin Van Lightstreams
    string public symbol; // e.g: AVL

    /*
    * @param _addresses [0] externalToken [1] fundingPool [2] feeRecipient [3] pauser
    * @param _settings [0] _gasPrice [1] _theta [2] _p0 [3] _initialRaise [4] _friction [5] _hatchDurationSeconds [6] _hatchVestingDurationSeconds [7] _minExternalContribution
    * @param _reserveRatio
    */
    constructor (
        string memory _name,
        string memory _symbol,
        address[4] memory _addresses,
        uint256[8] memory _settings,
        uint32 _reserveRatio
    ) public
    CommonsToken(
        _addresses,
        _settings,
        _reserveRatio
    )
    Ownable(msg.sender)
    {
        name = _name;
        symbol = _symbol;
    }
}
