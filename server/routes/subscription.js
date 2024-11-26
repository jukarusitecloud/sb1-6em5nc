import express from 'express';
import { PrismaClient } from '@prisma/client';
import payjp from 'payjp';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// PAY.JPの初期化
const payjpClient = payjp('sk_live_823d95d23572f41898bcca1ca2f65f69376739da8d612593646ff2fc');

// サブスクリプション作成
router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { planId, token, isYearly } = req.body;
    const userId = req.user.id;

    // 顧客作成
    const customer = await payjpClient.customers.create({
      email: req.user.email,
      card: token
    });

    // サブスクリプション作成
    const subscription = await payjpClient.subscriptions.create({
      customer: customer.id,
      plan: planId,
      prorate: true
    });

    // データベースを更新
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscription: {
          create: {
            payjpCustomerId: customer.id,
            payjpSubscriptionId: subscription.id,
            plan: planId,
            isYearly,
            status: 'active'
          }
        }
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Subscription creation failed:', error);
    res.status(500).json({ message: 'サブスクリプションの作成に失敗しました' });
  }
});

// サブスクリプションのキャンセル
router.post('/cancel', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true }
    });

    if (!user?.subscription) {
      return res.status(404).json({ message: 'サブスクリプションが見つかりません' });
    }

    // PAY.JPでサブスクリプションをキャンセル
    await payjpClient.subscriptions.cancel(user.subscription.payjpSubscriptionId);

    // データベースを更新
    await prisma.subscription.update({
      where: { userId },
      data: { status: 'canceled' }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Subscription cancellation failed:', error);
    res.status(500).json({ message: 'サブスクリプションのキャンセルに失敗しました' });
  }
});

export default router;