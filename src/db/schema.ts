import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// 1. User Progress & Neuroscience Memory Tracking (Leitner Spaced Repetition System)
export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  lessonId: text("lesson_id").notNull().unique(),
  completed: boolean("completed").default(false).notNull(),
  leitnerBox: integer("leitner_box").default(1).notNull(), // 1 to 5
  memoryStrength: integer("memory_strength").default(20).notNull(), // 0 to 100%
  lastReviewedAt: timestamp("last_reviewed_at").defaultNow().notNull(),
  nextReviewAt: timestamp("next_review_at").defaultNow().notNull(),
  quizScore: integer("quiz_score").default(0).notNull(),
  notes: text("notes").default(""),
});

// 2. Interactive W3Schools Sandbox Saved Code Snippets
export const savedSandboxes = pgTable("saved_sandboxes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(), // 'js', 'dom', 'async', 'node', 'telegram-bot', 'security'
  code: text("code").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 3. Telegram Bot Manager & File Locker Simulator
export const telegramBotInstances = pgTable("telegram_bot_instances", {
  id: serial("id").primaryKey(),
  botToken: text("bot_token").notNull(),
  name: text("name").notNull(),
  webhookSecret: text("webhook_secret").notNull(),
  mode: text("mode").default("polling").notNull(), // 'polling' or 'webhook'
  isActive: boolean("is_active").default(true).notNull(),
  filesCount: integer("files_count").default(0).notNull(),
  membersCount: integer("members_count").default(1).notNull(),
  configJson: jsonb("config_json").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 4. NSA Security Tokens, Encrypted Vault & Referral Code Engine
export const securityTokensAndReferrals = pgTable("security_tokens_and_referrals", {
  id: serial("id").primaryKey(),
  tokenCode: text("token_code").notNull().unique(),
  type: text("type").notNull(), // 'referral_code', 'jwt_token', 'hmac_signature', 'aes_gcm_vault'
  encryptedPayload: text("encrypted_payload").notNull(),
  hmacHash: text("hmac_hash").notNull(),
  securityLevel: text("security_level").default("NSA-SECRET").notNull(), // 'STANDARD', 'ADVANCED', 'NSA-SECRET', 'TOP-SECRET'
  usageCount: integer("usage_count").default(0).notNull(),
  maxUsages: integer("max_usages").default(100).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
