import {
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC1155
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc1155ABI = [
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false }
    ],
    name: 'ApprovalForAll'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'Paused'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'previousAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true
      },
      {
        name: 'newAdminRole',
        internalType: 'bytes32',
        type: 'bytes32',
        indexed: true
      }
    ],
    name: 'RoleAdminChanged'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'RoleGranted'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32', indexed: true },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true
      }
    ],
    name: 'RoleRevoked'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'ids',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false
      }
    ],
    name: 'TransferBatch'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true
      },
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false
      }
    ],
    name: 'TransferSingle'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'value', internalType: 'string', type: 'string', indexed: false },
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: true }
    ],
    name: 'URI'
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false
      }
    ],
    name: 'Unpaused'
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'MINTER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'PAUSER_ROLE',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'accounts', internalType: 'address[]', type: 'address[]' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' }
    ],
    name: 'balanceOfBatch',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'burn',
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' }
    ],
    name: 'burnBatch',
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleAdmin',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'index', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'getRoleMember',
    outputs: [{ name: '', internalType: 'address', type: 'address' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'role', internalType: 'bytes32', type: 'bytes32' }],
    name: 'getRoleMemberCount',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' }
    ],
    name: 'grantRole',
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' }
    ],
    name: 'hasRole',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' }
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' }
    ],
    name: 'mint',
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'mint',
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'mintBatch',
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'pause',
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' }
    ],
    name: 'renounceRole',
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'role', internalType: 'bytes32', type: 'bytes32' },
      { name: 'account', internalType: 'address', type: 'address' }
    ],
    name: 'revokeRole',
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'amounts', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'safeBatchTransferFrom',
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' }
    ],
    name: 'safeTransferFrom',
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' }
    ],
    name: 'setApprovalForAll',
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [],
    name: 'unpause',
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'uri',
    outputs: [{ name: '', internalType: 'string', type: 'string' }]
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20ABI = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'value', type: 'uint256', indexed: false }
    ],
    name: 'Transfer'
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' }
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'amount', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }]
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC721
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc721ABI = [
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'spender', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true }
    ],
    name: 'Approval'
  },
  {
    type: 'event',
    inputs: [
      { name: 'owner', type: 'address', indexed: true },
      { name: 'operator', type: 'address', indexed: true },
      { name: 'approved', type: 'bool', indexed: false }
    ],
    name: 'ApprovalForAll'
  },
  {
    type: 'event',
    inputs: [
      { name: 'from', type: 'address', indexed: true },
      { name: 'to', type: 'address', indexed: true },
      { name: 'tokenId', type: 'uint256', indexed: true }
    ],
    name: 'Transfer'
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'tokenId', type: 'uint256' }
    ],
    name: 'approve',
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', type: 'address' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'operator', type: 'address' }
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', type: 'bool' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: 'owner', type: 'address' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'tokenId', type: 'uint256' }
    ],
    name: 'safeTransferFrom',
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'id', type: 'uint256' },
      { name: 'data', type: 'bytes' }
    ],
    name: 'safeTransferFrom',
    outputs: []
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'approved', type: 'bool' }
    ],
    name: 'setApprovalForAll',
    outputs: []
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'index', type: 'uint256' }],
    name: 'tokenByIndex',
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'index', type: 'uint256' }
    ],
    name: 'tokenByIndex',
    outputs: [{ name: 'tokenId', type: 'uint256' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', type: 'string' }]
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }]
  },
  {
    stateMutability: 'payable',
    type: 'function',
    inputs: [
      { name: 'sender', type: 'address' },
      { name: 'recipient', type: 'address' },
      { name: 'tokeId', type: 'uint256' }
    ],
    name: 'transferFrom',
    outputs: []
  }
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__.
 */
export function useErc1155Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"DEFAULT_ADMIN_ROLE"`.
 */
export function useErc1155DefaultAdminRole<
  TFunctionName extends 'DEFAULT_ADMIN_ROLE',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'DEFAULT_ADMIN_ROLE',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"MINTER_ROLE"`.
 */
export function useErc1155MinterRole<
  TFunctionName extends 'MINTER_ROLE',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'MINTER_ROLE',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"PAUSER_ROLE"`.
 */
export function useErc1155PauserRole<
  TFunctionName extends 'PAUSER_ROLE',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'PAUSER_ROLE',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc1155BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'balanceOf',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"balanceOfBatch"`.
 */
