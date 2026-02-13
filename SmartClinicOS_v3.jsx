import { useState, useEffect, useRef } from "react";

/*
 ╔══════════════════════════════════════════════════════════════════╗
 ║  SMART CLINIC OS v3.0 — Complete Dual-Practice Dashboard        ║
 ║  Elgin Endocrinology Clinic (EEC) + Elgin Metabolic Center (EMC)║
 ║  7 Roles · 3 Sub-panels · Practice Switcher · Glass UI          ║
 ║  Bubble.io Visual Blueprint — Feb 2026                          ║
 ╚══════════════════════════════════════════════════════════════════╝
*/

// ═══════════════════════════════════════════
// DESIGN SYSTEM TOKENS
// ═══════════════════════════════════════════
const C = {
  // Backgrounds
  bg0: "#070d17", bg1: "#0b1422", bg2: "#0f1a2a",
  card: "rgba(16, 26, 42, 0.7)",
  cardH: "rgba(20, 32, 52, 0.82)",
  input: "rgba(10, 18, 30, 0.92)",
  // Borders
  b0: "rgba(74, 158, 255, 0.05)",
  b1: "rgba(74, 158, 255, 0.1)",
  b2: "rgba(74, 158, 255, 0.22)",
  b3: "rgba(74, 158, 255, 0.38)",
  // Accent
  blue: "#4a9eff", blueD: "rgba(74,158,255,0.12)",
  // Semantic
  grn: "#5cd4a4", grnD: "rgba(92,212,164,0.12)",
  red: "#f87171", redD: "rgba(248,113,113,0.12)",
  ylw: "#fbbf24", ylwD: "rgba(251,191,36,0.12)",
  orn: "#fb923c", ornD: "rgba(251,146,60,0.12)",
  pnk: "#f5a0a0",
  // Text
  t1: "#e8edf4", t2: "#94a3b8", t3: "#5a6b80", t4: "#3a4a5e",
  // Shape
  r: 14, rs: 8, rr: 20,
  // Font
  f: "'Manrope', system-ui, -apple-system, sans-serif",
};

// ═══════════════════════════════════════════
// PRACTICE DATA — DUAL ENTITY
// ═══════════════════════════════════════════
const PRACTICES = {
  eec: {
    id: "eec", name: "Elgin Endocrinology Clinic", short: "EEC",
    tagline: "Associates in Endocrinology Inc.",
    addr: "2400 Big Timber Rd, Suite 200B, Elgin, IL 60124",
    patients: "30,000", monthly: "$522K", weeklyRev: "$2,300",
    ar: "$19,800", staffCount: 15, payroll: "$26,200",
    color: C.blue,
  },
  emc: {
    id: "emc", name: "Elgin Metabolic Center", short: "EMC",
    tagline: "Elgin Metabolic Center LLC",
    addr: "2400 Big Timber Rd, Suite 200B, Elgin, IL 60124",
    patients: "8,200", monthly: "$148K", weeklyRev: "$980",
    ar: "$6,400", staffCount: 6, payroll: "$9,800",
    color: "#7dd3c0",
  },
};

const ROLES = [
  { id: "admin", label: "Admin / Owner", s: "Admin", icon: "◆", k: "A" },
  { id: "reception", label: "Receptionist", s: "Recep", icon: "◇", k: "R" },
  { id: "ma", label: "Medical Assistant", s: "MA", icon: "◈", k: "M" },
  { id: "np", label: "Nurse Practitioner", s: "NP", icon: "◉", k: "N" },
  { id: "provider", label: "Provider", s: "Dr.", icon: "●", k: "P" },
  { id: "billing", label: "Billing", s: "Bill", icon: "◐", k: "B" },
  { id: "hr", label: "HR & Payroll", s: "HR", icon: "◑", k: "H" },
];

const USERS = {
  admin: { name: "Dr. Qazi", title: "CEO / Owner", practices: ["eec", "emc"] },
  reception: { name: "John Patel", title: "Receptionist", practices: ["eec"] },
  ma: { name: "Michelle", title: "Medical Assistant", practices: ["eec"] },
  np: { name: "Ruby", title: "Nurse Practitioner", practices: ["eec", "emc"] },
  provider: { name: "Dr. Rahman", title: "Endocrinologist", practices: ["eec", "emc"] },
  billing: { name: "Marie Sanders", title: "Billing Specialist", practices: ["eec", "emc"] },
  hr: { name: "Komal", title: "Practice Manager", practices: ["eec", "emc"] },
};

// Per-practice appointment data
const APPTS = {
  eec: [
    { t: "8:30 AM", p: "Gordon Leblanc", type: "Follow-up", s: "checked_in", prov: "Dr. Rahman", copay: 30, bal: 0, elig: "active" },
    { t: "9:00 AM", p: "Jackie Peterson", type: "New Patient", s: "scheduled", prov: "Dr. Rahman", copay: 10, bal: 85, elig: "active" },
    { t: "9:30 AM", p: "Kevin Wang", type: "Lab Review", s: "scheduled", prov: "Dr. Rahman", copay: 0, bal: 1100, elig: "pending" },
    { t: "10:00 AM", p: "Peter Murphy", type: "Follow-up", s: "scheduled", prov: "Ruby NP", copay: 16, bal: 6, elig: "active" },
    { t: "10:30 AM", p: "Andrea Stephenson", type: "Consult", s: "scheduled", prov: "Dr. Rahman", copay: 30, bal: 85, elig: "active" },
    { t: "11:00 AM", p: "Sarah Chen", type: "Diabetes Mgmt", s: "scheduled", prov: "Ruby NP", copay: 25, bal: 0, elig: "active" },
    { t: "11:30 AM", p: "Marcus Johnson", type: "Thyroid F/U", s: "scheduled", prov: "Dr. Rahman", copay: 30, bal: 220, elig: "active" },
  ],
  emc: [
    { t: "8:00 AM", p: "Diana Ross", type: "Weight Mgmt", s: "checked_in", prov: "Dr. Rahman", copay: 40, bal: 0, elig: "active" },
    { t: "9:00 AM", p: "Tom Bradley", type: "Metabolic Panel", s: "scheduled", prov: "Ruby NP", copay: 25, bal: 150, elig: "active" },
    { t: "10:00 AM", p: "Lisa Park", type: "GLP-1 F/U", s: "scheduled", prov: "Dr. Rahman", copay: 30, bal: 0, elig: "pending" },
    { t: "11:00 AM", p: "James Wright", type: "Initial Consult", s: "scheduled", prov: "Dr. Rahman", copay: 50, bal: 0, elig: "active" },
    { t: "1:00 PM", p: "Maria Gonzalez", type: "Nutrition F/U", s: "scheduled", prov: "Ruby NP", copay: 20, bal: 45, elig: "active" },
  ],
};

