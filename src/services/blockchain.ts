// src/services/blockchain.ts
import { createPublicClient, http, webSocket } from 'viem';
import { mainnet } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://mainnet.infura.io/v3/e386f52a75874c53a1b9da8e3f4e41ed')
});