export function useErc1155BalanceOfBatch<
  TFunctionName extends 'balanceOfBatch',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'balanceOfBatch',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"getRoleAdmin"`.
 */
export function useErc1155GetRoleAdmin<
  TFunctionName extends 'getRoleAdmin',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'getRoleAdmin',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"getRoleMember"`.
 */
export function useErc1155GetRoleMember<
  TFunctionName extends 'getRoleMember',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'getRoleMember',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"getRoleMemberCount"`.
 */
export function useErc1155GetRoleMemberCount<
  TFunctionName extends 'getRoleMemberCount',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'getRoleMemberCount',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"hasRole"`.
 */
export function useErc1155HasRole<
  TFunctionName extends 'hasRole',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'hasRole',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"isApprovedForAll"`.
 */
export function useErc1155IsApprovedForAll<
  TFunctionName extends 'isApprovedForAll',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'isApprovedForAll',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"paused"`.
 */
export function useErc1155Paused<
  TFunctionName extends 'paused',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'paused',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"supportsInterface"`.
 */
export function useErc1155SupportsInterface<
  TFunctionName extends 'supportsInterface',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'supportsInterface',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"uri"`.
 */
export function useErc1155Uri<
  TFunctionName extends 'uri',
  TSelectData = ReadContractResult<typeof erc1155ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc1155ABI,
    functionName: 'uri',
    ...config
  } as UseContractReadConfig<typeof erc1155ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__.
 */
