import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN;
const REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN;

export const createAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      type: "access",
    },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
};

export const createRefreshToken = async (user) => {
  const tokenId = randomUUID();

  const now = new Date();
  const expiresAt = new Date(now.getTime() + parseExpires(REFRESH_EXPIRES_IN));

  await prisma.refreshToken.create({
    data: {
      tokenId,
      userId: user.id,
      expiresAt,
    },
  });

  const refreshToken = jwt.sign(
    {
      sub: user.id,
      jti: tokenId,
      type: "refresh",
    },
    REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );

  return refreshToken;
};

/**
 * Paverčia, pvz. "15m", "7d" į ms (milisekundes)
 */
const parseExpires = (value) => {
  // labai paprastas parseris
  const match = /^(\d+)([smhd])$/.exec(value);
  if (!match) {
    // default 7d
    return 7 * 24 * 60 * 60 * 1000;
  }
  const num = Number(match[1]);
  const unit = match[2];
  switch (unit) {
    case "s":
      return num * 1000;
    case "m":
      return num * 60 * 1000;
    case "h":
      return num * 60 * 60 * 1000;
    case "d":
      return num * 24 * 60 * 60 * 1000;
    default:
      return num * 1000;
  }
};


export const verifyAccessToken = (token) => {
  const payload = jwt.verify(token, ACCESS_SECRET);
  if (payload.type !== "access") {
    throw new Error("Invalid token type");
  }
  return payload;
};

export const verifyRefreshToken = async (token) => {
  const payload = jwt.verify(token, REFRESH_SECRET);
  if (payload.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { tokenId: payload.jti },
  });

  if (!tokenRecord) {
    throw new Error("Refresh token not found");
  }

  if (tokenRecord.revokedAt) {
    throw new Error("Refresh token revoked");
  }

  if (tokenRecord.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  return { payload, tokenRecord };
};

export const revokeRefreshToken = async (tokenId, replacedByTokenId = null) => {
  await prisma.refreshToken.update({
    where: { tokenId },
    data: { revokedAt: new Date(), replacedByToken: replacedByTokenId },
  });
};
