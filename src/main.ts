// main.ts

import { config } from './config';
import { logger } from './logger';
import { V2DutchOrderReactor__factory } from '@banr1/uniswapx-sdk/dist/src/contracts';
import { constants, providers, Wallet } from 'ethers';
import { IdentificationService } from './services/identification-service';
import { FillService } from './services/fill-service';
import { REACTOR_ADDRESS } from './constants';
import { sleep } from './utils';
import { ERC20__factory } from './types/typechain';
import { formatUnits } from 'ethers/lib/utils';

async function monitorIntent(
  identificationService: IdentificationService,
  fillService: FillService,
): Promise<void> {
  // Step 1: Identify the intent
  // Identify the intent from the UniswapX API
  const intent = await identificationService.identifyIntent();
  if (intent === null) return;

  // Step 2: Fill the intent
  // Fill the intent with the signature
  await fillService.fillIntent(intent);
}

async function main(): Promise<void> {
  // Prepare the environment
  const {
    alchemyUrl,
    privateKey,
    interval,
    targetInputTokenAddresses,
    targetOutputTokenAddresses,
  } = config;

  const provider = new providers.JsonRpcProvider(alchemyUrl);
  const wallet = new Wallet(privateKey, provider);
  const reactor = V2DutchOrderReactor__factory.connect(REACTOR_ADDRESS, wallet);

  const inputTokens = targetInputTokenAddresses.map(address =>
    ERC20__factory.connect(address, wallet),
  );
  const outputTokens = [];
  // Run sequentially to avoid nonce issues
  for (const address of targetOutputTokenAddresses) {
    const outputToken = ERC20__factory.connect(address, wallet);
    await outputToken.approve(REACTOR_ADDRESS, constants.MaxUint256);
    const outputTokenSymbol = await outputToken.symbol();
    const outputTokenBalance = await outputToken.balanceOf(wallet.address);
    const outputTokenDecimal = await outputToken.decimals();
    logger.info(`Approved🖊️ ${outputTokenSymbol} for UniswapX Reactor`);
    logger.info(
      `Balance💰: ${formatUnits(outputTokenBalance, outputTokenDecimal)} ${outputTokenSymbol}`,
    );
    outputTokens.push(outputToken);
  }
  logger.info('Preparation completed 🌱');

  // Initialize the services
  const identificationService = new IdentificationService({
    wallet,
    inputTokens,
    outputTokens,
  });
  const fillService = new FillService({
    wallet,
    reactor,
    inputTokens,
    outputTokens,
  });

  logger.info(
    `Starting the main function 🚀 with ${interval / 1000}s interval`,
  );

  while (true) {
    await monitorIntent(identificationService, fillService);
    await sleep(interval);
  }
}

main();
