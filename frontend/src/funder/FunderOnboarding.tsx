import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Upload, Camera, Shield, Home, TrendingUp, Banknote, Repeat, ChevronRight } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
type InvestPath = 'tenant' | 'pool' | null;
type PayoutMode = 'payout' | 'compound' | null;

interface FormState {
  understoodRole: boolean;
  investPath: InvestPath;
  payoutMode: PayoutMode;
  idFront: File | null;
  idBack: File | null;
  selfie: File | null;
  acknowledgedNotice: boolean;
  agreedToTerms: boolean;
}

// ─── Animation Variants ───────────────────────────────────────────────────────
const slideVariants = {
  enter: { x: 40, opacity: 0 },
  center: { x: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { x: -40, opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width: i + 1 === current ? 24 : 6,
            backgroundColor: i + 1 <= current ? '#9234EA' : '#DDD6FE',
          }}
          transition={{ duration: 0.3 }}
          className="h-1.5 rounded-full"
        />
      ))}
    </div>
  );
}

function ChoiceCard({
  selected,
  onClick,
  icon: Icon,
  title,
  body,
  badge,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  body: string;
  badge: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.985 }}
      className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 relative overflow-hidden ${selected
          ? 'border-[#9234EA] bg-[#F3F0FF]'
          : 'border-gray-100 bg-white hover:border-purple-200'
        }`}
    >
      {selected && (
        <motion.div
          layoutId="card-glow"
          className="absolute inset-0 bg-gradient-to-br from-purple-100/40 to-transparent pointer-events-none"
        />
      )}
      <div className="flex items-start gap-4 relative z-10">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${selected ? 'bg-[#9234EA] text-white' : 'bg-purple-50 text-[#9234EA]'
            }`}
        >
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-bold text-gray-900 text-sm">{title}</h4>
            <span
              className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${selected ? 'bg-[#9234EA] text-white' : 'bg-purple-100 text-[#9234EA]'
                }`}
            >
              {badge}
            </span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
        </div>
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-0 right-0 w-5 h-5 rounded-full bg-[#9234EA] flex items-center justify-center"
        >
          <Check size={11} className="text-white top-1" strokeWidth={3} />
        </motion.div>
      )}
    </motion.button>
  );
}

function UploadZone({
  label,
  file,
  onFile,
  capture,
  icon: Icon,
}: {
  label: string;
  file: File | null;
  onFile: (f: File) => void;
  capture?: 'user' | 'environment';
  icon: React.ElementType;
}) {
  return (
    <div>
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</p>
      <label
        className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl py-7 cursor-pointer transition-all ${file
            ? 'border-[#9234EA] bg-purple-50'
            : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50/40'
          }`}
      >
        <input
          type="file"
          accept="image/*"
          capture={capture}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) onFile(e.target.files[0]);
          }}
        />
        {file ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 rounded-full bg-[#9234EA] flex items-center justify-center">
              <Check size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <p className="text-xs text-[#9234EA] font-bold">{file.name.slice(0, 22)}{file.name.length > 22 ? '…' : ''}</p>
          </motion.div>
        ) : (
          <>
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-300">
              <Icon size={20} strokeWidth={1.5} />
            </div>
            <p className="text-xs text-gray-400 font-medium">Tap to upload</p>
          </>
        )}
      </label>
    </div>
  );
}

// ─── Projection Mini Chart ─────────────────────────────────────────────────────
function ProjectionBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-[10px] text-gray-500 w-20 shrink-0">{label}</p>
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / max) * 100}%` }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <p className="text-[11px] font-bold text-gray-700 w-20 text-right shrink-0">
        {(value / 1_000_000).toFixed(1)}M
      </p>
    </div>
  );
}

// ─── Steps ───────────────────────────────────────────────────────────────────

function Step1({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp} className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#9234EA] flex items-center justify-center mx-auto mb-5">
          <Shield size={26} className="text-white" strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
          You Make Homes<br />Possible
        </h2>
        <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-xs mx-auto">
          As a Welile Partner, your contribution powers rent for verified families across Uganda.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-3">
        {[
          {
            icon: Home,
            title: 'Fund Housing',
            body: 'Your contribution covers rent for real, verified tenants who need it most.',
          },
          {
            icon: Banknote,
            title: 'Earn Monthly Rewards',
            body: 'Receive participation rewards every 30 days on your active contribution.',
          },
          {
            icon: Shield,
            title: 'We Handle Everything',
            body: 'Welile manages all verification, collections, and repayments   no stress on your end.',
          },
        ].map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex items-start gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 text-[#9234EA]">
              <Icon size={17} strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <motion.label
        variants={fadeUp}
        className="flex items-start gap-3 bg-purple-50 border border-purple-100 rounded-xl p-4 cursor-pointer"
      >
        <div
          className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${form.understoodRole ? 'bg-[#9234EA] border-[#9234EA]' : 'border-gray-300'
            }`}
          onClick={() => setForm(p => ({ ...p, understoodRole: !p.understoodRole }))}
        >
          {form.understoodRole && <Check size={11} className="text-white" strokeWidth={3} />}
        </div>
        <p className="text-[13px] text-gray-600 font-medium leading-snug">
          I understand I am a housing contributor   Welile manages all tenant relationships on my behalf.
        </p>
      </motion.label>
    </motion.div>
  );
}

