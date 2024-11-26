export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: '入力データが無効です',
      errors: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: '認証が必要です'
    });
  }

  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      message: 'アクセス権限がありません'
    });
  }

  res.status(500).json({
    message: '内部サーバーエラーが発生しました'
  });
};