const TASKS = {
  eec: [
    { title: "Verify insurance — Gordon Leblanc", to: "John Patel", pri: "high", due: "10:30 AM", cat: "elig" },
    { title: "Prior auth — Jackie Peterson insulin pump", to: "Michelle", pri: "urgent", due: "11:00 AM", cat: "pa" },
    { title: "Review 5 Aetria denied claims", to: "Marie Sanders", pri: "high", due: "2:00 PM", cat: "bill" },
    { title: "Send IL app for Dr. Qazi to Medicaid", to: "Komal", pri: "medium", due: "EOD", cat: "cred" },
    { title: "Follow up Dr. Rahman billing error", to: "Marie Sanders", pri: "high", due: "3:00 PM", cat: "bill" },
    { title: "Prior auth — K. Wang insulin pump PA", to: "Michelle", pri: "urgent", due: "11:30 AM", cat: "pa" },
  ],
  emc: [
    { title: "Verify insurance — Diana Ross", to: "John Patel", pri: "high", due: "9:00 AM", cat: "elig" },
    { title: "GLP-1 prior auth — Lisa Park", to: "Michelle", pri: "urgent", due: "10:30 AM", cat: "pa" },
    { title: "Process 3 ERA payments", to: "Marie Sanders", pri: "medium", due: "1:00 PM", cat: "bill" },
  ],
};

const CLAIMS = {
  eec: [
    { payer: "BCBS IL", billed: 9133, status: "Pending" },
    { payer: "UHC", billed: 9810, status: "Paid" },
    { payer: "Aetna", billed: 2700, status: "Denied" },
    { payer: "Cigna", billed: 1010, status: "Pending" },
    { payer: "Medicare", billed: 4200, status: "Paid" },
  ],
  emc: [
    { payer: "BCBS IL", billed: 3200, status: "Paid" },
    { payer: "UHC", billed: 2100, status: "Pending" },
    { payer: "Aetna", billed: 890, status: "Denied" },
    { payer: "Medicare", billed: 1800, status: "Paid" },
  ],
};

const CREDS = [
  { prov: "Dr. Rahman", s: ["ok", "ok", "ok"] },
  { prov: "Dr. Qazi", s: ["ok", "ok", "warn"] },
  { prov: "Dr. Khan", s: ["ok", "warn", "bad"] },
];

// ═══════════════════════════════════════════
// PARTICLES
// ═══════════════════════════════════════════
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = (c.width = window.innerWidth), h = (c.height = window.innerHeight);
    const N = 22;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
      r: Math.random() * 1.1 + 0.3,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < N; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.28);
        ctx.fillStyle = "rgba(74,158,255,0.1)"; ctx.fill();
        for (let j = i + 1; j < N; j++) {
          const d = Math.hypot(p.x - pts[j].x, p.y - pts[j].y);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(74,158,255,${0.03 * (1 - d / 120)})`;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const rs = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    window.addEventListener("resize", rs);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", rs); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

// ═══════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════
const G = ({ children, style, onClick, hover }) => {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        background: h && hover ? C.cardH : C.card,
        border: `1px solid ${h && hover ? C.b2 : C.b1}`,
        borderRadius: C.r, backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
        padding: 16, transition: "all 0.22s", cursor: onClick ? "pointer" : "default", ...style,
      }}>{children}</div>
  );
};

const B = ({ status, label }) => {
  const m = {
    active: [C.grnD, C.grn], checked_in: [C.grnD, C.grn], paid: [C.grnD, C.grn], ok: [C.grnD, C.grn],
    scheduled: [C.blueD, C.blue], pending: [C.ylwD, C.ylw], warn: [C.ylwD, C.ylw],
    denied: [C.redD, C.red], bad: [C.redD, C.red], expired: [C.redD, C.red],
    urgent: [C.redD, C.red], high: [C.ornD, C.orn], medium: [C.blueD, C.blue],
  };
  const [bg, fg] = m[status] || [C.blueD, C.blue];
  const def = { ok: "✓", warn: "⚠", bad: "✕", checked_in: "In", active: "Active", pending: "Pending", denied: "Denied", paid: "Paid", scheduled: "Sched" };
  return <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 4, background: bg, color: fg, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.3px" }}>{label || def[status] || status}</span>;
};

const M = ({ label, value, color = C.blue, sub, icon }) => (
  <G>
    <div style={{ fontSize: 9, color: C.t3, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 7 }}>{icon} {label}</div>
    <div style={{ fontSize: 24, fontWeight: 800, color, letterSpacing: "-1px", lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 9.5, color: C.t3, marginTop: 5 }}>{sub}</div>}
  </G>
);

const S = ({ children, icon }) => <div style={{ fontSize: 12, fontWeight: 700, color: C.t1, marginBottom: 10, display: "flex", alignItems: "center", gap: 5, letterSpacing: "0.2px" }}>{icon} {children}</div>;

const TH = ({ cols }) => (
  <div style={{ display: "grid", gridTemplateColumns: cols.map(c => c.w || "1fr").join(" "), padding: "5px 0", borderBottom: `1px solid ${C.b1}`, marginBottom: 2 }}>
    {cols.map(c => <div key={c.l} style={{ fontSize: 8.5, color: C.t4, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", padding: "0 3px" }}>{c.l}</div>)}
  </div>
);

const Pill = ({ children, active, onClick }) => (
  <button onClick={onClick} style={{
    padding: "5px 16px", borderRadius: 16, fontSize: 11, fontWeight: 600,
    border: `1px solid ${active ? C.b3 : "transparent"}`,
    background: active ? C.blueD : "transparent",
    color: active ? C.t1 : C.t3, cursor: "pointer", fontFamily: C.f, transition: "all 0.15s",
  }}>{children}</button>
);

const Row = ({ children, style }) => <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${C.b0}`, ...style }}>{children}</div>;

const Btn = ({ children, color = C.blue, filled }) => (
  <button style={{ padding: "7px 12px", borderRadius: C.rs, fontSize: 10, fontWeight: 600, border: filled ? "none" : `1px solid ${color}33`, background: filled ? `${color}18` : "transparent", color, cursor: "pointer", fontFamily: C.f }}>{children}</button>
);