export function useErc1155Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc1155ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof erc1155ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, TFunctionName, TMode>({
    abi: erc1155ABI,
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"burn"`.
 */
export function useErc1155Burn<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc1155ABI, 'burn'>['request']['abi'],
        'burn',
        TMode
      > & { functionName?: 'burn' }
    : UseContractWriteConfig<typeof erc1155ABI, 'burn', TMode> & {
        abi?: never
        functionName?: 'burn'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'burn', TMode>({
    abi: erc1155ABI,
    functionName: 'burn',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"burnBatch"`.
 */
export function useErc1155BurnBatch<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc1155ABI,
          'burnBatch'
        >['request']['abi'],
        'burnBatch',
        TMode
      > & { functionName?: 'burnBatch' }
    : UseContractWriteConfig<typeof erc1155ABI, 'burnBatch', TMode> & {
        abi?: never
        functionName?: 'burnBatch'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'burnBatch', TMode>({
    abi: erc1155ABI,
    functionName: 'burnBatch',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"grantRole"`.
 */
export function useErc1155GrantRole<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc1155ABI,
          'grantRole'
        >['request']['abi'],
        'grantRole',
        TMode
      > & { functionName?: 'grantRole' }
    : UseContractWriteConfig<typeof erc1155ABI, 'grantRole', TMode> & {
        abi?: never
        functionName?: 'grantRole'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'grantRole', TMode>({
    abi: erc1155ABI,
    functionName: 'grantRole',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"mint"`.
 */
export function useErc1155Mint<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc1155ABI, 'mint'>['request']['abi'],
        'mint',
        TMode
      > & { functionName?: 'mint' }
    : UseContractWriteConfig<typeof erc1155ABI, 'mint', TMode> & {
        abi?: never
        functionName?: 'mint'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'mint', TMode>({
    abi: erc1155ABI,
    functionName: 'mint',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"mintBatch"`.
 */
export function useErc1155MintBatch<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc1155ABI,
          'mintBatch'
        >['request']['abi'],
        'mintBatch',
        TMode
      > & { functionName?: 'mintBatch' }
    : UseContractWriteConfig<typeof erc1155ABI, 'mintBatch', TMode> & {
        abi?: never
        functionName?: 'mintBatch'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'mintBatch', TMode>({
    abi: erc1155ABI,
    functionName: 'mintBatch',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"pause"`.
 */
export function useErc1155Pause<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc1155ABI,
          'pause'
        >['request']['abi'],
        'pause',
        TMode
      > & { functionName?: 'pause' }
    : UseContractWriteConfig<typeof erc1155ABI, 'pause', TMode> & {
        abi?: never
        functionName?: 'pause'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'pause', TMode>({
    abi: erc1155ABI,
    functionName: 'pause',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"renounceRole"`.
 */
export function useErc1155RenounceRole<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc1155ABI,
          'renounceRole'
        >['request']['abi'],
        'renounceRole',
        TMode
      > & { functionName?: 'renounceRole' }
    : UseContractWriteConfig<typeof erc1155ABI, 'renounceRole', TMode> & {
        abi?: never
        functionName?: 'renounceRole'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'renounceRole', TMode>({
    abi: erc1155ABI,
    functionName: 'renounceRole',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"revokeRole"`.
 */
export function useErc1155RevokeRole<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc1155ABI,
          'revokeRole'
        >['request']['abi'],
        'revokeRole',
        TMode
      > & { functionName?: 'revokeRole' }
    : UseContractWriteConfig<typeof erc1155ABI, 'revokeRole', TMode> & {
        abi?: never
        functionName?: 'revokeRole'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'revokeRole', TMode>({
    abi: erc1155ABI,
    functionName: 'revokeRole',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"safeBatchTransferFrom"`.
 */
export function useErc1155SafeBatchTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc1155ABI,
          'safeBatchTransferFrom'
        >['request']['abi'],
        'safeBatchTransferFrom',
        TMode
      > & { functionName?: 'safeBatchTransferFrom' }
    : UseContractWriteConfig<
        typeof erc1155ABI,
        'safeBatchTransferFrom',
        TMode
      > & {
        abi?: never
        functionName?: 'safeBatchTransferFrom'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'safeBatchTransferFrom', TMode>({
    abi: erc1155ABI,
    functionName: 'safeBatchTransferFrom',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function useErc1155SafeTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc1155ABI,
          'safeTransferFrom'
        >['request']['abi'],
        'safeTransferFrom',
        TMode
      > & { functionName?: 'safeTransferFrom' }
    : UseContractWriteConfig<typeof erc1155ABI, 'safeTransferFrom', TMode> & {
        abi?: never
        functionName?: 'safeTransferFrom'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'safeTransferFrom', TMode>({
    abi: erc1155ABI,
    functionName: 'safeTransferFrom',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function useErc1155SetApprovalForAll<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc1155ABI,
          'setApprovalForAll'
        >['request']['abi'],
        'setApprovalForAll',
        TMode
      > & { functionName?: 'setApprovalForAll' }
    : UseContractWriteConfig<typeof erc1155ABI, 'setApprovalForAll', TMode> & {
        abi?: never
        functionName?: 'setApprovalForAll'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'setApprovalForAll', TMode>({
    abi: erc1155ABI,
    functionName: 'setApprovalForAll',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"unpause"`.
 */
export function useErc1155Unpause<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc1155ABI,
          'unpause'
        >['request']['abi'],
        'unpause',
        TMode
      > & { functionName?: 'unpause' }
    : UseContractWriteConfig<typeof erc1155ABI, 'unpause', TMode> & {
        abi?: never
        functionName?: 'unpause'
      } = {} as any
) {
  return useContractWrite<typeof erc1155ABI, 'unpause', TMode>({
    abi: erc1155ABI,
    functionName: 'unpause',
    ...config
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__.
 */
export function usePrepareErc1155Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, TFunctionName>,
    'abi'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"burn"`.
 */
export function usePrepareErc1155Burn(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'burn'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'burn',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, 'burn'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"burnBatch"`.
 */
export function usePrepareErc1155BurnBatch(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'burnBatch'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'burnBatch',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, 'burnBatch'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"grantRole"`.
 */
export function usePrepareErc1155GrantRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'grantRole'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'grantRole',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, 'grantRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"mint"`.
 */
export function usePrepareErc1155Mint(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'mint'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'mint',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, 'mint'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"mintBatch"`.
 */
export function usePrepareErc1155MintBatch(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'mintBatch'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'mintBatch',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, 'mintBatch'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"pause"`.
 */
export function usePrepareErc1155Pause(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'pause'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'pause',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, 'pause'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"renounceRole"`.
 */
export function usePrepareErc1155RenounceRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'renounceRole'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'renounceRole',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, 'renounceRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"revokeRole"`.
 */
export function usePrepareErc1155RevokeRole(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'revokeRole'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'revokeRole',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, 'revokeRole'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"safeBatchTransferFrom"`.
 */
export function usePrepareErc1155SafeBatchTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'safeBatchTransferFrom'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'safeBatchTransferFrom',
    ...config
  } as UsePrepareContractWriteConfig<
    typeof erc1155ABI,
    'safeBatchTransferFrom'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function usePrepareErc1155SafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'safeTransferFrom'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'safeTransferFrom',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, 'safeTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function usePrepareErc1155SetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'setApprovalForAll'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'setApprovalForAll',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, 'setApprovalForAll'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc1155ABI}__ and `functionName` set to `"unpause"`.
 */
export function usePrepareErc1155Unpause(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc1155ABI, 'unpause'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc1155ABI,
    functionName: 'unpause',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc1155ABI, 'unpause'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc1155ABI}__.
 */
export function useErc1155Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof erc1155ABI, TEventName>,
    'abi'
  > = {} as any
) {
  return useContractEvent({
    abi: erc1155ABI,
    ...config
  } as UseContractEventConfig<typeof erc1155ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc1155ABI}__ and `eventName` set to `"ApprovalForAll"`.
 */
export function useErc1155ApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof erc1155ABI, 'ApprovalForAll'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc1155ABI,
    eventName: 'ApprovalForAll',
    ...config
  } as UseContractEventConfig<typeof erc1155ABI, 'ApprovalForAll'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc1155ABI}__ and `eventName` set to `"Paused"`.
 */
export function useErc1155PausedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc1155ABI, 'Paused'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc1155ABI,
    eventName: 'Paused',
    ...config
  } as UseContractEventConfig<typeof erc1155ABI, 'Paused'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc1155ABI}__ and `eventName` set to `"RoleAdminChanged"`.
 */
export function useErc1155RoleAdminChangedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc1155ABI, 'RoleAdminChanged'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc1155ABI,
    eventName: 'RoleAdminChanged',
    ...config
  } as UseContractEventConfig<typeof erc1155ABI, 'RoleAdminChanged'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc1155ABI}__ and `eventName` set to `"RoleGranted"`.
 */
export function useErc1155RoleGrantedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc1155ABI, 'RoleGranted'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc1155ABI,
    eventName: 'RoleGranted',
    ...config
  } as UseContractEventConfig<typeof erc1155ABI, 'RoleGranted'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc1155ABI}__ and `eventName` set to `"RoleRevoked"`.
 */
export function useErc1155RoleRevokedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc1155ABI, 'RoleRevoked'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc1155ABI,
    eventName: 'RoleRevoked',
    ...config
  } as UseContractEventConfig<typeof erc1155ABI, 'RoleRevoked'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc1155ABI}__ and `eventName` set to `"TransferBatch"`.
 */
export function useErc1155TransferBatchEvent(
  config: Omit<
    UseContractEventConfig<typeof erc1155ABI, 'TransferBatch'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc1155ABI,
    eventName: 'TransferBatch',
    ...config
  } as UseContractEventConfig<typeof erc1155ABI, 'TransferBatch'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc1155ABI}__ and `eventName` set to `"TransferSingle"`.
 */
export function useErc1155TransferSingleEvent(
  config: Omit<
    UseContractEventConfig<typeof erc1155ABI, 'TransferSingle'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc1155ABI,
    eventName: 'TransferSingle',
    ...config
  } as UseContractEventConfig<typeof erc1155ABI, 'TransferSingle'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc1155ABI}__ and `eventName` set to `"URI"`.
 */
export function useErc1155UriEvent(
  config: Omit<
    UseContractEventConfig<typeof erc1155ABI, 'URI'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc1155ABI,
    eventName: 'URI',
    ...config
  } as UseContractEventConfig<typeof erc1155ABI, 'URI'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc1155ABI}__ and `eventName` set to `"Unpaused"`.
 */
export function useErc1155UnpausedEvent(
  config: Omit<
    UseContractEventConfig<typeof erc1155ABI, 'Unpaused'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc1155ABI,
    eventName: 'Unpaused',
    ...config
  } as UseContractEventConfig<typeof erc1155ABI, 'Unpaused'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any
) {
  return useContractRead({ abi: erc20ABI, ...config } as UseContractReadConfig<
    typeof erc20ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"allowance"`.
 */
export function useErc20Allowance<
  TFunctionName extends 'allowance',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'allowance',
    ...config
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc20BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'balanceOf',
    ...config
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"decimals"`.
 */
export function useErc20Decimals<
  TFunctionName extends 'decimals',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'decimals',
    ...config
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"name"`.
 */
export function useErc20Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'name',
    ...config
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"symbol"`.
 */
export function useErc20Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'symbol',
    ...config
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useErc20TotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof erc20ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc20ABI,
    functionName: 'totalSupply',
    ...config
  } as UseContractReadConfig<typeof erc20ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc20ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof erc20ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, TFunctionName, TMode>({
    abi: erc20ABI,
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function useErc20Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof erc20ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, 'approve', TMode>({
    abi: erc20ABI,
    functionName: 'approve',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function useErc20Transfer<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          'transfer'
        >['request']['abi'],
        'transfer',
        TMode
      > & { functionName?: 'transfer' }
    : UseContractWriteConfig<typeof erc20ABI, 'transfer', TMode> & {
        abi?: never
        functionName?: 'transfer'
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, 'transfer', TMode>({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useErc20TransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc20ABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof erc20ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any
) {
  return useContractWrite<typeof erc20ABI, 'transferFrom', TMode>({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__.
 */
export function usePrepareErc20Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, TFunctionName>,
    'abi'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    ...config
  } as UsePrepareContractWriteConfig<typeof erc20ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareErc20Approve(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'approve',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transfer"`.
 */
export function usePrepareErc20Transfer(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transfer',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transfer'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc20ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareErc20TransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc20ABI,
    functionName: 'transferFrom',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc20ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__.
 */
export function useErc20Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, TEventName>,
    'abi'
  > = {} as any
) {
  return useContractEvent({
    abi: erc20ABI,
    ...config
  } as UseContractEventConfig<typeof erc20ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Approval"`.
 */
export function useErc20ApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc20ABI,
    eventName: 'Approval',
    ...config
  } as UseContractEventConfig<typeof erc20ABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc20ABI}__ and `eventName` set to `"Transfer"`.
 */
export function useErc20TransferEvent(
  config: Omit<
    UseContractEventConfig<typeof erc20ABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc20ABI,
    eventName: 'Transfer',
    ...config
  } as UseContractEventConfig<typeof erc20ABI, 'Transfer'>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__.
 */
export function useErc721Read<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>,
    'abi'
  > = {} as any
) {
  return useContractRead({ abi: erc721ABI, ...config } as UseContractReadConfig<
    typeof erc721ABI,
    TFunctionName,
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"balanceOf"`.
 */
export function useErc721BalanceOf<
  TFunctionName extends 'balanceOf',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc721ABI,
    functionName: 'balanceOf',
    ...config
  } as UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"getApproved"`.
 */
export function useErc721GetApproved<
  TFunctionName extends 'getApproved',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc721ABI,
    functionName: 'getApproved',
    ...config
  } as UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"isApprovedForAll"`.
 */
export function useErc721IsApprovedForAll<
  TFunctionName extends 'isApprovedForAll',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc721ABI,
    functionName: 'isApprovedForAll',
    ...config
  } as UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"name"`.
 */
export function useErc721Name<
  TFunctionName extends 'name',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc721ABI,
    functionName: 'name',
    ...config
  } as UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"ownerOf"`.
 */
export function useErc721OwnerOf<
  TFunctionName extends 'ownerOf',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc721ABI,
    functionName: 'ownerOf',
    ...config
  } as UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"symbol"`.
 */
export function useErc721Symbol<
  TFunctionName extends 'symbol',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc721ABI,
    functionName: 'symbol',
    ...config
  } as UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"tokenByIndex"`.
 */
export function useErc721TokenByIndex<
  TFunctionName extends 'tokenByIndex',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc721ABI,
    functionName: 'tokenByIndex',
    ...config
  } as UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"tokenURI"`.
 */
export function useErc721TokenUri<
  TFunctionName extends 'tokenURI',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc721ABI,
    functionName: 'tokenURI',
    ...config
  } as UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"totalSupply"`.
 */
export function useErc721TotalSupply<
  TFunctionName extends 'totalSupply',
  TSelectData = ReadContractResult<typeof erc721ABI, TFunctionName>
>(
  config: Omit<
    UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>,
    'abi' | 'functionName'
  > = {} as any
) {
  return useContractRead({
    abi: erc721ABI,
    functionName: 'totalSupply',
    ...config
  } as UseContractReadConfig<typeof erc721ABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc721ABI}__.
 */
export function useErc721Write<
  TFunctionName extends string,
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<typeof erc721ABI, string>['request']['abi'],
        TFunctionName,
        TMode
      >
    : UseContractWriteConfig<typeof erc721ABI, TFunctionName, TMode> & {
        abi?: never
      } = {} as any
) {
  return useContractWrite<typeof erc721ABI, TFunctionName, TMode>({
    abi: erc721ABI,
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"approve"`.
 */
export function useErc721Approve<TMode extends WriteContractMode = undefined>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc721ABI,
          'approve'
        >['request']['abi'],
        'approve',
        TMode
      > & { functionName?: 'approve' }
    : UseContractWriteConfig<typeof erc721ABI, 'approve', TMode> & {
        abi?: never
        functionName?: 'approve'
      } = {} as any
) {
  return useContractWrite<typeof erc721ABI, 'approve', TMode>({
    abi: erc721ABI,
    functionName: 'approve',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function useErc721SafeTransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc721ABI,
          'safeTransferFrom'
        >['request']['abi'],
        'safeTransferFrom',
        TMode
      > & { functionName?: 'safeTransferFrom' }
    : UseContractWriteConfig<typeof erc721ABI, 'safeTransferFrom', TMode> & {
        abi?: never
        functionName?: 'safeTransferFrom'
      } = {} as any
) {
  return useContractWrite<typeof erc721ABI, 'safeTransferFrom', TMode>({
    abi: erc721ABI,
    functionName: 'safeTransferFrom',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function useErc721SetApprovalForAll<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc721ABI,
          'setApprovalForAll'
        >['request']['abi'],
        'setApprovalForAll',
        TMode
      > & { functionName?: 'setApprovalForAll' }
    : UseContractWriteConfig<typeof erc721ABI, 'setApprovalForAll', TMode> & {
        abi?: never
        functionName?: 'setApprovalForAll'
      } = {} as any
) {
  return useContractWrite<typeof erc721ABI, 'setApprovalForAll', TMode>({
    abi: erc721ABI,
    functionName: 'setApprovalForAll',
    ...config
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function useErc721TransferFrom<
  TMode extends WriteContractMode = undefined
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        PrepareWriteContractResult<
          typeof erc721ABI,
          'transferFrom'
        >['request']['abi'],
        'transferFrom',
        TMode
      > & { functionName?: 'transferFrom' }
    : UseContractWriteConfig<typeof erc721ABI, 'transferFrom', TMode> & {
        abi?: never
        functionName?: 'transferFrom'
      } = {} as any
) {
  return useContractWrite<typeof erc721ABI, 'transferFrom', TMode>({
    abi: erc721ABI,
    functionName: 'transferFrom',
    ...config
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc721ABI}__.
 */
export function usePrepareErc721Write<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc721ABI, TFunctionName>,
    'abi'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc721ABI,
    ...config
  } as UsePrepareContractWriteConfig<typeof erc721ABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"approve"`.
 */
export function usePrepareErc721Approve(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc721ABI, 'approve'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc721ABI,
    functionName: 'approve',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc721ABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"safeTransferFrom"`.
 */
export function usePrepareErc721SafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc721ABI, 'safeTransferFrom'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc721ABI,
    functionName: 'safeTransferFrom',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc721ABI, 'safeTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"setApprovalForAll"`.
 */
export function usePrepareErc721SetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc721ABI, 'setApprovalForAll'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc721ABI,
    functionName: 'setApprovalForAll',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc721ABI, 'setApprovalForAll'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link erc721ABI}__ and `functionName` set to `"transferFrom"`.
 */
export function usePrepareErc721TransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof erc721ABI, 'transferFrom'>,
    'abi' | 'functionName'
  > = {} as any
) {
  return usePrepareContractWrite({
    abi: erc721ABI,
    functionName: 'transferFrom',
    ...config
  } as UsePrepareContractWriteConfig<typeof erc721ABI, 'transferFrom'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc721ABI}__.
 */
export function useErc721Event<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof erc721ABI, TEventName>,
    'abi'
  > = {} as any
) {
  return useContractEvent({
    abi: erc721ABI,
    ...config
  } as UseContractEventConfig<typeof erc721ABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc721ABI}__ and `eventName` set to `"Approval"`.
 */
export function useErc721ApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof erc721ABI, 'Approval'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc721ABI,
    eventName: 'Approval',
    ...config
  } as UseContractEventConfig<typeof erc721ABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc721ABI}__ and `eventName` set to `"ApprovalForAll"`.
 */
export function useErc721ApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof erc721ABI, 'ApprovalForAll'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc721ABI,
    eventName: 'ApprovalForAll',
    ...config
  } as UseContractEventConfig<typeof erc721ABI, 'ApprovalForAll'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link erc721ABI}__ and `eventName` set to `"Transfer"`.
 */
export function useErc721TransferEvent(
  config: Omit<
    UseContractEventConfig<typeof erc721ABI, 'Transfer'>,
    'abi' | 'eventName'
  > = {} as any
) {
  return useContractEvent({
    abi: erc721ABI,
    eventName: 'Transfer',
    ...config
  } as UseContractEventConfig<typeof erc721ABI, 'Transfer'>)
}
