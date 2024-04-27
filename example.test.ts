import { createPublicClient, http } from 'viem';
import { usdt } from './src/abi/usdt';
import { mainnet } from 'viem/chains';

const client = createPublicClient({
  chain: mainnet,
  transport: http('https://mainnet.infura.io/v3/e386f52a75874c53a1b9da8e3f4e41ed'),
});

// async function getBlockNumber() {
//   return await client.getBlockNumber();
// }

async function watchUSDTTransfers() {
  const filter = await client.createContractEventFilter({
    abi: usdt,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    eventName: 'Transfer',
    fromBlock: BigInt(19744930)
  });

  const logs = await client.getFilterLogs({ filter })
  console.log(logs)

} 



// export function
export { 
  // getBlockNumber,
  watchUSDTTransfers
 };