const Clock = () => {
  const [t, setT] = useState(new Date());
  useEffect(() => { const i = setInterval(() => setT(new Date()), 1000); return () => clearInterval(i); }, []);
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 24, fontWeight: 200, color: C.t1, letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>{t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</div>
      <div style={{ fontSize: 8, color: "rgba(74,158,255,0.3)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Powered by Smart Clinic OS</div>
    </div>
  );
};

const Bar = ({ data, color = C.blue }) => {
  const mx = Math.max(...data);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2.5, height: 52 }}>
      {data.map((v, i) => <div key={i} style={{ flex: 1, height: `${(v / mx) * 100}%`, borderRadius: 2, background: `linear-gradient(to top, ${color}88, ${color}15)`, minHeight: 2 }} />)}
    </div>
  );
};

// ═══════════════════════════════════════════
// PORTAL: ADMIN
// ═══════════════════════════════════════════
function AdminPortal({ pr, setPanel }) {
  const p = PRACTICES[pr];
  const tasks = TASKS[pr] || [];
  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        <M icon="💵" label="Outstanding AR" value={p.ar} color={C.ylw} />
        <M icon="📈" label="Weekly Revenue" value={p.weeklyRev} color={C.grn} />
        <M icon="👥" label="Active Patients" value={p.patients} color={p.color} />
        <M icon="💰" label="Monthly Collections" value={p.monthly} color={C.grn} sub="↑ 3.2% vs last month" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: 12 }}>
        <G>
          <S icon="📧">Mail</S>
          {[
            { f: "support@elation.com", s: "API key renewal — action needed by Feb 20", t: "6:30 AM" },
            { f: "waystar@clearinghouse.com", s: `${p.short} Monthly ERA/EFT summary`, t: "6:02 AM" },
            { f: "komal@elginendo.com", s: "Staff PTO requests — 3 pending approval", t: "Yesterday" },
          ].map((m, i) => (
            <Row key={i}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10.5, color: p.color, fontWeight: 600 }}>{m.f}</div>
                <div style={{ fontSize: 10.5, color: C.t2, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.s}</div>
              </div>
              <div style={{ fontSize: 9.5, color: C.t3, whiteSpace: "nowrap", flexShrink: 0, marginLeft: 8 }}>{m.t}</div>
            </Row>
          ))}
        </G>
        <G>
          <S icon="📊">Revenue (12 mo)</S>
          <Bar data={[65, 82, 45, 93, 71, 88, 56, 77, 94, 60, 85, 98]} color={p.color} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
            <span style={{ fontSize: 8, color: C.t4 }}>Mar '25</span><span style={{ fontSize: 8, color: C.t4 }}>Feb '26</span>
          </div>
        </G>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <G>
          <S icon="🏥">Compliance Overview</S>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {[{ l: "Credentialing", v: "All Current", c: C.grn }, { l: "Licenses", v: "2 Expiring", c: C.ylw }, { l: "Malpractice", v: pr === "eec" ? "1 Issue" : "OK", c: pr === "eec" ? C.red : C.grn }, { l: "HIPAA", v: "100%", c: C.grn }].map(x => (
              <div key={x.l} style={{ padding: 8, background: "rgba(255,255,255,0.012)", borderRadius: C.rs }}>
                <div style={{ fontSize: 9, color: C.t3 }}>{x.l}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: x.c, marginTop: 2 }}>{x.v}</div>
              </div>
            ))}
          </div>
        </G>
        <G>
          <S icon="⚡">Tasks — {p.short}</S>
          {tasks.slice(0, 4).map((t, i) => (
            <Row key={i}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 10.5, color: C.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</div>
                <div style={{ fontSize: 9.5, color: C.t3 }}>{t.to}</div>
              </div>
              <B status={t.pri} label={t.pri} />
            </Row>
          ))}
        </G>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        {[
          { l: "Credentialing", ic: "📜", d: "Licenses, revalidations, tracking", pn: "cred" },
          { l: "HR & Payroll", ic: "👥", d: `${p.staffCount} staff · ${p.payroll}/wk payroll`, pn: "hr" },
          { l: "Revalidation", ic: "🔄", d: "Medicare, CAQH, Medicaid portals", pn: "reval" },
        ].map(q => (
          <G key={q.l} hover onClick={() => setPanel(q.pn)} style={{ cursor: "pointer" }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{q.ic}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.t1 }}>{q.l}</div>
            <div style={{ fontSize: 9.5, color: C.t3, marginTop: 2 }}>{q.d}</div>
          </G>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PORTAL: RECEPTION
// ═══════════════════════════════════════════
function ReceptionPortal({ pr }) {
  const p = PRACTICES[pr];
  const appts = APPTS[pr] || [];
  const totalAppts = pr === "eec" ? 33 : 18;
  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr 1fr", gap: 12 }}>
        <G>
          <S icon="📅">Today's Appointments</S>
          <div style={{ fontSize: 30, fontWeight: 800, color: C.t1, marginBottom: 8 }}>{totalAppts}</div>
          {[{ l: "Walk-Ins", v: pr === "eec" ? 2 : 1 }, { l: "Rescheduled", v: 1 }, { l: "No-Shows", v: 0 }].map(s => (
            <Row key={s.l}><span style={{ fontSize: 11, color: C.t2 }}>{s.l}</span><span style={{ fontSize: 11, fontWeight: 700, color: s.v === 0 ? C.grn : C.t1 }}>{s.v}</span></Row>
          ))}
        </G>
        <G>
          <S icon="✅">Eligibility</S>
          <div style={{ textAlign: "center", padding: "6px 0" }}>
            <div style={{ width: 42, height: 42, borderRadius: "50%", background: C.grnD, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px", fontSize: 18, color: C.grn }}>✓</div>
            <div style={{ fontSize: 9, color: C.grn }}>Completed</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.grn }}>{pr === "eec" ? 28 : 14}</div>
          </div>
          <div style={{ borderTop: `1px solid ${C.b0}`, textAlign: "center", padding: "6px 0" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.redD, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 4px", fontSize: 14, color: C.red }}>✕</div>
            <div style={{ fontSize: 9, color: C.red }}>Pending</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.red }}>{pr === "eec" ? 5 : 4}</div>
          </div>
        </G>
        <G>
          <S icon="🤖">AI Receptionist Alerts</S>
          {["Follow up with patient re: lab callback", "Return call from pharmacy", "Patient portal message awaiting"].map((a, i) => (
            <div key={i} style={{ display: "flex", gap: 6, padding: "5px 0", borderBottom: `1px solid ${C.b0}` }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.pnk, marginTop: 5, flexShrink: 0 }} />
              <span style={{ fontSize: 10.5, color: C.t2, lineHeight: 1.4 }}>{a}</span>
            </div>
          ))}
          <div style={{ marginTop: 10 }}><S icon="💬">Messages</S></div>
          <div style={{ fontSize: 10.5, color: C.t2 }}>Reminder: Check with Dr. Lee</div>
        </G>
      </div>
      <G>
        <S icon="📋">{p.short} — Full Schedule</S>
        <div style={{ overflowY: "auto", maxHeight: 200 }}>
          <TH cols={[{ l: "Time", w: "65px" }, { l: "Patient" }, { l: "Type", w: "85px" }, { l: "Elig", w: "55px" }, { l: "Copay", w: "50px" }, { l: "Balance", w: "65px" }]} />
          {appts.map((a, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "65px 1fr 85px 55px 50px 65px", padding: "6px 0", borderBottom: `1px solid ${C.b0}`, alignItems: "center" }}>
              <span style={{ fontSize: 10.5, color: C.t2, padding: "0 3px" }}>{a.t}</span>
              <span style={{ fontSize: 10.5, color: C.t1, fontWeight: 600, padding: "0 3px" }}>{a.p}</span>
              <span style={{ fontSize: 9.5, color: C.t3, padding: "0 3px" }}>{a.type}</span>
              <span style={{ padding: "0 3px" }}><B status={a.elig} /></span>
              <span style={{ fontSize: 10.5, color: C.t2, padding: "0 3px" }}>${a.copay}</span>
              <span style={{ fontSize: 10.5, fontWeight: 600, color: a.bal === 0 ? C.grn : C.ylw, padding: "0 3px" }}>${a.bal.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </G>
    </div>
  );
}

// ═══════════════════════════════════════════
// PORTAL: PROVIDER
// ═══════════════════════════════════════════
function ProviderPortal({ pr }) {
  const [view, setView] = useState("clinic");
  const p = PRACTICES[pr];
  const curPat = pr === "eec" ? "Jane Thompson" : "Diana Ross";
  const nextPat = pr === "eec" ? "Michael Rivera" : "Tom Bradley";
  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
        <Pill active={view === "clinic"} onClick={() => setView("clinic")}>Clinic</Pill>
        <Pill active={view === "finance"} onClick={() => setView("finance")}>Finance</Pill>
      </div>
      {view === "clinic" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr 1fr", gap: 12 }}>
          <G>
            <div style={{ fontSize: 9, color: C.t4, textTransform: "uppercase", letterSpacing: "1px" }}>Checked-In Patient</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.t1, margin: "4px 0 2px" }}>{curPat}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.ylw }}>Due</div>
            <div style={{ marginTop: 12, borderTop: `1px solid ${C.b0}`, paddingTop: 8 }}>
              <S icon="⚠">Alerts</S>
              <div style={{ fontSize: 10.5, color: C.t2 }}>• Abnormal A1C — 9.2%</div>
              <div style={{ fontSize: 10.5, color: C.t2, marginTop: 2 }}>• Patient's birthday 🎂</div>
            </div>
            <div style={{ marginTop: 12, borderTop: `1px solid ${C.b0}`, paddingTop: 8 }}>
              <div style={{ fontSize: 9, color: C.t4 }}>Next Patient</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.t1 }}>{nextPat}</div>
            </div>
          </G>
          <G>
            <S>Quick Access</S>
            {["Schedule", "Labs", "Rx Refills", "Billing", "HR & Payroll", "Credentialing", "Legal", "Revalidations"].map(x => (
              <button key={x} style={{ display: "block", width: "100%", padding: "7px 10px", marginBottom: 4, borderRadius: C.rs, border: `1px solid ${C.b1}`, background: "rgba(255,255,255,0.012)", color: C.t1, fontSize: 10.5, fontWeight: 500, cursor: "pointer", fontFamily: C.f, textAlign: "center" }}>{x}</button>
            ))}
          </G>
          <G>
            <S icon="💬">Messaging</S>
            <div style={{ fontSize: 10.5, color: C.t2, marginBottom: 8 }}>3 new refill requests to approve</div>
            <div style={{ padding: "7px 10px", borderRadius: C.rs, background: C.input, border: `1px solid ${C.b1}`, display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: 10.5, color: C.t3, flex: 1 }}>Send a message...</span>
              <span style={{ color: C.blue }}>➤</span>
            </div>
            <div style={{ marginTop: 12, borderTop: `1px solid ${C.b0}`, paddingTop: 8, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div><div style={{ fontSize: 9, color: C.t3 }}>Labs Ready</div><div style={{ fontSize: 20, fontWeight: 800, color: C.blue }}>4</div></div>
              <div><div style={{ fontSize: 9, color: C.t3 }}>Rx Refills</div><div style={{ fontSize: 20, fontWeight: 800, color: C.ylw }}>5</div></div>
            </div>
          </G>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <M icon="💵" label="Required Income" value={pr === "eec" ? "$40,000" : "$15,000"} color={C.ylw} />
          <M icon="📉" label="Liabilities" value={pr === "eec" ? "$62,000" : "$18,500"} color={C.red} />
          <M icon="🏦" label="Billing AR" value={pr === "eec" ? "$85,300" : "$22,100"} color={C.blue} sub={`Remaining Denials: ${pr === "eec" ? 6 : 2}`} />
          <M icon="🧑" label="Patient AR" value={pr === "eec" ? "$10,500" : "$3,200"} color={C.pnk} sub={`Over 30 Days: ${pr === "eec" ? 54 : 18}`} />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// PORTAL: BILLING
// ═══════════════════════════════════════════
function BillingPortal({ pr }) {
  const claims = CLAIMS[pr] || [];
  const p = PRACTICES[pr];
  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12 }}>
        <M icon="📤" label="Claims Sent" value={pr === "eec" ? "45" : "22"} color={C.grn} />
        <M icon="❌" label="Denied" value={pr === "eec" ? "12" : "4"} color={C.red} />
        <M icon="⚠" label="Rejections" value={pr === "eec" ? "6" : "2"} color={C.ylw} />
        <G>
          <S icon="🤖">AI Actions</S>
          <div style={{ fontSize: 10.5, color: C.t2 }}>• UHC denied GGM — missing DX</div>
          <div style={{ fontSize: 10.5, color: C.t2, marginTop: 2 }}>• Refile 5 claims from Aetria</div>
          <div style={{ fontSize: 10.5, color: C.blue, marginTop: 3, cursor: "pointer" }}>View all →</div>
        </G>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <G>
          <S icon="💰">{p.short} Patient Balances (30+ Days)</S>
          {(pr === "eec" ? [{ n: "Jones", a: 1050 }, { n: "Patel", a: 975 }, { n: "Cooper", a: 860 }, { n: "Nguyen", a: 775 }] : [{ n: "Bradley", a: 520 }, { n: "Wright", a: 410 }, { n: "Gonzalez", a: 280 }]).map(x => (
            <Row key={x.n}><span style={{ fontSize: 11, color: C.t2 }}>{x.n}</span><span style={{ fontSize: 11, fontWeight: 700, color: C.ylw }}>${x.a.toLocaleString()}</span></Row>
          ))}
        </G>
        <G>
          <S icon="📊">Claim Overview — {p.short}</S>
          <TH cols={[{ l: "Payer" }, { l: "Billed", w: "75px" }, { l: "Status", w: "65px" }]} />
          {claims.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 75px 65px", padding: "5px 0", borderBottom: `1px solid ${C.b0}`, alignItems: "center" }}>
              <span style={{ fontSize: 10.5, color: C.t1, padding: "0 3px" }}>{c.payer}</span>
              <span style={{ fontSize: 10.5, color: C.t2, padding: "0 3px" }}>${c.billed.toLocaleString()}</span>
              <span style={{ padding: "0 3px" }}><B status={c.status.toLowerCase()} label={c.status} /></span>
            </div>
          ))}
        </G>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <M icon="📬" label="Pending ERA/EFT" value={pr === "eec" ? "14" : "6"} color={C.blue} />
        <M icon="💵" label="Expected Weekly" value={pr === "eec" ? "$14,200" : "$4,800"} color={C.grn} />
        <G>
          <S icon="💬">Messages</S>
          <div style={{ fontSize: 10.5, color: C.t2 }}>Follow up on Dr. Rahman's billing error</div>
          <div style={{ fontSize: 10.5, color: C.t2, marginTop: 3 }}>ERA posted — review underpayments</div>
        </G>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PORTAL: MA
