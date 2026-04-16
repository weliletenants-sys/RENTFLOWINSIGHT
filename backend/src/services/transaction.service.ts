export class TransactionService {
  /**
   * FATAL DEPRECATION: Single-sided GeneralLedger inserts are physically impossible in V2 True Financial Ledger Architecture.
   * Do not use. Use `LedgerService.transferWithIdempotency()` or `LedgerService.recordDoubleEntry()` directly.
   */
  static async createLedgerTransaction(payload: any) {
    throw new Error("TransactionService is DEPRECATED. Use V2 LedgerService for atomic, double-entry financial mutations.");
  }
}
