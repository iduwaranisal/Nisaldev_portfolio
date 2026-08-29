"use server";

import { cookies } from "next/headers";
import crypto from "crypto";

export interface AuthResult {
  success: boolean;
  message?: string;
  error?: string;
  token?: string;
  user?: { username: string };
}

export async function loginAdminAction(credentials: {
  username?: string;
  password?: string;
}): Promise<AuthResult> {
  try {
    const { username, password } = credentials || {};

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
      return { success: false, error: "Username and password must be valid strings." };
    }

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;
    const secretKey = process.env.ADMIN_SECRET_KEY || "nisaldev_admin_secret_key_2026";

    if (!validUsername || !validPassword) {
      console.error("Admin credentials not configured in server environment variables.");
      return { success: false, error: "Server authentication configuration error." };
    }

    // Timing-safe comparisons to prevent timing attacks
    const userBuffer = Buffer.from(username.padEnd(64));
    const validUserBuffer = Buffer.from(validUsername.padEnd(64));
    const isUsernameMatch = crypto.timingSafeEqual(userBuffer, validUserBuffer);

    const passBuffer = Buffer.from(password.padEnd(64));
    const validPassBuffer = Buffer.from(validPassword.padEnd(64));
    const isPasswordMatch = crypto.timingSafeEqual(passBuffer, validPassBuffer);

    if (isUsernameMatch && isPasswordMatch && username === validUsername && password === validPassword) {
      const timestamp = Date.now();
      const payload = `${username}:${timestamp}`;
      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(payload)
        .digest("hex");
      const token = Buffer.from(`${payload}:${signature}`).toString("base64");

      const cookieStore = await cookies();
      cookieStore.set({
        name: "admin_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return {
        success: true,
        message: "Authentication successful",
        token,
        user: { username },
      };
    }

    return { success: false, error: "Invalid username or password credentials." };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Authentication error";
    return { success: false, error: message };
  }
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return { success: true };
  } catch {
    return { success: false };
  }
}

export async function verifyAdminSessionAction(): Promise<{ isValid: boolean; username?: string }> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("admin_session");
    if (!tokenCookie?.value) return { isValid: false };

    const secretKey = process.env.ADMIN_SECRET_KEY || "nisaldev_admin_secret_key_2026";
    const decoded = Buffer.from(tokenCookie.value, "base64").toString("utf-8");
    const [username, timestamp, signature] = decoded.split(":");

    if (!username || !timestamp || !signature) return { isValid: false };

    // Check age (7 days max)
    const ageMs = Date.now() - parseInt(timestamp, 10);
    if (isNaN(ageMs) || ageMs > 7 * 24 * 60 * 60 * 1000) return { isValid: false };

    const expectedPayload = `${username}:${timestamp}`;
    const expectedSig = crypto
      .createHmac("sha256", secretKey)
      .update(expectedPayload)
      .digest("hex");

    const sigBuffer = Buffer.from(signature.padEnd(64));
    const expectedSigBuffer = Buffer.from(expectedSig.padEnd(64));

    if (crypto.timingSafeEqual(sigBuffer, expectedSigBuffer) && username === process.env.ADMIN_USERNAME) {
      return { isValid: true, username };
    }

    return { isValid: false };
  } catch {
    return { isValid: false };
  }
}
