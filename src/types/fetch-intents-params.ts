// types/fetch-intents-params.ts

import { OrderType } from '@banr1/uniswapx-sdk';

import { ChainId } from './chain-id';
import { IntentStatus } from './intent-status';

// The source code below is from the UniswapX service repository.
// https://github.com/Uniswap/uniswapx-service/blob/5397efa66378e879e8b48d38c422d55942b0a949/lib/handlers/shared/get.ts#L59-L99
export interface FetchIntentsParams {
  chainId: ChainId;
  limit?: number;
  orderStatus?: IntentStatus;
  sortKey?: 'createdAt';
  desc?: boolean;
  sort?: string;
  includeV2?: boolean;
  orderType?: OrderType;
}
