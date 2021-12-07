/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { Contract, ContractFactory, Overrides } from "@ethersproject/contracts";

import type { Erc721Full } from "./Erc721Full";

export class Erc721FullFactory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    name: string,
    symbol: string,
    overrides?: Overrides
  ): Promise<Erc721Full> {
    return super.deploy(name, symbol, overrides || {}) as Promise<Erc721Full>;
  }
  getDeployTransaction(
    name: string,
    symbol: string,
    overrides?: Overrides
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  attach(address: string): Erc721Full {
    return super.attach(address) as Erc721Full;
  }
  connect(signer: Signer): Erc721FullFactory {
    return super.connect(signer) as Erc721FullFactory;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Erc721Full {
    return new Contract(address, _abi, signerOrProvider) as Erc721Full;
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
  "0x60806040523480156200001157600080fd5b50604051620013e7380380620013e7833981018060405260408110156200003757600080fd5b8101908080516401000000008111156200005057600080fd5b820160208101848111156200006457600080fd5b81516401000000008111828201871017156200007f57600080fd5b505092919060200180516401000000008111156200009c57600080fd5b82016020810184811115620000b057600080fd5b8151640100000000811182820187101715620000cb57600080fd5b509093508492508391506200010b90507f01ffc9a700000000000000000000000000000000000000000000000000000000640100000000620001dd810204565b6200013f7f80ac58cd00000000000000000000000000000000000000000000000000000000640100000000620001dd810204565b620001737f780e9d6300000000000000000000000000000000000000000000000000000000640100000000620001dd810204565b8151620001889060099060208501906200024a565b5080516200019e90600a9060208401906200024a565b50620001d37f5b5e139f00000000000000000000000000000000000000000000000000000000640100000000620001dd810204565b50505050620002ef565b7fffffffff0000000000000000000000000000000000000000000000000000000080821614156200020d57600080fd5b7fffffffff00000000000000000000000000000000000000000000000000000000166000908152602081905260409020805460ff19166001179055565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200028d57805160ff1916838001178555620002bd565b82800160010185558215620002bd579182015b82811115620002bd578251825591602001919060010190620002a0565b50620002cb929150620002cf565b5090565b620002ec91905b80821115620002cb5760008155600101620002d6565b90565b6110e880620002ff6000396000f3fe60806040526004361061011b576000357c0100000000000000000000000000000000000000000000000000000000900480634f6ccce7116100b257806395d89b411161008157806395d89b411461045e578063a22cb46514610473578063b88d4fde146104ae578063c87b56dd14610574578063e985e9c51461059e5761011b565b80634f6ccce7146103545780635a3f26721461037e5780636352211e1461040157806370a082311461042b5761011b565b806318160ddd116100ee57806318160ddd1461028857806323b872dd146102af5780632f745c59146102e557806342842e0e1461031e5761011b565b806301ffc9a71461012057806306fdde031461017d578063081812fc14610207578063095ea7b31461024d575b600080fd5b34801561012c57600080fd5b506101696004803603602081101561014357600080fd5b50357bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166105d9565b604080519115158252519081900360200190f35b34801561018957600080fd5b5061019261060d565b6040805160208082528351818301528351919283929083019185019080838360005b838110156101cc5781810151838201526020016101b4565b50505050905090810190601f1680156101f95780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561021357600080fd5b506102316004803603602081101561022a57600080fd5b50356106a4565b60408051600160a060020a039092168252519081900360200190f35b34801561025957600080fd5b506102866004803603604081101561027057600080fd5b50600160a060020a0381351690602001356106d6565b005b34801561029457600080fd5b5061029d61078c565b60408051918252519081900360200190f35b610286600480360360608110156102c557600080fd5b50600160a060020a03813581169160208101359091169060400135610792565b3480156102f157600080fd5b5061029d6004803603604081101561030857600080fd5b50600160a060020a038135169060200135610820565b6102866004803603606081101561033457600080fd5b50600160a060020a0381358116916020810135909116906040013561086d565b34801561036057600080fd5b5061029d6004803603602081101561037757600080fd5b503561088e565b34801561038a57600080fd5b506103b1600480360360208110156103a157600080fd5b5035600160a060020a03166108c3565b60408051602080825283518183015283519192839290830191858101910280838360005b838110156103ed5781810151838201526020016103d5565b505050509050019250505060405180910390f35b34801561040d57600080fd5b506102316004803603602081101561042457600080fd5b503561092f565b34801561043757600080fd5b5061029d6004803603602081101561044e57600080fd5b5035600160a060020a0316610959565b34801561046a57600080fd5b5061019261098c565b34801561047f57600080fd5b506102866004803603604081101561049657600080fd5b50600160a060020a03813516906020013515156109ed565b610286600480360360808110156104c457600080fd5b600160a060020a038235811692602081013590911691604082013591908101906080810160608201356401000000008111156104ff57600080fd5b82018360208201111561051157600080fd5b8035906020019184600183028401116401000000008311171561053357600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610a71945050505050565b34801561058057600080fd5b506101926004803603602081101561059757600080fd5b5035610a99565b3480156105aa57600080fd5b50610169600480360360408110156105c157600080fd5b50600160a060020a0381358116916020013516610b44565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191660009081526020819052604090205460ff1690565b60098054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156106995780601f1061066e57610100808354040283529160200191610699565b820191906000526020600020905b81548152906001019060200180831161067c57829003601f168201915b505050505090505b90565b60006106af82610b72565b15156106ba57600080fd5b50600090815260026020526040902054600160a060020a031690565b60006106e18261092f565b9050600160a060020a0383811690821614156106fc57600080fd5b33600160a060020a038216148061071857506107188133610b44565b151561072357600080fd5b600082815260026020526040808220805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0387811691821790925591518593918516917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591a4505050565b60075490565b61079c3382610b8f565b15156107a757600080fd5b600160a060020a03821615156107bc57600080fd5b6107c68382610bee565b6107d08382610c5f565b6107da8282610d61565b8082600160a060020a031684600160a060020a03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef60405160405180910390a4505050565b600061082b83610959565b821061083657600080fd5b600160a060020a038316600090815260056020526040902080548390811061085a57fe5b9060005260206000200154905092915050565b6108898383836020604051908101604052806000815250610a71565b505050565b600061089861078c565b82106108a357600080fd5b60078054839081106108b157fe5b90600052602060002001549050919050565b600160a060020a03811660009081526005602090815260409182902080548351818402810184019094528084526060939283018282801561092357602002820191906000526020600020905b81548152602001906001019080831161090f575b50505050509050919050565b600081815260016020526040812054600160a060020a031680151561095357600080fd5b92915050565b6000600160a060020a038216151561097057600080fd5b50600160a060020a031660009081526003602052604090205490565b600a8054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156106995780601f1061066e57610100808354040283529160200191610699565b600160a060020a038216331415610a0357600080fd5b336000818152600460209081526040808320600160a060020a03871680855290835292819020805460ff1916861515908117909155815190815290519293927f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31929181900390910190a35050565b610a7c848484610792565b610a8884848484610da7565b1515610a9357600080fd5b50505050565b6060610aa482610b72565b1515610aaf57600080fd5b6000828152600b602090815260409182902080548351601f6002600019610100600186161502019093169290920491820184900484028101840190945280845290918301828280156109235780601f10610b1757610100808354040283529160200191610923565b820191906000526020600020905b815481529060010190602001808311610b255750939695505050505050565b600160a060020a03918216600090815260046020908152604080832093909416825291909152205460ff1690565b600090815260016020526040902054600160a060020a0316151590565b600080610b9b8361092f565b905080600160a060020a031684600160a060020a03161480610bd6575083600160a060020a0316610bcb846106a4565b600160a060020a0316145b80610be65750610be68185610b44565b949350505050565b81600160a060020a0316610c018261092f565b600160a060020a031614610c1457600080fd5b600081815260026020526040902054600160a060020a031615610c5b576000818152600260205260409020805473ffffffffffffffffffffffffffffffffffffffff191690555b5050565b610c698282610f23565b600081815260066020908152604080832054600160a060020a03861684526005909252822054909190610ca390600163ffffffff610fb916565b600160a060020a03851660009081526005602052604081208054929350909183908110610ccc57fe5b90600052602060002001549050806005600087600160a060020a0316600160a060020a0316815260200190815260200160002084815481101515610d0c57fe5b6000918252602080832090910192909255600160a060020a0387168152600590915260409020805490610d4390600019830161107f565b50600093845260066020526040808520859055908452909220555050565b610d6b8282610fce565b600160a060020a039091166000908152600560209081526040808320805460018101825590845282842081018590559383526006909152902055565b6000610dbb84600160a060020a031661105e565b1515610dc957506001610be6565b6040517f150b7a020000000000000000000000000000000000000000000000000000000081523360048201818152600160a060020a03888116602485015260448401879052608060648501908152865160848601528651600095928a169463150b7a029490938c938b938b939260a4019060208501908083838e5b83811015610e5c578181015183820152602001610e44565b50505050905090810190601f168015610e895780820380516001836020036101000a031916815260200191505b5095505050505050602060405180830381600087803b158015610eab57600080fd5b505af1158015610ebf573d6000803e3d6000fd5b505050506040513d6020811015610ed557600080fd5b50517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167f150b7a020000000000000000000000000000000000000000000000000000000014915050949350505050565b81600160a060020a0316610f368261092f565b600160a060020a031614610f4957600080fd5b600160a060020a038216600090815260036020526040902054610f7390600163ffffffff610fb916565b600160a060020a03909216600090815260036020908152604080832094909455918152600190915220805473ffffffffffffffffffffffffffffffffffffffff19169055565b600082821115610fc857600080fd5b50900390565b600081815260016020526040902054600160a060020a031615610ff057600080fd5b6000818152600160208181526040808420805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a038816908117909155845260039091529091205461103e91611066565b600160a060020a0390921660009081526003602052604090209190915550565b6000903b1190565b60008282018381101561107857600080fd5b9392505050565b815481835581811115610889576000838152602090206108899181019083016106a191905b808211156110b857600081556001016110a4565b509056fea165627a7a723058204119e20ffbee176e13ecde5bcc2a509717ba81e3f211021f58bafdef2624cd470029";