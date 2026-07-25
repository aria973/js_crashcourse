import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const NSA_MASTER_KEY = crypto
  .createHash("sha256")
  .update("NSA-ROOT-SECRET-KEY-2026-FINAL")
  .digest();

const processedNonces = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const { action, payload } = await req.json();

    if (!action) {
      return NextResponse.json(
        { status: "error", message: "Action is required" },
        { status: 400 }
      );
    }

    // PROJECT 1: Group Guard & File Manager Simulation
    if (action === "test_group_guard") {
      const text = payload?.text || "";
      const isSpam = /(t\.me\/joinchat|http:\/\/spam|crypto-airdrop)/i.test(text);

      if (isSpam) {
        return NextResponse.json({
          status: "success",
          botAction: "DELETE_AND_WARN",
          chatMessage: `⚠️ Message from @${payload?.user || "user"} was automatically deleted for spam rule violation.`,
          log: `[Anti-Spam Filter] Deleted spam text: "${text}"`,
        });
      }

      if (text.startsWith("/files")) {
        const query = text.replace("/files", "").trim().toLowerCase();
        const demoFiles = [
          { name: "js-closures-guide.pdf", size: "2.4 MB", uploader: "Alex" },
          { name: "nsa-security-handbook.pdf", size: "15 MB", uploader: "NSA_Dev" },
          { name: "telegram-bot-cheatsheet.pdf", size: "850 KB", uploader: "Sarah" },
        ];
        const matching = demoFiles.filter(
          (f) => !query || f.name.toLowerCase().includes(query)
        );

        return NextResponse.json({
          status: "success",
          botAction: "FILE_LIST_RESPONSE",
          matchingFiles: matching,
          chatMessage: matching.length
            ? `🔎 Found ${matching.length} matching file(s)`
            : "No matching files found in group archive.",
        });
      }

      return NextResponse.json({
        status: "success",
        botAction: "MESSAGE_ACCEPTED",
        chatMessage: `✅ Message from @${payload?.user || "user"} passed security filter.`,
      });
    }

    // PROJECT 2: Inline Query & Dynamic Buttons Simulation
    if (action === "test_inline_query") {
      const query = (payload?.query || "").toLowerCase();
      const dbItems = [
        { id: "1", title: "JS Closures Guide", desc: "Lexical scopes & private state" },
        { id: "2", title: "Event Loop Secrets", desc: "Microtasks vs Macrotasks priority" },
        { id: "3", title: "NSA Security HMAC", desc: "Webhook signature verification" },
        { id: "4", title: "Telegram Telegraf Master", desc: "Webhooks vs Long Polling" },
      ];
      const filtered = dbItems.filter(
        (i) =>
          i.title.toLowerCase().includes(query) ||
          i.desc.toLowerCase().includes(query)
      );

      return NextResponse.json({
        status: "success",
        inlineResults: filtered,
        queryId: `inline_req_${Date.now()}`,
      });
    }

    // PROJECT 3: Crypto Token Guard & Secure Referral Code Engine
    if (action === "test_crypto_referral") {
      const userId = payload?.userId || "USER_101";
      const timestamp = Date.now().toString(36);
      const data = `USER_${userId}_${timestamp}`;
      const hmac = crypto
        .createHmac("sha256", NSA_MASTER_KEY)
        .update(data)
        .digest("hex")
        .slice(0, 8)
        .toUpperCase();

      const refCode = `REF-${userId}-${timestamp}-${hmac}`;

      // Also generate AES-256-GCM Encrypted Token
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv("aes-256-gcm", NSA_MASTER_KEY, iv);
      const tokenPayload = JSON.stringify({
        userId,
        access: "NSA-TOP-SECRET",
        exp: Date.now() + 86400000,
      });
      let encrypted = cipher.update(tokenPayload, "utf8", "base64");
      encrypted += cipher.final("base64");
      const authTag = cipher.getAuthTag().toString("base64");
      const aesToken = `TOKEN.${iv.toString("base64")}.${encrypted}.${authTag}`;

      return NextResponse.json({
        status: "success",
        referralCode: refCode,
        hmacChecksum: hmac,
        aesGcmToken: aesToken,
        verificationStatus: "VERIFIED_TIMING_SAFE",
      });
    }

    // PROJECT 4: Multi-Group Membership Manager & One-Time File Locker
    if (action === "test_multi_group") {
      const userId = payload?.userId || "998877";
      const fileId = payload?.fileId || "nsa_masterclass_2026.zip";
      const allJoined = payload?.forceMember !== false;

      if (!allJoined) {
        return NextResponse.json({
          status: "success",
          access: "DENIED",
          reason: "User is missing membership in required channel @JSHeroChannel",
          requiredChannels: ["@JSHeroChannel", "@W3SchoolsJS"],
        });
      }

      const unlockToken = `UNLOCK_${fileId}_${Date.now()}_${crypto
        .randomBytes(4)
        .toString("hex")}`;
      return NextResponse.json({
        status: "success",
        access: "GRANTED",
        unlockToken,
        expiresInSeconds: 300,
        message: "✅ Membership confirmed across all required channels. Unlock token generated.",
      });
    }

    // PROJECT 5: NSA Security Audit Bot (Webhook HMAC + Anti-Replay + Timing Safe)
    if (action === "test_nsa_audit") {
      const secretTokenHeader = payload?.secretHeader || "";
      const expectedToken = "NSA-SECRET-WEBHOOK-2026";
      const nonce = payload?.nonce || "nonce-default-01";

      // Timing-safe comparison check
      const a = Buffer.from(secretTokenHeader.padEnd(32, "0").slice(0, 32));
      const b = Buffer.from(expectedToken.padEnd(32, "0").slice(0, 32));
      const signatureValid =
        secretTokenHeader.length === expectedToken.length &&
        crypto.timingSafeEqual(a, b);

      // Replay attack check
      const isReplayed = processedNonces.has(nonce);
      if (!isReplayed) {
        processedNonces.add(nonce);
      }

      return NextResponse.json({
        status: "success",
        auditResults: {
          signatureValid,
          timingSafeUsed: true,
          replayAttackDetected: isReplayed,
          nonceStatus: isReplayed ? "REJECTED_DUPLICATE_NONCE" : "ACCEPTED_NEW_NONCE",
          nsaSecurityRating:
            signatureValid && !isReplayed ? "NSA-LEVEL-5-PASSED" : "SECURITY-VIOLATION",
        },
      });
    }

    return NextResponse.json(
      { status: "error", message: "Unknown simulation action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Telegram simulator error:", error);
    return NextResponse.json(
      { status: "error", message: "Simulation execution failed" },
      { status: 500 }
    );
  }
}
