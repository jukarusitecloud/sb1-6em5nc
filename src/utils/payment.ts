export const initializePayjp = () => {
  if (typeof window !== 'undefined' && window.Payjp) {
    window.Payjp.setPublicKey('pk_live_d58cb29e8aa1c15f20d99b74');
  }
};

export const createPaymentToken = async (cardData: {
  number: string;
  cvc: string;
  exp_month: string;
  exp_year: string;
}) => {
  if (!window.Payjp) {
    throw new Error('PAY.JP SDKが読み込まれていません');
  }

  const response = await window.Payjp.createToken(cardData);
  
  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.id;
};