// ═══════════════════════════════════════════
function MAPortal({ pr }) {
  const appts = APPTS[pr] || [];
  const tasks = TASKS[pr] || [];
  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 0.6fr", gap: 12 }}>
        <G>
          <S icon="📅">Today's Appointments</S>
          {appts.slice(0, 4).map((a, i) => (
            <Row key={i}>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: C.t1 }}>{a.p}</div><div style={{ fontSize: 9.5, color: C.t3 }}>{a.type} · {a.prov}</div></div>
              <div style={{ textAlign: "right" }}><div style={{ fontSize: 10.5, color: C.t2 }}>{a.t}</div><B status={a.s} /></div>
            </Row>
          ))}
        </G>
        <G>
          <S icon="⚡">Quick Actions</S>
          {["Check-In Patient", "Take Vitals", "Room Assignment", "Add Notes", "Update Records"].map(a => (
            <button key={a} style={{ display: "block", width: "100%", padding: "7px 8px", marginBottom: 4, borderRadius: C.rs, border: `1px solid ${C.b1}`, background: C.blueD, color: C.blue, fontSize: 10, fontWeight: 600, cursor: "pointer", fontFamily: C.f }}>{a}</button>
          ))}
        </G>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <G>
          <S icon="🧑‍🤝‍🧑">Patient Queue</S>
          {appts.filter(a => a.s === "scheduled").slice(0, 3).map((a, i) => (
            <Row key={i}><span style={{ fontSize: 11, color: C.t1 }}>{a.p}</span><B status="scheduled" /></Row>
          ))}
        </G>
        <G>
          <S icon="📝">Prior Auth Queue</S>
          {tasks.filter(t => t.cat === "pa").map((t, i) => (
            <Row key={i}>
              <div style={{ fontSize: 10.5, color: C.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }}>{t.title}</div>
              <B status={t.pri} label={t.pri} />
            </Row>
          ))}
        </G>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PORTAL: NP