// ─── Investment Projection Graph ─────────────────────────────────────────────
const MONTHS = 12;
const PRINCIPAL = 1_000_000;

function buildPoints(mode: 'tenant' | 'pool', principal: number): number[] {
  const pts: number[] = [];
  let bal = principal;
  for (let m = 0; m <= MONTHS; m++) {
    pts.push(bal);
    if (mode === 'tenant') bal += principal * 0.15;
    else bal = bal * 1.15;
  }
  return pts;
}

function fmtUGX(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return `${Math.round(n)}`;
}

function InvestmentGraph({ mode }: { mode: 'tenant' | 'pool' }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [rawInput, setRawInput] = useState('1,000,000');

  // Parse the raw input to a usable number (strip commas)
  const principal = Math.max(10_000, Number(rawInput.replace(/,/g, '')) || PRINCIPAL);

  // Format with commas as user types
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    const formatted = digits ? Number(digits).toLocaleString() : '';
    setRawInput(formatted);
  };

  const W = 320, H = 140, PAD = { top: 12, right: 12, bottom: 28, left: 8 };
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;

  const points = buildPoints(mode, principal);
  const maxVal = points[MONTHS];
  const minVal = principal;
  const range = maxVal - minVal || 1;  // guard div-by-zero

  const xOf = (i: number) => PAD.left + (i / MONTHS) * innerW;
  const yOf = (v: number) => PAD.top + innerH - ((v - minVal) / range) * innerH;

  const pathD = points
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${xOf(i).toFixed(1)},${yOf(v).toFixed(1)}`)
    .join(' ');

  const areaD = pathD +
    ` L${xOf(MONTHS).toFixed(1)},${(PAD.top + innerH).toFixed(1)}` +
    ` L${PAD.left.toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`;

  const color = mode === 'pool' ? '#9234EA' : '#7B2AC5';
  const labelStep = mode === 'pool' ? 3 : 2;
  const pathId = `graph-${mode}`;

  return (
    <motion.div
      key={mode}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3 gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {mode === 'tenant' ? 'Monthly rewards · 12 months' : 'Compounding growth · 12 months'}
          </p>
          {/* Inline amount calculator */}
          <div className="flex items-center gap-1.5 mt-1.5 bg-purple-50 border border-purple-100 rounded-xl px-3 py-1.5">
            <span className="text-[11px] font-bold text-[#9234EA] shrink-0">UGX</span>
            <input
              type="text"
              inputMode="numeric"
              value={rawInput}
              onChange={handleAmountChange}
              placeholder="1,000,000"
              className="flex-1 min-w-0 bg-transparent text-sm font-black text-[#1C1C2E] outline-none placeholder:text-gray-300 w-full"
            />
          </div>
        </div>
        <motion.span
          key={mode + '-badge'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-[11px] font-black px-2.5 py-1 rounded-full bg-purple-100 text-[#9234EA] shrink-0 mt-4"
        >
          {mode === 'tenant' ? '+15% / mo' : 'Compounds'}
        </motion.span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ touchAction: 'none' }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id={`area-${mode}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <clipPath id={pathId}>
            <motion.rect
              x={PAD.left}
              y={0}
              height={H}
              initial={{ width: 0 }}
              animate={{ width: innerW }}
              transition={{ duration: 1.1, ease: 'easeOut', delay: 0.1 }}
            />
          </clipPath>
        </defs>

        <path d={areaD} fill={`url(#area-${mode})`} clipPath={`url(#${pathId})`} />

        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          clipPath={`url(#${pathId})`}
        />

        {points.map((_, i) => {
          if (i % labelStep !== 0 || i === 0) return null;
          return (
            <text key={i} x={xOf(i)} y={H - 6} textAnchor="middle" fontSize="8" fill="#9CA3AF">
              M{i}
            </text>
          );
        })}

        {points.map((v, i) => (
          <g key={i}>
            <rect
              x={xOf(i) - 12}
              y={0}
              width={24}
              height={H - PAD.bottom}
              fill="transparent"
              onMouseEnter={() => setHovered(i)}
              style={{ cursor: 'crosshair' }}
            />
            {hovered === i && (
              <g>
                <line
                  x1={xOf(i)} y1={PAD.top}
                  x2={xOf(i)} y2={PAD.top + innerH}
                  stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5"
                />
                <circle cx={xOf(i)} cy={yOf(v)} r={4} fill={color} />
                <circle cx={xOf(i)} cy={yOf(v)} r={7} fill={color} opacity="0.15" />
                <g transform={`translate(${Math.min(xOf(i) + 6, W - 82)},${Math.max(yOf(v) - 28, PAD.top)})`}>
                  <rect width="78" height="22" rx="6" fill={color} />
                  <text x="39" y="14" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">
                    {fmtUGX(v)} UGX
                  </text>
                </g>
              </g>
            )}
          </g>
        ))}
      </svg>

      {/* Bottom summary - reactive to typed amount */}
      <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
        <div>
          <p className="text-[10px] text-gray-400">After 12 months</p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {mode === 'tenant'
              ? `+UGX ${fmtUGX(principal * 0.15)} / mo reward`
              : `${((points[MONTHS] / principal - 1) * 100).toFixed(0)}% total growth`
            }
          </p>
        </div>
        <motion.p
          key={points[MONTHS]}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-base font-black text-[#9234EA]"
        >
          UGX {fmtUGX(points[MONTHS])}
        </motion.p>
      </div>
    </motion.div>
  );
}

