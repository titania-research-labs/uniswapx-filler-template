import { config } from '../config';
import { ChainId } from '../types/chain-id';
import { Address, ContractAddress } from '../types/hash';

// Uniswap Permit2
const PERMIT2_ADDRESSES: Record<ChainId, Address> = {
  1: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
  42161: '0x000000000022D473030F116dDEE9F6B43aC78BA3',
};

// Uniswap v3
const POOL_FACTORY_ADDRESSES: Record<ChainId, ContractAddress> = {
  1: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  42161: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
};
const SWAP_ROUTER_ADDRESSES: Record<ChainId, ContractAddress> = {
  1: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  42161: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
};
const QUOTER_CONTRACT_ADDRESSES: Record<ChainId, ContractAddress> = {
  1: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
  42161: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
};

// UniswapX
const REACTOR_ADDRESSES: Record<ChainId, ContractAddress> = {
  1: '0x6000da47483062A0D734Ba3dc7576Ce6A0B645C4',
  42161: '0x1bd1aAdc9E230626C44a139d7E70d842749351eb',
};

const { chainId } = config;
export const PERMIT2_ADDRESS = PERMIT2_ADDRESSES[chainId];
export const POOL_FACTORY_ADDRESS = POOL_FACTORY_ADDRESSES[chainId];
export const SWAP_ROUTER_ADDRESS = SWAP_ROUTER_ADDRESSES[chainId];
export const QUOTER_CONTRACT_ADDRESS = QUOTER_CONTRACT_ADDRESSES[chainId];
export const REACTOR_ADDRESS = REACTOR_ADDRESSES[chainId];

// ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Transfer(address,address,uint256)'));
export const TRANSFER_SIGNATURE_HASH =
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
