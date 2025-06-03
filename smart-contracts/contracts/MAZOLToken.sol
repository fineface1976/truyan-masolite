// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MAZOLToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 50_000_000 * 10**18;
    uint256 public constant PRIVATE_SALE = 25_000_000 * 10**18;
    uint256 public constant MINING_RESERVE = 5_000_000 * 10**18;
    uint256 public constant LOCKED_TOKENS = 20_000_000 * 10**18;
    
    uint256 public currentPrice = 0.001 * 10**18; // $0.001 in wei
    address public treasury;
    
    struct Vote {
        uint256 proposedPrice;
        bool hasVoted;
    }
    
    mapping(address => Vote) public votes;
    mapping(address => bool) public eligibleVoters;
    
    constructor(address _treasury) ERC20("MAZOL", "MZLx") {
        treasury = _treasury;
        _mint(treasury, PRIVATE_SALE + MINING_RESERVE);
        _mint(address(this), LOCKED_TOKENS); // Contract holds locked tokens
    }
    
    function voteForPrice(uint256 _proposedPrice) external {
        require(eligibleVoters[msg.sender], "Not eligible to vote");
        require(!votes[msg.sender].hasVoted, "Already voted");
        
        votes[msg.sender] = Vote({
            proposedPrice: _proposedPrice,
            hasVoted: true
        });
    }
    
    function executePriceVote() external onlyOwner {
        // Implementation to calculate new price based on votes
        // Then reset all votes for next round
    }
    
    function releaseLockedTokens() external onlyOwner {
        _transfer(address(this), treasury, LOCKED_TOKENS);
    }
    
    function addVoter(address _voter) external onlyOwner {
        eligibleVoters[_voter] = true;
    }
}
