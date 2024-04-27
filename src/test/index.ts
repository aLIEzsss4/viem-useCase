// import express, { Request, Response } from 'express';
// import { createPublicClient, http } from 'viem';
// import { mainnet } from 'viem/chains';
// import dotenv from 'dotenv';
// import { usdt } from './contract';
// import * as admin from 'firebase-admin';
// import * as serviceAccount from './viem.json';


// dotenv.config();

// const app = express();
// const port = 3000;

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
// });

// const publicClient = createPublicClient({
//   chain: mainnet,
//   transport: http('https://mainnet.infura.io/v3/e386f52a75874c53a1b9da8e3f4e41ed')
// });

// app.get('/', (req: Request, res: Response) => {
//   res.send('Hello World!');
// });

// let unwatch: (() => void) | null = null;

// app.get('/start-listening', async (req: Request, res: Response) => {
//   try {
//     if (!unwatch) {
//       unwatch = publicClient.watchContractEvent({
//         address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
//         abi: usdt,
//         eventName: 'Transfer',
//         onLogs: (logs) => {
//           console.log('Detected USDT Transfer:', logs);
//         },
//         onError: (error) => {
//           console.error('Error in event listener:', error);
//         }
//       });
//     }
//     res.json({ message: 'Listening for USDT transfers...' });
//   } catch (error) {
//     console.error('Failed to start listening:', error);
//     res.status(500).json({ error: 'Failed to start listening due to an error.' });
//   }
// });

// app.get('/stop-listening', (req: Request, res: Response) => {
//   if (unwatch) {
//     unwatch();
//     unwatch = null;
//     res.json({ message: 'Stopped listening for USDT transfers.' });
//   } else {
//     res.json({ message: 'No active listener to stop.' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
