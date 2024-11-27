// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import { ERC721 } from '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract MockNFT is ERC721 {

    constructor() ERC721("Mock NFT", "mNFT") {}

    uint256 public idCounter;

    function mint(address to) external {
        _mint(to, idCounter++);
    }

    function burn(uint256 tokenId) external {
        _burn(tokenId);
    }

}