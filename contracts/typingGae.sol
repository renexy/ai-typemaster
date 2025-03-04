// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@lukso/lsp-smart-contracts/contracts/LSP8IdentifiableDigitalAsset/LSP8IdentifiableDigitalAsset.sol";

contract TypingLeaderboardNFT is LSP8IdentifiableDigitalAsset {
    enum Difficulty {
        EASY,
        NORMAL,
        HARD
    }

    struct Leader {
        address player;
        uint256 score;
    }

    mapping(Difficulty => Leader) public topScorers;
    mapping(address => mapping(Difficulty => bool)) public hasFirstPlaceNFT;

    bytes32 private constant FIRST_PLACE_NFT = keccak256("FIRST_PLACE_NFT");
    bytes32 private immutable secretHash;
    address public immutable contractOwner;

    event ScoreUpdated(
        Difficulty indexed difficulty,
        address indexed player,
        uint256 score
    );
    event NFTRewarded(
        Difficulty indexed difficulty,
        address indexed player,
        bytes32 tokenId
    );
    event NFTRevoked(
        Difficulty indexed difficulty,
        address indexed previousPlayer,
        bytes32 tokenId
    );

    constructor(
        string memory name_,
        string memory symbol_,
        address newOwner_,
        uint256 lsp4TokenType_,
        uint256 lsp8TokenIdFormat_,
        string memory secretCode_
    )
        LSP8IdentifiableDigitalAsset(
            name_,
            symbol_,
            newOwner_,
            lsp4TokenType_,
            lsp8TokenIdFormat_
        )
    {
        contractOwner = msg.sender;
        secretHash = keccak256(abi.encodePacked(secretCode_));

        // Initialize the leaderboards and mint NFTs for each difficulty
        for (uint8 i = 0; i < 3; i++) {
            Difficulty diff = Difficulty(i);
            bytes32 tokenId = keccak256(
                abi.encodePacked(diff, FIRST_PLACE_NFT)
            );

            // Mint the "First Place NFT" for each difficulty, initially to the contract owner
            _mint(newOwner_, tokenId, true, "Initial First Place NFT");
            topScorers[diff] = Leader(newOwner_, 0);
            hasFirstPlaceNFT[newOwner_][diff] = true;
        }
    }

    function submitScore(
        uint256 score,
        Difficulty difficulty,
        string memory secretCode
    ) external {
        // Validate secret code
        require(
            keccak256(abi.encodePacked(secretCode)) == secretHash,
            "Invalid secret code"
        );

        Leader storage leader = topScorers[difficulty];
        require(score >= leader.score, "Not the highest score");

        address previousPlayer = leader.player;
        bytes32 tokenId = keccak256(
            abi.encodePacked(difficulty, FIRST_PLACE_NFT)
        );

        // If the player is the current leader, just update their score
        if (previousPlayer == msg.sender) {
            leader.score = score;
            emit ScoreUpdated(difficulty, msg.sender, score);
            return;
        }

        if (hasFirstPlaceNFT[previousPlayer][difficulty]) {
            // transfer from the address from the previous player
            _transfer(previousPlayer, msg.sender, tokenId, true, "");
        } else {
            _transfer(contractOwner, msg.sender, tokenId, true, "");
        }

        // Update the leaderboard
        leader.player = msg.sender;
        leader.score = score;
        hasFirstPlaceNFT[msg.sender][difficulty] = true;

        // Emit events
        emit ScoreUpdated(difficulty, msg.sender, score);
        emit NFTRewarded(difficulty, msg.sender, tokenId);
    }

    // Override transfer to prevent transferring First Place NFTs between players
    function _transfer(
        address from,
        address to,
        bytes32 tokenId,
        bool skipCheck,
        bytes memory data
    ) internal override {
        
            super._transfer(from, to, tokenId, skipCheck, data);
    }
}
