export const abi = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" }
    ],
    name: "Initialized",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Paused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32"
      }
    ],
    name: "RoleAdminChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "RoleGranted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "RoleRevoked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_collection",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_statId",
        type: "uint256"
      }
    ],
    name: "TokenJoinedStat",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "_collection",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_tokenId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "_statId",
        type: "uint256"
      }
    ],
    name: "TokenLeftStat",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Unpaused",
    type: "event"
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint64", name: "_statId", type: "uint64" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      { internalType: "uint128", name: "_amountOfStatToAdd", type: "uint128" }
    ],
    name: "addStatAsAllowedAdjuster",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint64", name: "_statId", type: "uint64" },
      {
        components: [
          {
            internalType: "uint128",
            name: "globalStatAccrued",
            type: "uint128"
          },
          { internalType: "uint128", name: "emissionRate", type: "uint128" },
          { internalType: "bool", name: "exists", type: "bool" },
          { internalType: "bool", name: "joinable", type: "bool" }
        ],
        internalType: "struct School.StatDetails",
        name: "_statDetails",
        type: "tuple"
      }
    ],
    name: "adjustStatDetails",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint64", name: "_statId", type: "uint64" },
      { internalType: "uint256[]", name: "_tokenIds", type: "uint256[]" }
    ],
    name: "claimPendingStatEmissions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint64", name: "_statId", type: "uint64" },
      { internalType: "uint256[]", name: "_tokenIds", type: "uint256[]" }
    ],
    name: "getManyTokenDetails",
    outputs: [
      {
        components: [
          { internalType: "uint128", name: "statAccrued", type: "uint128" },
          { internalType: "uint64", name: "timestampJoined", type: "uint64" },
          { internalType: "bool", name: "joined", type: "bool" }
        ],
        internalType: "struct School.TokenDetails[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint64", name: "_statId", type: "uint64" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" }
    ],
    name: "getPendingStatEmissions",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleAdmin",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "uint256", name: "index", type: "uint256" }
    ],
    name: "getRoleMember",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
    name: "getRoleMemberCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint64", name: "_statId", type: "uint64" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" }
    ],
    name: "getTotalStatPlusPendingEmissions",
    outputs: [{ internalType: "uint128", name: "", type: "uint128" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_role", type: "bytes32" },
      { internalType: "address", name: "_account", type: "address" }
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" }
    ],
    name: "hasRole",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint64", name: "_statId", type: "uint64" },
      { internalType: "uint256[]", name: "_tokenIds", type: "uint256[]" }
    ],
    name: "joinStat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint64", name: "_statId", type: "uint64" },
      { internalType: "uint256[]", name: "_tokenIds", type: "uint256[]" }
    ],
    name: "leaveStat",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "paused",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint64", name: "_statId", type: "uint64" },
      { internalType: "uint256", name: "_tokenId", type: "uint256" },
      {
        internalType: "uint128",
        name: "_amountOfStatToRemove",
        type: "uint128"
      }
    ],
    name: "removeStatAsAllowedAdjuster",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "role", type: "bytes32" },
      { internalType: "address", name: "account", type: "address" }
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "bytes32", name: "_role", type: "bytes32" },
      { internalType: "address", name: "_account", type: "address" }
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "bool", name: "_shouldPause", type: "bool" }],
    name: "setPause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_collectionAddress", type: "address" },
      { internalType: "uint64", name: "_statId", type: "uint64" },
      {
        components: [
          {
            internalType: "uint128",
            name: "globalStatAccrued",
            type: "uint128"
          },
          { internalType: "uint128", name: "emissionRate", type: "uint128" },
          { internalType: "bool", name: "exists", type: "bool" },
          { internalType: "bool", name: "joinable", type: "bool" }
        ],
        internalType: "struct School.StatDetails",
        name: "_statDetails",
        type: "tuple"
      }
    ],
    name: "setStatDetails",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "statDetails",
    outputs: [
      { internalType: "uint128", name: "globalStatAccrued", type: "uint128" },
      { internalType: "uint128", name: "emissionRate", type: "uint128" },
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "bool", name: "joinable", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint64", name: "", type: "uint64" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "tokenDetails",
    outputs: [
      { internalType: "uint128", name: "statAccrued", type: "uint128" },
      { internalType: "uint64", name: "timestampJoined", type: "uint64" },
      { internalType: "bool", name: "joined", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "totalStatsJoinedWithinCollection",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  }
] as const;
