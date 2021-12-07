pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "../fixtures/modifiedOz/Dada721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721


contract AnyNFT is Dada721 {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() public Dada721("AnyNFT", "ANFT") {
  }

  function mintItem(address to, string memory tokenURI)
      public
      returns (uint256)
  {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(to, id);

      return id;
  }
  
  function transferFrom(address from, address to, uint256 tokenId) public payable override{
    super.transferFrom(from, to, tokenId);
  }
}
