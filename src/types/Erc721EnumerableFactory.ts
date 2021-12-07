/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Erc721Enumerable } from "./Erc721Enumerable";

export class Erc721EnumerableFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides): Promise<Erc721Enumerable> {
    return super.deploy(overrides || {}) as Promise<Erc721Enumerable>;
  }
  getDeployTransaction(overrides?: Overrides): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Erc721Enumerable {
    return super.attach(address) as Erc721Enumerable;
  }
  connect(signer: Signer): Erc721EnumerableFactory {
    return super.connect(signer) as Erc721EnumerableFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Erc721Enumerable {
    return new Contract(address, _abi, signerOrProvider) as Erc721Enumerable;
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
    constant: true,
    inputs: [],
    name: "totalSupply",
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
    constant: true,
    inputs: [
      {
        name: "owner",
        type: "address",
      },
      {
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenOfOwnerByIndex",
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
        name: "index",
        type: "uint256",
      },
    ],
    name: "tokenByIndex",
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
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "tokensOf",
    outputs: [
      {
        name: "",
        type: "uint256[]",
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
    inputs: [],
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
  "0x608060405234801561001057600080fd5b506100437f01ffc9a7000000000000000000000000000000000000000000000000000000006401000000006100ac810204565b6100757f80ac58cd000000000000000000000000000000000000000000000000000000006401000000006100ac810204565b6100a77f780e9d63000000000000000000000000000000000000000000000000000000006401000000006100ac810204565b610118565b7fffffffff0000000000000000000000000000000000000000000000000000000080821614156100db57600080fd5b7fffffffff00000000000000000000000000000000000000000000000000000000166000908152602081905260409020805460ff19166001179055565b610e5c806101276000396000f3fe6080604052600436106100fa576000357c0100000000000000000000000000000000000000000000000000000000900480634f6ccce71161009c57806370a082311161007657806370a0823114610380578063a22cb465146103b3578063b88d4fde146103ee578063e985e9c5146104b4576100fa565b80634f6ccce7146102a95780635a3f2672146102d35780636352211e14610356576100fa565b806318160ddd116100d857806318160ddd146101dd57806323b872dd146102045780632f745c591461023a57806342842e0e14610273576100fa565b806301ffc9a7146100ff578063081812fc1461015c578063095ea7b3146101a2575b600080fd5b34801561010b57600080fd5b506101486004803603602081101561012257600080fd5b50357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166104ef565b604080519115158252519081900360200190f35b34801561016857600080fd5b506101866004803603602081101561017f57600080fd5b5035610523565b60408051600160a060020a039092168252519081900360200190f35b3480156101ae57600080fd5b506101db600480360360408110156101c557600080fd5b50600160a060020a038135169060200135610555565b005b3480156101e957600080fd5b506101f261060b565b60408051918252519081900360200190f35b6101db6004803603606081101561021a57600080fd5b50600160a060020a03813581169160208101359091169060400135610612565b34801561024657600080fd5b506101f26004803603604081101561025d57600080fd5b50600160a060020a0381351690602001356106a0565b6101db6004803603606081101561028957600080fd5b50600160a060020a038135811691602081013590911690604001356106ed565b3480156102b557600080fd5b506101f2600480360360208110156102cc57600080fd5b503561070e565b3480156102df57600080fd5b50610306600480360360208110156102f657600080fd5b5035600160a060020a0316610743565b60408051602080825283518183015283519192839290830191858101910280838360005b8381101561034257818101518382015260200161032a565b505050509050019250505060405180910390f35b34801561036257600080fd5b506101866004803603602081101561037957600080fd5b50356107af565b34801561038c57600080fd5b506101f2600480360360208110156103a357600080fd5b5035600160a060020a03166107d9565b3480156103bf57600080fd5b506101db600480360360408110156103d657600080fd5b50600160a060020a038135169060200135151561080c565b6101db6004803603608081101561040457600080fd5b600160a060020a0382358116926020810135909116916040820135919081019060808101606082013564010000000081111561043f57600080fd5b82018360208201111561045157600080fd5b8035906020019184600183028401116401000000008311171561047357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610890945050505050565b3480156104c057600080fd5b50610148600480360360408110156104d757600080fd5b50600160a060020a03813581169160200135166108b8565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191660009081526020819052604090205460ff1690565b600061052e826108e6565b151561053957600080fd5b50600090815260026020526040902054600160a060020a031690565b6000610560826107af565b9050600160a060020a03838116908216141561057b57600080fd5b33600160a060020a0382161480610597575061059781336108b8565b15156105a257600080fd5b600082815260026020526040808220805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b6007545b90565b61061c3382610903565b151561062757600080fd5b600160a060020a038216151561063c57600080fd5b6106468382610962565b61065083826109d3565b61065a8282610ad5565b8082600160a060020a031684600160a060020a03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b60006106ab836107d9565b82106106b657600080fd5b600160a060020a03831660009081526005602052604090208054839081106106da57fe5b9060005260206000200154905092915050565b6107098383836020604051908101604052806000815250610890565b505050565b600061071861060b565b821061072357600080fd5b600780548390811061073157fe5b90600052602060002001549050919050565b600160a060020a0381166000908152600560209081526040918290208054835181840281018401909452808452606093928301828280156107a357602002820191906000526020600020905b81548152602001906001019080831161078f575b50505050509050919050565b600081815260016020526040812054600160a060020a03168015156107d357600080fd5b92915050565b6000600160a060020a03821615156107f057600080fd5b50600160a060020a031660009081526003602052604090205490565b600160a060020a03821633141561082257600080fd5b336000818152600460209081526040808320600160a060020a03871680855290835292819020805460ff1916861515908117909155815190815290519293927f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31929181900390910190a35050565b61089b848484610612565b6108a784848484610b1b565b15156108b257600080fd5b50505050565b600160a060020a03918216600090815260046020908152604080832093909416825291909152205460ff1690565b600090815260016020526040902054600160a060020a0316151590565b60008061090f836107af565b905080600160a060020a031684600160a060020a0316148061094a575083600160a060020a031661093f84610523565b600160a060020a0316145b8061095a575061095a81856108b8565b949350505050565b81600160a060020a0316610975826107af565b600160a060020a03161461098857600080fd5b600081815260026020526040902054600160a060020a0316156109cf576000818152600260205260409020805473ffffffffffffffffffffffffffffffffffffffff191690555b5050565b6109dd8282610c97565b600081815260066020908152604080832054600160a060020a03861684526005909252822054909190610a1790600163ffffffff610d2d16565b600160a060020a03851660009081526005602052604081208054929350909183908110610a4057fe5b90600052602060002001549050806005600087600160a060020a0316600160a060020a0316815260200190815260200160002084815481101515610a8057fe5b6000918252602080832090910192909255600160a060020a0387168152600590915260409020805490610ab7906000198301610df3565b50600093845260066020526040808520859055908452909220555050565b610adf8282610d42565b600160a060020a039091166000908152600560209081526040808320805460018101825590845282842081018590559383526006909152902055565b6000610b2f84600160a060020a0316610dd2565b1515610b3d5750600161095a565b6040517f150b7a020000000000000000000000000000000000000000000000000000000081523360048201818152600160a060020a03888116602485015260448401879052608060648501908152865160848601528651600095928a169463150b7a029490938c938b938b939260a4019060208501908083838e5b83811015610bd0578181015183820152602001610bb8565b50505050905090810190601f168015610bfd5780820380516001836020036101000a031916815260200191505b5095505050505050602060405180830381600087803b158015610c1f57600080fd5b505af1158015610c33573d6000803e3d6000fd5b505050506040513d6020811015610c4957600080fd5b50517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167f150b7a020000000000000000000000000000000000000000000000000000000014915050949350505050565b81600160a060020a0316610caa826107af565b600160a060020a031614610cbd57600080fd5b600160a060020a038216600090815260036020526040902054610ce790600163ffffffff610d2d16565b600160a060020a03909216600090815260036020908152604080832094909455918152600190915220805473ffffffffffffffffffffffffffffffffffffffff19169055565b600082821115610d3c57600080fd5b50900390565b600081815260016020526040902054600160a060020a031615610d6457600080fd5b6000818152600160208181526040808420805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0388169081179091558452600390915290912054610db291610dda565b600160a060020a0390921660009081526003602052604090209190915550565b6000903b1190565b600082820183811015610dec57600080fd5b9392505050565b8154818355818111156107095760008381526020902061070991810190830161060f91905b80821115610e2c5760008155600101610e18565b509056fea165627a7a72305820886f2a926f840ada628500b585f265e7baf46dbef2363fcefb665a6a5a02823d0029";