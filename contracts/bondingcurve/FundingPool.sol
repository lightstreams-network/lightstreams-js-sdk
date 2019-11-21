pragma solidity ^0.5.0;

import "./ArtistToken.sol";
import "./vendor/ERC20/IERC20.sol";

contract FundingPool {
  function allocateFunds(address artistTokenAddr, address to, uint256 value) public {
    ArtistToken artistToken = ArtistToken(artistTokenAddr);
    address artistTokenOwner = artistToken.getOwner();

    require(artistTokenOwner == msg.sender, "only ArtistToken owner can allocate funds");

    artistToken.fundsAllocated(value);
    IERC20(artistToken.externalToken()).transfer(to, value);
  }
}
