import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import { emailService } from '../services/emailService.js';
import crypto from 'crypto';

const router = express.Router();
const prisma = new PrismaClient();

// 管理者新規登録
router.post('/register/admin', [
  body('email').isEmail().withMessage('有効なメールアドレスを入力してください'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('パスワードは8文字以上で入力してください')
    .matches(/[A-Z]/).withMessage('大文字を含める必要があります')
    .matches(/[a-z]/).withMessage('小文字を含める必要があります')
    .matches(/[0-9]/).withMessage('数字を含める必要があります')
    .matches(/[^A-Za-z0-9]/).withMessage('特殊文字を含める必要があります'),
  body('fullName').notEmpty().withMessage('氏名は必須です'),
  body('termsAccepted').equals('true').withMessage('利用規約への同意が必要です')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        message: '入力データが無効です', 
        errors: errors.array() 
      });
    }

    const { email, password, fullName } = req.body;

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'このメールアドレスは既に登録されています' 
      });
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 12);

    // 認証トークンの生成
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間後

    // トランザクションでユーザー作成とメール認証トークンを保存
    const [user, emailVerification] = await prisma.$transaction([
      prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          fullName,
          role: 'ADMIN',
          permissions: ['*'],
          emailVerified: false
        }
      }),
      prisma.emailVerification.create({
        data: {
          email,
          token: verificationToken,
          expiresAt
        }
      })
    ]);

    // 認証メールを送信
    await emailService.sendVerificationEmail(email, fullName, verificationToken);

    res.status(201).json({
      success: true,
      message: '認証メールを送信しました。メールを確認して登録を完了してください。',
      userId: user.id
    });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ 
      success: false,
      message: '管理者登録に失敗しました' 
    });
  }
});