// ═══════════════════════════════════════════
function NPPortal({ pr }) {
  const appts = APPTS[pr] || [];
  const tasks = TASKS[pr] || [];
  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <G>
          <S icon="📋">Today's Schedule — {PRACTICES[pr].short}</S>
          {appts.slice(0, 4).map((a, i) => (
            <Row key={i}>
              <div><div style={{ fontSize: 11, fontWeight: 600, color: C.t1 }}>{a.p}</div><div style={{ fontSize: 9.5, color: C.t3 }}>{a.type}</div></div>
              <span style={{ fontSize: 10.5, color: C.t2 }}>{a.t}</span>
            </Row>
          ))}
        </G>
        <G>
          <S icon="✅">Tasks</S>
          {tasks.slice(0, 3).map((t, i) => (
            <Row key={i}><span style={{ fontSize: 10.5, color: C.t1 }}>{t.title}</span><span style={{ fontSize: 9.5, color: C.t3 }}>{t.due}</span></Row>
          ))}
        </G>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <G>
          <S icon="🧑‍🤝‍🧑">Patient Queue</S>
          {appts.filter(a => a.s === "scheduled").slice(0, 3).map((a, i) => (
            <Row key={i}><span style={{ fontSize: 11, color: C.t1 }}>{a.p}</span><span style={{ fontSize: 9.5, color: C.t3 }}>8:33 AM</span></Row>
          ))}
        </G>
        <G>
          <S icon="💬">Messages</S>
          {["Lab report ready — review", "Rx question — patient callback"].map((m, i) => (
            <div key={i} style={{ fontSize: 10.5, color: C.t2, padding: "4px 0", borderBottom: `1px solid ${C.b0}` }}>{m}</div>
          ))}
        </G>
        <G>
          <S icon="🔗">Quick Links</S>
          {["Scores & Screenings", "CGM Dashboard"].map(l => (
            <button key={l} style={{ display: "block", width: "100%", padding: "7px", marginBottom: 4, borderRadius: C.rs, border: `1px solid ${C.grnD}`, background: "transparent", color: C.grn, fontSize: 10, cursor: "pointer", fontFamily: C.f, textAlign: "left" }}>{l} →</button>
          ))}
        </G>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SUB-PANELS: CRED / HR / REVAL
// ═══════════════════════════════════════════
function CredPanel({ pr }) {
  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <G>
          <S icon="📝">Document Tracker</S>
          <TH cols={[{ l: "Provider" }, { l: "DEA", w: "38px" }, { l: "License", w: "48px" }, { l: "CAQH", w: "42px" }]} />
          {CREDS.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 38px 48px 42px", padding: "7px 0", borderBottom: `1px solid ${C.b0}`, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: C.t1, fontWeight: 600, padding: "0 3px" }}>{c.prov}</span>
              {c.s.map((s, j) => <span key={j} style={{ textAlign: "center" }}><B status={s} /></span>)}
            </div>
          ))}
        </G>
        <G>
          <S icon="📁">Documents Vault</S>
          {["BAA", "License", "NPPES", "CAQH", "CMS"].map(d => (
            <button key={d} style={{ display: "block", width: "100%", padding: "6px 8px", marginBottom: 3, borderRadius: C.rs, border: `1px solid ${C.b1}`, background: "rgba(255,255,255,0.01)", color: C.t1, fontSize: 10.5, cursor: "pointer", fontFamily: C.f, textAlign: "left" }}>{d} →</button>
          ))}
        </G>
        <G>
          <S icon="🆕">New Practice Onboarding</S>
          {[{ s: "EIN Registration", m: "M1" }, { s: "NPPES", m: "M2" }, { s: "CAQH Enrollment", m: "M3" }, { s: "IL State App", m: "M4" }, { s: "Clearinghouse", m: "M5" }].map(x => (
            <Row key={x.s}><span style={{ fontSize: 10.5, color: C.t2 }}>{x.s}</span><span style={{ fontSize: 9, color: C.t3 }}>{x.m}</span></Row>
          ))}
        </G>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <G>
          <S icon="⚠">Upcoming Expirations</S>
          <Row><div style={{ display: "flex", gap: 5 }}><span style={{ color: C.red }}>⚠</span><span style={{ fontSize: 11, color: C.t1 }}>DEA</span></div><span style={{ fontSize: 10, color: C.red }}>Next month</span></Row>
          <Row style={{ borderBottom: "none" }}><div style={{ display: "flex", gap: 5 }}><span style={{ color: C.ylw }}>⚠</span><span style={{ fontSize: 11, color: C.t1 }}>State License</span></div><span style={{ fontSize: 10, color: C.ylw }}>45 days</span></Row>
        </G>
        <G>
          <S icon="🌐">Portal Access</S>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            {["Availity", "CAQH", "NPPES", "CMS", "Medicare", "Medicaid"].map(p => (
              <button key={p} style={{ padding: "6px", borderRadius: C.rs, border: `1px solid ${C.b1}`, background: "rgba(255,255,255,0.01)", color: C.t2, fontSize: 9.5, cursor: "pointer", fontFamily: C.f }}>{p}</button>
            ))}
          </div>
        </G>
      </div>
    </div>
  );
}

