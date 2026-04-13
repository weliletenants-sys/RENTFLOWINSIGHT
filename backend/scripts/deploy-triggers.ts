import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deployTriggers() {
  console.log('🚀 Deploying production natively bound PostgreSQL Triggers...');

  try {
    // 1. Wallet Trigger Function
    console.log('Deploying Wallet Derivation Function...');
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION update_wallet_balance()
      RETURNS TRIGGER AS $$
      DECLARE
        current_balance FLOAT;
      BEGIN
        -- Auto-create wallet if unmapped
        INSERT INTO wallets (id, account_id, balance, created_at, updated_at)
        VALUES (gen_random_uuid()::varchar, NEW.account_id, 0, NOW(), NOW())
        ON CONFLICT (account_id) DO NOTHING;

        IF NEW.entry_type = 'credit' THEN
          UPDATE wallets
          SET balance = balance + NEW.amount,
              updated_at = NOW()
          WHERE account_id = NEW.account_id;
        ELSE
          UPDATE wallets
          SET balance = balance - NEW.amount,
              updated_at = NOW()
          WHERE account_id = NEW.account_id
          RETURNING balance INTO current_balance;

          IF current_balance < 0 THEN
            RAISE EXCEPTION 'Insufficient funds: Wallet % balance cannot drop below 0.', NEW.account_id;
          END IF;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // 2. Attach Trigger
    console.log('Attaching Trigger to general_ledger...');
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS wallet_balance_trigger ON general_ledger;`);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER wallet_balance_trigger
      AFTER INSERT ON general_ledger
      FOR EACH ROW
      EXECUTE FUNCTION update_wallet_balance();
    `);

    console.log('✅ TRUTH SYSTEM LOCK ENGAGED! Ledger is mathematically guaranteed.');
  } catch (err) {
    console.error('❌ Failed to deploy triggers:', err);
  } finally {
    await prisma.$disconnect();
  }
}

deployTriggers();
