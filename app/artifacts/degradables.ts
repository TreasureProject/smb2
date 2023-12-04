export const abi = [
  {
    inputs: [
      { internalType: "uint256", name: "lootId", type: "uint256" },
      {
        components: [
          { internalType: "uint8", name: "color", type: "uint8" },
          { internalType: "uint8", name: "shape", type: "uint8" },
          { internalType: "string", name: "colorName", type: "string" },
          { internalType: "string", name: "shapeName", type: "string" }
        ],
        internalType: "struct ISmolverseLoot.Loot",
        name: "loot",
        type: "tuple"
      }
    ],
    name: "ExistingLoot",
    type: "error"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
          {
            internalType: "enum ISmolverseLoot.CraftType",
            name: "craftType",
            type: "uint8"
          }
        ],
        internalType: "struct ISmolverseLoot.RainbowTreasureCraftInput",
        name: "rainbowTreasureCraftInput",
        type: "tuple"
      }
    ],
    name: "InvalidCraft",
    type: "error"
  },
  {
    inputs: [
      { internalType: "uint256", name: "lootId", type: "uint256" },
      {
        components: [
          { internalType: "uint8", name: "color", type: "uint8" },
          { internalType: "uint8", name: "shape", type: "uint8" },
          { internalType: "string", name: "colorName", type: "string" },
          { internalType: "string", name: "shapeName", type: "string" }
        ],
        internalType: "struct ISmolverseLoot.Loot",
        name: "loot",
        type: "tuple"
      }
    ],
    name: "InvalidLoot",
    type: "error"
  },
  {
    inputs: [{ internalType: "uint256", name: "lootId", type: "uint256" }],
    name: "InvalidLootId",
    type: "error"
  },
  {
    inputs: [{ internalType: "uint256", name: "treasureId", type: "uint256" }],
    name: "InvalidTreasure",
    type: "error"
  },
  {
    inputs: [
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "address", name: "operator", type: "address" }
    ],
    name: "NotOwner",
    type: "error"
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "SmolIsNotFemale",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "UserHasAlreadyClaimedSkinLoot",
    type: "error"
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "UserIsNotInMerkleTree",
    type: "error"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address"
      },
      { indexed: false, internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "ApprovalForAll",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lootId",
        type: "uint256"
      },
      {
        components: [
          { internalType: "uint8", name: "color", type: "uint8" },
          { internalType: "uint8", name: "shape", type: "uint8" },
          { internalType: "string", name: "colorName", type: "string" },
          { internalType: "string", name: "shapeName", type: "string" }
        ],
        indexed: false,
        internalType: "struct ISmolverseLoot.Loot",
        name: "loot",
        type: "tuple"
      }
    ],
    name: "LootAdded",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        components: [
          { internalType: "uint16", name: "lootId", type: "uint16" },
          { internalType: "uint40", name: "expireAt", type: "uint40" }
        ],
        indexed: false,
        internalType: "struct ISmolverseLoot.LootToken",
        name: "lootToken",
        type: "tuple"
      }
    ],
    name: "LootTokenMinted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        components: [
          { internalType: "uint16", name: "lootId", type: "uint16" },
          { internalType: "uint40", name: "expireAt", type: "uint40" }
        ],
        indexed: false,
        internalType: "struct ISmolverseLoot.LootToken",
        name: "lootToken",
        type: "tuple"
      }
    ],
    name: "LootTokenRerolled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lootId",
        type: "uint256"
      },
      {
        components: [
          { internalType: "uint8", name: "color", type: "uint8" },
          { internalType: "uint8", name: "shape", type: "uint8" },
          { internalType: "string", name: "colorName", type: "string" },
          { internalType: "string", name: "shapeName", type: "string" }
        ],
        indexed: false,
        internalType: "struct ISmolverseLoot.Loot",
        name: "loot",
        type: "tuple"
      }
    ],
    name: "LootUpdated",
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
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "Transfer",
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
      { internalType: "uint256[]", name: "_lootIds", type: "uint256[]" },
      {
        components: [
          { internalType: "uint8", name: "color", type: "uint8" },
          { internalType: "uint8", name: "shape", type: "uint8" },
          { internalType: "string", name: "colorName", type: "string" },
          { internalType: "string", name: "shapeName", type: "string" }
        ],
        internalType: "struct ISmolverseLoot.Loot[]",
        name: "_loots",
        type: "tuple[]"
      }
    ],
    name: "addLoots",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "areContractsSet",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "baseURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "collectionDescription",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256[]", name: "smolCarIds", type: "uint256[]" },
          {
            internalType: "uint256[]",
            name: "swolercycleIds",
            type: "uint256[]"
          },
          { internalType: "uint256[]", name: "treasureIds", type: "uint256[]" },
          { internalType: "uint256[]", name: "smolPetIds", type: "uint256[]" },
          { internalType: "uint256[]", name: "swolPetIds", type: "uint256[]" },
          {
            internalType: "uint256[]",
            name: "treasureAmounts",
            type: "uint256[]"
          },
          {
            internalType: "uint256[]",
            name: "vehicleSkinIds",
            type: "uint256[]"
          },
          {
            internalType: "bytes32[]",
            name: "merkleProofsForSmolTraitShop",
            type: "bytes32[]"
          },
          {
            internalType: "uint256",
            name: "smolTraitShopSkinCount",
            type: "uint256"
          },
          {
            internalType: "uint256[]",
            name: "smolFemaleIds",
            type: "uint256[]"
          }
        ],
        internalType: "struct ISmolverseLoot.LootConversionInput",
        name: "_lootConversionInput",
        type: "tuple"
      }
    ],
    name: "convertToLoot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
          {
            internalType: "enum ISmolverseLoot.CraftType",
            name: "craftType",
            type: "uint8"
          }
        ],
        internalType: "struct ISmolverseLoot.RainbowTreasureCraftInput[]",
        name: "_rainbowTreasureCraftInputs",
        type: "tuple[]"
      }
    ],
    name: "craftRainbowTreasures",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "getApproved",
    outputs: [{ internalType: "address", name: "", type: "address" }],
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
      { internalType: "bytes32", name: "_role", type: "bytes32" },
      { internalType: "address", name: "_account", type: "address" }
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "hasClaimedSkinLoot",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
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
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "operator", type: "address" }
    ],
    name: "isApprovedForAll",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "lootTokens",
    outputs: [
      { internalType: "uint16", name: "lootId", type: "uint16" },
      { internalType: "uint40", name: "expireAt", type: "uint40" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "loots",
    outputs: [
      { internalType: "uint8", name: "color", type: "uint8" },
      { internalType: "uint8", name: "shape", type: "uint8" },
      { internalType: "string", name: "colorName", type: "string" },
      { internalType: "string", name: "shapeName", type: "string" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_receiver", type: "address" },
      { internalType: "uint256", name: "_count", type: "uint256" }
    ],
    name: "mintLootsAsAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "_lootIds", type: "uint256[]" },
      {
        components: [
          { internalType: "uint8", name: "color", type: "uint8" },
          { internalType: "uint8", name: "shape", type: "uint8" },
          { internalType: "string", name: "colorName", type: "string" },
          { internalType: "string", name: "shapeName", type: "string" }
        ],
        internalType: "struct ISmolverseLoot.Loot[]",
        name: "_loots",
        type: "tuple[]"
      }
    ],
    name: "overrideLoots",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
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
      { internalType: "uint256[]", name: "_tokenIds", type: "uint256[]" }
    ],
    name: "rerollLoots",
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
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" },
      { internalType: "bytes", name: "_data", type: "bytes" }
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "operator", type: "address" },
      { internalType: "bool", name: "approved", type: "bool" }
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "string", name: "_newBaseURI", type: "string" }],
    name: "setBaseURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_newCollectionDescription",
        type: "string"
      }
    ],
    name: "setCollectionDescription",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_smolCarsAddress", type: "address" },
      {
        internalType: "address",
        name: "_swolercyclesAddress",
        type: "address"
      },
      { internalType: "address", name: "_treasuresAddress", type: "address" },
      { internalType: "address", name: "_magicAddress", type: "address" },
      {
        internalType: "address",
        name: "_smolChopShopAddress",
        type: "address"
      },
      { internalType: "address", name: "_troveAddress", type: "address" },
      { internalType: "address", name: "_smolPetsAddress", type: "address" },
      { internalType: "address", name: "_swolPetsAddress", type: "address" },
      { internalType: "address", name: "_smolBrainsAddress", type: "address" },
      { internalType: "address", name: "_smolsStateAddress", type: "address" }
    ],
    name: "setContracts",
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
      {
        internalType: "bytes32",
        name: "_traitShopSkinsMerkleRoot",
        type: "bytes32"
      }
    ],
    name: "setTraitShopSkinsMerkleRoot",
    outputs: [],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "traitShopSkinsMerkleRoot",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "troveAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "walletOfOwner",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function"
  }
] as const;
