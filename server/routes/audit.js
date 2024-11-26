import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { adminGuard } from '../middleware/adminGuard.js';
import { query, validationResult } from 'express-validator';

const router = express.Router();
const prisma = new PrismaClient();

// 監査ログ一覧の取得
router.get('/', [
  authMiddleware,
  adminGuard,
  query('type').optional().isIn(['auth', 'system', 'data', 'security']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, startDate, endDate, page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;

    const where = {
      ...(type && { type }),
      ...(startDate && { createdAt: { gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { lte: new Date(endDate) } })
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          user: {
            select: {
              fullName: true,
              email: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.auditLog.count({ where })
    ]);

    res.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    res.status(500).json({ message: '監査ログの取得に失敗しました' });
  }
});

// 監査ログのエクスポート
router.get('/export', [
  authMiddleware,
  adminGuard,
  query('format').isIn(['csv', 'json']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { format, startDate, endDate } = req.query;

    const where = {
      ...(startDate && { createdAt: { gte: new Date(startDate) } }),
      ...(endDate && { createdAt: { lte: new Date(endDate) } })
    };

    const logs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            fullName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (format === 'csv') {
      const csvContent = [
        ['タイムスタンプ', 'タイプ', 'アクション', '詳細', 'ユーザー', 'IPアドレス'].join(','),
        ...logs.map(log => [
          log.createdAt,
          log.type,
          log.action,
          log.details,
          log.user.fullName,
          log.ip || ''
        ].map(field => `"${field}"`).join(','))
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.csv');
      return res.send(csvContent);
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.json');
    res.json(logs);
  } catch (error) {
    console.error('Failed to export audit logs:', error);
    res.status(500).json({ message: '監査ログのエクスポートに失敗しました' });
  }
});

// 監査ログの作成（内部使用）
export const createAuditLog = async (data) => {
  try {
    return await prisma.auditLog.create({
      data: {
        type: data.type,
        action: data.action,
        details: data.details,
        ip: data.ip,
        userAgent: data.userAgent,
        userId: data.userId
      }
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    throw new Error('監査ログの作成に失敗しました');
  }
};

export default router;