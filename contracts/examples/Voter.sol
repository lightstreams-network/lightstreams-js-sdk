pragma solidity ^0.5.0;

import "../utils/GSN.sol";

contract Voter is GSN {
    uint256 public count;

    event Voted(uint256 newCount, address account);

    function upVote() public {
        address lastVoter = _msgSender();
        count++;

        emit Voted(count, lastVoter);
    }

    function downVote() public {
        address lastVoter = _msgSender();
        count--;

        emit Voted(count, lastVoter);
    }
}
