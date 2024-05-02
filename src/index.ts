import { Hono } from 'hono';
import dotenv from 'dotenv';
import { publicClient } from './service/client';
import Transaction from './model/dbConfig';
import { connectDB } from './model/dbConfig';
import { usdtAbi } from './abi/usdtAbi';

dotenv.config();

const app = new Hono();


app.get('/', (c) => c.text('Hello World!'));

let unwatch: (() => void) | null = null;

app.get('/start-listening', async (c) => {
  if (!unwatch) {
    unwatch = publicClient.watchContractEvent({
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      abi: usdtAbi,
      eventName: 'Transfer',
      onLogs: (logs) => {
        logs.forEach(log => {
          const transferValue = parseTransferValue(log.data); 
          if (transferValue > 1) {
            sendPushNotification(); // Send a mock push notification
          }
        });
      },
      onError: (error) => {
        console.error('Error in event listener:', error);
      }
    });
  }
  return c.json({ message: 'Listening for USDT transfers...' });
});

function parseTransferValue(data) {
  const transferValue = parseInt(data, 16);
  return transferValue;
}



async function sendPushNotification() {
  console.log("amount exceeds 100000 USDT, sending push notification...");
}



app.get('/getUSDTIndex', async (c) => {
  try {
    if (!unwatch) {
      unwatch = publicClient.watchContractEvent({
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        abi: usdtAbi,
        eventName: 'Transfer',
        args: { from: "0x56c243BD5B43A84dAb5dF3C4Bc0a61256C2Acf1e" }, 
        onLogs: (logs) => {
          logs.forEach(log => {
            const transferValue = parseTransferValue(log.data); 
            console.log(`Transaction from ${log.args.from} to ${log.args.to}: ${transferValue.toFixed(6)} USDT`);
            const newTransaction = new Transaction({
              from: log.args.from,
              to: log.args.to,
              value: transferValue
            });
            newTransaction.save();
            if (transferValue > 1) {
              sendPushNotification();
            }
            else {
              console.log('Transaction value is less than 1 USDT.');
            }
          });
        },
        onError: (error) => {
          console.error('Error in event listener:', error);
        }
      });
    }
    return c.json({ message: 'Started listening for USDT transfers from specified address.' });
  } catch (error) {
    console.error('Failed to start listening:', error);
    return c.status(500);
  }
});
app.get('/sendLink', async (c) => {
  try {
    if (!unwatch) {
      unwatch = publicClient.watchContractEvent({
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        abi: usdtAbi,
        eventName: 'Transfer',
        onLogs: (logs) => {
          logs.forEach(log => {
            const transferValue = parseTransferValue(log.data); // Adjust based on USDT's decimals
            console.log(`Transaction from ${log.args.from} to ${log.args.to}: ${transferValue.toFixed(6)} USDT`);
            if (transferValue > 500) {
              console.log('Sending Link Tokens to recipient...');
             sendLinkToken(log.args.to); // Send link token to recipient
            }
          });
        },
        onError: (error) => {
          console.error('Error in event listener:', error);
        }
      });
    }
    return c.json({ message: 'Started listening for USDT transfers to send Link Tokens.' });
  } catch (error) {
    console.error('Failed to start listening:', error);
    return c.status(500);
  }
});

async function sendLinkToken(recipientAddress: string) {
  try {
    // Initialize your contract instance using Hono
    const contract = new LinkTokenContract(); 

    const transaction = await contract.sendLinkTokens(recipientAddress); 

    
    console.log(`Link tokens sent to address: ${recipientAddress}, Transaction Hash: ${transaction.hash}`);
  } catch (error) {
    console.error('Error sending link tokens:', error);
  }
}

export default app;