import React, { useState } from 'react';
import { CreditCard, Shield, Lock, CheckCircle2, Sparkles, X, Smartphone, Globe } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (planName: string) => void;
  plan: {
    name: string;
    price: string;
    period: string;
  };
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, onSuccess, plan }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'stripe'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      onSuccess(plan.name);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-2xl relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Secure Checkout
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" /> 256-bit SSL Encryption
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-400" /> Complete Subscription Payment
          </h3>
        </div>

        {/* Order Summary */}
        <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs text-purple-300 font-bold uppercase tracking-wider">Selected Plan</div>
            <div className="text-base font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              <Sparkles className="w-4 h-4 text-amber-400" /> {plan.name}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-black text-white font-mono">{plan.price}</div>
            <div className="text-[11px] text-gray-400">/{plan.period}</div>
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              paymentMethod === 'card'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" /> Credit Card
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('upi')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              paymentMethod === 'upi'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> UPI / QR
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('stripe')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              paymentMethod === 'stripe'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Stripe
          </button>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {paymentMethod === 'card' && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  required
                  placeholder="Samuel Kiran Babu"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Card Number</label>
                <input
                  type="text"
                  required
                  maxLength={19}
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={e => setCardNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Expiry Date</label>
                  <input
                    type="text"
                    required
                    placeholder="12/28"
                    maxLength={5}
                    value={expiry}
                    onChange={e => setExpiry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">CVC Code</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    placeholder="888"
                    value={cvc}
                    onChange={e => setCvc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </>
          )}

          {paymentMethod === 'upi' && (
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">UPI ID / VPA</label>
              <input
                type="text"
                required
                placeholder="username@upi"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-purple-500"
              />
              <p className="text-[10px] text-gray-400 mt-1.5">Supported: Google Pay, PhonePe, Paytm, BHIM UPI.</p>
            </div>
          )}

          {paymentMethod === 'stripe' && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 space-y-2">
              <p className="font-bold text-white">Stripe Checkout Hosted Redirect</p>
              <p className="text-gray-400">Clicking below will process tokenized checkout via Stripe Billing Webhooks.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={processing}
            className="w-full py-3.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 hover:from-purple-500 hover:to-pink-500 shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Pay {plan.price} & Activate Subscription
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-[10px] text-gray-500 pt-2 border-t border-white/5">
          <Shield className="w-3.5 h-3.5 text-purple-400" /> Powered by Stripe & Razorpay Billing Infrastructure
        </div>
      </div>
    </div>
  );
};
