// src/routes/usdt.ts
import { Hono } from 'hono';
import { publicClient } from '../services/blockchain';

export const usdtRoutes = new Hono();

let unwatch: (() => void) | null = null;

usdtRoutes.get('/start-listening', async (req: Request<unknown, CfProperties<unknown>>, res: Response) => {
  try {
    if (!unwatch) {
      unwatch = publicClient.watchContractEvent({
        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        abi: usdt,
        eventName: 'Transfer',
        onLogs: (logs) => {
          console.log('Detected USDT Transfer:', logs);
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

usdtRoutes.get('/stop-listening', (req: Request, res: Response) => {
  if (unwatch) {
    unwatch();
    unwatch = null;
    res.json({ message: 'Stopped listening for USDT transfers.' });
  } else {
    res.json({ message: 'No active listener to stop.' });
  }
});
