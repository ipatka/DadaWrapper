pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "../fixtures/modifiedOz/Dada721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

contract MockDadaNFT is Dada721{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() public Dada721("AnyNFT", "ANFT") {}

    mapping(uint256 => uint256) public tokenToItem;

    function mintItem(
        address to,
        uint256 itemId
    ) public returns (uint256) {
        _tokenIds.increment();

        uint256 id = _tokenIds.current();
        _mint(to, id);
        tokenToItem[id] = itemId;

        return id;
    }

    function collectibleInfo(uint256 _collectibleId)
        external
        view
        override
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
        )
    {
        require(_exists(_collectibleId));
        return (tokenToItem[_collectibleId], 0, 0, 0, 0, 0, 0, 0, "", "");
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable override {
        super.transferFrom(from, to, tokenId);
    }
}
