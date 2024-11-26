import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';
import { adminGuard } from '../middleware/adminGuard.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// スタッフ一覧の取得
router.get('/staff', [authMiddleware, adminGuard], async (req, res) => {
  try {
    const staff = await prisma.user.findMany({
      where: {
        clinicId: req.user.clinicId,
        role: 'STAFF'
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        department: true,
        position: true,
        isActive: true,
        permissions: true,
        lastLoginAt: true
      },
      orderBy: {
        fullName: 'asc'
      }
    });
    res.json(staff);
  } catch (error) {
    console.error('Failed to fetch staff:', error);
    res.status(500).json({ message: 'スタッフ一覧の取得に失敗しました' });
  }
});

// スタッフの新規登録
router.post('/staff', [
  authMiddleware,
  adminGuard,
  body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上で入力してください')
    .matches(/[A-Z]/).withMessage('大文字を含める必要があります')
    .matches(/[a-z]/).withMessage('小文字を含める必要があります')
    .matches(/[0-9]/).withMessage('数字を含める必要があります')
    .matches(/[^A-Za-z0-9]/).withMessage('特殊文字を含める必要があります'),
  body('fullName').notEmpty().withMessage('氏名は必須です'),
  body('permissions').isArray().withMessage('権限は配列で指定してください')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName, department, position, permissions } = req.body;

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'このメールアドレスは既に登録されています' });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    const staff = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        department,
        position,
        permissions,
        role: 'STAFF',
        clinicId: req.user.clinicId
      }
    });

    // パスワードを除外して返却
    const { password: _, ...staffData } = staff;
    res.status(201).json(staffData);
  } catch (error) {
    console.error('Failed to create staff:', error);
    res.status(500).json({ message: 'スタッフの登録に失敗しました' });
  }
});

// スタッフ情報の更新
router.put('/staff/:id', [
  authMiddleware,
  adminGuard,
  body('email').optional().isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('fullName').optional().notEmpty().withMessage('氏名は必須です'),
  body('permissions').optional().isArray().withMessage('権限は配列で指定してください')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { password, ...updateData } = req.body;

    // スタッフが存在し、同じクリニックに属しているか確認
    const staff = await prisma.user.findFirst({
      where: {
        id,
        clinicId: req.user.clinicId,
        role: 'STAFF'
      }
    });

    if (!staff) {
      return res.status(404).json({ message: 'スタッフが見つかりません' });
    }

    // パスワードが含まれている場合はハッシュ化
    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    const updatedStaff = await prisma.user.update({
      where: { id },
      data: updateData
    });

    // パスワードを除外して返却
    const { password: _, ...staffData } = updatedStaff;
    res.json(staffData);
  } catch (error) {
    console.error('Failed to update staff:', error);
    res.status(500).json({ message: 'スタッフ情報の更新に失敗しました' });
  }
});

// スタッフの有効/無効切り替え
router.patch('/staff/:id/toggle-active', [authMiddleware, adminGuard], async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await prisma.user.findFirst({
      where: {
        id,
        clinicId: req.user.clinicId,
        role: 'STAFF'
      }
    });

    if (!staff) {
      return res.status(404).json({ message: 'スタッフが見つかりません' });
    }

    const updatedStaff = await prisma.user.update({
      where: { id },
      data: {
        isActive: !staff.isActive
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        department: true,
        position: true,
        isActive: true,
        permissions: true
      }
    });

    res.json(updatedStaff);
  } catch (error) {
    console.error('Failed to toggle staff status:', error);
    res.status(500).json({ message: 'スタッフの状態更新に失敗しました' });
  }
});

// クリニック情報の取得
router.get('/clinic', [authMiddleware, adminGuard], async (req, res) => {
  try {
    const clinic = await prisma.clinic.findUnique({
      where: { id: req.user.clinicId },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        settings: true
      }
    });

    if (!clinic) {
      return res.status(404).json({ message: 'クリニック情報が見つかりません' });
    }

    res.json(clinic);
  } catch (error) {
    console.error('Failed to fetch clinic info:', error);
    res.status(500).json({ message: 'クリニック情報の取得に失敗しました' });
  }
});

// クリニック情報の更新
router.put('/clinic', [
  authMiddleware,
  adminGuard,
  body('name').optional().notEmpty().withMessage('クリニック名は必須です'),
  body('email').optional().isEmail().withMessage('有効なメールアドレスを入力してください')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updatedClinic = await prisma.clinic.update({
      where: { id: req.user.clinicId },
      data: req.body
    });

    res.json(updatedClinic);
  } catch (error) {
    console.error('Failed to update clinic:', error);
    res.status(500).json({ message: 'クリニック情報の更新に失敗しました' });
  }
});

// システム設定の取得
router.get('/settings', [authMiddleware, adminGuard], async (req, res) => {
  try {
    const settings = await prisma.systemSettings.findFirst({
      where: { clinicId: req.user.clinicId }
    });
    res.json(settings || {});
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    res.status(500).json({ message: 'システム設定の取得に失敗しました' });
  }
});

// システム設定の更新
router.put('/settings', [authMiddleware, adminGuard], async (req, res) => {
  try {
    const settings = await prisma.systemSettings.upsert({
      where: { clinicId: req.user.clinicId },
      update: req.body,
      create: {
        ...req.body,
        clinicId: req.user.clinicId
      }
    });
    res.json(settings);
  } catch (error) {
    console.error('Failed to update settings:', error);
    res.status(500).json({ message: 'システム設定の更新に失敗しました' });
  }
});

export default router;