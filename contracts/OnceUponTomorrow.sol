// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ERC721Enumerable, ERC721 } from '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import { ERC721Royalty } from '@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol';
import { Ownable } from '@openzeppelin/contracts/access/Ownable.sol';

/// @title Once Upon Tomorrow contract.
contract OnceUponTomorrow is ERC721Enumerable, ERC721Royalty, Ownable {
    /// @notice Maximum number of tokens a user can purchase in a single transaction.
    uint256 public constant MAX_HELMET_PURCHASE = 10;
    /// @notice Royalty factor for secondary sales, expressed as a percentage scaled by 10000 (e.g., 4% = 400).
    uint96 public constant ROYALTY_FACTOR = 400; // 4%.

    /// @notice Maximum supply of helmet tokens.
    uint256 public immutable MAX_HELMETS;

    /// @notice Price per helmet token in Wei.
    uint256 public helmetPrice = 0.05 ether;
    /// @notice Indicates whether the sale is active.
    bool public saleIsActive;

    /// @dev For inactive sales.
    error SaleInactive();
    /// @dev For exceeding the maximum allowed tokens in a single transaction.
    error MaxPurchaseExceeded(uint256 requested, uint256 maxAllowed);
    /// @dev For exceeding the maximum token supply.
    error MaxSupplyExceeded(uint256 requested, uint256 available);
    /// @dev For insufficient Ether sent.
    error InsufficientPayment(uint256 required, uint256 provided);

    /// @param name Name of the ERC721 token.
    /// @param symbol Symbol of the ERC721 token.
    /// @param maxNftSupply Maximum supply of the helmet tokens.
    constructor(string memory name, string memory symbol, uint256 maxNftSupply) ERC721(name, symbol) Ownable(msg.sender) {
        MAX_HELMETS = maxNftSupply;
    }

    /// @notice Withdraws the balance of the contract to the owner's address.
    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }

    /// @notice Sets the price of a helmet token.
    /// @param price The new price in Wei.
    function setHelmetPrice(uint256 price) external onlyOwner {
        helmetPrice = price;
    }

    /// @notice Toggles the sale state between active and inactive.
    function flipSaleState() external onlyOwner {
        saleIsActive = !saleIsActive;
    }

    /// @notice Mints a specified number of helmet tokens to the caller.
    /// @param numberOfTokens Number of helmet tokens to mint.
    /// @dev Reverts with custom errors for various invalid states.
    function mintHelmets(uint256 numberOfTokens) external payable {
        if (!saleIsActive) revert SaleInactive();
        if (numberOfTokens > MAX_HELMET_PURCHASE) revert MaxPurchaseExceeded(numberOfTokens, MAX_HELMET_PURCHASE);
        if (totalSupply() + numberOfTokens > MAX_HELMETS) revert MaxSupplyExceeded(numberOfTokens, MAX_HELMETS - totalSupply());
        if (helmetPrice * numberOfTokens > msg.value) revert InsufficientPayment(helmetPrice * numberOfTokens, msg.value);

        for (uint256 i = 0; i < numberOfTokens; i++) {
            uint256 mintIndex = totalSupply();
            if (totalSupply() < MAX_HELMETS) {
                _safeMint(msg.sender, mintIndex);
                _setTokenRoyalty(mintIndex, msg.sender, ROYALTY_FACTOR);
            }
        }
    }

    /// @notice Checks if the contract supports a given interface.
    /// @param interfaceId Interface ID to check.
    /// @return True if the interface is supported, false otherwise.
    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, ERC721Royalty) returns (bool) {
        return
            ERC721Enumerable.supportsInterface(interfaceId) ||
            ERC721Royalty.supportsInterface(interfaceId) ||
            ERC721.supportsInterface(interfaceId) ||
            super.supportsInterface(interfaceId);
    }

    function _increaseBalance(address account, uint128 amount) internal override(ERC721, ERC721Enumerable) {
        ERC721Enumerable._increaseBalance(account, amount);
    }

    function _update(address to, uint256 tokenId, address auth) internal override(ERC721, ERC721Enumerable) returns (address) {
        return ERC721Enumerable._update(to, tokenId, auth);
    }

    function _baseURI() internal pure override returns (string memory) {
        return 'https://nft.rsclabs.io/nft/once-upon-tomorrow/meta/';
    }
}
