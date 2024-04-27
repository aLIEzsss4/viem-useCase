import { Hono } from 'hono';
import { usdtRoutes} from './routes/usdt';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

// Use usdtRoutes as middleware
app.route('/usdt', usdtRoutes); // Use `route` instead of `use` if usdtRoutes is a Hono instance

export default app;