function HRPanel({ pr }) {
  const p = PRACTICES[pr];
  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
        <G>
          <S icon="👥">Staff — {p.short}</S>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.t1, marginBottom: 6 }}>{p.staffCount}</div>
          {(pr === "eec" ? [{ l: "Doctors", v: 4 }, { l: "NPs", v: 3 }, { l: "MAs", v: 6 }, { l: "Reception", v: 2 }] : [{ l: "Doctors", v: 2 }, { l: "NPs", v: 1 }, { l: "MAs", v: 2 }, { l: "Reception", v: 1 }]).map(s => (
            <Row key={s.l}><span style={{ fontSize: 11, color: C.t2 }}>{s.l}</span><span style={{ fontSize: 11, fontWeight: 700, color: C.t1 }}>{s.v}</span></Row>
          ))}
        </G>
        <G>
          <S icon="💵">Payroll — {p.short}</S>
          <div style={{ fontSize: 26, fontWeight: 800, color: C.grn }}>{p.payroll}</div>
          <div style={{ fontSize: 10, color: C.t3 }}>Weekly</div>
        </G>
        <G>
          <S icon="📅">Leave Requests</S>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 9, color: C.t3 }}>Pending</div><div style={{ fontSize: 20, fontWeight: 800, color: C.ylw }}>2</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 9, color: C.t3 }}>Approved</div><div style={{ fontSize: 20, fontWeight: 800, color: C.grn }}>5</div></div>
          </div>
        </G>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <G>
          <S icon="✅">Compliance</S>
          {[{ l: "Handbook", ok: true }, { l: "Safety", ok: true }, { l: "Licenses", ok: true }, { l: "Health Ins.", ok: true }, { l: "Malpractice", ok: false }].map(c => (
            <Row key={c.l}><span style={{ fontSize: 10.5, color: C.t2 }}>{c.l}</span><span style={{ color: c.ok ? C.grn : C.red }}>{c.ok ? "✓" : "✕"}</span></Row>
          ))}
        </G>
        <G>
          <S icon="📋">Performance Review</S>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ylw }}>2 Weeks Overdue</div>
          <div style={{ fontSize: 10.5, color: C.t3, marginTop: 3 }}>Annual reviews due for 4 staff</div>
          <div style={{ marginTop: 8, width: "100%", height: 4, borderRadius: 2, background: C.blueD }}><div style={{ width: "60%", height: "100%", borderRadius: 2, background: C.blue }} /></div>
        </G>
      </div>
    </div>
  );
}

function RevalPanel() {
  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <G>
          <S icon="🔄">Revalidations</S>
          <Row><span style={{ fontSize: 13, color: C.t1 }}>Medicare</span><span style={{ fontSize: 12, fontWeight: 700, color: C.red }}>Overdue</span></Row>
          <Row style={{ borderBottom: "none" }}><span style={{ fontSize: 13, color: C.t1 }}>CAQH</span><span style={{ fontSize: 12, color: C.t2 }}>May 17</span></Row>
        </G>
        <G>
          <S>Portal Access</S>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {["Medicare", "CAQH", "Availity", "Medicaid"].map(p => (
              <button key={p} style={{ padding: "12px", borderRadius: C.r, border: `1px solid ${C.b1}`, background: "rgba(255,255,255,0.015)", color: C.t1, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: C.f }}>{p}</button>
            ))}
          </div>
        </G>
      </div>
      <G>
        <S>Quick Actions</S>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
          {[["🖨", "Print"], ["📠", "Fax"], ["⬆", "Upload"], ["📷", "Scan"], ["🔑", "Logon"], ["✉", "Email"]].map(([ic, l]) => (
            <div key={l} style={{ textAlign: "center", padding: 10, borderRadius: C.r, border: `1px solid ${C.b1}`, background: "rgba(255,255,255,0.01)", cursor: "pointer" }}>
              <div style={{ fontSize: 18, marginBottom: 3, color: C.blue }}>{ic}</div>
              <div style={{ fontSize: 9, color: C.t2 }}>{l}</div>
            </div>
          ))}
        </div>
      </G>
    </div>
  );
}

