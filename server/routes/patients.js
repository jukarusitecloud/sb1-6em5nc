import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// 患者一覧の取得
router.get('/', authMiddleware, async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      where: {
        clinicId: req.user.clinicId,
        isDeleted: false
      },
      orderBy: {
        lastNameKana: 'asc'
      }
    });
    res.json(patients);
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    res.status(500).json({ message: '患者一覧の取得に失敗しました' });
  }
});

// 患者の新規登録
router.post('/', [
  authMiddleware,
  body('firstName').notEmpty().withMessage('名前（名）は必須です'),
  body('lastName').notEmpty().withMessage('名前（姓）は必須です'),
  body('firstNameKana').notEmpty().withMessage('フリガナ（メイ）は必須です'),
  body('lastNameKana').notEmpty().withMessage('フリガナ（セイ）は必須です'),
  body('dateOfBirth').notEmpty().withMessage('生年月日は必須です'),
  body('gender').notEmpty().withMessage('性別は必須です'),
  body('firstVisitDate').notEmpty().withMessage('初診日は必須です')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const patient = await prisma.patient.create({
      data: {
        ...req.body,
        clinicId: req.user.clinicId,
        createdBy: req.user.id
      }
    });

    res.status(201).json(patient);
  } catch (error) {
    console.error('Failed to create patient:', error);
    res.status(500).json({ message: '患者の登録に失敗しました' });
  }
});

// 患者情報の更新
router.put('/:id', [
  authMiddleware,
  body('firstName').optional().notEmpty().withMessage('名前（名）は必須です'),
  body('lastName').optional().notEmpty().withMessage('名前（姓）は必須です'),
  body('firstNameKana').optional().notEmpty().withMessage('フリガナ（メイ）は必須です'),
  body('lastNameKana').optional().notEmpty().withMessage('フリガナ（セイ）は必須です')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const patient = await prisma.patient.update({
      where: { 
        id,
        clinicId: req.user.clinicId
      },
      data: {
        ...req.body,
        updatedBy: req.user.id
      }
    });

    res.json(patient);
  } catch (error) {
    console.error('Failed to update patient:', error);
    res.status(500).json({ message: '患者情報の更新に失敗しました' });
  }
});

// 患者の削除（論理削除）
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.patient.update({
      where: { 
        id,
        clinicId: req.user.clinicId
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user.id
      }
    });

    res.json({ message: '患者を削除しました' });
  } catch (error) {
    console.error('Failed to delete patient:', error);
    res.status(500).json({ message: '患者の削除に失敗しました' });
  }
});

// 患者の詳細情報取得
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await prisma.patient.findFirst({
      where: { 
        id,
        clinicId: req.user.clinicId,
        isDeleted: false
      },
      include: {
        chartEntries: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    });

    if (!patient) {
      return res.status(404).json({ message: '患者が見つかりません' });
    }

    res.json(patient);
  } catch (error) {
    console.error('Failed to fetch patient:', error);
    res.status(500).json({ message: '患者情報の取得に失敗しました' });
  }
});

export default router;