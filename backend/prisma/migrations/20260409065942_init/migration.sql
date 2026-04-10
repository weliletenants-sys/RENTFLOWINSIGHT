-- CreateTable
CREATE TABLE "agent_advance_ledger" (
    "amount_deducted" DOUBLE PRECISION NOT NULL,
    "closing_balance" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "deduction_status" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "interest_accrued" DOUBLE PRECISION NOT NULL,
    "opening_balance" DOUBLE PRECISION NOT NULL,
    "advance_id" TEXT,

    CONSTRAINT "agent_advance_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_advance_topups" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "topped_up_by" TEXT NOT NULL,

    CONSTRAINT "agent_advance_topups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_advances" (
    "created_at" TEXT NOT NULL,
    "cycle_days" DOUBLE PRECISION NOT NULL,
    "daily_rate" DOUBLE PRECISION NOT NULL,
    "expires_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "issued_at" TEXT NOT NULL,
    "issued_by" TEXT NOT NULL,
    "outstanding_balance" DOUBLE PRECISION NOT NULL,
    "principal" DOUBLE PRECISION NOT NULL,
    "registration_fee" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "agent_id" TEXT,
    "advance_type" TEXT,
    "expected_date" TEXT,
    "reason" TEXT,

    CONSTRAINT "agent_advances_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_collections" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "float_after" DOUBLE PRECISION NOT NULL,
    "float_before" DOUBLE PRECISION NOT NULL,
    "id" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "agent_id" TEXT,
    "location_name" TEXT,
    "momo_payer_name" TEXT,
    "momo_phone" TEXT,
    "momo_provider" TEXT,
    "momo_transaction_id" TEXT,
    "notes" TEXT,
    "sms_sent_agent" BOOLEAN,
    "sms_sent_tenant" BOOLEAN,
    "tenant_id" TEXT,
    "token_id" TEXT,
    "tracking_id" TEXT,
    "visit_id" TEXT,

    CONSTRAINT "agent_collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_commission_payouts" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "mobile_money_number" TEXT NOT NULL,
    "mobile_money_provider" TEXT NOT NULL,
    "processed_at" TEXT,
    "processed_by" TEXT,
    "rejection_reason" TEXT,
    "requested_at" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transaction_id" TEXT,
    "updated_at" TEXT NOT NULL,
    "agent_id" TEXT,

    CONSTRAINT "agent_commission_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_earnings" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "description" TEXT,
    "earning_type" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "rent_request_id" TEXT,
    "source_user_id" TEXT,
    "agent_id" TEXT,

    CONSTRAINT "agent_earnings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_float_limits" (
    "assigned_by" TEXT,
    "collected_today" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "float_limit" DOUBLE PRECISION NOT NULL,
    "id" TEXT NOT NULL,
    "last_reset_date" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "agent_float_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_goals" (
    "created_at" TEXT NOT NULL,
    "goal_month" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "notes" TEXT,
    "target_activations" DOUBLE PRECISION,
    "target_registrations" DOUBLE PRECISION NOT NULL,
    "updated_at" TEXT NOT NULL,
    "agent_id" TEXT,

    CONSTRAINT "agent_goals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_receipts" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "notes" TEXT,
    "payer_name" TEXT NOT NULL,
    "payer_phone" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,
    "receipt_image_url" TEXT,
    "transaction_id" TEXT,
    "agent_id" TEXT,

    CONSTRAINT "agent_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_subagents" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "parent_agent_id" TEXT,
    "sub_agent_id" TEXT,

    CONSTRAINT "agent_subagents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_visits" (
    "accuracy" DOUBLE PRECISION,
    "checked_in_at" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "agent_id" TEXT,
    "location_name" TEXT,
    "tenant_id" TEXT,

    CONSTRAINT "agent_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_chat_messages" (
    "content" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "ai_chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversation_participants" (
    "id" TEXT NOT NULL,
    "joined_at" TEXT NOT NULL,
    "last_read_at" TEXT,
    "conversation_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_access_limits" (
    "base_limit" DOUBLE PRECISION NOT NULL,
    "bonus_from_landlord_rent" DOUBLE PRECISION NOT NULL,
    "bonus_from_ratings" DOUBLE PRECISION NOT NULL,
    "bonus_from_receipts" DOUBLE PRECISION NOT NULL,
    "bonus_from_rent_history" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "total_limit" DOUBLE PRECISION,
    "updated_at" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "credit_access_limits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_request_details" (
    "agent_id" TEXT,
    "agent_verified" BOOLEAN,
    "agent_verified_at" TEXT,
    "borrower_mm_name" TEXT NOT NULL,
    "borrower_phone" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "duration_days" DOUBLE PRECISION NOT NULL,
    "electricity_meter_number" TEXT,
    "funder_interest_rate" DOUBLE PRECISION NOT NULL,
    "id" TEXT NOT NULL,
    "landlord_id" TEXT,
    "landlord_name" TEXT NOT NULL,
    "landlord_on_platform" BOOLEAN,
    "landlord_phone" TEXT NOT NULL,
    "loan_id" TEXT,
    "location_address" TEXT,
    "location_latitude" DOUBLE PRECISION,
    "location_longitude" DOUBLE PRECISION,
    "platform_fee_amount" DOUBLE PRECISION NOT NULL,
    "platform_fee_rate" DOUBLE PRECISION NOT NULL,
    "repayment_frequency" TEXT NOT NULL,
    "total_with_fees" DOUBLE PRECISION NOT NULL,
    "updated_at" TEXT NOT NULL,
    "water_meter_number" TEXT,
    "borrower_id" TEXT,

    CONSTRAINT "credit_request_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deposit_requests" (
    "agent_id" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "approved_at" TEXT,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "notes" TEXT,
    "processed_by" TEXT,
    "provider" TEXT,
    "rejected_at" TEXT,
    "rejection_reason" TEXT,
    "status" TEXT NOT NULL,
    "transaction_date" TEXT,
    "transaction_id" TEXT,
    "updated_at" TEXT NOT NULL,
    "user_id" TEXT,
    "coo_id" TEXT,
    "coo_approved_at" TEXT,
    "cfo_id" TEXT,
    "cfo_approved_at" TEXT,

    CONSTRAINT "deposit_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "earning_baselines" (
    "id" TEXT NOT NULL,
    "avg_daily_earnings" DOUBLE PRECISION,
    "avg_receipts_per_day" DOUBLE PRECISION,
    "avg_referrals_per_week" DOUBLE PRECISION,
    "avg_weekly_earnings" DOUBLE PRECISION,
    "last_calculated_at" TEXT,
    "receipt_count_7d" DOUBLE PRECISION,
    "referral_count_7d" DOUBLE PRECISION,
    "total_agent_earnings" DOUBLE PRECISION,

    CONSTRAINT "earning_baselines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "earning_predictions" (
    "assumptions" JSONB,
    "confidence" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "predicted_earnings" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "earning_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "general_ledger" (
    "account" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "description" TEXT,
    "direction" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "linked_party" TEXT,
    "reference_id" TEXT,
    "running_balance" DOUBLE PRECISION,
    "source_id" TEXT,
    "source_table" TEXT NOT NULL,
    "transaction_date" TEXT NOT NULL,
    "transaction_group_id" TEXT,
    "user_id" TEXT,
    "from_bucket" TEXT,
    "to_bucket" TEXT,
    "role_type" TEXT,
    "scope" TEXT,
    "account_type" TEXT,

    CONSTRAINT "general_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updated_by" TEXT,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investment_withdrawal_requests" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "earliest_process_date" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "processed_at" TEXT,
    "processed_by" TEXT,
    "reason" TEXT,
    "rejection_reason" TEXT,
    "requested_at" TEXT NOT NULL,
    "rewards_paused" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "investment_withdrawal_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_portfolios" (
    "account_name" TEXT,
    "account_number" TEXT,
    "activation_token" TEXT NOT NULL,
    "bank_name" TEXT,
    "created_at" TEXT NOT NULL,
    "duration_months" DOUBLE PRECISION NOT NULL,
    "id" TEXT NOT NULL,
    "investment_amount" DOUBLE PRECISION NOT NULL,
    "investor_id" TEXT,
    "invite_id" TEXT,
    "maturity_date" TEXT,
    "mobile_money_number" TEXT,
    "mobile_network" TEXT,
    "next_roi_date" TEXT,
    "payment_method" TEXT,
    "portfolio_code" TEXT NOT NULL,
    "portfolio_pin" TEXT NOT NULL,
    "roi_mode" TEXT NOT NULL,
    "roi_percentage" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "total_roi_earned" DOUBLE PRECISION NOT NULL,
    "agent_id" TEXT,
    "payout_day" DOUBLE PRECISION,
    "auto_renew" BOOLEAN DEFAULT false,

    CONSTRAINT "investor_portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landlords" (
    "account_number" TEXT,
    "bank_name" TEXT,
    "caretaker_name" TEXT,
    "caretaker_phone" TEXT,
    "cell" TEXT,
    "country" TEXT,
    "county" TEXT,
    "created_at" TEXT NOT NULL,
    "description" TEXT,
    "desired_rent_from_welile" DOUBLE PRECISION,
    "district" TEXT,
    "electricity_meter_number" TEXT,
    "has_smartphone" BOOLEAN,
    "house_category" TEXT,
    "house_number" TEXT,
    "id" TEXT NOT NULL,
    "is_agent_managed" BOOLEAN,
    "latitude" DOUBLE PRECISION,
    "location_captured_at" TEXT,
    "location_captured_by" TEXT,
    "longitude" DOUBLE PRECISION,
    "managed_by_agent_id" TEXT,
    "management_fee_rate" DOUBLE PRECISION,
    "mobile_money_name" TEXT,
    "mobile_money_number" TEXT,
    "monthly_rent" DOUBLE PRECISION,
    "name" TEXT NOT NULL,
    "number_of_houses" DOUBLE PRECISION,
    "number_of_rooms" DOUBLE PRECISION,
    "phone" TEXT NOT NULL,
    "property_address" TEXT NOT NULL,
    "ready_to_receive" BOOLEAN,
    "region" TEXT,
    "registered_by" TEXT,
    "rent_balance_due" DOUBLE PRECISION NOT NULL,
    "rent_last_paid_amount" DOUBLE PRECISION,
    "rent_last_paid_at" TEXT,
    "sub_county" TEXT,
    "tenant_id" TEXT,
    "tin" TEXT,
    "town_council" TEXT,
    "verification_pin_1" TEXT,
    "verification_pin_2" TEXT,
    "verified" BOOLEAN,
    "verified_at" TEXT,
    "verified_by" TEXT,
    "village" TEXT,
    "water_meter_number" TEXT,

    CONSTRAINT "landlords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lc1_chairpersons" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "village" TEXT NOT NULL,

    CONSTRAINT "lc1_chairpersons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_account_groups" (
    "description" TEXT NOT NULL,
    "group_code" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,

    CONSTRAINT "ledger_account_groups_pkey" PRIMARY KEY ("group_id")
);

-- CreateTable
CREATE TABLE "ledger_accounts" (
    "account_code" TEXT NOT NULL,
    "allow_negative" BOOLEAN,
    "created_at" TEXT,
    "currency" TEXT,
    "owner_id" TEXT,
    "owner_type" TEXT,
    "account_id" TEXT NOT NULL,
    "group_id" TEXT,

    CONSTRAINT "ledger_accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "currency" TEXT,
    "direction" TEXT NOT NULL,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_transactions" (
    "id" TEXT NOT NULL,
    "approved_by" TEXT,
    "category" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "description" TEXT,
    "initiated_by" TEXT,
    "source_id" TEXT,
    "source_table" TEXT,
    "transaction_group_id" TEXT,

    CONSTRAINT "ledger_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_applications" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "loan_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_requests" (
    "accuracy" DOUBLE PRECISION,
    "captured_at" TEXT,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "requested_by" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "target_role" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "rent_request_id" TEXT,
    "target_user_id" TEXT,

    CONSTRAINT "location_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "content" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "read_at" TEXT,
    "conversation_id" TEXT,
    "sender_id" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "money_requests" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "description" TEXT,
    "id" TEXT NOT NULL,
    "responded_at" TEXT,
    "status" TEXT NOT NULL,
    "recipient_id" TEXT,
    "requester_id" TEXT,

    CONSTRAINT "money_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "created_at" TEXT,
    "id" TEXT NOT NULL,
    "is_read" BOOLEAN,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "updated_at" TEXT,
    "user_id" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_targets" (
    "achieved_count" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "target_count" DOUBLE PRECISION NOT NULL,
    "target_month" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "onboarding_targets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity_summaries" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "notes" TEXT,
    "posted_by" TEXT NOT NULL,
    "total_agents" DOUBLE PRECISION NOT NULL,
    "total_landlords" DOUBLE PRECISION NOT NULL,
    "total_rent_requested" DOUBLE PRECISION NOT NULL,
    "total_requests" DOUBLE PRECISION NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "opportunity_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_verifications" (
    "attempts" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "expires_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "otp_code" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "verified_at" TEXT,

    CONSTRAINT "otp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_escalations" (
    "created_at" TEXT NOT NULL,
    "details" TEXT,
    "escalation_type" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "portfolio_id" TEXT,
    "resolved_at" TEXT,
    "resolved_by" TEXT,
    "status" TEXT NOT NULL,

    CONSTRAINT "partner_escalations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_tokens" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "expires_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "token_code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL,
    "used_at" TEXT,
    "visit_id" TEXT,
    "agent_id" TEXT,
    "tenant_id" TEXT,

    CONSTRAINT "payment_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pending_wallet_operations" (
    "account" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "description" TEXT,
    "direction" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "linked_party" TEXT,
    "metadata" JSONB,
    "reference_id" TEXT,
    "rejection_reason" TEXT,
    "reviewed_at" TEXT,
    "reviewed_by" TEXT,
    "source_id" TEXT,
    "source_table" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "transaction_group_id" TEXT,
    "updated_at" TEXT NOT NULL,
    "user_id" TEXT,
    "manager_id" TEXT,
    "manager_approved_at" TIMESTAMP(3),
    "cfo_id" TEXT,
    "cfo_approved_at" TIMESTAMP(3),
    "coo_id" TEXT,
    "coo_approved_at" TIMESTAMP(3),
    "ip_address" TEXT,
    "device_info" TEXT,
    "external_tx_id" TEXT,

    CONSTRAINT "pending_wallet_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "color" TEXT,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "created_at" TEXT NOT NULL,
    "display_order" DOUBLE PRECISION NOT NULL,
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_orders" (
    "agent_commission" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "delivery_notes" TEXT,
    "estimated_delivery_date" TEXT,
    "id" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "status_updated_at" TEXT,
    "total_price" DOUBLE PRECISION NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "user_id" TEXT,
    "product_id" TEXT,

    CONSTRAINT "product_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_reviews" (
    "comment" TEXT,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "order_id" TEXT,
    "rating" DOUBLE PRECISION NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "product_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "active" BOOLEAN NOT NULL,
    "category" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "description" TEXT,
    "discount_ends_at" TEXT,
    "discount_percentage" DOUBLE PRECISION,
    "id" TEXT NOT NULL,
    "image_url" TEXT,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" DOUBLE PRECISION NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "agent_type" TEXT,
    "avatar_url" TEXT,
    "city" TEXT,
    "country" TEXT,
    "country_code" TEXT,
    "created_at" TEXT NOT NULL,
    "email" TEXT,
    "frozen_at" TEXT,
    "frozen_reason" TEXT,
    "full_name" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "is_frozen" BOOLEAN NOT NULL,
    "last_active_at" TEXT,
    "mobile_money_number" TEXT,
    "mobile_money_provider" TEXT,
    "monthly_rent" DOUBLE PRECISION,
    "national_id" TEXT,
    "phone" TEXT NOT NULL,
    "ai_id" TEXT,
    "referrer_id" TEXT,
    "rent_discount_active" BOOLEAN NOT NULL,
    "territory" TEXT,
    "updated_at" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "whatsapp_verified" BOOLEAN,
    "whatsapp_verified_at" TEXT,
    "password_hash" TEXT,
    "role" TEXT,
    "kyc_status" TEXT NOT NULL DEFAULT 'NOT_SUBMITTED',
    "kyc_submitted_at" TEXT,
    "kyc_approved_at" TEXT,
    "kyc_rejected_reason" TEXT,
    "is_2fa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "two_factor_expires_at" TEXT,
    "two_factor_otp" TEXT,
    "has_accepted_platform_terms" BOOLEAN NOT NULL DEFAULT false,
    "platform_terms_accepted_at" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "push_subscriptions" (
    "auth" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "p256dh" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "push_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receipt_numbers" (
    "created_at" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "receipt_code" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "vendor_amount" DOUBLE PRECISION,
    "vendor_marked_at" TEXT,
    "vendor_id" TEXT,

    CONSTRAINT "receipt_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referral_rewards" (
    "created_at" TEXT NOT NULL,
    "credited" BOOLEAN NOT NULL,
    "credited_at" TEXT,
    "id" TEXT NOT NULL,
    "rank" DOUBLE PRECISION NOT NULL,
    "referral_count" DOUBLE PRECISION NOT NULL,
    "reward_amount" DOUBLE PRECISION NOT NULL,
    "reward_month" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "referral_rewards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referrals" (
    "bonus_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "credited" BOOLEAN NOT NULL,
    "credited_at" TEXT,
    "first_transaction_bonus_amount" DOUBLE PRECISION,
    "first_transaction_bonus_credited" BOOLEAN,
    "first_transaction_bonus_credited_at" TEXT,
    "id" TEXT NOT NULL,
    "referred_id" TEXT,
    "referrer_id" TEXT,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rent_requests" (
    "access_fee" DOUBLE PRECISION NOT NULL,
    "agent_id" TEXT,
    "agent_verified" BOOLEAN,
    "agent_verified_at" TEXT,
    "agent_verified_by" TEXT,
    "amount_repaid" DOUBLE PRECISION NOT NULL,
    "approval_comment" TEXT,
    "approved_at" TEXT,
    "approved_by" TEXT,
    "created_at" TEXT NOT NULL,
    "daily_repayment" DOUBLE PRECISION NOT NULL,
    "disbursed_at" TEXT,
    "duration_days" DOUBLE PRECISION NOT NULL,
    "fund_recipient_id" TEXT,
    "fund_recipient_name" TEXT,
    "fund_recipient_type" TEXT,
    "fund_routed_at" TEXT,
    "funded_at" TEXT,
    "house_category" TEXT,
    "id" TEXT NOT NULL,
    "lc1_id" TEXT NOT NULL,
    "manager_verified" BOOLEAN,
    "manager_verified_at" TEXT,
    "manager_verified_by" TEXT,
    "next_roi_due_date" TEXT,
    "number_of_payments" DOUBLE PRECISION,
    "rejected_reason" TEXT,
    "rent_amount" DOUBLE PRECISION NOT NULL,
    "request_city" TEXT,
    "request_country" TEXT,
    "request_fee" DOUBLE PRECISION NOT NULL,
    "request_latitude" DOUBLE PRECISION,
    "request_longitude" DOUBLE PRECISION,
    "roi_payments_count" DOUBLE PRECISION,
    "schedule_status" TEXT,
    "status" TEXT,
    "supporter_id" TEXT,
    "tenant_electricity_meter" TEXT,
    "tenant_no_smartphone" BOOLEAN NOT NULL,
    "tenant_water_meter" TEXT,
    "total_repayment" DOUBLE PRECISION NOT NULL,
    "total_roi_paid" DOUBLE PRECISION,
    "updated_at" TEXT NOT NULL,
    "landlord_id" TEXT,
    "tenant_id" TEXT,

    CONSTRAINT "rent_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repayments" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "rent_request_id" TEXT,
    "tenant_id" TEXT,

    CONSTRAINT "repayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_images" (
    "created_at" TEXT NOT NULL,
    "display_order" DOUBLE PRECISION NOT NULL,
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,

    CONSTRAINT "review_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_responses" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "response_text" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "review_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_votes" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "vote_type" TEXT NOT NULL,

    CONSTRAINT "review_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_charge_logs" (
    "amount_deducted" DOUBLE PRECISION NOT NULL,
    "charge_amount" DOUBLE PRECISION NOT NULL,
    "charge_date" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "debt_added" DOUBLE PRECISION NOT NULL,
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "wallet_balance_after" DOUBLE PRECISION,
    "wallet_balance_before" DOUBLE PRECISION,
    "subscription_id" TEXT,
    "tenant_id" TEXT,

    CONSTRAINT "subscription_charge_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_charges" (
    "accumulated_debt" DOUBLE PRECISION NOT NULL,
    "agent_charge_count" DOUBLE PRECISION NOT NULL,
    "agent_charged_amount" DOUBLE PRECISION NOT NULL,
    "agent_id" TEXT,
    "charge_agent_wallet" BOOLEAN NOT NULL,
    "charge_amount" DOUBLE PRECISION NOT NULL,
    "charges_completed" DOUBLE PRECISION NOT NULL,
    "charges_remaining" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "end_date" TEXT,
    "frequency" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "next_charge_date" TEXT NOT NULL,
    "rent_request_id" TEXT,
    "service_type" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tenant_failed_at" TEXT,
    "total_charged" DOUBLE PRECISION NOT NULL,
    "total_charges_due" DOUBLE PRECISION NOT NULL,
    "updated_at" TEXT NOT NULL,
    "tenant_id" TEXT,

    CONSTRAINT "subscription_charges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supporter_agreement_acceptance" (
    "accepted_at" TEXT NOT NULL,
    "agreement_version" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "device_info" TEXT,
    "id" TEXT NOT NULL,
    "ip_address" TEXT,
    "status" TEXT NOT NULL,
    "supporter_id" TEXT,

    CONSTRAINT "supporter_agreement_acceptance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supporter_invites" (
    "account_name" TEXT,
    "account_number" TEXT,
    "activated_at" TEXT,
    "activated_user_id" TEXT,
    "activation_token" TEXT NOT NULL,
    "bank_name" TEXT,
    "country" TEXT,
    "created_at" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "district_city" TEXT,
    "email" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "location_accuracy" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "mobile_money_number" TEXT,
    "mobile_network" TEXT,
    "national_id" TEXT,
    "next_of_kin_name" TEXT,
    "next_of_kin_phone" TEXT,
    "next_of_kin_relationship" TEXT,
    "parent_agent_id" TEXT,
    "payment_method" TEXT,
    "phone" TEXT NOT NULL,
    "property_address" TEXT,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "temp_password" TEXT,

    CONSTRAINT "supporter_invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supporter_referrals" (
    "bonus_amount" DOUBLE PRECISION,
    "bonus_credited" BOOLEAN,
    "bonus_credited_at" TEXT,
    "created_at" TEXT NOT NULL,
    "first_investment_at" TEXT,
    "id" TEXT NOT NULL,
    "referred_id" TEXT,
    "referrer_id" TEXT,

    CONSTRAINT "supporter_referrals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "supporter_roi_payments" (
    "created_at" TEXT NOT NULL,
    "due_date" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "paid_at" TEXT,
    "payment_number" DOUBLE PRECISION NOT NULL,
    "rent_amount" DOUBLE PRECISION NOT NULL,
    "roi_amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "rent_request_id" TEXT,
    "supporter_id" TEXT,

    CONSTRAINT "supporter_roi_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_events" (
    "created_at" TEXT,
    "event_type" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "metadata" JSONB,
    "processed" BOOLEAN,
    "processed_at" TEXT,
    "related_entity_id" TEXT,
    "related_entity_type" TEXT,
    "user_id" TEXT,

    CONSTRAINT "system_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_agreement_acceptance" (
    "accepted_at" TEXT NOT NULL,
    "agreement_version" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "device_info" TEXT,
    "id" TEXT NOT NULL,
    "ip_address" TEXT,
    "status" TEXT NOT NULL,
    "tenant_id" TEXT,

    CONSTRAINT "tenant_agreement_acceptance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_merchant_payments" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "merchant_name" TEXT NOT NULL,
    "notes" TEXT,
    "payment_date" TEXT NOT NULL,
    "tenant_id" TEXT,
    "tenant_phone" TEXT,
    "updated_at" TEXT NOT NULL,
    "agent_id" TEXT,
    "transaction_id" TEXT,

    CONSTRAINT "tenant_merchant_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_ratings" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "updated_at" TEXT NOT NULL,
    "landlord_id" TEXT,
    "tenant_id" TEXT,

    CONSTRAINT "tenant_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_approvals" (
    "id" TEXT NOT NULL,
    "approval_notes" TEXT,
    "approved_at" TEXT NOT NULL,
    "approved_by" TEXT NOT NULL,
    "transaction_id" TEXT,

    CONSTRAINT "transaction_approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activity_log" (
    "activity_type" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "metadata" JSONB,
    "performed_by" TEXT,
    "user_id" TEXT,

    CONSTRAINT "user_activity_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_loan_repayments" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "payment_method" TEXT NOT NULL,

    CONSTRAINT "user_loan_repayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_loans" (
    "agent_verified" BOOLEAN,
    "agent_verified_at" TEXT,
    "agent_verified_by" TEXT,
    "ai_insurance_accepted" BOOLEAN,
    "ai_insurance_accepted_at" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "due_date" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "interest_rate" DOUBLE PRECISION NOT NULL,
    "paid_amount" DOUBLE PRECISION NOT NULL,
    "repaid_at" TEXT,
    "repayment_frequency" TEXT,
    "status" TEXT NOT NULL,
    "total_repayment" DOUBLE PRECISION NOT NULL,
    "borrower_id" TEXT,
    "lender_id" TEXT,

    CONSTRAINT "user_loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_locations" (
    "accuracy" DOUBLE PRECISION,
    "address" TEXT,
    "captured_at" TEXT NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "verification_notes" TEXT,
    "verified" BOOLEAN,
    "verified_at" TEXT,
    "verified_by" TEXT,
    "user_id" TEXT,

    CONSTRAINT "user_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_receipts" (
    "claimed_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "items_description" TEXT NOT NULL,
    "loan_contribution" DOUBLE PRECISION,
    "rejection_reason" TEXT,
    "verified" BOOLEAN NOT NULL,
    "verified_at" TEXT,

    CONSTRAINT "user_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_reviews" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "review_text" TEXT,
    "reviewer_role" TEXT,
    "updated_at" TEXT NOT NULL,
    "reviewed_user_id" TEXT,
    "reviewer_id" TEXT,

    CONSTRAINT "user_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_risk_scores" (
    "consecutive_missed_payments" DOUBLE PRECISION,
    "consecutive_on_time_payments" DOUBLE PRECISION,
    "created_at" TEXT,
    "id" TEXT NOT NULL,
    "last_payment_date" TEXT,
    "last_risk_update" TEXT,
    "notes" TEXT,
    "risk_level" TEXT,
    "risk_score" DOUBLE PRECISION,
    "total_missed_payments" DOUBLE PRECISION,
    "total_on_time_payments" DOUBLE PRECISION,
    "updated_at" TEXT,
    "user_id" TEXT,

    CONSTRAINT "user_risk_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "created_at" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "active" BOOLEAN NOT NULL,
    "created_at" TEXT NOT NULL,
    "created_by" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "location" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "pin" TEXT,
    "pin_hash" TEXT,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "voided_ledger_entries" (
    "account" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "description" TEXT,
    "direction" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "linked_party" TEXT,
    "reference_id" TEXT,
    "running_balance" DOUBLE PRECISION,
    "source_id" TEXT,
    "source_table" TEXT NOT NULL,
    "transaction_date" TEXT NOT NULL,
    "transaction_group_id" TEXT,
    "user_id" TEXT,
    "void_reason" TEXT NOT NULL,
    "voided_at" TEXT NOT NULL,
    "voided_by" TEXT NOT NULL,

    CONSTRAINT "voided_ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_deposits" (
    "amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "deposit_type" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "agent_id" TEXT,
    "user_id" TEXT,

    CONSTRAINT "wallet_deposits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "amount" DOUBLE PRECISION NOT NULL,
    "balance_before" DOUBLE PRECISION,
    "balance_after" DOUBLE PRECISION,
    "created_at" TEXT NOT NULL,
    "description" TEXT,
    "id" TEXT NOT NULL,
    "recipient_id" TEXT,
    "sender_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "balance" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "welile_homes_subscriptions" (
    "created_at" TEXT NOT NULL,
    "email_statements_enabled" BOOLEAN,
    "id" TEXT NOT NULL,
    "landlord_id" TEXT,
    "landlord_registered" BOOLEAN NOT NULL,
    "last_interest_applied_at" TEXT,
    "last_statement_sent_at" TEXT,
    "monthly_rent" DOUBLE PRECISION NOT NULL,
    "months_enrolled" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "subscription_status" TEXT NOT NULL,
    "total_savings" DOUBLE PRECISION NOT NULL,
    "updated_at" TEXT NOT NULL,
    "tenant_id" TEXT,

    CONSTRAINT "welile_homes_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlists" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,

    CONSTRAINT "wishlists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawal_requests" (
    "amount" DOUBLE PRECISION NOT NULL,
    "cfo_approved_at" TEXT,
    "cfo_approved_by" TEXT,
    "coo_approved_at" TEXT,
    "coo_approved_by" TEXT,
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "manager_approved_at" TEXT,
    "manager_approved_by" TEXT,
    "mobile_money_name" TEXT,
    "mobile_money_number" TEXT,
    "mobile_money_provider" TEXT,
    "processed_at" TEXT,
    "processed_by" TEXT,
    "rejection_reason" TEXT,
    "status" TEXT NOT NULL,
    "transaction_id" TEXT,
    "updated_at" TEXT NOT NULL,
    "user_id" TEXT,

    CONSTRAINT "withdrawal_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "metadata" JSONB,
    "action_type" TEXT,
    "created_at" TEXT,
    "record_id" TEXT,
    "table_name" TEXT,
    "user_id" TEXT,
    "actor_role" TEXT,
    "ip_address" TEXT,
    "target_id" TEXT,
    "user_agent" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_profiles" (
    "id" TEXT NOT NULL,
    "created_at" TEXT,
    "created_by" TEXT,
    "department" TEXT,
    "employee_id" TEXT,
    "must_change_password" BOOLEAN,
    "position" TEXT,
    "updated_at" TEXT,
    "user_id" TEXT,

    CONSTRAINT "staff_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_profiles" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "occupation" TEXT,
    "work_address" TEXT,
    "home_address" TEXT,
    "village_cell" TEXT,
    "parish_ward" TEXT,
    "sub_county" TEXT,
    "district" TEXT,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "tenant_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landlord_details" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "landlord_name" TEXT NOT NULL,
    "landlord_phone" TEXT NOT NULL,
    "landlord_address" TEXT,
    "house_unit_number" TEXT,
    "next_of_kin_name" TEXT,
    "next_of_kin_phone" TEXT,
    "next_of_kin_relationship" TEXT,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "landlord_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repayment_schedules" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "total_repayment" DOUBLE PRECISION NOT NULL,
    "payback_period_days" DOUBLE PRECISION NOT NULL,
    "daily_repayment_amount" DOUBLE PRECISION NOT NULL,
    "start_date" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "repayment_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identity_documents" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "document_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TEXT NOT NULL,

    CONSTRAINT "identity_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lc1_documents" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "consented" BOOLEAN NOT NULL DEFAULT false,
    "uploaded_at" TEXT NOT NULL,

    CONSTRAINT "lc1_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "rent_amount" DOUBLE PRECISION NOT NULL,
    "rent_period_months" DOUBLE PRECISION,
    "rent_per_month" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "access_fee" DOUBLE PRECISION,
    "total_repayment" DOUBLE PRECISION,
    "daily_repayment" DOUBLE PRECISION,
    "payback_period_days" DOUBLE PRECISION,
    "submitted_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_profiles" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "occupation" TEXT,
    "residence" TEXT,
    "district" TEXT,
    "city" TEXT,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "agent_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_next_of_kin" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "contact_number" TEXT NOT NULL,
    "residence" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "agent_next_of_kin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_rent_requests" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "tenant_id" TEXT,
    "tenant_name" TEXT,
    "phone" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "payback_plan_daily" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "rejection_reason" TEXT,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "approved_at" TEXT,
    "processed_at" TEXT,

    CONSTRAINT "agent_rent_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_applications" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submitted_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "agent_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_logs" (
    "id" TEXT NOT NULL,
    "event" TEXT NOT NULL,
    "user_id" TEXT,
    "email" TEXT,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallet_buckets" (
    "id" TEXT NOT NULL,
    "wallet_id" TEXT NOT NULL,
    "bucket_type" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_buckets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_personas" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "persona" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_personas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_requisitions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "requested_persona" TEXT NOT NULL,
    "justification" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persona_requisitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_platform_stats" (
    "date" TEXT NOT NULL,
    "total_users" DOUBLE PRECISION NOT NULL,
    "new_users" DOUBLE PRECISION NOT NULL,
    "active_users" DOUBLE PRECISION NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,
    "rent_financed" DOUBLE PRECISION NOT NULL,
    "rent_repaid" DOUBLE PRECISION NOT NULL,
    "transactions_count" DOUBLE PRECISION NOT NULL,
    "retention_rate" DOUBLE PRECISION NOT NULL,
    "referral_rate" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "daily_platform_stats_pkey" PRIMARY KEY ("date")
);

-- CreateTable
CREATE TABLE "monthly_financial_stats" (
    "month" TEXT NOT NULL,
    "capital_raised" DOUBLE PRECISION NOT NULL,
    "repayments" DOUBLE PRECISION NOT NULL,
    "revenue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "monthly_financial_stats_pkey" PRIMARY KEY ("month")
);

-- CreateTable
CREATE TABLE "staff_performance_summary" (
    "staff_id" TEXT NOT NULL,
    "tasks_completed" DOUBLE PRECISION NOT NULL,
    "sla_score" DOUBLE PRECISION NOT NULL,
    "avg_response_time" DOUBLE PRECISION NOT NULL,
    "idle_time" DOUBLE PRECISION NOT NULL,
    "approvals_count" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "staff_performance_summary_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "staff_audit_logs" (
    "id" TEXT NOT NULL,
    "staff_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "time_taken_ms" DOUBLE PRECISION,

    CONSTRAINT "staff_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "device_info" TEXT,
    "ip_address" TEXT,
    "is_revoked" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_configs" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "config_data" JSONB NOT NULL,
    "changed_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "impersonation_logs" (
    "id" TEXT NOT NULL,
    "super_admin_id" TEXT NOT NULL,
    "target_role" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "impersonation_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "virtual_opportunities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "image_url" TEXT,
    "rent_required" DOUBLE PRECISION NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'available',
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "virtual_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payout_methods" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payout_methods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funder_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "reward_mode" TEXT NOT NULL DEFAULT 'compound',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funder_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funder_portfolios" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "portfolio_id" TEXT NOT NULL,
    "funding_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active_capital" DOUBLE PRECISION NOT NULL,
    "roi_rate" TEXT NOT NULL,
    "earned_rewards" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "funder_portfolios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funder_proxy_mandates" (
    "id" TEXT NOT NULL,
    "funder_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "agent_name" TEXT,
    "agent_code" TEXT,
    "daily_limit" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "revoked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funder_proxy_mandates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_gamification" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "target_goal" DOUBLE PRECISION NOT NULL,
    "current_savings" DOUBLE PRECISION NOT NULL,
    "payment_streak_months" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "tenant_gamification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gamification_trophies" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "unlocked" BOOLEAN NOT NULL,
    "unlocked_at" TEXT,

    CONSTRAINT "gamification_trophies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "savings_history" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "savings" DOUBLE PRECISION,
    "projected" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "savings_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_tasks" (
    "created_at" TEXT NOT NULL,
    "due_date" TEXT,
    "id" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "task_type" TEXT NOT NULL,
    "description" TEXT,
    "requires_gps" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TEXT,
    "completion_notes" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "agent_id" TEXT,
    "manager_id" TEXT,

    CONSTRAINT "agent_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_escalations" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "issue_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "resolution_notes" TEXT,
    "resolved_at" TEXT,
    "agent_id" TEXT,
    "assigned_to_id" TEXT,

    CONSTRAINT "agent_escalations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_collection_streaks" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    "agent_id" TEXT,
    "consecutive_days" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "current_multiplier" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "last_collection_date" TEXT,
    "longest_streak" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "agent_collection_streaks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_rebalance_records" (
    "created_at" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "agent_id" TEXT,
    "manager_id" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "direction" TEXT NOT NULL,
    "reason" TEXT,
    "float_before" DOUBLE PRECISION,
    "float_after" DOUBLE PRECISION,

    CONSTRAINT "agent_rebalance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_service_centres" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "photo_url" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "location_description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TEXT NOT NULL,
    "approved_at" TEXT,
    "approved_by" TEXT,

    CONSTRAINT "agent_service_centres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_bonuses" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "bonus_type" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TEXT NOT NULL,
    "paid_at" TEXT,

    CONSTRAINT "agent_bonuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "angel_pool_investments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "amount_ugx" DOUBLE PRECISION NOT NULL,
    "shares_purchased" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reference_code" TEXT NOT NULL,

    CONSTRAINT "angel_pool_investments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_rent_pledges" (
    "id" TEXT NOT NULL,
    "portfolio_id" TEXT NOT NULL,
    "rent_request_id" TEXT NOT NULL,
    "assigned_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,

    CONSTRAINT "portfolio_rent_pledges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "granted_at" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leave_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "leave_type" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,
    "reason" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reviewer_id" TEXT,
    "reviewed_at" TEXT,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "leave_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplinary_records" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "issuer_id" TEXT,
    "type" TEXT NOT NULL,
    "severity" TEXT,
    "description" TEXT,
    "evidence_url" TEXT,
    "issued_at" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "disciplinary_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_batches" (
    "id" TEXT NOT NULL,
    "batch_name" TEXT NOT NULL,
    "period_start" TEXT NOT NULL,
    "period_end" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "submitted_by" TEXT,
    "approved_by_cfo" TEXT,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "payroll_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_agents" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT,
    "expense_category" TEXT NOT NULL,
    "assigned_by" TEXT,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "financial_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proxy_agent_assignments" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT,
    "partner_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "assigned_by" TEXT,
    "assigned_at" TEXT,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "proxy_agent_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_phone_key" ON "profiles"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_ai_id_key" ON "profiles"("ai_id");

-- CreateIndex
CREATE UNIQUE INDEX "agent_profiles_agent_id_key" ON "agent_profiles"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "agent_applications_agent_id_key" ON "agent_applications"("agent_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_buckets_wallet_id_bucket_type_key" ON "wallet_buckets"("wallet_id", "bucket_type");

-- CreateIndex
CREATE UNIQUE INDEX "user_personas_user_id_persona_key" ON "user_personas"("user_id", "persona");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_token_key" ON "sessions"("token");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "payout_methods_user_id_idx" ON "payout_methods"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "funder_settings_user_id_key" ON "funder_settings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "funder_portfolios_portfolio_id_key" ON "funder_portfolios"("portfolio_id");

-- CreateIndex
CREATE INDEX "funder_portfolios_user_id_idx" ON "funder_portfolios"("user_id");

-- CreateIndex
CREATE INDEX "funder_proxy_mandates_funder_id_idx" ON "funder_proxy_mandates"("funder_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_gamification_tenant_id_key" ON "tenant_gamification"("tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_role_permission_id_key" ON "role_permissions"("role", "permission_id");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
