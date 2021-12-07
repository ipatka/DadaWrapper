// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

interface IDada721 {
    function ownerOf(uint256 tokenId) external view returns (address);

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external payable;

    function collectibleInfo(uint256 _collectibleId)
        external
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            uint256,
            string memory,
            string memory
        );
}

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
}

contract DadaCollectibleWrapper is ERC721, Ownable {
    using Strings for uint256;
    // Modified ERC20 contract
    IDadaCollectible dadaCollectible;

    // NFT interface for token swaps
    IDada721 dadaNft;

    // todo contract needs to be token receiver?

    mapping(uint256 => uint256) public _tokenIDToDrawingID;

    string private _baseTokenURI;

    uint256 constant PREFIX_2017 = 20170000000000;
    uint256 constant PREFIX_2019 = 20170000000000;
    uint256 constant DRAWING_ASSET_ID_MUL = 100000;

    event WrappedCreep(uint256 indexed drawingID, uint256 printID, uint256 wrappedTokenId);
    event UnwrappedCreep(uint256 indexed drawingID, uint256 printID, uint256 wrappedTokenId);

    event WrappedWeirdo(uint256 indexed assetId, uint256 tokenId, uint256 wrappedTokenId);
    event UnwrappedWeirdo(uint256 indexed assetId, uint256 tokenId, uint256 wrappedTokenId);

    constructor(address dadaCollectibleAddress, address _dadaNftAddress)
        ERC721("Wrapped Creeps and Weirdos", "WCW")
    {
        dadaCollectible = IDadaCollectible(dadaCollectibleAddress);
        dadaNft = IDada721(_dadaNftAddress);
        _baseTokenURI = "https://dadacollectibles.s3.eu-north-1.amazonaws.com/Dada+Metadata/";
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function _setBaseURI(string memory baseUri) public onlyOwner {
        _baseTokenURI = baseUri;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory baseURI = _baseURI();
        return
            bytes(baseURI).length > 0
                ? string(abi.encodePacked(baseURI, tokenId.toString()))
                : "";
    }

    function get2017TokenId(uint256 _drawingId, uint256 _printIndex)
        public
        pure
        returns (uint256)
    {
        return PREFIX_2017 + (_drawingId * DRAWING_ASSET_ID_MUL) + _printIndex;
    }

    function get2019TokenId(uint256 _assetId, uint256 _tokenId)
        public
        pure
        returns (uint256)
    {
        return PREFIX_2019 + (_assetId * DRAWING_ASSET_ID_MUL) + _tokenId;
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
        uint256 _wrappedTokenId = get2017TokenId(_drawingId, _printIndex);

        require(!_exists(_wrappedTokenId), "minted");

        _mint(msg.sender, _wrappedTokenId);
        emit WrappedCreep(_drawingId, _printIndex, _wrappedTokenId);
    }

    function unwrapCreep(uint256 _drawingId, uint256 _printIndex) public {
        // Check if caller owns the drawing
        uint256 _wrappedTokenId = get2017TokenId(_drawingId, _printIndex);
        require(ownerOf(_wrappedTokenId) == msg.sender, "!owner");
        _burn(_printIndex);

        bool success = dadaCollectible.transfer(
            msg.sender,
            _drawingId,
            _printIndex
        );

        // Check if transfer succeeded
        require(success);
        emit UnwrappedCreep(_drawingId, _printIndex, _wrappedTokenId);
    }

    function wrapWeirdo(uint256 _tokenId) public {
        address _owner = dadaNft.ownerOf(_tokenId);
        require(_owner == msg.sender, "!owner");

        dadaNft.transferFrom(msg.sender, address(this), _tokenId);

        (, , uint256 _assetId, , , , , , , ) = dadaNft.collectibleInfo(_tokenId);

        require(dadaNft.ownerOf(_tokenId) == address(this), "An error occured");

        // calculate new tokenId
        // 2019 assetId tokenId
        uint256 _wrappedTokenId = get2019TokenId(_assetId, _tokenId);

        
        require(!_exists(_wrappedTokenId), "minted");

        _mint(msg.sender, _wrappedTokenId);
        emit WrappedWeirdo(_assetId, _tokenId, _wrappedTokenId);
    }

    function unwrapWeirdo(uint256 _tokenId) public {
        // make sure wrapper owns this
        address _owner = dadaNft.ownerOf(_tokenId);
        require(_owner == address(this), "!owner");

        // Check if caller owns the drawing
        (, , uint256 _assetId, , , , , , , ) = dadaNft.collectibleInfo(_tokenId);
        uint256 _wrappedTokenId = get2019TokenId(_assetId, _tokenId);

        require(ownerOf(_wrappedTokenId) == msg.sender, "!owner");
        _burn(_wrappedTokenId);

        dadaNft.transferFrom(address(this), msg.sender, _tokenId);

        // Check if transfer succeeded
        // require(success);
        emit UnwrappedWeirdo(_assetId, _tokenId, _wrappedTokenId);
    }
}
