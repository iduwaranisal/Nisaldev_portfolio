import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const { username, password } = body;

    if (typeof username !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { success: false, error: "Username and password must be valid strings." },
        { status: 400 }
      );
    }

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;
    const secretKey = process.env.ADMIN_SECRET_KEY || "nisaldev_admin_secret_key_2026";

    if (!validUsername || !validPassword) {
      console.error("Admin credentials not configured in server environment variables.");
      return NextResponse.json(
        { success: false, error: "Server authentication configuration error." },
        { status: 500 }
      );
    }

    // Secure timing-safe comparison to prevent timing attacks
    const userBuffer = Buffer.from(username.padEnd(64));
    const validUserBuffer = Buffer.from(validUsername.padEnd(64));
    const isUsernameMatch = crypto.timingSafeEqual(userBuffer, validUserBuffer);

    const passBuffer = Buffer.from(password.padEnd(64));
    const validPassBuffer = Buffer.from(validPassword.padEnd(64));
    const isPasswordMatch = crypto.timingSafeEqual(passBuffer, validPassBuffer);

    if (isUsernameMatch && isPasswordMatch && username === validUsername && password === validPassword) {
      // Create tamper-proof session token with HMAC
      const timestamp = Date.now();
      const payload = `${username}:${timestamp}`;
      const signature = crypto
        .createHmac("sha256", secretKey)
        .update(payload)
        .digest("hex");
      const token = Buffer.from(`${payload}:${signature}`).toString("base64");

      const response = NextResponse.json({
        success: true,
        message: "Authentication successful",
        token,
        user: { username },
      });

      // Set HTTP-only secure cookie
      response.cookies.set({
        name: "admin_session",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid username or password credentials." },
      { status: 401 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Authentication error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
