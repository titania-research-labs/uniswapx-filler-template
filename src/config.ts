import { ChainId } from './types/chain-id';
import { ContractAddress } from './types/hash';

if (!process.env.PRIVATE_KEY) {
  throw new Error('PRIVATE_KEY environment variable is not set');
} else if (!process.env.ALCHEMY_API_KEY) {
  throw new Error('ALCHEMY_API_KEY environment variable is not set');
}

interface Config {
  interval: number;
  chainId: ChainId;
  privateKey: string;
  alchemyUrl: string;
  targetInputTokenAddresses: ContractAddress[];
  targetOutputTokenAddresses: ContractAddress[];
}

export const config: Config = {
  interval: 200, // 200ms
  chainId: 42161, // Arbitrum
  privateKey: process.env.PRIVATE_KEY,
  alchemyUrl: `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
  targetInputTokenAddresses: [
    '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', // USDC
    '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // WETH
    '0x912CE59144191C1204E64559FE8253a0e49E6548', // ARB
    '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', // WBTC
    '0x5979D7b546E38E414F7E9822514be443A4800529', // wstETH
    '0x2C650dAb03A59332e2E0C0C4A7F726913e5028C1', // TAP
    '0x0c880f6761F1af8d9Aa9C466984b80DAb9a8c9e8', // PENDLE
    '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a', // GMX
    '0x6985884C4392D348587B19cb9eAAf157F13271cd', // ZRO
  ],
  targetOutputTokenAddresses: [
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', // USDT
  ],
};
