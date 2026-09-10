import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma.js";
import {
  createRefreshToken,
  hashToken,
  signAccessToken,
} from "../lib/tokens.js";
import { HttpError } from "../utils/http-error.js";
import { env } from "../config/env.js";

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (
      !user ||
      !user.active ||
      !(await bcrypt.compare(password, user.passwordHash))
    ) {
      throw new HttpError(401, "Invalid email or password");
    }
    return this.issueTokens(user);
  }
  async refresh(rawToken: string) {
    const record = await prisma.refreshToken.findUnique({
      where: { tokenHash: hashToken(rawToken) },
      include: { user: true },
    });
    if (
      !record ||
      record.revokedAt ||
      record.expiresAt <= new Date() ||
      !record.user.active
    ) {
      throw new HttpError(401, "Invalid or expired refresh token");
    }
    const revoked = await prisma.refreshToken.updateMany({
      where: { id: record.id, revokedAt: null, expiresAt: { gt: new Date() } },
      data: { revokedAt: new Date() },
    });
    if (revoked.count !== 1)
      throw new HttpError(401, "Invalid or expired refresh token");
    return this.issueTokens(record.user);
  }
  async logout(rawToken: string): Promise<void> {
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(rawToken), revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  private async issueTokens(user: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "USER";
  }) {
    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const refreshToken = createRefreshToken();
    const expiresAt = new Date(
      Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    );
    await prisma.refreshToken.create({
      data: { tokenHash: hashToken(refreshToken), userId: user.id, expiresAt },
    });
    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: env.ACCESS_TOKEN_TTL_SECONDS,
      session: {
        idleTimeoutSeconds: env.SESSION_IDLE_TIMEOUT_SECONDS,
        refreshTokenExpiresInDays: env.REFRESH_TOKEN_TTL_DAYS,
      },
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
