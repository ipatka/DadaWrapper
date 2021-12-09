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
    IDadaCollectible dadaCollectible; /*2017 ERC20 collection contract*/

    IDada721 dadaNft; /*2019 ERC721 collection contract*/

    mapping(uint256 => uint256) public _tokenIDToDrawingID;

    string private _baseTokenURI; /*URI where metadata for all tokens is stored*/

    string public contractURI; /*contractURI contract metadata json*/

    uint256 constant PREFIX_2017 = 20170000000000; /*Prefix for 14 digit token IDs*/
    uint256 constant PREFIX_2019 = 20190000000000; /*Prefix for 14 digit token IDs*/
    uint256 constant DRAWING_ASSET_ID_MUL = 100000; /*Multiplier to shift middle identifier*/

    event WrappedCreep(
        uint256 indexed drawingID,
        uint256 printID,
        uint256 wrappedTokenId
    );
    event UnwrappedCreep(
        uint256 indexed drawingID,
        uint256 printID,
        uint256 wrappedTokenId
    );

    event WrappedWeirdo(
        uint256 indexed itemId,
        uint256 tokenId,
        uint256 wrappedTokenId
    );
    event UnwrappedWeirdo(
        uint256 indexed itemId,
        uint256 tokenId,
        uint256 wrappedTokenId
    );

    /// @notice Initialize connections to external contracts and set the contract metadata
    /// @param _dadaCollectibleAddress Address of 2017 ERC20
    /// @param _dadaNftAddress Address of 2019 ERC721
    /// @param baseURI_ Prefix for all metadata storage
    /// @param _contractURI Location of metadata.json
    constructor(
        address _dadaCollectibleAddress,
        address _dadaNftAddress,
        string memory baseURI_,
        string memory _contractURI
    ) ERC721("Wrapped Creeps and Weirdos", "WCW") {
        dadaCollectible = IDadaCollectible(_dadaCollectibleAddress); /*Set interface to 2017 contract*/
        dadaNft = IDada721(_dadaNftAddress); /*Set interface to 2019 contract*/
        _baseTokenURI = baseURI_; /*Set initial base URI*/
        contractURI = _contractURI; /*Set initial contract URI*/
    }

    /*****************
    Public wrapping and unwrapping
    *****************/
    /// @notice Transfer a 2017 ERC20 to this contract and receive an NFT in return
    /// @dev Must call `offerCollectibleForSaleToAddress` with a 0 value purchase price offered to this contract address
    /// @param _drawingId 2017 ERC20 drawing ID
    /// @param _printIndex 2017 ERC20 print index
    function wrapCreep(uint256 _drawingId, uint256 _printIndex) public {
        require(
            dadaCollectible.DrawingPrintToAddress(_printIndex) == msg.sender,
            "!owner"
        ); /* Ensure sender owns the token they are trying to wrap*/

        dadaCollectible.buyCollectible(_drawingId, _printIndex); /*Transfer the ERC20 into this contract*/

        require(
            dadaCollectible.DrawingPrintToAddress(_printIndex) == address(this),
            "transfer failed"
        ); /*Ensure transfer succeeded*/

        uint256 _wrappedTokenId = get2017TokenId(_drawingId, _printIndex); /*Calculate new token ID*/

        require(!_exists(_wrappedTokenId), "minted"); /*Ensure this token has not been wrapped - should be unreachable*/

        _mint(msg.sender, _wrappedTokenId); /*Mint newly wrapped token to sender*/
        emit WrappedCreep(_drawingId, _printIndex, _wrappedTokenId);
    }

    /// @notice Transfer a wrapped 2017 ERC20 and receive the original ERC20 out
    /// @dev Burns the wrapped token, but it can be minted again if the same token is wrapped
    /// @param _drawingId 2017 ERC20 drawing ID
    /// @param _printIndex 2017 ERC20 print index
    function unwrapCreep(uint256 _drawingId, uint256 _printIndex) public {
        uint256 _wrappedTokenId = get2017TokenId(_drawingId, _printIndex); /*Encode drawing and print into token ID*/
        require(ownerOf(_wrappedTokenId) == msg.sender, "!owner"); /*Ensure sender owns the NFT they want to unwrap*/
        _burn(_wrappedTokenId); /*Send token to 0 address - can be re-minted later if re-wrapped*/

        bool success = dadaCollectible.transfer(
            msg.sender,
            _drawingId,
            _printIndex
        ); /*Send the original token to sender*/

        require(success); /*Ensure transfer was successful*/
        emit UnwrappedCreep(_drawingId, _printIndex, _wrappedTokenId);
    }

    /// @notice Transfer a 2019 ERC721 to this contract and receive an NFT in return
    /// @dev Must call approve on this contract for specified token ID
    /// @param _tokenId 2019 ERC721 token ID
    function wrapWeirdo(uint256 _tokenId) public {
        require(dadaNft.ownerOf(_tokenId) == msg.sender, "!owner"); /* Ensure sender owns the token they are trying to wrap*/

        dadaNft.transferFrom(msg.sender, address(this), _tokenId); /*Transfer ERC721 into this contract*/
        require(dadaNft.ownerOf(_tokenId) == address(this), "An error occured"); /*Ensure transfer was successful*/

        (uint256 _itemId, , , , , , , , , ) = dadaNft.collectibleInfo(_tokenId); /*Fetch unique item ID to identify this drawing*/

        uint256 _wrappedTokenId = get2019TokenId(_itemId, _tokenId); /*Encode item and token into new token ID*/

        require(!_exists(_wrappedTokenId), "minted"); /*Ensure this token has not been wrapped - should be unreacheable*/

        _mint(msg.sender, _wrappedTokenId); /*Mint newly wrapped token to sender*/
        emit WrappedWeirdo(_itemId, _tokenId, _wrappedTokenId);
    }

    /// @notice Transfer a wrapped 2019 ERC721 and receive the original ERC721 out
    /// @dev Burns the wrapped token, but it can be minted again if the same token is wrapped
    /// @param _tokenId 2019 ERC721 token ID
    function unwrapWeirdo(uint256 _tokenId) public {
        (uint256 _itemId, , , , , , , , , ) = dadaNft.collectibleInfo(_tokenId); /*Fetch unique item ID to identify this drawing*/
        uint256 _wrappedTokenId = get2019TokenId(_itemId, _tokenId); /*Enocde item and token into new token ID*/
        require(ownerOf(_wrappedTokenId) == msg.sender, "!owner"); /*Ensure sender owns the "NFT they want to unwrap*/

        require(dadaNft.ownerOf(_tokenId) == address(this), "!owner"); /*Ensure original token is still owned by this contract - should be unreachable*/

        _burn(_wrappedTokenId); /*Send token to 0 address - can be re-minted later if re-wrapped*/

        dadaNft.transferFrom(address(this), msg.sender, _tokenId); /*Send original token to sender*/

        require(dadaNft.ownerOf(_tokenId) == msg.sender, "transfer failed"); /*Ensure transfer succeeded - should be unreachable*/

        emit UnwrappedWeirdo(_itemId, _tokenId, _wrappedTokenId);
    }

    /*****************
    Helpers
    *****************/
    /// @notice Internal helper to get base URI and conform to spec
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /// @notice Helper to encode the wrapped 2017 token ID
    function get2017TokenId(uint256 _drawingId, uint256 _printIndex)
        public
        pure
        returns (uint256)
    {
        return PREFIX_2017 + (_drawingId * DRAWING_ASSET_ID_MUL) + _printIndex;
    }

    /// @notice Helper to encode the wrapped 2019 token ID
    function get2019TokenId(uint256 _itemId, uint256 _tokenId)
        public
        pure
        returns (uint256)
    {
        return PREFIX_2019 + (_itemId * DRAWING_ASSET_ID_MUL) + _tokenId;
    }

    /*****************
    External interfaces
    *****************/
    /// @notice Public way to view the metadata for any token
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

    /*****************
    Admin configs
    *****************/
    /// @notice Set new base URI
    /// @param baseURI_ URI prefix for tokens
    function setBaseURI(string memory baseURI_) public onlyOwner {
        _baseTokenURI = baseURI_;
    }

    /// @notice Set new contract URI
    /// @param _contractURI Contract metadata json
    function setContractURI(string memory _contractURI) external onlyOwner {
        contractURI = _contractURI;
    }
}
