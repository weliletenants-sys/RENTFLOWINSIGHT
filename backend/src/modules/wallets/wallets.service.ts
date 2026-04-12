import { WalletsRepository } from './wallets.repository';
import { TransactionClient } from '../ledger/ledger.repository';

export class WalletsService {
  private walletsRepository: WalletsRepository;

  constructor() {
    this.walletsRepository = new WalletsRepository();
  }

  /**
   * Safe wrapper that interprets the Ledger's strict requirement that 
   * wallets are ONLY updated as a consequence of a Ledger entry.
   */
  async processLedgerEffect(
    tx: TransactionClient, 
    userId: string, 
    amount: number, 
    isCredit: boolean,
    ledgerEventId: string,
    ledgerEntryId: string | null = null,
    triggeredByType: string = 'system',
    triggeredById: string = 'system'
  ) {
    const delta = isCredit ? amount : -amount;
    return this.walletsRepository.applyBalanceDelta(tx, userId, delta, ledgerEventId, ledgerEntryId, triggeredByType, triggeredById);
  }
}
