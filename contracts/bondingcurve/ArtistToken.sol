pragma solidity ^0.5.0;

import "./CommonsToken.sol";

contract ArtistToken is CommonsToken {
    string public name;   // e.g: Armin Van Lightstreams
    string public symbol; // e.g: AVL

    constructor (
        string memory _name,
        string memory _symbol,
        address _externalToken,
        uint32 _reserveRatio,
        uint256 _gasPrice,
        uint256 _theta,
        uint256 _p0,
        uint256 _initialRaise,
        address _fundingPool,
        uint256 _friction,
        uint256 _duration,
        uint256 _minExternalContribution
    ) public
    CommonsToken(
        _externalToken,
        _reserveRatio,
        _gasPrice,
        _theta,
        _p0,
        _initialRaise,
        _fundingPool,
        _friction,
        _duration,
        _minExternalContribution
    ) {
        name = _name;
        symbol = _symbol;
    }
}
