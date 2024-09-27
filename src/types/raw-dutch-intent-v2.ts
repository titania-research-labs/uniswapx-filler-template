// types/raw-dutch-intent-v2.ts

import {
  CosignerData,
  DutchInput,
  DutchOutput,
  OrderType,
} from '@banr1/uniswapx-sdk';

import { ChainId } from './chain-id';
import { Address, IntentHash } from './hash';

// There's a example of a raw Dutch intent in the reference directory:
// reference/raw-dutch-intent-v2.json
export interface RawOpenDutchIntentV2 {
  type: OrderType.Dutch_V2;
  orderStatus: 'open';
  signature: string;
  encodedOrder: string;
  chainId: ChainId;
  nonce: number;
  orderHash: IntentHash;
  swapper: Address;
  input: DutchInput;
  outputs: DutchOutput[];
  cosignerData: CosignerData;
  cosignature: string;
  quoteId: string;
  requestId: string;
  createdAt: number;
}
