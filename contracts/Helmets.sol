import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.20;

/**
 * @title Helmet contract
 * @dev Extends ERC721 Non-Fungible Token Standard basic implementation
 */
contract Helmets is ERC721Enumerable, Ownable {
    uint256 public helmetPrice = 0.05 ether; //0.05 ETH

    uint public constant maxHelmetPurchase = 10;

    uint256 public MAX_HELMETS;

    bool public saleIsActive = false;

    constructor(
        string memory name,
        string memory symbol,
        uint256 maxNftSupply
    ) ERC721(name, symbol) Ownable(msg.sender) {
        MAX_HELMETS = maxNftSupply;
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://nft.rsclabs.io/nft/once-upon-tomorrow/meta/";
    }

    /**
     * Set some Bored Helmets aside
     */
    function reserveHelmets() public onlyOwner {
        uint supply = totalSupply();
        uint i;
        for (i = 0; i < 30; i++) {
            _safeMint(msg.sender, supply + i);
        }
    }

    function setHelmetPrice(uint256 price) public onlyOwner {
        helmetPrice = price;
    }

    /*
     * Pause sale if active, make active if paused
     */
    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    /**
     * Mints Helmets
     */
    function mintHelmets(uint numberOfTokens) public payable {
        require(saleIsActive, "Sale must be active to mint Helmet");
        require(
            numberOfTokens <= maxHelmetPurchase,
            "Can only mint 10 tokens at a time"
        );
        require(
            totalSupply() + numberOfTokens <= MAX_HELMETS,
            "Purchase would exceed max supply of Helmets"
        );
        require(
            helmetPrice * numberOfTokens <= msg.value,
            "Ether value sent is not correct"
        );

        for (uint i = 0; i < numberOfTokens; i++) {
            uint mintIndex = totalSupply();
            if (totalSupply() < MAX_HELMETS) {
                _safeMint(msg.sender, mintIndex);
            }
        }
    }
}
