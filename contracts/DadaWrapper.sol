// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./fixtures/modifiedOz/IDada721.sol";

interface IDadaCollectible {
    function transfer(
        address to,
        uint256 drawingId,
        uint256 printIndex
    ) external returns (bool success);

    function DrawingPrintToAddress(uint256 print)
        external
        returns (address _address);

    function buyCollectible(uint256 drawingId, uint256 printIndex)
        external
        payable;

    function OfferedForSale(uint256)
        external
        returns (
            bool isForSale,
            uint256 drawingId,
            uint256 printIndex,
            address seller,
            uint256 minValue,
            address onlySellTo,
            uint256 lastSellValue
        );
}

contract DadaCollectibleWrapper is ERC721, Ownable{
    // Modified ERC20 contract
    IDadaCollectible dadaCollectible;

    // NFT interface for token swaps
    IDada721 dadaNFT;
    
    // todo contract needs to be token receiver?

    mapping(uint256 => uint256) public _tokenIDToDrawingID;

    string private _baseTokenURI;
    
    uint256 constant PREFIX_2017 = 20170000000000;
    uint256 constant PREFIX_2019 = 20170000000000;
    uint256 constant DRAWING_ID_MUL = 100000;

    event Wrapped(uint256 indexed drawingID, uint256 printID, uint256 tokenID);
    event Unwrapped(uint256 indexed drawingID, uint256 printID);

    constructor(address dadaCollectibleAddress, address _dadaNftAddress)
        ERC721("Wrapped Creeps and Weirdos", "CAW")
    {
        dadaCollectible = IDadaCollectible(dadaCollectibleAddress);
        dadaNFT = IDada721(_dadaNftAddress);
        _baseTokenURI = "https://dadacollectibles.s3.eu-north-1.amazonaws.com/Dada+Metadata/";
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function _setBaseURI(string memory baseUri) public onlyOwner {
        _baseTokenURI = baseUri;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString())) : "";
    }

    function get2017TokenId(uint256 _drawingId, uint256 _printIndex) public pure returns (uint256) {
        return PREFIX_2017 + (_drawingId * DRAWING_ID_MUL) + _printIndex;
    }

    function get2019TokenId(uint256 _tokenId, uint256 _tokenNumber) public pure returns (uint256) {
        return PREFIX_2019 + (_tokenId * DRAWING_ID_MUL) + _tokenNumber;
    }

    function wrapCreep(uint256 _drawingId, uint256 _printIndex) public {
        address _owner = dadaCollectible.DrawingPrintToAddress(_printIndex);

        require(_owner == msg.sender, "!owner");

        dadaCollectible.buyCollectible(_drawingId, _printIndex);

        require(
            dadaCollectible.DrawingPrintToAddress(_printIndex) == address(this),
            "An error occured"
        );
        
        // calculate new tokenId
        uint256 _tokenId = get2017TokenId(_drawingId, _printIndex);
        
        require(!_exists(_tokenId), 'minted');

        _mint(msg.sender, _tokenId);
        emit Wrapped(_drawingId, _printIndex, _tokenId);
    }

    function unwrapCreep(uint256 _drawingId, uint256 _printIndex) public {
        // Check if caller owns the drawing
        uint256 _tokenId = get2017TokenId(_drawingId, _printIndex);
        require(ownerOf(_tokenId) == msg.sender, "!owner");
        _burn(_printIndex);

        bool success = dadaCollectible.transfer(
            msg.sender,
            _drawingId,
            _printIndex
        );

        // Check if transfer succeeded
        require(success);
        emit Unwrapped(_drawingId, _printIndex);
    }

    function wrapWeirdo(uint256 _tokenId) public {
        address _owner = dadaNft.ownerOf(_tokenId);
        require(_owner == msg.sender, "!owner");

        dadaNFT.transferFrom(msg.sender, address(this), _tokenId);

        require(
            dadaNFT.ownerOf(_tokenId) == address(this),
            "An error occured"
        );
        
        // calculate new tokenId
        uint256 _tokenId = get2019TokenId(_tokenId);
        
        require(!_exists(_tokenId), 'minted');

        _mint(msg.sender, _tokenId);
        // emit Wrapped(_drawingId, _printIndex, _tokenId);
    }

    function unwrapCreep(uint256 _drawingId, uint256 _printIndex) public {
        // Check if caller owns the drawing
        uint256 _tokenId = get2019TokenId(_drawingId, _printIndex);
        require(ownerOf(_tokenId) == msg.sender, "!owner");
        _burn(_printIndex);

        dadaNFT.transferFrom(address(this), msg.sender, _tokenId);

        // Check if transfer succeeded
        // require(success);
        emit Unwrapped(_drawingId, _printIndex);
    }
}
