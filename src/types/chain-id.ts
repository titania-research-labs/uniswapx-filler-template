// types/chain-id.ts

export type ChainId = 1 | 42161;

export const CHAIN_NAMES: { [key in ChainId]: string } = {
  1: 'Ethereum',
  42161: 'Arbitrum',
};
