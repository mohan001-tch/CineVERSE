/**
 * SubscribePage.jsx — Premium Subscription Page
 * 
 * Complete subscription flow with:
 *   Section A: 3 Pricing plan cards (Basic, Pro, Elite)
 *   Section B: User details form with validation
 *   Section C: Payment section with UPI/Card/Net Banking options
 *   Success screen with fake transaction ID
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Crown, Star, Zap, Check, CreditCard, Smartphone,
  Building2, ChevronDown, ArrowRight, Sparkles, Shield,
  PartyPopper, Home
} from 'lucide-react';

// ─── Plan Data ───────────────────────────────────────────────
const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    icon: Star,
    color: 'from-blue-500 to-cyan-400',
    shadow: 'shadow-[0_0_30px_rgba(59,130,246,0.3)]',
    features: ['Watchlist Management', 'Voice Narrator', 'Basic Search', 'Standard Quality'],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 199,
    icon: Crown,
    color: 'from-cinema-accent to-cinema-purple',
    shadow: 'shadow-[0_0_40px_rgba(0,212,255,0.3)]',
    features: ['Everything in Basic', 'Trailer Access', 'HD Posters', 'Mood Discovery', 'AI Chatbot'],
    popular: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 499,
    icon: Zap,
    color: 'from-amber-400 to-orange-500',
    shadow: 'shadow-[0_0_30px_rgba(251,191,36,0.3)]',
    features: ['Everything in Pro', 'AI Recommendations', 'Early Access', '4K Streaming', 'Offline Downloads', 'Priority Support'],
    popular: false,
  },
];

const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank'];

// ─── Helper: Generate fake transaction ID ────────────────────
function generateTxnId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ─── Main Component ──────────────────────────────────────────
export default function SubscribePage() {
  const navigate = useNavigate();
  const formRef = useRef(null);

  // State
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [showSuccess, setShowSuccess] = useState(false);
  const [txnId, setTxnId] = useState('');
  const [errors, setErrors] = useState({});

  // Form fields
  const [form, setForm] = useState({
    name: '', email: '', phone: '', city: '',
    upiId: '', cardNumber: '', cardExpiry: '', cardCvv: '', bank: banks[0],
  });

  const currentPlan = plans.find((p) => p.id === selectedPlan);
  const gst = Math.round(currentPlan.price * 0.18);
  const total = currentPlan.price + gst;

  // ─── Handlers ──────────────────────────────────────────────
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const scrollToForm = (planId) => {
    setSelectedPlan(planId);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  const validate = () => {
    const e = {};
    if (!form.name || form.name.length < 3) e.name = 'Name must be at least 3 characters';
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone || !/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number';
    if (!form.city) e.city = 'City is required';
    if (paymentMethod === 'upi' && !form.upiId) e.upiId = 'Enter your UPI ID';
    if (paymentMethod === 'card') {
      if (!form.cardNumber || form.cardNumber.replace(/\s/g, '').length < 16) e.cardNumber = 'Enter a valid card number';
      if (!form.cardExpiry) e.cardExpiry = 'Enter expiry date';
      if (!form.cardCvv || form.cardCvv.length < 3) e.cardCvv = 'Enter CVV';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => {
    if (!validate()) return;
    setTxnId(generateTxnId());
    setShowSuccess(true);
  };

  // ─── Success Screen ────────────────────────────────────────
  if (showSuccess) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-center max-w-md mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]"
          >
            <Check size={48} className="text-white" strokeWidth={3} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-3">Payment Successful!</h1>
            <div className="glass rounded-2xl p-6 mb-6 text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-cinema-muted text-sm">Plan</span>
                <span className="text-white font-semibold">{currentPlan.name} — ₹{currentPlan.price}/mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cinema-muted text-sm">Transaction ID</span>
                <span className="text-cinema-accent font-mono font-bold">{txnId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cinema-muted text-sm">Total Paid</span>
                <span className="text-cinema-green font-bold">₹{total}</span>
              </div>
            </div>
            <p className="text-cinema-green font-medium mb-8 flex items-center justify-center gap-2">
              <Sparkles size={16} /> Your premium access is now active
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="magnetic-btn px-8 py-4 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold shadow-neon flex items-center gap-2 mx-auto"
            >
              <Home size={18} /> Go to Homepage
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // ─── Main Page ─────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* ═══ Header ═══ */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6">
            <Crown size={14} className="text-cinema-gold" />
            <span className="text-xs text-cinema-muted">Premium Plans</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4">
            Unlock <span className="gradient-text">Premium</span>
          </h1>
          <p className="text-cinema-muted text-lg max-w-xl mx-auto">
            Get unlimited access to trailers, AI recommendations, and exclusive features.
          </p>
        </motion.div>

        {/* ═══ SECTION A: Pricing Plans ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            const isSelected = selectedPlan === plan.id;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-[1px] ${plan.popular ? 'bg-gradient-to-b ' + plan.color : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-cinema-accent to-cinema-purple text-white text-xs font-bold shadow-neon">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className={`h-full rounded-2xl p-6 md:p-8 ${plan.popular ? 'bg-cinema-dark' : 'glass'} ${isSelected ? plan.shadow : ''} transition-all duration-300`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="font-display text-4xl font-bold text-white">₹{plan.price}</span>
                    <span className="text-cinema-muted text-sm">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-cinema-text">
                        <Check size={14} className="text-cinema-green flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => scrollToForm(plan.id)}
                    className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cinema-accent to-cinema-purple text-white shadow-neon'
                        : 'glass text-white border border-white/10 hover:border-cinema-accent/30'
                    }`}
                  >
                    Subscribe Now <ArrowRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ═══ SECTION B & C: Form + Payment ═══ */}
        <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ─── Left: User Details Form ─── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 glass rounded-2xl p-6 md:p-8"
          >
            <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield size={20} className="text-cinema-accent" /> Your Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputField label="Full Name" value={form.name} onChange={(v) => updateField('name', v)} error={errors.name} placeholder="John Doe" />
              <InputField label="Email Address" type="email" value={form.email} onChange={(v) => updateField('email', v)} error={errors.email} placeholder="you@email.com" />
              <InputField label="Phone Number" value={form.phone} onChange={(v) => updateField('phone', v.replace(/\D/g, '').slice(0, 10))} error={errors.phone} placeholder="9876543210" />
              <InputField label="City" value={form.city} onChange={(v) => updateField('city', v)} error={errors.city} placeholder="Mumbai" />
            </div>

            {/* Plan Selector */}
            <div className="mt-6">
              <label className="text-sm text-cinema-muted mb-2 block">Selected Plan</label>
              <div className="relative">
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full bg-cinema-card border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cinema-accent/50 appearance-none cursor-pointer"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} — ₹{p.price}/month</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-cinema-muted pointer-events-none" />
              </div>
            </div>

            {/* ─── Payment Method ─── */}
            <h3 className="font-display text-lg font-bold text-white mt-8 mb-4">Payment Method</h3>
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { id: 'upi', label: 'UPI', icon: Smartphone },
                { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                { id: 'netbanking', label: 'Net Banking', icon: Building2 },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    paymentMethod === id
                      ? 'bg-cinema-accent/15 text-cinema-accent border border-cinema-accent/30'
                      : 'glass text-cinema-muted border border-white/5 hover:border-white/15'
                  }`}
                >
                  <Icon size={16} /> {label}
                </button>
              ))}
            </div>

            {/* Payment Fields */}
            <AnimatePresence mode="wait">
              {paymentMethod === 'upi' && (
                <motion.div key="upi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <InputField label="UPI ID" value={form.upiId} onChange={(v) => updateField('upiId', v)} error={errors.upiId} placeholder="yourname@upi" />
                </motion.div>
              )}
              {paymentMethod === 'card' && (
                <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <InputField label="Card Number" value={form.cardNumber} onChange={(v) => updateField('cardNumber', v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim())} error={errors.cardNumber} placeholder="1234 5678 9012 3456" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Expiry (MM/YY)" value={form.cardExpiry} onChange={(v) => updateField('cardExpiry', v)} error={errors.cardExpiry} placeholder="12/28" />
                    <InputField label="CVV" type="password" value={form.cardCvv} onChange={(v) => updateField('cardCvv', v.replace(/\D/g, '').slice(0, 4))} error={errors.cardCvv} placeholder="•••" />
                  </div>
                </motion.div>
              )}
              {paymentMethod === 'netbanking' && (
                <motion.div key="nb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <label className="text-sm text-cinema-muted mb-2 block">Select Bank</label>
                  <div className="relative">
                    <select value={form.bank} onChange={(e) => updateField('bank', e.target.value)}
                      className="w-full bg-cinema-card border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cinema-accent/50 appearance-none cursor-pointer">
                      {banks.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-cinema-muted pointer-events-none" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ─── Right: Order Summary ─── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-2xl p-6 md:p-8 sticky top-24">
              <h3 className="font-display text-lg font-bold text-white mb-6">Order Summary</h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-cinema-muted">{currentPlan.name} Plan</span>
                  <span className="text-white">₹{currentPlan.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-cinema-muted">GST (18%)</span>
                  <span className="text-white">₹{gst}</span>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between">
                  <span className="text-white font-bold">Total</span>
                  <span className="font-display text-2xl font-bold gradient-text">₹{total}</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handlePay}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cinema-accent to-cinema-purple text-white font-bold shadow-neon flex items-center justify-center gap-2 text-lg"
              >
                Pay ₹{total} Now
              </motion.button>
              <p className="text-cinema-muted/50 text-xs text-center mt-4 flex items-center justify-center gap-1">
                <Shield size={12} /> Secured with 256-bit encryption
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Input Field Component ──────────────────────────
function InputField({ label, value, onChange, error, placeholder, type = 'text' }) {
  return (
    <div>
      <label className="text-sm text-cinema-muted mb-2 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-cinema-card border rounded-xl px-4 py-3 text-white text-sm placeholder:text-cinema-muted/40 focus:outline-none transition-colors ${
          error ? 'border-cinema-red/50 focus:border-cinema-red' : 'border-white/10 focus:border-cinema-accent/50'
        }`}
      />
      {error && <p className="text-cinema-red text-xs mt-1">{error}</p>}
    </div>
  );
}
