import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const adminGuard = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '認証が必要です' });
    }

    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'この操作には管理者権限が必要です' });
    }

    next();
  } catch (error) {
    console.error('Admin guard error:', error);
    res.status(500).json({ message: '認証チェックに失敗しました' });
  }
};