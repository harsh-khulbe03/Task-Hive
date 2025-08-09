import db from "./db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function authenticateRequest(request: Request) {
  const token = request.headers.get("authorization")?.split(" ")[1];
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  const user = db.users.find((u) => u.id === decoded.userId);
  if (!user) return null;

  return user;
}
