/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Erc721Metadata } from "./Erc721Metadata";

export class Erc721MetadataFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    name: string,
    symbol: string,
    overrides?: Overrides
  ): Promise<Erc721Metadata> {
    return super.deploy(
      name,
      symbol,
      overrides || {}
    ) as Promise<Erc721Metadata>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  attach(address: string): Erc721Metadata {
    return super.attach(address) as Erc721Metadata;
  }
  connect(signer: Signer): Erc721MetadataFactory {
    return super.connect(signer) as Erc721MetadataFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Erc721Metadata {
    return new Contract(address, _abi, signerOrProvider) as Erc721Metadata;
  }
}

const _abi = [
  {
    constant: true,
    inputs: [
      {
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "to",
        type: "address",
      },
      {
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "from",
        type: "address",
      },
      {
        name: "to",
        type: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
      },
      {
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        name: "name",
        type: "string",
      },
      {
        name: "symbol",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        name: "to",
        type: "address",
      },
      {
        indexed: true,
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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
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
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040516200100738038062001007833981018060405260408110156200003757600080fd5b8101908080516401000000008111156200005057600080fd5b820160208101848111156200006457600080fd5b81516401000000008111828201871017156200007f57600080fd5b505092919060200180516401000000008111156200009c57600080fd5b82016020810184811115620000b057600080fd5b8151640100000000811182820187101715620000cb57600080fd5b509093506200010892507f01ffc9a700000000000000000000000000000000000000000000000000000000915050640100000000620001a4810204565b6200013c7f80ac58cd00000000000000000000000000000000000000000000000000000000640100000000620001a4810204565b81516200015190600590602085019062000211565b5080516200016790600690602084019062000211565b506200019c7f5b5e139f00000000000000000000000000000000000000000000000000000000640100000000620001a4810204565b5050620002b6565b7fffffffff000000000000000000000000000000000000000000000000000000008082161415620001d457600080fd5b7fffffffff00000000000000000000000000000000000000000000000000000000166000908152602081905260409020805460ff19166001179055565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200025457805160ff191683800117855562000284565b8280016001018555821562000284579182015b828111156200028457825182559160200191906001019062000267565b506200029292915062000296565b5090565b620002b391905b808211156200029257600081556001016200029d565b90565b610d4180620002c66000396000f3fe6080604052600436106100df576000357c0100000000000000000000000000000000000000000000000000000000900480636352211e1161009c578063a22cb46511610076578063a22cb4651461033c578063b88d4fde14610377578063c87b56dd1461043d578063e985e9c514610467576100df565b80636352211e146102b857806370a08231146102e257806395d89b4114610327576100df565b806301ffc9a7146100e457806306fdde0314610141578063081812fc146101cb578063095ea7b31461021157806323b872dd1461024c57806342842e0e14610282575b600080fd5b3480156100f057600080fd5b5061012d6004803603602081101561010757600080fd5b50357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166104a2565b604080519115158252519081900360200190f35b34801561014d57600080fd5b506101566104d6565b6040805160208082528351818301528351919283929083019185019080838360005b83811015610190578181015183820152602001610178565b50505050905090810190601f1680156101bd5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b3480156101d757600080fd5b506101f5600480360360208110156101ee57600080fd5b503561056c565b60408051600160a060020a039092168252519081900360200190f35b34801561021d57600080fd5b5061024a6004803603604081101561023457600080fd5b50600160a060020a03813516906020013561059e565b005b61024a6004803603606081101561026257600080fd5b50600160a060020a03813581169160208101359091169060400135610654565b61024a6004803603606081101561029857600080fd5b50600160a060020a038135811691602081013590911690604001356106e2565b3480156102c457600080fd5b506101f5600480360360208110156102db57600080fd5b5035610703565b3480156102ee57600080fd5b506103156004803603602081101561030557600080fd5b5035600160a060020a031661072d565b60408051918252519081900360200190f35b34801561033357600080fd5b50610156610760565b34801561034857600080fd5b5061024a6004803603604081101561035f57600080fd5b50600160a060020a03813516906020013515156107c1565b61024a6004803603608081101561038d57600080fd5b600160a060020a038235811692602081013590911691604082013591908101906080810160608201356401000000008111156103c857600080fd5b8201836020820111156103da57600080fd5b803590602001918460018302840111640100000000831117156103fc57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610845945050505050565b34801561044957600080fd5b506101566004803603602081101561046057600080fd5b503561086d565b34801561047357600080fd5b5061012d6004803603604081101561048a57600080fd5b50600160a060020a0381358116916020013516610922565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191660009081526020819052604090205460ff1690565b60058054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156105625780601f1061053757610100808354040283529160200191610562565b820191906000526020600020905b81548152906001019060200180831161054557829003601f168201915b5050505050905090565b600061057782610950565b151561058257600080fd5b50600090815260026020526040902054600160a060020a031690565b60006105a982610703565b9050600160a060020a0383811690821614156105c457600080fd5b33600160a060020a03821614806105e057506105e08133610922565b15156105eb57600080fd5b600082815260026020526040808220805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b61065e338261096d565b151561066957600080fd5b600160a060020a038216151561067e57600080fd5b61068883826109cc565b6106928382610a3d565b61069c8282610ad3565b8082600160a060020a031684600160a060020a03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b6106fe8383836020604051908101604052806000815250610845565b505050565b600081815260016020526040812054600160a060020a031680151561072757600080fd5b92915050565b6000600160a060020a038216151561074457600080fd5b50600160a060020a031660009081526003602052604090205490565b60068054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156105625780601f1061053757610100808354040283529160200191610562565b600160a060020a0382163314156107d757600080fd5b336000818152600460209081526040808320600160a060020a03871680855290835292819020805460ff1916861515908117909155815190815290519293927f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31929181900390910190a35050565b610850848484610654565b61085c84848484610b63565b151561086757600080fd5b50505050565b606061087882610950565b151561088357600080fd5b60008281526007602090815260409182902080548351601f6002600019610100600186161502019093169290920491820184900484028101840190945280845290918301828280156109165780601f106108eb57610100808354040283529160200191610916565b820191906000526020600020905b8154815290600101906020018083116108f957829003601f168201915b50505050509050919050565b600160a060020a03918216600090815260046020908152604080832093909416825291909152205460ff1690565b600090815260016020526040902054600160a060020a0316151590565b60008061097983610703565b905080600160a060020a031684600160a060020a031614806109b4575083600160a060020a03166109a98461056c565b600160a060020a0316145b806109c457506109c48185610922565b949350505050565b81600160a060020a03166109df82610703565b600160a060020a0316146109f257600080fd5b600081815260026020526040902054600160a060020a031615610a39576000818152600260205260409020805473ffffffffffffffffffffffffffffffffffffffff191690555b5050565b81600160a060020a0316610a5082610703565b600160a060020a031614610a6357600080fd5b600160a060020a038216600090815260036020526040902054610a8d90600163ffffffff610cdf16565b600160a060020a03909216600090815260036020908152604080832094909455918152600190915220805473ffffffffffffffffffffffffffffffffffffffff19169055565b600081815260016020526040902054600160a060020a031615610af557600080fd5b6000818152600160208181526040808420805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0388169081179091558452600390915290912054610b4391610cf4565b600160a060020a0390921660009081526003602052604090209190915550565b6000610b7784600160a060020a0316610d0d565b1515610b85575060016109c4565b6040517f150b7a020000000000000000000000000000000000000000000000000000000081523360048201818152600160a060020a03888116602485015260448401879052608060648501908152865160848601528651600095928a169463150b7a029490938c938b938b939260a4019060208501908083838e5b83811015610c18578181015183820152602001610c00565b50505050905090810190601f168015610c455780820380516001836020036101000a031916815260200191505b5095505050505050602060405180830381600087803b158015610c6757600080fd5b505af1158015610c7b573d6000803e3d6000fd5b505050506040513d6020811015610c9157600080fd5b50517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167f150b7a020000000000000000000000000000000000000000000000000000000014915050949350505050565b600082821115610cee57600080fd5b50900390565b600082820183811015610d0657600080fd5b9392505050565b6000903b119056fea165627a7a72305820bf0c00fc7564a53e31629f346c7d4fcb6bc4734a8aa8d35d2bc8e1d84f8965620029";