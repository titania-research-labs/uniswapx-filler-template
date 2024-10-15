// services/identification-service.ts

import { CosignedV2DutchOrder, OrderType } from '@banr1/uniswapx-sdk';
import { FetchIntentsParams } from '../types/fetch-intents-params';
import axios from 'axios';
import { RawOpenDutchIntentV2 } from '../types/raw-dutch-intent-v2';
import { Wallet } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';
import { getTargetToken, nowTimestamp } from '../utils';
import { logger } from '../logger';
import { PERMIT2_ADDRESS } from '../constants';
import { ERC20, ERC20__factory } from '../types/typechain';
import { IntentWithSignature } from '../types/intent-with-signature';
import { IntentHash } from '../types/hash';
import { config } from '../config';
import { ADDRESS_ZERO } from '@uniswap/v3-sdk';

interface IdentificationServiceConstructorArgs {
  wallet: Wallet;
  inputTokens: ERC20[];
  outputTokens: ERC20[];
}

// IdentificationService class
// This class is responsible for identifying suitable intents
// It fetches intents from the Uniswap API and filters them
// based on the input and output tokens, and the current time
export class IdentificationService {
  private wallet: Wallet;
  private inputTokens: ERC20[];
  private outputTokens: ERC20[];
  private apiBaseUrl = 'https://api.uniswap.org';
  private lastSkippedIntentHash: IntentHash | null = null;

  constructor({
    wallet,
    inputTokens,
    outputTokens,
  }: IdentificationServiceConstructorArgs) {
    this.wallet = wallet;
    this.inputTokens = inputTokens;
    this.outputTokens = outputTokens;
  }

  // Fetch intents from the Uniswap API and identify suitable intents
  async identifyIntent(): Promise<IntentWithSignature | null> {
    try {
      return await this._identifyIntent();
    } catch (error) {
      logger.error(`Error occurred while identifying intent: ${error}`);
      throw error;
    }
  }

  private async _identifyIntent(): Promise<IntentWithSignature | null> {
    const params: FetchIntentsParams = {
      chainId: config.chainId,
      limit: 1,
      orderStatus: 'open',
      sortKey: 'createdAt',
      desc: true,
      sort: 'lt(9000000000)',
      orderType: OrderType.Dutch_V2,
      includeV2: true,
    };
    const response = await axios.get<{ orders: RawOpenDutchIntentV2[] }>(
      `${this.apiBaseUrl}/v2/orders`,
      { params },
    );
    if (!response.data.orders.length || !response.data.orders[0]) {
      // log only when seconds is 0
      if (new Date().getSeconds() === 0) {
        logger.info('No intents found 🍪');
        this.lastSkippedIntentHash = null;
      }
      return null;
    }

    const rawIntent = response.data.orders[0];
    // If the same intent is found again, skip it
    if (this.lastSkippedIntentHash === rawIntent.orderHash) {
      logger.info('The same intent found again. Skip it 🦋');
      return null;
    }

    if (
      rawIntent.type !== OrderType.Dutch_V2 ||
      rawIntent.orderStatus !== 'open'
    ) {
      logger.info('An intent found!✨ But it is not a Dutch V2 open intent.');
      this.lastSkippedIntentHash = rawIntent.orderHash;
      return null;
    }

    const intent = CosignedV2DutchOrder.parse(
      rawIntent.encodedOrder,
      config.chainId,
      PERMIT2_ADDRESS,
    );

    if (!intent.info.outputs[0]) {
      logger.info('An intent found!✨ But it has no output token.');
      this.lastSkippedIntentHash = rawIntent.orderHash;
      return null;
    }

    const intentInputToken = getTargetToken(
      intent.info.input,
      this.inputTokens,
    );
    if (!intentInputToken) {
      let nonTargetInputSymbol = 'ETH';

      if (intent.info.input.token !== ADDRESS_ZERO) {
        const nonTargetInputToken = ERC20__factory.connect(
          intent.info.input.token,
          this.wallet,
        );
        nonTargetInputSymbol = await nonTargetInputToken.symbol();
      }

      logger.info(
        `An intent found!✨ But input token is not targeted: ${nonTargetInputSymbol}`,
      );
      this.lastSkippedIntentHash = rawIntent.orderHash;
      return null;
    }
    const intentOutputToken = getTargetToken(
      intent.info.outputs[0],
      this.outputTokens,
    );
    if (!intentOutputToken) {
      let nonTargetInputSymbol = 'ETH';

      if (intent.info.outputs[0].token !== ADDRESS_ZERO) {
        const nonTargetInputToken = ERC20__factory.connect(
          intent.info.outputs[0].token,
          this.wallet,
        );
        nonTargetInputSymbol = await nonTargetInputToken.symbol();
      }

      logger.info(
        `An intent found!✨ But output token is not targeted: ${nonTargetInputSymbol}`,
      );
      this.lastSkippedIntentHash = rawIntent.orderHash;
      return null;
    }

    const startTime = intent.info.cosignerData.decayStartTime;
    if (startTime > nowTimestamp()) {
      logger.info(
        `An intent found!✨ But it is not started yet: ${new Date(startTime * 1000).toTimeString()}`,
      );
      this.lastSkippedIntentHash = rawIntent.orderHash;
      return null;
    }

    const endTime = intent.info.cosignerData.decayEndTime;
    const deadline = intent.info.deadline;
    if (endTime < nowTimestamp() || deadline < nowTimestamp()) {
      logger.info(
        `An intent found!✨ But it is expired: ${new Date(endTime * 1000).toTimeString()}`,
      );
      this.lastSkippedIntentHash = rawIntent.orderHash;
      return null;
    }

    const resolvedAmount = intent.resolve({ timestamp: nowTimestamp() })
      .outputs[0]!.amount;
    const outputTokenBalance = await intentOutputToken.balanceOf(
      this.wallet.address,
    );
    if (outputTokenBalance.lt(resolvedAmount)) {
      const tokenSymbol = await intentOutputToken.symbol();
      const tokenDecimals = await intentOutputToken.decimals();
      logger.info(
        `An intent found!✨ But balance is not enough (resolved amount: ${formatUnits(resolvedAmount, tokenDecimals)} ${tokenSymbol} balance: ${formatUnits(outputTokenBalance, tokenDecimals)} ${tokenSymbol})`,
      );
      this.lastSkippedIntentHash = rawIntent.orderHash;
      return null;
    }

    logger.info('An suitable intent found!✨');
    logger.info(`intent: ${JSON.stringify(intent)}`);

    return {
      intent,
      signature: rawIntent.signature,
    };
  }
}
