pragma solidity ^0.5.0;

import "./ArtistToken.sol";

contract FundingPoolMock {
  ArtistToken artistToken;

  function setArtistToken(address _artistToken) public {
    artistToken = ArtistToken(_artistToken);
  }

  function allocateFunds(address to, uint256 value) public {
    artistToken.fundsAllocated(value);
    artistToken.transfer(to, value);
  }
}
