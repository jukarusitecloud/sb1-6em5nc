import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// カルテ一覧の取得
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { patientId } = req.query;
    const chartEntries = await prisma.chartEntry.findMany({
      where: {
        patientId,
        isDeleted: false,
        patient: {
          clinicId: req.user.clinicId
        }
      },
      orderBy: {
        date: 'desc'
      },
      include: {
        creator: {
          select: {
            fullName: true
          }
        }
      }
    });
    res.json(chartEntries);
  } catch (error) {
    console.error('Failed to fetch chart entries:', error);
    res.status(500).json({ message: 'カルテ一覧の取得に失敗しました' });
  }
});

// カルテの新規作成
router.post('/', [
  authMiddleware,
  body('patientId').notEmpty().withMessage('患者IDは必須です'),
  body('date').notEmpty().withMessage('施術日は必須です'),
  body('content').notEmpty().withMessage('施術内容は必須です'),
  body('therapyMethods').isArray().withMessage('物理療法は配列で指定してください'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // 患者が存在し、同じクリニックに属しているか確認
    const patient = await prisma.patient.findFirst({
      where: {
        id: req.body.patientId,
        clinicId: req.user.clinicId,
        isDeleted: false
      }
    });

    if (!patient) {
      return res.status(404).json({ message: '患者が見つかりません' });
    }

    const chartEntry = await prisma.chartEntry.create({
      data: {
        ...req.body,
        date: new Date(req.body.date),
        nextAppointment: req.body.nextAppointment ? new Date(req.body.nextAppointment) : null,
        createdBy: req.user.id
      }
    });

    res.status(201).json(chartEntry);
  } catch (error) {
    console.error('Failed to create chart entry:', error);
    res.status(500).json({ message: 'カルテの作成に失敗しました' });
  }
});

// カルテの修正
router.put('/:id', [
  authMiddleware,
  body('content').notEmpty().withMessage('施術内容は必須です'),
  body('therapyMethods').isArray().withMessage('物理療法は配列で指定してください'),
  body('editReason').notEmpty().withMessage('修正理由は必須です')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { editReason, ...updateData } = req.body;

    const chartEntry = await prisma.chartEntry.findFirst({
      where: {
        id,
        patient: {
          clinicId: req.user.clinicId
        }
      }
    });

    if (!chartEntry) {
      return res.status(404).json({ message: 'カルテが見つかりません' });
    }

    const updatedEntry = await prisma.chartEntry.update({
      where: { id },
      data: {
        ...updateData,
        nextAppointment: updateData.nextAppointment ? new Date(updateData.nextAppointment) : null,
        updatedBy: req.user.id,
        modifiedReason: editReason
      }
    });

    res.json(updatedEntry);
  } catch (error) {
    console.error('Failed to update chart entry:', error);
    res.status(500).json({ message: 'カルテの修正に失敗しました' });
  }
});

// カルテの削除（論理削除）
router.delete('/:id', [
  authMiddleware,
  body('deleteReason').notEmpty().withMessage('削除理由は必須です')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { deleteReason } = req.body;

    const chartEntry = await prisma.chartEntry.findFirst({
      where: {
        id,
        patient: {
          clinicId: req.user.clinicId
        }
      }
    });

    if (!chartEntry) {
      return res.status(404).json({ message: 'カルテが見つかりません' });
    }

    await prisma.chartEntry.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: req.user.id,
        deleteReason
      }
    });

    res.json({ message: 'カルテを削除しました' });
  } catch (error) {
    console.error('Failed to delete chart entry:', error);
    res.status(500).json({ message: 'カルテの削除に失敗しました' });
  }
});

// カルテの詳細取得
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const chartEntry = await prisma.chartEntry.findFirst({
      where: {
        id,
        isDeleted: false,
        patient: {
          clinicId: req.user.clinicId
        }
      },
      include: {
        creator: {
          select: {
            fullName: true
          }
        }
      }
    });

    if (!chartEntry) {
      return res.status(404).json({ message: 'カルテが見つかりません' });
    }

    res.json(chartEntry);
  } catch (error) {
    console.error('Failed to fetch chart entry:', error);
    res.status(500).json({ message: 'カルテの取得に失敗しました' });
  }
});

export default router;