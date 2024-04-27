import express, { Request, Response } from 'express';
import { createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';
import dotenv from 'dotenv';
import { usdt } from './contract';
import * as admin from 'firebase-admin';
// import serviceAccount from './viem.json';  // Ensure the path and file name are correct
import * as serviceAccount from './viem.json';
import Transaction  from './models/Transactions';
import { connectDB } from './config/db';


dotenv.config();

const app = express();
const port = 3000;

// db connection
// connectDB()

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http('https://mainnet.infura.io/v3/e386f52a75874c53a1b9da8e3f4e41ed')  // Replace with your actual Infura Project ID
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

let unwatch: (() => void) | null = null;

app.get('/start-listening', async (req: Request, res: Response) => {
  try {
    if (!unwatch) {
      unwatch = publicClient.watchContractEvent({
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        abi: usdt,
        eventName: 'Transfer',
        onLogs: (logs) => {
          logs.forEach(log => {
            console.log(`Raw log value: ${log.args.value}`); // Log the raw value to ensure it's captured correctly
            const valueInUSDT = parseInt(log.args.value?.toString() ?? '0') / 1e6; // Adjust based on USDT's decimals
            console.log(`Transaction from ${log.args.from} to ${log.args.to}: ${valueInUSDT.toFixed(6)} USDT`);
            const newTransaction = new Transaction({
              from: log.args.from,
              to: log.args.to,
              value: valueInUSDT
            });
            newTransaction.save();
            if (valueInUSDT > 1000) {
              sendHighValueNotification(valueInUSDT);
            }
          });
        },
        onError: (error) => {
          console.error('Error in event listener:', error);
        }
      });
    }
    res.json({ message: 'Listening for USDT transfers...' });
  } catch (error) {
    console.error('Failed to start listening:', error);
    res.status(500).json({ error: 'Failed to start listening due to an error.' });
  }
});

app.get('/getUSDTIndex', async (req: Request, res: Response) => {
  // const fromAddress = req.body.from; // Ensure the request includes a 'from' field in the JSON body
  try {
    if (!unwatch) {
      unwatch = publicClient.watchContractEvent({
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        abi: usdt,
        eventName: 'Transfer',
        args: { from: "0x8644A2Ec8842894E14277df75b4269cC57DEfd9b" }, // Use the provided address from the request body
        // args: { from: fromAddress },
        onLogs: (logs) => {
          logs.forEach(log => {
            const valueInUSDT = parseInt(log.args.value?.toString() ?? '0') / 1e6; // Adjust based on USDT's decimals
            console.log(`Transaction from ${log.args.from} to ${log.args.to}: ${valueInUSDT.toFixed(6)} USDT`);
            const newTransaction = new Transaction({
              from: log.args.from,
              to: log.args.to,
              value: valueInUSDT
            });
            newTransaction.save();
            if (valueInUSDT > 1000) {
              sendHighValueNotification(valueInUSDT);
            }
          });
        },
        onError: (error) => {
          console.error('Error in event listener:', error);
        }
      });
    }
    res.json({ message: 'Started listening for USDT transfers from specified address.' });
  } catch (error) {
    console.error('Failed to start listening:', error);
    res.status(500).json({ error: 'Failed to start listening due to an error.' });
  }
});




app.get('/stop-listening', (req: Request, res: Response) => {
  if (unwatch) {
    unwatch();
    unwatch = null;
    res.json({ message: 'Stopped listening for USDT transfers.' });
  } else {
    res.json({ message: 'No active listener to stop.' });
  }
});

function sendHighValueNotification(valueInUSDT: number) {
  const message = {
    notification: {
      title: 'High Value USDT Transaction Detected',
      body: `A transfer of ${valueInUSDT.toFixed(2)} USDT has been made.`
    },
    topic: 'high-value-transactions'
  };
  admin.messaging().send(message)
    .then(response => console.log('Successfully sent notification:', response))
    .catch(error => console.error('Error sending notification:', error));
}


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});