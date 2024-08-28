// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NexusNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    struct RealEstateAsset {
        uint256 tokenId;
        string propertyAddress;
        string tokenURI;
        uint256 valuation;
        uint256 fractionalShares;
    }

    uint256 public totalTokens = 0;

    mapping(uint256 => RealEstateAsset) public realEstateAssets;
    mapping(uint256 => mapping(address => uint256)) public ownershipShares;
    mapping(uint256 => mapping(address => uint256)) public lockedShares;
    mapping(uint256 => mapping(address => uint256)) public lockExpiry;
    mapping(uint256 => mapping(address => ShareListing)) public shareListings;

    struct ShareListing {
        uint256 shares;
        uint256 pricePerShare; // In wei
        bool active;
    }

    constructor() ERC721("NexusNFT", "NXNFT") Ownable(msg.sender) {
        _tokenIdCounter = 1;
    }

    // Events
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

    event TransactionRecorded(
        uint256 indexed tokenId,
        address indexed from,
        address indexed to,
        uint256 shares,
        uint256 timestamp
    );

    // Function to tokenize a new real estate asset
    function tokenizeRealEstate(
        string memory propertyAddress,
        uint256 valuation, // Valuation should be passed in ETH, not wei
        uint256 fractionalShares,
        string memory tokenURI
    ) public onlyOwner returns (uint256) {
        RealEstateAsset storage asset = realEstateAssets[totalTokens];
        
        asset.tokenId = totalTokens++;
        asset.propertyAddress = propertyAddress;
        asset.tokenURI = tokenURI;
        asset.valuation = valuation;
        asset.fractionalShares = fractionalShares;
        ownershipShares[asset.tokenId][msg.sender] = fractionalShares; // Initialize full ownership to the creator

        _mint(msg.sender, asset.tokenId);
        _setTokenURI(asset.tokenId, tokenURI);

        emit RealEstateTokenized(asset.tokenId, propertyAddress, asset.valuation, fractionalShares);
        return asset.tokenId;
    }

    // Function to transfer ownership of fractional shares
    function transferOwnershipShares(
        uint256 tokenId,
        address to,
        uint256 shares
    ) public {
        require(tokenExists(tokenId), "Token does not exist");
        require(ownershipShares[tokenId][msg.sender] >= shares, "Insufficient shares");

        ownershipShares[tokenId][msg.sender] -= shares;
        ownershipShares[tokenId][to] += shares;

        emit OwnershipTransferred(tokenId, msg.sender, to, shares);
        recordTransaction(tokenId, msg.sender, to, shares);
    }

    // Function to get the fractional ownership of a user for a specific token
    function getOwnershipShares(uint256 tokenId, address owner) public view returns (uint256) {
        require(tokenExists(tokenId), "Token does not exist");
        return ownershipShares[tokenId][owner];
    }

    // Function to get details of a real estate asset
    function getRealEstateAssetDetails(uint256 tokenId)
        public
        view
        returns (
            string memory propertyAddress,
            string memory tokenURI,
            uint256 valuation,
            uint256 fractionalShares
        )
    {
        require(tokenExists(tokenId), "Token does not exist");
        RealEstateAsset storage asset = realEstateAssets[tokenId];
        return (
            asset.propertyAddress,
            asset.tokenURI,
            asset.valuation / 10**18,
            asset.fractionalShares
        );
    }

    // Function to initiate purchase of a real estate asset
    function purchaseRealEstate(uint256 tokenId, uint256 shares) public payable {
        require(tokenExists(tokenId), "Token does not exist");
        require(ownershipShares[tokenId][msg.sender] < shares, "Already owns shares");

        uint256 sharePrice = realEstateAssets[tokenId].valuation / realEstateAssets[tokenId].fractionalShares;
        uint256 purchasePrice = sharePrice * shares;
        require(msg.value >= purchasePrice, "Insufficient funds");

        ownershipShares[tokenId][msg.sender] += shares;

        emit OwnershipTransferred(tokenId, address(0), msg.sender, shares);
        recordTransaction(tokenId, address(0), msg.sender, shares);
    }

    // Function to list shares for sale
    function listSharesForSale(uint256 tokenId, uint256 shares, uint256 pricePerShare) public {
        require(tokenExists(tokenId), "Token does not exist");
        require(ownershipShares[tokenId][msg.sender] >= shares, "Insufficient shares");

        shareListings[tokenId][msg.sender] = ShareListing({
            shares: shares,
            pricePerShare: pricePerShare,
            active: true
        });
    }

    // Function to buy listed shares
    function buyListedShares(uint256 tokenId, address from, uint256 shares) public payable {
        ShareListing storage listing = shareListings[tokenId][from];
        require(listing.active, "Listing not active");
        require(listing.shares >= shares, "Not enough shares listed");
        uint256 totalCost = listing.pricePerShare * shares;
        require(msg.value >= totalCost, "Insufficient funds");

        listing.shares -= shares;
        if (listing.shares == 0) {
            listing.active = false;
        }

        ownershipShares[tokenId][from] -= shares;
        ownershipShares[tokenId][msg.sender] += shares;

        payable(from).transfer(totalCost);

        emit OwnershipTransferred(tokenId, from, msg.sender, shares);
        recordTransaction(tokenId, from, msg.sender, shares);
    }

    // Function to lock shares for a certain period
    function lockShares(uint256 tokenId, uint256 shares, uint256 lockTime) public {
        require(tokenExists(tokenId), "Token does not exist");
        require(ownershipShares[tokenId][msg.sender] >= shares, "Insufficient shares");

        lockedShares[tokenId][msg.sender] += shares;
        lockExpiry[tokenId][msg.sender] = block.timestamp + lockTime;

        ownershipShares[tokenId][msg.sender] -= shares;
    }

    // Function to unlock shares after lock period
    function unlockShares(uint256 tokenId) public {
        require(block.timestamp >= lockExpiry[tokenId][msg.sender], "Shares are still locked");

        ownershipShares[tokenId][msg.sender] += lockedShares[tokenId][msg.sender];
        lockedShares[tokenId][msg.sender] = 0;
    }

    // Function to revalue the property
    function revalueProperty(uint256 tokenId, uint256 newValuation) public onlyOwner {
        require(tokenExists(tokenId), "Token does not exist");
        require(newValuation > 0, "New valuation must be positive");

        realEstateAssets[tokenId].valuation = newValuation;
        emit RealEstateTokenized(tokenId, realEstateAssets[tokenId].propertyAddress, newValuation, realEstateAssets[tokenId].fractionalShares);
    }

    // Function to distribute dividends
    function distributeDividends(uint256 tokenId) public payable onlyOwner {
        require(tokenExists(tokenId), "Token does not exist");

        uint256 totalShares = realEstateAssets[tokenId].fractionalShares;
        require(msg.value > 0, "No funds to distribute");

        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            address shareholder = ownerOf(i);
            uint256 shareholderShares = ownershipShares[tokenId][shareholder];
            uint256 payment = (msg.value * shareholderShares) / totalShares;
            payable(shareholder).transfer(payment);
        }
    }

    // Function to buy back shares
    function buyBackShares(uint256 tokenId, uint256 shares) public payable onlyOwner {
        require(tokenExists(tokenId), "Token does not exist");
        require(ownershipShares[tokenId][msg.sender] >= shares, "Insufficient shares to buy back");

        uint256 sharePrice = realEstateAssets[tokenId].valuation / realEstateAssets[tokenId].fractionalShares;
        uint256 totalCost = sharePrice * shares;
        require(msg.value >= totalCost, "Insufficient funds to buy back shares");

        ownershipShares[tokenId][msg.sender] -= shares;
        ownershipShares[tokenId][owner()] += shares;

        emit OwnershipTransferred(tokenId, msg.sender, owner(), shares);
        recordTransaction(tokenId, msg.sender, owner(), shares);
    }

    // Function to transfer full ownership of the property
    function transferFullOwnership(uint256 tokenId, address newOwner) public onlyOwner {
        require(tokenExists(tokenId), "Token does not exist");

        ownershipShares[tokenId][newOwner] = realEstateAssets[tokenId].fractionalShares;
        ownershipShares[tokenId][owner()] = 0;

        _transfer(owner(), newOwner, tokenId);

        emit OwnershipTransferred(tokenId, owner(), newOwner, realEstateAssets[tokenId].fractionalShares);
        recordTransaction(tokenId, owner(), newOwner, realEstateAssets[tokenId].fractionalShares);
    }

   function burnProperty(uint256 tokenId) public onlyOwner {
    require(tokenExists(tokenId), "Token does not exist");

    _burn(tokenId);
    delete realEstateAssets[tokenId];  // This is okay since it's a struct.

    // For the ownershipShares mapping:
    address[] memory owners = _getAllOwners(tokenId); // Get all owners of the token.
    for (uint256 i = 0; i < owners.length; i++) {
        ownershipShares[tokenId][owners[i]] = 0;  // Resetting to the default value.
    }

        emit OwnershipTransferred(tokenId, owner(), address(0), 0);
    }

// Helper function to get all owners of a token.
    function _getAllOwners(uint256 tokenId) internal view returns (address[] memory) {
        uint256 count = 0;
        address[] memory tempOwners = new address[](totalTokens);  // Array to store temporary owners.

        for (uint256 i = 1; i <= _tokenIdCounter; i++) {
            if (ownershipShares[tokenId][ownerOf(i)] > 0) {
                tempOwners[count] = ownerOf(i);
                count++;
            }
        }

        address[] memory owners = new address[](count);  // Final array with correct size.
        for (uint256 j = 0; j < count; j++) {
            owners[j] = tempOwners[j];
        }

        return owners;
    }


    // Emergency withdrawal function
    function emergencyWithdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Custom function to check if a token ID exists
    function tokenExists(uint256 tokenId) public view returns (bool) {
        return ownerOf(tokenId) != address(0);
    }

    // Internal function to record transactions
    function recordTransaction(uint256 tokenId, address from, address to, uint256 shares) internal {
        emit TransactionRecorded(tokenId, from, to, shares, block.timestamp);
    }
}
