// types/intent-with-signature.ts

import { CosignedV2DutchOrder } from '@banr1/uniswapx-sdk';

export interface IntentWithSignature {
  intent: CosignedV2DutchOrder;
  signature: string;
}
