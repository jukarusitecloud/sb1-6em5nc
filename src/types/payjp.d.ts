declare namespace Payjp {
  interface CardElement {
    mount(domElement: string | HTMLElement): void;
    on(event: string, handler: (event: any) => void): void;
    unmount(): void;
  }

  interface Token {
    card: {
      id: string;
      object: string;
      address_city: string | null;
      address_line1: string | null;
      address_line2: string | null;
      address_state: string | null;
      address_zip: string | null;
      address_zip_check: string;
      brand: string;
      country: string;
      created: number;
      customer: string | null;
      cvc_check: string;
      exp_month: number;
      exp_year: number;
      fingerprint: string;
      last4: string;
      livemode: boolean;
      metadata: any;
      name: string | null;
    };
    created: number;
    id: string;
    livemode: boolean;
    object: string;
    used: boolean;
  }

  interface PayjpStatic {
    setPublicKey(key: string): void;
    createToken(details: {
      number: string;
      cvc: string;
      exp_month: string;
      exp_year: string;
    }): Promise<{
      error?: { message: string };
      id?: string;
      token?: Token;
    }>;
    elements(): {
      create(type: string, options?: any): CardElement;
    };
  }
}

declare const Payjp: Payjp.PayjpStatic;

interface Window {
  Payjp: Payjp.PayjpStatic;
}