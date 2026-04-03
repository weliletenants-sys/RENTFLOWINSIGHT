import { Request, Response } from 'express';
import { FunderEventBus, FUNDER_EVENTS } from '../events/funder.events';

export const streamFunderEvents = (req: Request, res: Response) => {
  const userId = req.user?.sub || req.user?.id;
  
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized stream attempt' });
  }

  // SSE Required Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); // Establish the stream

  // Send an initial handshake ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'SSE Stream Established' })}\n\n`);

  // Event dispatchers pointing to the connected client
  
  const handleDepositRequested = (payload: any) => {
    if (payload.userId === userId) {
      res.write(`data: ${JSON.stringify({ type: 'INVALIDATE', keys: ['funder_wallet', 'notifications'] })}\n\n`);
    }
  };

  const handleWithdrawalRequested = (payload: any) => {
    if (payload.userId === userId) {
      res.write(`data: ${JSON.stringify({ type: 'INVALIDATE', keys: ['funder_wallet', 'wallet_operations', 'notifications'] })}\n\n`);
    }
  };
  
  const handleP2pTransfer = (payload: any) => {
    if (payload.senderId === userId || payload.recipientId === userId) {
      res.write(`data: ${JSON.stringify({ type: 'INVALIDATE', keys: ['funder_wallet', 'notifications'] })}\n\n`);
    }
  };

  const handleWalletCredited = (payload: any) => {
    if (payload.userId === userId) {
      res.write(`data: ${JSON.stringify({ type: 'INVALIDATE', keys: ['funder_wallet', 'notifications'] })}\n\n`);
      res.write(`data: ${JSON.stringify({ type: 'TOAST', message: 'Funds have been credited to your wallet!', variant: 'success' })}\n\n`);
    }
  };

  const handlePortfolioMatured = (payload: any) => {
    if (payload.userId === userId) {
      res.write(`data: ${JSON.stringify({ type: 'INVALIDATE', keys: ['funder_portfolio'] })}\n\n`);
    }
  };

  // Register listeners
  FunderEventBus.on(FUNDER_EVENTS.DEPOSIT_REQUESTED, handleDepositRequested);
  FunderEventBus.on(FUNDER_EVENTS.WITHDRAWAL_REQUESTED, handleWithdrawalRequested);
  FunderEventBus.on(FUNDER_EVENTS.P2P_TRANSFER_SUCCESS, handleP2pTransfer);
  FunderEventBus.on(FUNDER_EVENTS.WALLET_CREDITED, handleWalletCredited);
  FunderEventBus.on(FUNDER_EVENTS.PORTFOLIO_MATURED, handlePortfolioMatured);

  // Keep-alive ping every 30 seconds to prevent reverse-proxy timeout
  const keepAlive = setInterval(() => {
    res.write(':\n\n');
  }, 30000);

  // Clean up when client drops connection
  req.on('close', () => {
    clearInterval(keepAlive);
    FunderEventBus.off(FUNDER_EVENTS.DEPOSIT_REQUESTED, handleDepositRequested);
    FunderEventBus.off(FUNDER_EVENTS.WITHDRAWAL_REQUESTED, handleWithdrawalRequested);
    FunderEventBus.off(FUNDER_EVENTS.P2P_TRANSFER_SUCCESS, handleP2pTransfer);
    FunderEventBus.off(FUNDER_EVENTS.WALLET_CREDITED, handleWalletCredited);
    FunderEventBus.off(FUNDER_EVENTS.PORTFOLIO_MATURED, handlePortfolioMatured);
    res.end();
  });
};
