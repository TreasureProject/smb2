export const abi = [
  { inputs: [], name: "ComponentDoesNotYetExist", type: "error" },
  { inputs: [], name: "ComponentLevelNotHighEnough", type: "error" },
  { inputs: [], name: "ComponentNotMatchingDesiredStatus", type: "error" },
  { inputs: [], name: "NotEnoughGlobalCountOfComponentType", type: "error" },
  { inputs: [], name: "NotEnoughObjectCountOfComponentType", type: "error" },
  { inputs: [], name: "NotEnoughTimePassedSinceLastAction", type: "error" },
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
        name: "smolWorldId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "componentId",
        type: "uint256"
      }
    ],
    name: "ComponentUnlocked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "smolWorldId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "componentId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newLevel",
        type: "uint256"
      }
    ],
    name: "ComponentUpgraded",
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
        internalType: "uint256",
        name: "smolWorldId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "smolId",
        type: "uint256"
      }
    ],
    name: "SmolCheckedIn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "smolWorldId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "smolId",
        type: "uint256"
      }
    ],
    name: "SmolCheckedOut",
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
      {
        components: [
          { internalType: "bool", name: "exists", type: "bool" },
          { internalType: "string", name: "componentName", type: "string" },
          {
            internalType: "enum ISmolWorld.COMPONENT_TYPE",
            name: "componentType",
            type: "uint8"
          },
          {
            components: [
              { internalType: "bool", name: "exists", type: "bool" },
              {
                internalType: "string",
                name: "componentLevelName",
                type: "string"
              },
              { internalType: "string", name: "uri", type: "string" },
              { internalType: "string", name: "unlockText", type: "string" },
              {
                components: [
                  {
                    internalType: "enum ISmolWorld.COST_TYPE",
                    name: "costType",
                    type: "uint8"
                  },
                  { internalType: "bytes", name: "costData", type: "bytes" }
                ],
                internalType: "struct ISmolWorld.Cost[]",
                name: "costsForUnlock",
                type: "tuple[]"
              },
              {
                components: [
                  {
                    internalType: "enum ISmolWorld.CONDITION_TYPE",
                    name: "conditionType",
                    type: "uint8"
                  },
                  {
                    internalType: "bytes",
                    name: "conditionData",
                    type: "bytes"
                  }
                ],
                internalType: "struct ISmolWorld.Condition[]",
                name: "conditionsForUnlock",
                type: "tuple[]"
              }
            ],
            internalType: "struct ISmolWorld.ComponentLevel[]",
            name: "componentLevels",
            type: "tuple[]"
          }
        ],
        internalType: "struct ISmolWorld.Component[]",
        name: "_components",
        type: "tuple[]"
      }
    ],
    name: "addComponents",
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
    inputs: [
      { internalType: "uint256", name: "_oldSmolWorldId", type: "uint256" }
    ],
    name: "burnOldSmolWorldToMintNewSmolWorld",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_smolWorldId", type: "uint256" },
      { internalType: "uint256", name: "_componentId", type: "uint256" },
      { internalType: "uint256", name: "_targetLevel", type: "uint256" }
    ],
    name: "canUnlockComponent",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_smolId", type: "uint256" },
      { internalType: "uint256", name: "_smolWorldId", type: "uint256" }
    ],
    name: "checkSmolIntoSmolWorld",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_smolId", type: "uint256" }],
    name: "checkSmolOutOfSmolWorld",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "componentCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "componentIdToComponent",
    outputs: [
      { internalType: "bool", name: "exists", type: "bool" },
      { internalType: "string", name: "componentName", type: "string" },
      {
        internalType: "enum ISmolWorld.COMPONENT_TYPE",
        name: "componentType",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "componentTypeIdToGlobalCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getAllComponents",
    outputs: [
      {
        components: [
          { internalType: "bool", name: "exists", type: "bool" },
          { internalType: "string", name: "componentName", type: "string" },
          {
            internalType: "enum ISmolWorld.COMPONENT_TYPE",
            name: "componentType",
            type: "uint8"
          },
          {
            components: [
              { internalType: "bool", name: "exists", type: "bool" },
              {
                internalType: "string",
                name: "componentLevelName",
                type: "string"
              },
              { internalType: "string", name: "uri", type: "string" },
              { internalType: "string", name: "unlockText", type: "string" },
              {
                components: [
                  {
                    internalType: "enum ISmolWorld.COST_TYPE",
                    name: "costType",
                    type: "uint8"
                  },
                  { internalType: "bytes", name: "costData", type: "bytes" }
                ],
                internalType: "struct ISmolWorld.Cost[]",
                name: "costsForUnlock",
                type: "tuple[]"
              },
              {
                components: [
                  {
                    internalType: "enum ISmolWorld.CONDITION_TYPE",
                    name: "conditionType",
                    type: "uint8"
                  },
                  {
                    internalType: "bytes",
                    name: "conditionData",
                    type: "bytes"
                  }
                ],
                internalType: "struct ISmolWorld.Condition[]",
                name: "conditionsForUnlock",
                type: "tuple[]"
              }
            ],
            internalType: "struct ISmolWorld.ComponentLevel[]",
            name: "componentLevels",
            type: "tuple[]"
          }
        ],
        internalType: "struct ISmolWorld.Component[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_smolWorldId", type: "uint256" }
    ],
    name: "getAllTokenUnlockedComponents",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
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
    inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
    name: "isSmolCheckedIn",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
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
    inputs: [],
    name: "oldSmolWorldAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256[]", name: "", type: "uint256[]" },
      { internalType: "uint256[]", name: "", type: "uint256[]" },
      { internalType: "bytes", name: "", type: "bytes" }
    ],
    name: "onERC1155BatchReceived",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "bytes", name: "", type: "bytes" }
    ],
    name: "onERC1155Received",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
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
    inputs: [
      { internalType: "address", name: "_smolsAddress", type: "address" },
      { internalType: "address", name: "_oldSmolWorldAddress", type: "address" }
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
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "smolIdToSmolWorldData",
    outputs: [
      { internalType: "bool", name: "checkedIn", type: "bool" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "smolWorldIdToComponentIdToTokenComponentData",
    outputs: [
      { internalType: "bool", name: "unlocked", type: "bool" },
      { internalType: "uint256", name: "unlockTime", type: "uint256" },
      { internalType: "uint256", name: "currentLevel", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" }
    ],
    name: "smolWorldIdToComponentTypeIdToObjectCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "smolWorldIdToLastActionTimestamp",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "smolWorldIdToSmolData",
    outputs: [
      { internalType: "bool", name: "checkedIn", type: "bool" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "smolsAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
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
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
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
    inputs: [
      { internalType: "uint256", name: "_smolWorldId", type: "uint256" },
      { internalType: "uint256", name: "_componentId", type: "uint256" }
    ],
    name: "unlockComponent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        components: [
          { internalType: "bool", name: "exists", type: "bool" },
          { internalType: "string", name: "componentName", type: "string" },
          {
            internalType: "enum ISmolWorld.COMPONENT_TYPE",
            name: "componentType",
            type: "uint8"
          },
          {
            components: [
              { internalType: "bool", name: "exists", type: "bool" },
              {
                internalType: "string",
                name: "componentLevelName",
                type: "string"
              },
              { internalType: "string", name: "uri", type: "string" },
              { internalType: "string", name: "unlockText", type: "string" },
              {
                components: [
                  {
                    internalType: "enum ISmolWorld.COST_TYPE",
                    name: "costType",
                    type: "uint8"
                  },
                  { internalType: "bytes", name: "costData", type: "bytes" }
                ],
                internalType: "struct ISmolWorld.Cost[]",
                name: "costsForUnlock",
                type: "tuple[]"
              },
              {
                components: [
                  {
                    internalType: "enum ISmolWorld.CONDITION_TYPE",
                    name: "conditionType",
                    type: "uint8"
                  },
                  {
                    internalType: "bytes",
                    name: "conditionData",
                    type: "bytes"
                  }
                ],
                internalType: "struct ISmolWorld.Condition[]",
                name: "conditionsForUnlock",
                type: "tuple[]"
              }
            ],
            internalType: "struct ISmolWorld.ComponentLevel[]",
            name: "componentLevels",
            type: "tuple[]"
          }
        ],
        internalType: "struct ISmolWorld.Component[]",
        name: "_components",
        type: "tuple[]"
      },
      { internalType: "uint256[]", name: "_componentIds", type: "uint256[]" }
    ],
    name: "updateComponents",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_smolWorldId", type: "uint256" },
      { internalType: "uint256", name: "_componentId", type: "uint256" }
    ],
    name: "upgradeComponent",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
] as const;
