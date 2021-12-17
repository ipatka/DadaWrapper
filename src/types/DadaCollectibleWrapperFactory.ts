/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { DadaCollectibleWrapper } from "./DadaCollectibleWrapper";

export class DadaCollectibleWrapperFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    _dadaCollectibleAddress: string,
    _dadaNftAddress: string,
    baseURI_: string,
    _contractURI: string,
    overrides?: Overrides
  ): Promise<DadaCollectibleWrapper> {
    return super.deploy(
      _dadaCollectibleAddress,
      _dadaNftAddress,
      baseURI_,
      _contractURI,
      overrides || {}
    ) as Promise<DadaCollectibleWrapper>;
  }
  getDeployTransaction(
    _dadaCollectibleAddress: string,
    _dadaNftAddress: string,
    baseURI_: string,
    _contractURI: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(
      _dadaCollectibleAddress,
      _dadaNftAddress,
      baseURI_,
      _contractURI,
      overrides || {}
    );
  }
  attach(address: string): DadaCollectibleWrapper {
    return super.attach(address) as DadaCollectibleWrapper;
  }
  connect(signer: Signer): DadaCollectibleWrapperFactory {
    return super.connect(signer) as DadaCollectibleWrapperFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): DadaCollectibleWrapper {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as DadaCollectibleWrapper;
  }
}

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_dadaCollectibleAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_dadaNftAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "baseURI_",
        type: "string",
      },
      {
        internalType: "string",
        name: "_contractURI",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "drawingID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "printID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wrappedTokenId",
        type: "uint256",
      },
    ],
    name: "UnwrappedCreep",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wrappedTokenId",
        type: "uint256",
      },
    ],
    name: "UnwrappedWeirdo",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "drawingID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "printID",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wrappedTokenId",
        type: "uint256",
      },
    ],
    name: "WrappedCreep",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "wrappedTokenId",
        type: "uint256",
      },
    ],
    name: "WrappedWeirdo",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_drawingId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_printIndex",
        type: "uint256",
      },
    ],
    name: "get2017TokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_itemId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "get2019TokenId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "baseURI_",
        type: "string",
      },
    ],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_contractURI",
        type: "string",
      },
    ],
    name: "setContractURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_drawingId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_printIndex",
        type: "uint256",
      },
    ],
    name: "unwrapCreep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "unwrapWeirdo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_drawingId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_printIndex",
        type: "uint256",
      },
    ],
    name: "wrapCreep",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256",
      },
    ],
    name: "wrapWeirdo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162002b0238038062002b028339810160408190526200003491620002f1565b604080518082018252601a81527f577261707065642043726565707320616e642057656972646f7300000000000060208083019182528351808501909452600384526257435760e81b908401528151919291620000949160009162000183565b508051620000aa90600190602084019062000183565b505050620000c7620000c16200012d60201b60201c565b62000131565b600780546001600160a01b038087166001600160a01b031992831617909255600880549286169290911691909117905581516200010c90600990602085019062000183565b5080516200012290600a90602084019062000183565b5050505050620003d1565b3390565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b82805462000191906200037e565b90600052602060002090601f016020900481019282620001b5576000855562000200565b82601f10620001d057805160ff191683800117855562000200565b8280016001018555821562000200579182015b8281111562000200578251825591602001919060010190620001e3565b506200020e92915062000212565b5090565b5b808211156200020e576000815560010162000213565b80516001600160a01b03811681146200024157600080fd5b919050565b600082601f83011262000257578081fd5b81516001600160401b0380821115620002745762000274620003bb565b6040516020601f8401601f19168201810183811183821017156200029c576200029c620003bb565b6040528382528584018101871015620002b3578485fd5b8492505b83831015620002d65785830181015182840182015291820191620002b7565b83831115620002e757848185840101525b5095945050505050565b6000806000806080858703121562000307578384fd5b620003128562000229565b9350620003226020860162000229565b60408601519093506001600160401b03808211156200033f578384fd5b6200034d8883890162000246565b9350606087015191508082111562000363578283fd5b50620003728782880162000246565b91505092959194509250565b6002810460018216806200039357607f821691505b60208210811415620003b557634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b61272180620003e16000396000f3fe608060405234801561001057600080fd5b50600436106101735760003560e01c80636352211e116100de578063a22cb46511610097578063c87b56dd11610071578063c87b56dd1461031a578063e8a3d4851461032d578063e985e9c514610335578063f2fde38b1461034857610173565b8063a22cb465146102e1578063b7bf9b66146102f4578063b88d4fde1461030757610173565b80636352211e1461029057806370a08231146102a3578063715018a6146102b65780638da5cb5b146102be578063938e3d7b146102c657806395d89b41146102d957610173565b806323b872dd1161013057806323b872dd1461021e57806323bb0df71461023157806342842e0e146102445780634773457b146102575780634837d67b1461026a57806355f804b31461027d57610173565b806301ffc9a71461017857806304150daa146101a157806306fdde03146101b6578063081812fc146101cb578063095ea7b3146101eb57806312a9c7b3146101fe575b600080fd5b61018b610186366004611d7a565b61035b565b6040516101989190611ff8565b60405180910390f35b6101b46101af366004611e10565b6103a3565b005b6101be6104c6565b6040516101989190612003565b6101de6101d9366004611df8565b610558565b6040516101989190611f3c565b6101b46101f9366004611cbf565b61059b565b61021161020c366004611e10565b610633565b604051610198919061250f565b6101b461022c366004611bd5565b610664565b6101b461023f366004611df8565b61069c565b6101b4610252366004611bd5565b610966565b6101b4610265366004611df8565b610981565b610211610278366004611e10565b610c35565b6101b461028b366004611db2565b610c55565b6101de61029e366004611df8565b610cab565b6102116102b1366004611b65565b610ce0565b6101b4610d24565b6101de610d6f565b6101b46102d4366004611db2565b610d7e565b6101be610dd0565b6101b46102ef366004611c92565b610ddf565b6101b4610302366004611e10565b610df1565b6101b4610315366004611c15565b61110a565b6101be610328366004611df8565b611149565b6101be6111cb565b61018b610343366004611b9d565b611259565b6101b4610356366004611b65565b611287565b60006001600160e01b031982166380ac58cd60e01b148061038c57506001600160e01b03198216635b5e139f60e01b145b8061039b575061039b826112f8565b90505b919050565b60006103af8383610c35565b9050336103bb82610cab565b6001600160a01b0316146103ea5760405162461bcd60e51b81526004016103e1906124ef565b60405180910390fd5b6103f381611311565b6007546040516304ade6db60e11b81526000916001600160a01b03169063095bcdb69061042890339088908890600401611fb1565b602060405180830381600087803b15801561044257600080fd5b505af1158015610456573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061047a9190611cea565b90508061048657600080fd5b837f0b91d8325d34f3bfeef6af7d5e9cd25ca6f1355540b47ac03a81c41ae5e4e4e984846040516104b8929190612518565b60405180910390a250505050565b6060600080546104d590612606565b80601f016020809104026020016040519081016040528092919081815260200182805461050190612606565b801561054e5780601f106105235761010080835404028352916020019161054e565b820191906000526020600020905b81548152906001019060200180831161053157829003601f168201915b5050505050905090565b6000610563826113b8565b61057f5760405162461bcd60e51b81526004016103e1906122fb565b506000908152600460205260409020546001600160a01b031690565b60006105a682610cab565b9050806001600160a01b0316836001600160a01b031614156105da5760405162461bcd60e51b81526004016103e190612414565b806001600160a01b03166105ec6113d5565b6001600160a01b031614806106085750610608816103436113d5565b6106245760405162461bcd60e51b81526004016103e1906121d6565b61062e83836113d9565b505050565b600081610643620186a0856125a4565b6106539065125cd9c72c00612578565b61065d9190612578565b9392505050565b61067561066f6113d5565b82611447565b6106915760405162461bcd60e51b81526004016103e190612455565b61062e8383836114cc565b600854604051634e57770760e11b81526000916001600160a01b031690639caeee0e906106cd90859060040161250f565b60006040518083038186803b1580156106e557600080fd5b505afa1580156106f9573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f191682016040526107219190810190611e31565b505050505050505050905060006107388284610633565b90503361074482610cab565b6001600160a01b03161461076a5760405162461bcd60e51b81526004016103e1906124ef565b6008546040516331a9108f60e11b815230916001600160a01b031690636352211e9061079a90879060040161250f565b60206040518083038186803b1580156107b257600080fd5b505afa1580156107c6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107ea9190611b81565b6001600160a01b0316146108105760405162461bcd60e51b81526004016103e1906124ef565b61081981611311565b6008546040516323b872dd60e01b81526001600160a01b03909116906323b872dd9061084d90309033908890600401611f50565b600060405180830381600087803b15801561086757600080fd5b505af115801561087b573d6000803e3d6000fd5b50506008546040516331a9108f60e11b81523393506001600160a01b039091169150636352211e906108b190879060040161250f565b60206040518083038186803b1580156108c957600080fd5b505afa1580156108dd573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109019190611b81565b6001600160a01b0316146109275760405162461bcd60e51b81526004016103e1906124a6565b817f1fb176d369716bf4e05f09735eacc92f7c954c95da3144b24dc7c55f971662b88483604051610959929190612518565b60405180910390a2505050565b61062e8383836040518060200160405280600081525061110a565b6008546040516331a9108f60e11b815233916001600160a01b031690636352211e906109b190859060040161250f565b60206040518083038186803b1580156109c957600080fd5b505afa1580156109dd573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a019190611b81565b6001600160a01b031614610a275760405162461bcd60e51b81526004016103e1906124ef565b6008546040516323b872dd60e01b81526001600160a01b03909116906323b872dd90610a5b90339030908690600401611f50565b600060405180830381600087803b158015610a7557600080fd5b505af1158015610a89573d6000803e3d6000fd5b50506008546040516331a9108f60e11b81523093506001600160a01b039091169150636352211e90610abf90859060040161250f565b60206040518083038186803b158015610ad757600080fd5b505afa158015610aeb573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b0f9190611b81565b6001600160a01b031614610b355760405162461bcd60e51b81526004016103e1906121ac565b600854604051634e57770760e11b81526000916001600160a01b031690639caeee0e90610b6690859060040161250f565b60006040518083038186803b158015610b7e57600080fd5b505afa158015610b92573d6000803e3d6000fd5b505050506040513d6000823e601f3d908101601f19168201604052610bba9190810190611e31565b50505050505050505090506000610bd18284610633565b9050610bdc816113b8565b15610bf95760405162461bcd60e51b81526004016103e1906124cf565b610c0333826115f9565b817fd1758a9d42b100856bf7b75a9c182edd001588ccd66670d205389364b57453bf8483604051610959929190612518565b600081610c45620186a0856125a4565b6106539065125831af6400612578565b610c5d6113d5565b6001600160a01b0316610c6e610d6f565b6001600160a01b031614610c945760405162461bcd60e51b81526004016103e190612347565b8051610ca7906009906020840190611a4b565b5050565b6000818152600260205260408120546001600160a01b03168061039b5760405162461bcd60e51b81526004016103e19061227d565b60006001600160a01b038216610d085760405162461bcd60e51b81526004016103e190612233565b506001600160a01b031660009081526003602052604090205490565b610d2c6113d5565b6001600160a01b0316610d3d610d6f565b6001600160a01b031614610d635760405162461bcd60e51b81526004016103e190612347565b610d6d60006116d8565b565b6006546001600160a01b031690565b610d866113d5565b6001600160a01b0316610d97610d6f565b6001600160a01b031614610dbd5760405162461bcd60e51b81526004016103e190612347565b8051610ca790600a906020840190611a4b565b6060600180546104d590612606565b610ca7610dea6113d5565b838361172a565b600754604051635dc774d760e01b815233916001600160a01b031690635dc774d790610e2190859060040161250f565b602060405180830381600087803b158015610e3b57600080fd5b505af1158015610e4f573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e739190611b81565b6001600160a01b031614610e995760405162461bcd60e51b81526004016103e1906124ef565b60075460405163153d59d760e21b81526000916001600160a01b0316906354f5675c90610eca90859060040161250f565b60e060405180830381600087803b158015610ee457600080fd5b505af1158015610ef8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f1c9190611d06565b600754604051632767dd7d60e01b81529198506001600160a01b03169650632767dd7d9550610f5694508993508892506004019050612518565b600060405180830381600087803b158015610f7057600080fd5b505af1158015610f84573d6000803e3d6000fd5b5050600754604051630fb5cc6f60e21b81526001600160a01b039091169250633ed731bc9150610fbe903390879087908790600401611fd2565b600060405180830381600087803b158015610fd857600080fd5b505af1158015610fec573d6000803e3d6000fd5b5050600754604051635dc774d760e01b81523093506001600160a01b039091169150635dc774d79061102290869060040161250f565b602060405180830381600087803b15801561103c57600080fd5b505af1158015611050573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110749190611b81565b6001600160a01b03161461109a5760405162461bcd60e51b81526004016103e1906124a6565b60006110a68484610c35565b90506110b1816113b8565b156110ce5760405162461bcd60e51b81526004016103e1906124cf565b6110d833826115f9565b837fe9059f362d7c16ab8ddd5950a1fe31a0ece0211abb61f46a070f21e57eceb9d084836040516104b8929190612518565b61111b6111156113d5565b83611447565b6111375760405162461bcd60e51b81526004016103e190612455565b611143848484846117cd565b50505050565b6060611154826113b8565b6111705760405162461bcd60e51b81526004016103e1906123c5565b600061117a611800565b9050600081511161119a576040518060200160405280600081525061065d565b806111a48461180f565b6040516020016111b5929190611f0d565b6040516020818303038152906040529392505050565b600a80546111d890612606565b80601f016020809104026020016040519081016040528092919081815260200182805461120490612606565b80156112515780601f1061122657610100808354040283529160200191611251565b820191906000526020600020905b81548152906001019060200180831161123457829003601f168201915b505050505081565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b61128f6113d5565b6001600160a01b03166112a0610d6f565b6001600160a01b0316146112c65760405162461bcd60e51b81526004016103e190612347565b6001600160a01b0381166112ec5760405162461bcd60e51b81526004016103e190612068565b6112f5816116d8565b50565b6001600160e01b031981166301ffc9a760e01b14919050565b600061131c82610cab565b905061132a8160008461062e565b6113356000836113d9565b6001600160a01b038116600090815260036020526040812080546001929061135e9084906125c3565b909155505060008281526002602052604080822080546001600160a01b0319169055518391906001600160a01b038416907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908390a45050565b6000908152600260205260409020546001600160a01b0316151590565b3390565b600081815260046020526040902080546001600160a01b0319166001600160a01b038416908117909155819061140e82610cab565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000611452826113b8565b61146e5760405162461bcd60e51b81526004016103e190612160565b600061147983610cab565b9050806001600160a01b0316846001600160a01b031614806114b45750836001600160a01b03166114a984610558565b6001600160a01b0316145b806114c457506114c48185611259565b949350505050565b826001600160a01b03166114df82610cab565b6001600160a01b0316146115055760405162461bcd60e51b81526004016103e19061237c565b6001600160a01b03821661152b5760405162461bcd60e51b81526004016103e1906120e5565b61153683838361062e565b6115416000826113d9565b6001600160a01b038316600090815260036020526040812080546001929061156a9084906125c3565b90915550506001600160a01b0382166000908152600360205260408120805460019290611598908490612578565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b6001600160a01b03821661161f5760405162461bcd60e51b81526004016103e1906122c6565b611628816113b8565b156116455760405162461bcd60e51b81526004016103e1906120ae565b6116516000838361062e565b6001600160a01b038216600090815260036020526040812080546001929061167a908490612578565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b03861690811790915590518392907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef908290a45050565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b816001600160a01b0316836001600160a01b0316141561175c5760405162461bcd60e51b81526004016103e190612129565b6001600160a01b0383811660008181526005602090815260408083209487168084529490915290819020805460ff1916851515179055517f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31906117c0908590611ff8565b60405180910390a3505050565b6117d88484846114cc565b6117e48484848461192a565b6111435760405162461bcd60e51b81526004016103e190612016565b6060600980546104d590612606565b60608161183457506040805180820190915260018152600360fc1b602082015261039e565b8160005b811561185e578061184881612641565b91506118579050600a83612590565b9150611838565b60008167ffffffffffffffff81111561188757634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f1916602001820160405280156118b1576020820181803683370190505b5090505b84156114c4576118c66001836125c3565b91506118d3600a8661265c565b6118de906030612578565b60f81b81838151811061190157634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350611923600a86612590565b94506118b5565b600061193e846001600160a01b0316611a45565b15611a3a57836001600160a01b031663150b7a0261195a6113d5565b8786866040518563ffffffff1660e01b815260040161197c9493929190611f74565b602060405180830381600087803b15801561199657600080fd5b505af19250505080156119c6575060408051601f3d908101601f191682019092526119c391810190611d96565b60015b611a20573d8080156119f4576040519150601f19603f3d011682016040523d82523d6000602084013e6119f9565b606091505b508051611a185760405162461bcd60e51b81526004016103e190612016565b805181602001fd5b6001600160e01b031916630a85bd0160e11b1490506114c4565b506001949350505050565b3b151590565b828054611a5790612606565b90600052602060002090601f016020900481019282611a795760008555611abf565b82601f10611a9257805160ff1916838001178555611abf565b82800160010185558215611abf579182015b82811115611abf578251825591602001919060010190611aa4565b50611acb929150611acf565b5090565b5b80821115611acb5760008155600101611ad0565b6000611af7611af284612550565b612526565b9050828152838383011115611b0b57600080fd5b828260208301376000602084830101529392505050565b600082601f830112611b32578081fd5b8151611b40611af282612550565b818152846020838601011115611b54578283fd5b6114c48260208301602087016125da565b600060208284031215611b76578081fd5b813561065d816126b2565b600060208284031215611b92578081fd5b815161065d816126b2565b60008060408385031215611baf578081fd5b8235611bba816126b2565b91506020830135611bca816126b2565b809150509250929050565b600080600060608486031215611be9578081fd5b8335611bf4816126b2565b92506020840135611c04816126b2565b929592945050506040919091013590565b60008060008060808587031215611c2a578081fd5b8435611c35816126b2565b93506020850135611c45816126b2565b925060408501359150606085013567ffffffffffffffff811115611c67578182fd5b8501601f81018713611c77578182fd5b611c8687823560208401611ae4565b91505092959194509250565b60008060408385031215611ca4578182fd5b8235611caf816126b2565b91506020830135611bca816126c7565b60008060408385031215611cd1578182fd5b8235611cdc816126b2565b946020939093013593505050565b600060208284031215611cfb578081fd5b815161065d816126c7565b600080600080600080600060e0888a031215611d20578283fd5b8751611d2b816126c7565b8097505060208801519550604088015194506060880151611d4b816126b2565b608089015160a08a01519195509350611d63816126b2565b8092505060c0880151905092959891949750929550565b600060208284031215611d8b578081fd5b813561065d816126d5565b600060208284031215611da7578081fd5b815161065d816126d5565b600060208284031215611dc3578081fd5b813567ffffffffffffffff811115611dd9578182fd5b8201601f81018413611de9578182fd5b6114c484823560208401611ae4565b600060208284031215611e09578081fd5b5035919050565b60008060408385031215611e22578182fd5b50508035926020909101359150565b6000806000806000806000806000806101408b8d031215611e50578384fd5b8a51995060208b0151985060408b0151975060608b0151965060808b0151955060a08b0151945060c08b0151935060e08b015192506101008b015167ffffffffffffffff80821115611ea0578384fd5b611eac8e838f01611b22565b93506101208d0151915080821115611ec2578283fd5b50611ecf8d828e01611b22565b9150509295989b9194979a5092959850565b60008151808452611ef98160208601602086016125da565b601f01601f19169290920160200192915050565b60008351611f1f8184602088016125da565b835190830190611f338183602088016125da565b01949350505050565b6001600160a01b0391909116815260200190565b6001600160a01b039384168152919092166020820152604081019190915260600190565b6001600160a01b0385811682528416602082015260408101839052608060608201819052600090611fa790830184611ee1565b9695505050505050565b6001600160a01b039390931683526020830191909152604082015260600190565b6001600160a01b0394909416845260208401929092526040830152606082015260800190565b901515815260200190565b60006020825261065d6020830184611ee1565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526026908201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160408201526564647265737360d01b606082015260800190565b6020808252601c908201527f4552433732313a20746f6b656e20616c7265616479206d696e74656400000000604082015260600190565b60208082526024908201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646040820152637265737360e01b606082015260800190565b60208082526019908201527f4552433732313a20617070726f766520746f2063616c6c657200000000000000604082015260600190565b6020808252602c908201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860408201526b34b9ba32b73a103a37b5b2b760a11b606082015260800190565b60208082526010908201526f105b88195c9c9bdc881bd8d8dd5c995960821b604082015260600190565b60208082526038908201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760408201527f6e6572206e6f7220617070726f76656420666f7220616c6c0000000000000000606082015260800190565b6020808252602a908201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604082015269726f206164647265737360b01b606082015260800190565b60208082526029908201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460408201526832b73a103a37b5b2b760b91b606082015260800190565b6020808252818101527f4552433732313a206d696e7420746f20746865207a65726f2061646472657373604082015260600190565b6020808252602c908201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860408201526b34b9ba32b73a103a37b5b2b760a11b606082015260800190565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b60208082526029908201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960408201526839903737ba1037bbb760b91b606082015260800190565b6020808252602f908201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60408201526e3732bc34b9ba32b73a103a37b5b2b760891b606082015260800190565b60208082526021908201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656040820152603960f91b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b6020808252600f908201526e1d1c985b9cd9995c8819985a5b1959608a1b604082015260600190565b6020808252600690820152651b5a5b9d195960d21b604082015260600190565b60208082526006908201526510b7bbb732b960d11b604082015260600190565b90815260200190565b918252602082015260400190565b60405181810167ffffffffffffffff811182821017156125485761254861269c565b604052919050565b600067ffffffffffffffff82111561256a5761256a61269c565b50601f01601f191660200190565b6000821982111561258b5761258b612670565b500190565b60008261259f5761259f612686565b500490565b60008160001904831182151516156125be576125be612670565b500290565b6000828210156125d5576125d5612670565b500390565b60005b838110156125f55781810151838201526020016125dd565b838111156111435750506000910152565b60028104600182168061261a57607f821691505b6020821081141561263b57634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561265557612655612670565b5060010190565b60008261266b5761266b612686565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03811681146112f557600080fd5b80151581146112f557600080fd5b6001600160e01b0319811681146112f557600080fdfea264697066735822122001d5358db417c3b9d96a820f3b934a8712e49142cff71dd347b5405dc582953464736f6c63430008000033";
