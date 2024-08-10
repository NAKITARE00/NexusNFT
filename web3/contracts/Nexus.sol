// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NexusNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct RealEstateAsset {
        string propertyAddress;
        uint256 valuation;
        uint256 fractionalShares; // Number of fractional shares available
        mapping(address => uint256) ownershipShares; // Tracks ownership shares per address
    }

    mapping(uint256 => RealEstateAsset) public realEstateAssets;

    constructor() ERC721("NexusNFT", "NXNFT") Ownable(msg.sender) {
        _tokenIdCounter = 1;  // Start token IDs from 1
    }

    event RealEstateTokenized(
        uint256 indexed tokenId,
        string propertyAddress,
        uint256 valuation,
        uint256 fractionalShares
    );

    event OwnershipTransferred(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 shares
    );

    // Function to tokenize a new real estate asset
    function tokenizeRealEstate(
        string memory propertyAddress,
        uint256 valuation,
        uint256 fractionalShares,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        uint256 newItemId = _tokenIdCounter;
        _tokenIdCounter += 1;

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        RealEstateAsset storage asset = realEstateAssets[newItemId];
        asset.propertyAddress = propertyAddress;
        asset.valuation = valuation;
        asset.fractionalShares = fractionalShares;
        asset.ownershipShares[msg.sender] = fractionalShares;

        emit RealEstateTokenized(newItemId, propertyAddress, valuation, fractionalShares);
        return newItemId;
    }

    // Function to transfer ownership of fractional shares
    function transferOwnershipShares(
        uint256 tokenId,
        address to,
        uint256 shares
    ) public {
        require(tokenExists(tokenId), "Token does not exist");
        require(realEstateAssets[tokenId].ownershipShares[msg.sender] >= shares, "Insufficient shares");

        realEstateAssets[tokenId].ownershipShares[msg.sender] -= shares;
        realEstateAssets[tokenId].ownershipShares[to] += shares;

        emit OwnershipTransferred(tokenId, msg.sender, to, shares);
    }

    // Function to get the fractional ownership of a user for a specific token
    function getOwnershipShares(uint256 tokenId, address owner) public view returns (uint256) {
        require(tokenExists(tokenId), "Token does not exist");
        return realEstateAssets[tokenId].ownershipShares[owner];
    }

    // Function to get details of a real estate asset
    function getRealEstateAssetDetails(uint256 tokenId)
        public
        view
        returns (
            string memory propertyAddress,
            uint256 valuation,
            uint256 fractionalShares
        )
    {
        require(tokenExists(tokenId), "Token does not exist");
        RealEstateAsset storage asset = realEstateAssets[tokenId];
        return (asset.propertyAddress, asset.valuation, asset.fractionalShares);
    }

    // Integration point for DeFi protocols (e.g., staking, borrowing)
    function integrateWithDeFi(uint256 tokenId, address defiProtocol, uint256 shares) public {
        require(tokenExists(tokenId), "Token does not exist");
        require(realEstateAssets[tokenId].ownershipShares[msg.sender] >= shares, "Insufficient shares");

        // Transfer the shares to the DeFi protocol
        transferOwnershipShares(tokenId, defiProtocol, shares);

        // Additional logic for integrating with DeFi protocols can be added here
    }

    // Compliance check (example: only owner can mint new tokens)
    function mint(address to, uint256 tokenId) public onlyOwner {
        _mint(to, tokenId);
    }

    // Custom function to check if a token ID exists
    function tokenExists(uint256 tokenId) public view returns (bool) {
        return ownerOf(tokenId) != address(0);
    }
}