function Step2({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
          How Would You Like<br />to Contribute?
        </h2>
        <p className="text-sm text-gray-400 mt-2">Choose your contribution style   you can always adjust later.</p>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-3">
        <ChoiceCard
          selected={form.investPath === 'tenant'}
          onClick={() => setForm(p => ({ ...p, investPath: 'tenant' }))}
          icon={Home}
          title="Support a Tenant"
          body="Your contribution is matched to a specific rent need. A real family gets housed, and you earn a monthly participation reward on what you put in."
          badge="15% Monthly"
        />
        <ChoiceCard
          selected={form.investPath === 'pool'}
          onClick={() => setForm(p => ({ ...p, investPath: 'pool' }))}
          icon={TrendingUp}
          title="Grow Your Contribution"
          body="Add to the housing pool. Your monthly rewards build on themselves   each cycle your base grows and so does the next reward."
          badge="Compounding"
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {form.investPath && (
          <InvestmentGraph key={form.investPath} mode={form.investPath} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Step3({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  // Projections at 15% on UGX 1,000,000
  const monthly = 1_000_000 + (150_000 * 6);  // flat
  const compound = Math.round(1_000_000 * Math.pow(1.15, 6)); // compounded

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
          Choose Your<br />Reward Style
        </h2>
        <p className="text-sm text-gray-400 mt-2">How do you want to receive your monthly participation rewards?</p>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-3">
        <ChoiceCard
          selected={form.payoutMode === 'payout'}
          onClick={() => setForm(p => ({ ...p, payoutMode: 'payout' }))}
          icon={Banknote}
          title="Monthly Cash Rewards"
          body="Every 30 days your reward lands in your wallet   ready to spend, withdraw, or re-contribute however you like."
          badge="Steady Income"
        />
        <ChoiceCard
          selected={form.payoutMode === 'compound'}
          onClick={() => setForm(p => ({ ...p, payoutMode: 'compound' }))}
          icon={Repeat}
          title="Let It Grow"
          body="Your rewards are quietly added to your balance each month. Next month you earn on the bigger number   a quiet multiplier working for you."
          badge="Max Growth"
        />
      </motion.div>

      <motion.div variants={fadeUp} className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3 shadow-sm">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          UGX 1M projection   6 months
        </p>
        <ProjectionBar label="Monthly Cash" value={monthly} max={compound} color="#A78BFA" />
        <ProjectionBar label="Let It Grow" value={compound} max={compound} color="#9234EA" />
        <p className="text-[11px] text-gray-400 pt-1">
          Compounding earns <span className="text-[#9234EA] font-bold">UGX {((compound - monthly) / 1000).toFixed(0)}K more</span> over 6 months on the same contribution.
        </p>
      </motion.div>
    </motion.div>
  );
}

function Step4({ form, setForm }: { form: FormState; setForm: React.Dispatch<React.SetStateAction<FormState>> }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
          Secure Your<br />Account
        </h2>
        <p className="text-sm text-gray-400 mt-2">Required to protect your contributions and ensure secure payouts to you.</p>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-4">
        <UploadZone
          label="National ID   Front"
          file={form.idFront}
          icon={Upload}
          onFile={(f) => setForm(p => ({ ...p, idFront: f }))}
        />
        <UploadZone
          label="National ID   Back"
          file={form.idBack}
          icon={Upload}
          onFile={(f) => setForm(p => ({ ...p, idBack: f }))}
        />
        <UploadZone
          label="Live Selfie"
          file={form.selfie}
          icon={Camera}
          capture="user"
          onFile={(f) => setForm(p => ({ ...p, selfie: f }))}
        />
      </motion.div>
    </motion.div>
  );
}

function Step5({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={fadeUp}>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-tight">
          Partner<br />Commitment
        </h2>
        <p className="text-sm text-gray-400 mt-2">Almost there   just two things to confirm before you begin.</p>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="bg-amber-50 border border-amber-200 rounded-2xl p-5 relative overflow-hidden"
      >
        <div className="absolute -right-3 -top-3 w-20 h-20 rounded-full bg-amber-100/60" />
        <h4 className="font-black text-amber-900 text-sm mb-2 relative z-10">90-Day Exit Notice</h4>
        <p className="text-xs text-amber-800 leading-relaxed relative z-10">
          To keep the housing pool stable for all tenants and partners, withdrawing your principal contribution requires a{' '}
          <strong>90-day notice period</strong>. Monthly rewards are paused the moment a withdrawal request is submitted.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} className="space-y-3">
        {[
          {
            key: 'acknowledgedNotice' as keyof FormState,
            label: 'I understand the 90-day notice period and that monthly rewards pause during this time.',
          },
          {
            key: 'agreedToTerms' as keyof FormState,
            label: 'I agree to the Welile Partner Participation Terms and Conditions.',
          },
        ].map(({ key, label }) => (
          <label
            key={key}
            className="flex items-start gap-3 bg-white border border-gray-100 rounded-xl p-4 cursor-pointer shadow-sm"
          >
            <div
              className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-colors ${form[key] ? 'bg-[#9234EA] border-[#9234EA]' : 'border-gray-300'
                }`}
              onClick={() => setForm(p => ({ ...p, [key]: !p[key] }))}
            >
              {form[key] && <Check size={11} className="text-white" strokeWidth={3} />}
            </div>
            <p className="text-[13px] text-gray-600 font-medium leading-snug">{label}</p>
          </label>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── Step Validity ─────────────────────────────────────────────────────────────
function isValid(step: number, form: FormState): boolean {
  if (step === 1) return form.understoodRole;
  if (step === 2) return form.investPath !== null;
  if (step === 3) return form.payoutMode !== null;
  if (step === 4) return !!(form.idFront && form.idBack && form.selfie);
  if (step === 5) return form.acknowledgedNotice && form.agreedToTerms;
  return false;
}

const STEP_LABELS = ['Welcome', 'Invest', 'Reward Style', 'Identity', 'Agreement'];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FunderOnboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const TOTAL = 5;

  const [form, setForm] = useState<FormState>({
    understoodRole: false,
    investPath: null,
    payoutMode: null,
    idFront: null,
    idBack: null,
    selfie: null,
    acknowledgedNotice: false,
    agreedToTerms: false,
  });

  const valid = isValid(step, form);

  const handleNext = () => {
    if (step < TOTAL) setStep(s => s + 1);
    else navigate('/funder-dashboard');
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else navigate('/login');
  };

  const stepComponents: Record<number, React.ReactNode> = {
    1: <Step1 form={form} setForm={setForm} />,
    2: <Step2 form={form} setForm={setForm} />,
    3: <Step3 form={form} setForm={setForm} />,
    4: <Step4 form={form} setForm={setForm} />,
    5: <Step5 form={form} setForm={setForm} />,
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-100 shrink-0 sticky top-0 z-20">
        {/* Dots row sits at very top */}
        <div className="flex items-center justify-center pt-10 pb-2">
          <StepDots total={TOTAL} current={step} />
        </div>
        {/* Nav row */}
        <div className="px-5 pb-3 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
          >
            <ArrowLeft size={18} />
          </button>

          <p className="text-[13px] font-black text-gray-800 tracking-tight uppercase">
            {STEP_LABELS[step - 1]}
          </p>

          <div className="w-9" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {stepComponents[step]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-5 pb-8 pt-4 bg-white border-t border-gray-100 shrink-0">
        <motion.button
          onClick={handleNext}
          disabled={!valid}
          whileTap={valid ? { scale: 0.97 } : {}}
          className={`w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all duration-200 ${valid
              ? step === TOTAL
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600'
                : 'bg-[#9234EA] text-white shadow-lg shadow-purple-200 hover:bg-[#7B2AC5]'
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
        >
          {step === TOTAL ? (
            <>
              Complete Setup <Check size={18} strokeWidth={2.5} />
            </>
          ) : (
            <>
              Continue <ChevronRight size={18} strokeWidth={2.5} />
            </>
          )}
        </motion.button>

        <p className="text-center text-[11px] text-gray-400 mt-3">
          Step {step} of {TOTAL} · {STEP_LABELS[step - 1]}
        </p>
      </div>
    </div>
  );
}
