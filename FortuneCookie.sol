// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FortuneCookie {
    struct UserClaim {
        uint256 count;
        uint256 lastClaimTimestamp;
    }

    mapping(address => UserClaim) public userClaims;
    uint256 public constant MAX_CLAIMS_PER_DAY = 5;

    event FortuneClaimed(address indexed user, uint256 claimCount);

    function claimFortune() external {
        UserClaim storage claim = userClaims[msg.sender];
        
        // Reset count if it's a new day (86400 seconds)
        if (block.timestamp - claim.lastClaimTimestamp >= 1 days) {
            claim.count = 0;
        }

        require(claim.count < MAX_CLAIMS_PER_DAY, "Daily limit reached");

        claim.count += 1;
        claim.lastClaimTimestamp = block.timestamp;

        emit FortuneClaimed(msg.sender, claim.count);
    }

    function getClaimsToday(address user) external view returns (uint256) {
        UserClaim storage claim = userClaims[user];
        if (block.timestamp - claim.lastClaimTimestamp >= 1 days) {
            return 0;
        }
        return claim.count;
    }
}
