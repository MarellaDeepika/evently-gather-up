
export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  applicableEvents?: number[];
  couponType: 'general' | 'vip' | 'early-bird';
}

export interface CouponUsage {
  id: string;
  couponId: string;
  userId: number;
  eventId: number;
  usedAt: string;
  discountAmount: number;
}

class CouponService {
  private couponsKey = 'evently_coupons';
  private usageKey = 'evently_coupon_usage';

  // Get all coupons
  getAllCoupons(): Coupon[] {
    const stored = localStorage.getItem(this.couponsKey);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Initialize with default coupons
    const defaultCoupons = this.getDefaultCoupons();
    this.saveCoupons(defaultCoupons);
    return defaultCoupons;
  }

  // Validate and apply coupon
  validateCoupon(code: string, eventId: number, totalAmount: number): { valid: boolean; coupon?: Coupon; discount?: number; error?: string } {
    const coupons = this.getAllCoupons();
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());

    if (!coupon) {
      return { valid: false, error: 'Coupon code not found' };
    }

    if (!coupon.isActive) {
      return { valid: false, error: 'Coupon is not active' };
    }

    const now = new Date();
    const validFrom = new Date(coupon.validFrom);
    const validUntil = new Date(coupon.validUntil);

    if (now < validFrom || now > validUntil) {
      return { valid: false, error: 'Coupon has expired or is not yet valid' };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, error: 'Coupon usage limit reached' };
    }

    if (coupon.applicableEvents && !coupon.applicableEvents.includes(eventId)) {
      return { valid: false, error: 'Coupon is not applicable for this event' };
    }

    if (coupon.minPurchase && totalAmount < coupon.minPurchase) {
      return { valid: false, error: `Minimum purchase amount is $${coupon.minPurchase}` };
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (totalAmount * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, totalAmount);

    return { valid: true, coupon, discount };
  }

  // Use coupon
  useCoupon(couponId: string, userId: number, eventId: number, discountAmount: number): boolean {
    const coupons = this.getAllCoupons();
    const couponIndex = coupons.findIndex(c => c.id === couponId);
    
    if (couponIndex === -1) return false;

    // Update usage count
    coupons[couponIndex].usedCount += 1;
    this.saveCoupons(coupons);

    // Record usage
    const usage: CouponUsage = {
      id: `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      couponId,
      userId,
      eventId,
      usedAt: new Date().toISOString(),
      discountAmount
    };

    const usageHistory = this.getUsageHistory();
    usageHistory.push(usage);
    localStorage.setItem(this.usageKey, JSON.stringify(usageHistory));

    return true;
  }

  // Get usage history
  getUsageHistory(): CouponUsage[] {
    const stored = localStorage.getItem(this.usageKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Get VIP coupons for user
  getVIPCoupons(): Coupon[] {
    return this.getAllCoupons().filter(c => c.couponType === 'vip' && c.isActive);
  }

  private saveCoupons(coupons: Coupon[]): void {
    localStorage.setItem(this.couponsKey, JSON.stringify(coupons));
  }

  private getDefaultCoupons(): Coupon[] {
    return [
      {
        id: 'coupon_1',
        code: 'WELCOME20',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscount: 50,
        validFrom: '2024-01-01T00:00:00.000Z',
        validUntil: '2024-12-31T23:59:59.999Z',
        usageLimit: 100,
        usedCount: 15,
        isActive: true,
        couponType: 'general'
      },
      {
        id: 'coupon_2',
        code: 'VIP50',
        discountType: 'fixed',
        discountValue: 50,
        minPurchase: 100,
        validFrom: '2024-01-01T00:00:00.000Z',
        validUntil: '2024-12-31T23:59:59.999Z',
        usageLimit: 50,
        usedCount: 8,
        isActive: true,
        couponType: 'vip'
      },
      {
        id: 'coupon_3',
        code: 'EARLYBIRD',
        discountType: 'percentage',
        discountValue: 15,
        maxDiscount: 30,
        validFrom: '2024-01-01T00:00:00.000Z',
        validUntil: '2024-06-30T23:59:59.999Z',
        usageLimit: 200,
        usedCount: 45,
        isActive: true,
        couponType: 'early-bird'
      }
    ];
  }
}

export const couponService = new CouponService();