// ═══════════════════════════════════════════
// ARCHITECTURE VIEW
// ═══════════════════════════════════════════
function ArchView() {
  const sections = [
    { title: "BUBBLE.IO DATA TYPES (Create These First)", items: [
      "User — email, role (OptionSet), practice (OptionSet), name, title, is_active",
      "Practice — name, short_name, address, monthly_target, color_hex, is_hipaa",
      "Appointment — patient_name, time, type, status (OptionSet), provider (User), practice (Practice), copay, balance, eligibility",
      "Task — title, assigned_to (User), priority (OptionSet), due_time, category (OptionSet), practice, is_completed",
      "Claim — payer_name, billed_amount, status (OptionSet), practice, date_submitted, denial_reason",
      "Credential — provider (User), credential_type, status (OptionSet), expiration_date, document_url",
      "StaffMember — user (User), department, role_type, hire_date, payroll_rate, practice",
      "Message — sender, recipient, body, timestamp, is_read, practice",
      "EligibilityCheck — patient_name, practice, status (OptionSet), checked_at, payer",
      "AIAlert — message, portal_type, practice, priority (OptionSet), created_at, is_dismissed",
    ]},
    { title: "OPTION SETS (Create Before Data Types)", items: [
      "UserRole — admin, reception, ma, np, provider, billing, hr",
      "PracticeEntity — eec, emc",
      "AppointmentStatus — scheduled, checked_in, completed, no_show, cancelled, rescheduled",
      "TaskPriority — urgent, high, medium, low",
      "TaskCategory — eligibility, prior_auth, billing, credentialing, general",
      "ClaimStatus — pending, paid, denied, rejected, appealed",
      "CredentialStatus — active, expiring_soon, expired, pending_renewal",
      "EligibilityStatus — active, pending, inactive, unknown",
    ]},
    { title: "BUBBLE PAGES (8 Pages)", items: [
      "index — Login page (email/password + role selector for demo)",
      "dashboard — Main shell: header, practice switcher, role nav, copilot bar",
      "admin — Admin portal content (loads inside dashboard)",
      "reception — Reception portal content",
      "provider — Provider portal with Clinic/Finance toggle",
      "billing — Billing portal content",
      "ma — MA portal content",
      "np — NP portal content",
    ]},
    { title: "REUSABLE ELEMENTS (Build Once, Use Everywhere)", items: [
      "GlassCard — container with dark bg, blur backdrop, border, 14px radius",
      "MetricCard — label + big number + color + optional subtitle",
      "StatusBadge — colored pill: green/yellow/red/blue based on status",
      "SectionHeader — icon + title, uppercase label style",
      "CopilotBar — fixed bottom: Copilot btn + input + mic + logout",
      "PracticeSwitcher — toggle between EEC and EMC (visible to multi-practice users)",
      "RoleNav — icon buttons switching active portal",
      "ClockDisplay — real-time HH:MM with 'Powered by Smart Clinic OS'",
      "TableRow — grid row with consistent padding and border-bottom",
    ]},
    { title: "API CONNECTORS (Bubble API Connector Plugin)", items: [
      "Elation EMR — OAuth 2.0, GET /patients, /appointments, /tasks, /providers",
      "Waystar — API key auth, GET /claims, /eligibility, /era, POST /claims/submit",
      "QuickBooks — OAuth 2.0, GET /reports/ProfitAndLoss, /accounts, /invoices",
      "Zoho Mail — OAuth 2.0, GET /messages, /tasks, /calendar",
      "RingCentral — JWT auth, GET /fax, /call-log, POST /fax/send",
      "OpenAI Whisper — API key, POST /audio/transcriptions (voice commands)",
      "AWS Bedrock — IAM auth via Lambda proxy, POST /invoke-model (doc classification)",
    ]},
    { title: "ZAPIER WORKFLOWS (7 Core Zaps)", items: [
      "Elation New Appointment → Bubble Create Appointment record",
      "Elation Task Created → Bubble Create Task + Zoho Email notification",
      "RingCentral Fax Received → S3 Upload → Bedrock Classify → Bubble Create Task",
      "Waystar Claim Status Change → Bubble Update Claim record",
      "Bubble Task Completed → Elation Update Task status",
      "Waystar ERA Posted → Bubble Create AIAlert for billing portal",
      "Scheduled: Daily Eligibility Batch → Waystar Check → Bubble Update",
    ]},
    { title: "STYLES (Apply to Bubble Style Tab)", items: [
      "Background gradient: linear-gradient(160deg, #070d17, #0b1422, #0f1a2a)",
      "Card background: rgba(16, 26, 42, 0.7) with backdrop-filter blur(14px)",
      "Card border: 1px solid rgba(74, 158, 255, 0.1)",
      "Card border-radius: 14px",
      "Font: Manrope (import from Google Fonts) — weights 200-800",
      "Primary text: #e8edf4 | Secondary: #94a3b8 | Dim: #5a6b80",
      "Accent blue: #4a9eff | Green: #5cd4a4 | Red: #f87171 | Yellow: #fbbf24",
      "Input background: rgba(10, 18, 30, 0.92)",
      "Active pill: rgba(74,158,255,0.12) bg + rgba(74,158,255,0.38) border",
    ]},
  ];

  return (
    <div className="fi" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <G style={{ borderLeft: `3px solid ${C.blue}` }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: C.t1, marginBottom: 4 }}>Bubble.io Build Blueprint</div>
        <div style={{ fontSize: 11, color: C.t2 }}>Follow this sequence: Option Sets → Data Types → Reusable Elements → Pages → API Connectors → Zapier Workflows</div>
      </G>
      {sections.map((sec, si) => (
        <G key={si}>
          <div style={{ fontSize: 12, fontWeight: 800, color: C.blue, marginBottom: 10, letterSpacing: "0.5px" }}>{si + 1}. {sec.title}</div>
          {sec.items.map((item, ii) => {
            const [name, ...rest] = item.split(" — ");
            return (
              <div key={ii} style={{ padding: "5px 0", borderBottom: `1px solid ${C.b0}`, display: "flex", gap: 8 }}>
                <span style={{ fontSize: 10.5, color: C.t1, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>{name}</span>
                {rest.length > 0 && <span style={{ fontSize: 10.5, color: C.t3 }}>— {rest.join(" — ")}</span>}
              </div>
            );
          })}
        </G>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function SmartClinicOS() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("admin");
  const [practice, setPractice] = useState("eec");
  const [panel, setPanel] = useState(null);
  const [showArch, setShowArch] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const user = USERS[role];
  const pr = PRACTICES[practice];
  const canSwitch = user.practices.length > 1;

  const portals = {
    admin: AdminPortal, reception: ReceptionPortal, ma: MAPortal, np: NPPortal,
    provider: ProviderPortal, billing: BillingPortal, hr: HRPanel,
  };
  const panels = { cred: CredPanel, hr: HRPanel, reval: RevalPanel };
  const hasSubNav = ["admin", "provider"].includes(role) || panel;

  // ─── LOGIN ───
  if (!loggedIn) {
    return (
      <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.bg0} 0%, ${C.bg1} 50%, ${C.bg2} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: C.f, position: "relative" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          .fi { animation: fu 0.4s ease both; }
          @keyframes fu { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        <Particles />
        <div className="fi" style={{ width: 360, padding: 32, borderRadius: C.rr, background: "rgba(10, 18, 30, 0.8)", border: `1px solid ${C.b1}`, backdropFilter: "blur(20px)", zIndex: 10, textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 200, color: "#c0d0e4", letterSpacing: "-0.5px", lineHeight: 1.3 }}>Elgin<br/>Endocrinology<br/>Clinic</div>
          <div style={{ height: 1, background: C.b1, margin: "16px 0" }} />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${C.b1}`, background: C.input, color: C.t1, fontSize: 12, outline: "none", fontFamily: C.f, marginBottom: 8 }} />
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Password" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${C.b1}`, background: C.input, color: C.t1, fontSize: 12, outline: "none", fontFamily: C.f, marginBottom: 14 }} />
          <button onClick={() => setLoggedIn(true)} style={{ width: "100%", padding: "11px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, rgba(74,158,255,0.15), rgba(74,158,255,0.05))`, color: "#c0d0e4", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: C.f }}>Sign In</button>
          <div style={{ fontSize: 10, color: "rgba(74,158,255,0.3)", marginTop: 8, cursor: "pointer" }}>Forgot password?</div>
          <div style={{ marginTop: 14, fontSize: 8, color: C.t4, textTransform: "uppercase", letterSpacing: "1.5px" }}>Demo — select role</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center", marginTop: 5 }}>
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)} style={{
                padding: "3px 8px", borderRadius: 4, fontSize: 8.5, fontFamily: C.f,
                border: role === r.id ? `1px solid ${C.b3}` : "1px solid transparent",
                background: role === r.id ? C.blueD : "transparent",
                color: role === r.id ? C.blue : C.t4, cursor: "pointer", fontWeight: 600,
              }}>{r.s}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ───
  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${C.bg0} 0%, ${C.bg1} 50%, ${C.bg2} 100%)`, color: C.t1, fontFamily: C.f, position: "relative", paddingBottom: 56 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(74,158,255,0.12); border-radius: 2px; }
        .fi { animation: fu 0.4s ease both; }
        @keyframes fu { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <Particles />

      {/* HEADER */}
      <header style={{ position: "relative", zIndex: 10, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${C.b0}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: C.t1 }}>{pr.name}</span>
          <span style={{ fontSize: 11, color: pr.color, opacity: 0.6 }}>{user.title}</span>
          {canSwitch && (
            <div style={{ display: "flex", gap: 2, marginLeft: 4 }}>
              {user.practices.map(pid => (
                <button key={pid} onClick={() => { setPractice(pid); setPanel(null); }} style={{
                  padding: "3px 10px", borderRadius: 4, fontSize: 9, fontWeight: 700, fontFamily: C.f,
                  border: practice === pid ? `1px solid ${PRACTICES[pid].color}55` : "1px solid transparent",
                  background: practice === pid ? `${PRACTICES[pid].color}12` : "transparent",
                  color: practice === pid ? PRACTICES[pid].color : C.t4, cursor: "pointer",
                }}>{PRACTICES[pid].short}</button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", gap: 2 }}>
            {ROLES.map(r => (
              <button key={r.id} onClick={() => { setRole(r.id); setPanel(null); setShowArch(false); }} style={{
                width: 26, height: 26, borderRadius: 4, fontSize: 10, fontFamily: C.f, display: "flex", alignItems: "center", justifyContent: "center",
                border: role === r.id ? `1px solid ${C.b3}` : "1px solid transparent",
                background: role === r.id ? C.blueD : "transparent",
                color: role === r.id ? C.blue : C.t4, cursor: "pointer",
              }} title={r.label}>{r.k}</button>
            ))}
          </div>
          <button onClick={() => { setShowArch(!showArch); setPanel(null); }} style={{
            padding: "4px 10px", borderRadius: 4, fontSize: 9, fontWeight: 700, fontFamily: C.f,
            border: showArch ? `1px solid ${C.grn}55` : `1px solid ${C.b1}`,
            background: showArch ? C.grnD : "transparent",
            color: showArch ? C.grn : C.t3, cursor: "pointer",
          }}>ARCH</button>
          <Clock />
        </div>
      </header>

      {/* SUB-NAV */}
      {hasSubNav && !showArch && (
        <nav style={{ position: "relative", zIndex: 10, padding: "5px 24px", display: "flex", gap: 4, borderBottom: `1px solid rgba(255,255,255,0.01)` }}>
          <Pill active={!panel} onClick={() => setPanel(null)}>Dashboard</Pill>
          {(role === "admin" || role === "provider") && <Pill active={panel === "cred"} onClick={() => setPanel("cred")}>Credentialing</Pill>}
          {role === "admin" && <Pill active={panel === "hr"} onClick={() => setPanel("hr")}>HR & Payroll</Pill>}
          {(role === "admin" || role === "provider") && <Pill active={panel === "reval"} onClick={() => setPanel("reval")}>Revalidation</Pill>}
        </nav>
      )}

      {/* CONTENT */}
      <main style={{ position: "relative", zIndex: 10, padding: "16px 24px" }}>
        {showArch ? <ArchView /> : panel && panels[panel]
          ? (() => { const P = panels[panel]; return <P pr={practice} />; })()
          : role === "admin" ? <AdminPortal pr={practice} setPanel={setPanel} />
          : (() => { const P = portals[role]; return P ? <P pr={practice} setPanel={setPanel} /> : null; })()
        }
      </main>

      {/* COPILOT BAR */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 20, padding: "8px 24px", background: "rgba(7,13,23,0.9)", backdropFilter: "blur(10px)", borderTop: `1px solid ${C.b0}`, display: "flex", alignItems: "center", gap: 8 }}>
        <button style={{ padding: "4px 10px", borderRadius: C.rs, border: `1px solid ${C.b2}`, background: C.blueD, color: C.blue, fontSize: 10, fontWeight: 700, cursor: "pointer", fontFamily: C.f }}>⚡ Copilot</button>
        <div style={{ flex: 1, padding: "7px 12px", borderRadius: C.rs, border: `1px solid ${C.b1}`, background: C.input, color: C.t3, fontSize: 11, fontFamily: C.f }}>Ask me anything...</div>
        <button style={{ width: 28, height: 28, borderRadius: "50%", border: `1px solid ${C.b2}`, background: C.blueD, color: C.blue, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>🎤</button>
        <button onClick={() => setLoggedIn(false)} style={{ padding: "4px 10px", borderRadius: C.rs, border: `1px solid ${C.redD}`, background: "transparent", color: C.red, fontSize: 9, fontWeight: 600, cursor: "pointer", fontFamily: C.f }}>Logout</button>
      </div>
    </div>
  );
}
