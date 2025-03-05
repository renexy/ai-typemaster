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
    mapping(bytes32 => bool) private allowTransfer;
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
            uint256 tokenId = i + 1;
            allowTransfer[bytes32(tokenId)] = true;

            // Mint the "First Place NFT" for each difficulty, initially to the contract owner
            _mint(newOwner_, bytes32(tokenId), true, "Initial First Place NFT");
            allowTransfer[bytes32(tokenId)] = false;
            topScorers[diff] = Leader(newOwner_, 0);
            hasFirstPlaceNFT[newOwner_][diff] = true;
        }
    }

    function submitScore(
        uint256 score,
        Difficulty difficulty,
        string memory secretCode
    ) external {
        // Validate secret code -- this will be done with backend later on, just didn't have time to implement it
        require(
            keccak256(abi.encodePacked(secretCode)) == secretHash,
            "Invalid secret code"
        );

        Leader storage leader = topScorers[difficulty];
        require(score > leader.score, "Not the highest score");

        address previousPlayer = leader.player;
        
        bytes32 tokenId = bytes32(uint256(difficulty) + 1);

        // If the player is the current leader, just update their score
        if (previousPlayer == msg.sender) {
            leader.score = score;
            emit ScoreUpdated(difficulty, msg.sender, score);
            return;
        }
        allowTransfer[tokenId] = true;
        if (hasFirstPlaceNFT[previousPlayer][difficulty]) {
            // transfer from the address from the previous player
            _transfer(previousPlayer, msg.sender, tokenId, true, "");
        } else {
            _transfer(contractOwner, msg.sender, tokenId, true, "");
        }
        allowTransfer[tokenId] = false;

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

    function _beforeTokenTransfer(
        address from,
        address to,
        bytes32 tokenId,
        bool skipCheck,
        bytes memory data
    ) internal override {
        require(allowTransfer[tokenId], "Transfers are restricted");
        super._beforeTokenTransfer(from, to, tokenId, skipCheck, data);
    }
}
