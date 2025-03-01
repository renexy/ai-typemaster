// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@lukso/lsp7-contracts/contracts/LSP7DigitalAsset.sol";

contract SimpleAMA is LSP7DigitalAsset {
    struct Question {
        address sender;
        string questionText;
        string answerText;
        bool answered;
    }

    struct Profile {
        address owner;
        uint256 questionCounter;
        mapping(uint256 => Question) questions;
        mapping(address => bool) hasAskedQuestion; // Track if a user has already asked a question
        mapping(address => bool) hasReceivedToken; // Track if a user has received an FQT from this profile
    }

    mapping(address => Profile) public profiles;

    constructor(
        address owner
    ) LSP7DigitalAsset("Free Question Token", "FQT", msg.sender, 0, false) {}

    // Create a new profile for the caller
    function createProfile() external {
        require(
            profiles[msg.sender].owner == address(0),
            "Profile already exists"
        );
        profiles[msg.sender].owner = msg.sender;
    }

    // Visitors can claim a free token from a specific profile
    function claimFreeToken(address _profileOwner) external {
        Profile storage profile = profiles[_profileOwner];
        require(profile.owner != address(0), "Profile does not exist");
        require(
            !profile.hasReceivedToken[msg.sender],
            "You have already claimed a token from this profile"
        );

        profile.hasReceivedToken[msg.sender] = true;
        _mint(msg.sender, 1 * 10 ** 18, true, "Free token for AMA question");
    }

    // Submit a question to a specific profile
    function submitQuestion(
        address _profileOwner,
        string memory _questionText
    ) external {
        require(
            balanceOf(msg.sender) >= 1 * 10 ** 18,
            "You need an FQT to submit a question"
        );

        Profile storage profile = profiles[_profileOwner];
        require(profile.owner != address(0), "Profile does not exist");
        require(
            !profile.hasAskedQuestion[msg.sender],
            "You have already asked a question for this profile"
        );

        profile.questionCounter++;
        profile.questions[profile.questionCounter] = Question(
            msg.sender,
            _questionText,
            "",
            false
        );

        // Mark that the user has asked a question for this profile
        profile.hasAskedQuestion[msg.sender] = true;

        // Burn the token as part of the question submission process
        _burn(msg.sender, 1 * 10 ** 18, "Burn token to submit a question");
    }

    // Answer a question for the owner's profile
    function answerQuestion(
        uint256 _questionId,
        string memory _answerText
    ) external {
        Profile storage profile = profiles[msg.sender];
        require(profile.owner == msg.sender, "Only profile owner can answer");
        require(_questionId <= profile.questionCounter, "Invalid question ID");

        Question storage question = profile.questions[_questionId];
        question.answerText = _answerText;
        question.answered = true;
    }

    // Retrieve all questions for a specific profile
    function getAllQuestions(
        address _profileOwner
    ) external view returns (Question[] memory) {
        Profile storage profile = profiles[_profileOwner];
        require(profile.owner != address(0), "Profile does not exist");

        Question[] memory allQuestions = new Question[](
            profile.questionCounter
        );
        for (uint256 i = 1; i <= profile.questionCounter; i++) {
            allQuestions[i - 1] = profile.questions[i];
        }
        return allQuestions;
    }

    // Check if a user has already asked a question for a specific profile
    function hasAskedQuestion(
        address _profileOwner,
        address user
    ) external view returns (bool) {
        Profile storage profile = profiles[_profileOwner];
        require(profile.owner != address(0), "Profile does not exist");
        return profile.hasAskedQuestion[user];
    }

    // Get the total FQT balance of a user
    function getFQTBalance(address user) external view returns (uint256) {
        return balanceOf(user);
    }

    function hasProfile(address user) external view returns (bool) {
        return profiles[user].owner != address(0);
    }

    function hasReceivedToken(
        address _profileOwner,
        address user
    ) external view returns (bool) {
        Profile storage profile = profiles[_profileOwner];
        require(profile.owner != address(0), "Profile does not exist");
        return profile.hasReceivedToken[user];
    }
}
