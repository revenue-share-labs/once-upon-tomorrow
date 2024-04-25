import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity ^0.8.20;

/**
 * @title Once Upon Tomorrow contract
 */
contract OnceUponTomorrow is ERC721Enumerable, ERC721Royalty, Ownable {
    uint256 public helmetPrice = 0.05 ether; //0.05 ETH
    uint public constant maxHelmetPurchase = 10;
    uint256 public MAX_HELMETS;
    bool public saleIsActive = false;
    uint96 public constant ROYALTY_FACTOR = 400; // 4%

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
     * Mint Helmets
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
                _setTokenRoyalty(mintIndex, msg.sender, ROYALTY_FACTOR);
            }
        }
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Enumerable, ERC721Royalty) returns (bool) {
        return
            ERC721Enumerable.supportsInterface(interfaceId) ||
            ERC721Royalty.supportsInterface(interfaceId) ||
            ERC721.supportsInterface(interfaceId) ||
            super.supportsInterface(interfaceId);
    }

    function _increaseBalance(
        address account,
        uint128 amount
    ) internal override(ERC721, ERC721Enumerable) {
        ERC721Enumerable._increaseBalance(account, amount);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return ERC721Enumerable._update(to, tokenId, auth);
    }
}
