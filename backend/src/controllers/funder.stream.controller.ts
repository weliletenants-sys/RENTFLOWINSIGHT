import { Request, Response } from 'express';
import { getRedisClient } from '../config/redis.client';
import { FUNDER_EVENTS } from '../events/funder.events';

export const streamFunderEvents = (req: Request, res: Response) => {
  const userId = req.user?.sub || req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized stream attempt' });
  }

  // SSE Required Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); 

  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE Stream Established over Redis' })}\n\n`);

  // Duplicate the redis client strictly for pub/sub blocking needs
  const subscriber = getRedisClient().duplicate();
  const userChannel = `sse:user:${userId}`;

  subscriber.subscribe(userChannel, (err) => {
    if (err) console.error(`Failed to subscribe to ${userChannel}:`, err);
  });

  subscriber.on('message', (channel, message) => {
    if (channel !== userChannel) return;
    
    try {
      const { eventName, payload } = JSON.parse(message);
      
      switch (eventName) {
        case FUNDER_EVENTS.DEPOSIT_REQUESTED:
        case FUNDER_EVENTS.P2P_TRANSFER_SUCCESS:
        case FUNDER_EVENTS.WALLET_CREDITED:
          res.write(`data: ${JSON.stringify({ type: 'INVALIDATE', keys: ['funder_wallet', 'notifications'] })}\n\n`);
          if (eventName === FUNDER_EVENTS.WALLET_CREDITED) {
            res.write(`data: ${JSON.stringify({ type: 'TOAST', message: 'Funds have been credited to your wallet!', variant: 'success' })}\n\n`);
          }
          break;
        case FUNDER_EVENTS.WITHDRAWAL_REQUESTED:
          res.write(`data: ${JSON.stringify({ type: 'INVALIDATE', keys: ['funder_wallet', 'wallet_operations', 'notifications'] })}\n\n`);
          break;
        case FUNDER_EVENTS.PORTFOLIO_MATURED:
        case FUNDER_EVENTS.ANGEL_POOL_INVESTMENT:
          res.write(`data: ${JSON.stringify({ type: 'INVALIDATE', keys: ['funder_portfolio'] })}\n\n`);
          break;
      }
    } catch (err) {
      console.error('SSE Payload parsing error:', err);
    }
  });

  // Keep-alive ping every 30 seconds to prevent reverse-proxy timeout
  const keepAlive = setInterval(() => {
    res.write(':\n\n');
  }, 30000);

  // Clean up gracefully
  req.on('close', () => {
    clearInterval(keepAlive);
    subscriber.unsubscribe(userChannel);
    subscriber.quit();
    res.end();
  });
};
