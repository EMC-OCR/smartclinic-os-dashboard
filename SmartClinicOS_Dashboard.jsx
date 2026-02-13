import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
// SMART CLINIC OS — Role-Based Dashboard
// Glass UI Dark Theme · 7 Portals · Voice Ready
// ═══════════════════════════════════════════════════════════

const ROLES = [
  { id: "admin", label: "Admin / Owner", icon: "🏠", color: "#4a9eff" },
  { id: "reception", label: "Receptionist", icon: "📋", color: "#4a9eff" },
  { id: "ma", label: "Medical Assistant", icon: "💉", color: "#4a9eff" },
  { id: "np", label: "Nurse Practitioner", icon: "⚕️", color: "#4a9eff" },
  { id: "provider", label: "Provider", icon: "🩺", color: "#4a9eff" },
  { id: "billing", label: "Billing", icon: "💰", color: "#7dd3c0" },
  { id: "manager", label: "Manager", icon: "📊", color: "#4a9eff" },
];

const USERS = {
  admin: { name: "Dr. Qazi", title: "CEO / Admin", practice: "Elgin Endocrinology" },
  reception: { name: "John Patel", title: "Receptionist", practice: "Elgin Endo Clinic" },
  ma: { name: "Michelle", title: "Medical Assistant", practice: "Elgin Metabolic Center" },
  np: { name: "Ruby", title: "Nurse Practitioner", practice: "Elgin Metabolic Center" },
  provider: { name: "Dr. Rahman", title: "Endocrinologist", practice: "Elgin Endocrinology" },
  billing: { name: "Marie Sanders", title: "Billing Specialist", practice: "Elgin Endocrinology" },
  manager: { name: "Komal", title: "Practice Manager", practice: "Elgin Metabolic Center" },
};

const TODAY_APPTS = [
  { time: "8:30 AM", patient: "Gordon Leblanc", type: "Follow-up", status: "checked_in", provider: "Dr. Rahman", copay: "$30.00", balance: "$0.00", eligibility: "active", room: "" },
  { time: "9:00 AM", patient: "Jackie Peterson", type: "New Patient", status: "scheduled", provider: "Dr. Rahman", copay: "$10.00", balance: "$85.00", eligibility: "active", room: "" },
  { time: "9:30 AM", patient: "Kevin Wang", type: "Lab Review", status: "scheduled", provider: "Dr. Rahman", copay: "$0.00", balance: "$1,100.55", eligibility: "pending", room: "" },
  { time: "10:00 AM", patient: "Peter Murphy", type: "Follow-up", status: "scheduled", provider: "Ruby NP", copay: "$16.00", balance: "$6.00", eligibility: "active", room: "" },
  { time: "10:30 AM", patient: "Andrea Stephenson", type: "Consultation", status: "scheduled", provider: "Dr. Rahman", copay: "$30.00", balance: "$85.00", eligibility: "active", room: "" },
];

const TASKS = [
  { title: "Verify insurance for Gordon Leblanc", assigned: "John Patel", priority: "high", due: "10:30 AM", category: "eligibility" },
  { title: "Complete prior auth for Jackie Peterson", assigned: "Michelle", priority: "urgent", due: "11:00 AM", category: "prior_auth" },
  { title: "Review Aetria denied claims (5)", assigned: "Marie Sanders", priority: "high", due: "2:00 PM", category: "billing" },
  { title: "Send IL app for Dr. Qazi to Medicaid", assigned: "Komal", priority: "medium", due: "EOD", category: "credentialing" },
  { title: "Replace insulin pump PA for K. Wang", assigned: "Michelle", priority: "urgent", due: "11:30 AM", category: "prior_auth" },
  { title: "Follow up on Dr. Rahman's billing error", assigned: "Marie Sanders", priority: "high", due: "3:00 PM", category: "billing" },
];

const CLAIMS_DATA = [
  { payer: "CigTuast", submitted: "09/01", billed: "$9,133.00", status: "Pending", color: "#4a9eff" },
  { payer: "WQH Ice", submitted: "09/10", billed: "$9,810.00", status: "Paid", color: "#7dd3c0" },
  { payer: "TieT Tuast", submitted: "09/12", billed: "$2,700.00", status: "Denied", color: "#f87171" },
  { payer: "Muttler", submitted: "09/15", billed: "$1,010.00", status: "Pending", color: "#4a9eff" },
];

const AR_DATA = [
  { payer: "CigTuast", amount: "$1,710.00", aging: "30" },
  { payer: "Place Last", amount: "$2,081.00", aging: "60" },
  { payer: "WantTuast", amount: "$201.00", aging: "30" },
  { payer: "MicrT Tuast", amount: "$995.00", aging: "90" },
];

const CREDENTIALS = [
  { provider: "Dr. Rahman", statuses: ["active", "active", "active"] },
  { provider: "Dr. Qazi", statuses: ["active", "active", "warning"] },
  { provider: "Dr. Khan", statuses: ["active", "warning", "expired"] },
];

// ─── Glass Card Component ───
function GlassCard({ children, style, className = "", onClick, glow }) {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: "rgba(20, 32, 50, 0.65)",
        border: "1px solid rgba(74, 158, 255, 0.08)",
        borderRadius: 14,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: 20,
        transition: "all 0.3s ease",
        cursor: onClick ? "pointer" : "default",
        boxShadow: glow ? "0 0 20px rgba(74, 158, 255, 0.06)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Status Badge ───
function StatusBadge({ status }) {
  const colors = {
    active: { bg: "rgba(125, 211, 192, 0.15)", text: "#7dd3c0", label: "Active" },
    checked_in: { bg: "rgba(125, 211, 192, 0.15)", text: "#7dd3c0", label: "Checked In" },
    scheduled: { bg: "rgba(74, 158, 255, 0.15)", text: "#4a9eff", label: "Scheduled" },
    pending: { bg: "rgba(251, 191, 36, 0.15)", text: "#fbbf24", label: "Pending" },
    denied: { bg: "rgba(248, 113, 113, 0.15)", text: "#f87171", label: "Denied" },
    warning: { bg: "rgba(251, 191, 36, 0.15)", text: "#fbbf24", label: "⚠" },
    expired: { bg: "rgba(248, 113, 113, 0.15)", text: "#f87171", label: "⚠" },
    no_show: { bg: "rgba(248, 113, 113, 0.15)", text: "#f87171", label: "No-Show" },
    completed: { bg: "rgba(125, 211, 192, 0.15)", text: "#7dd3c0", label: "Done" },
  };
  const c = colors[status] || colors.scheduled;
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 6,
      background: c.bg, color: c.text, fontSize: 11, fontWeight: 600,
    }}>{c.label}</span>
  );
}

// ─── Metric Card ───
function MetricCard({ label, value, color = "#4a9eff", sub }) {
  return (
    <GlassCard>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color, letterSpacing: "-1px" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{sub}</div>}
    </GlassCard>
  );
}

// ─── Current Time Display ───
function ClockDisplay() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  return (
    <div style={{ textAlign: "right" }}>
      <div style={{ fontSize: 32, fontWeight: 300, color: "#e2e8f0", letterSpacing: "-1px", fontFamily: "'Outfit', sans-serif" }}>
        {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
      </div>
      <div style={{ fontSize: 11, color: "rgba(74, 158, 255, 0.5)", marginTop: 2 }}>Powered by Smart Clinic OS</div>
    </div>
  );
}

// ─── Particle Background ───
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = window.innerWidth;
    let h = c.height = window.innerHeight;
    const pts = Array.from({ length: 30 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 1.2 + 0.3,
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, w, h);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(74, 158, 255, 0.15)";
        ctx.fill();
        pts.slice(i + 1).forEach(q => {
          const d = Math.hypot(p.x - q.x, p.y - q.y);
          if (d < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(74, 158, 255, ${0.04 * (1 - d / 140)})`;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

// ═══════════════════════════════════════════════════════════
// PORTAL: ADMIN / OWNER
// ═══════════════════════════════════════════════════════════
function AdminPortal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, animation: "fadeUp 0.5s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
        <MetricCard label="Outstanding Receivables" value="$19,800" color="#fbbf24" />
        <MetricCard label="Weekly Revenue" value="$2,300" color="#7dd3c0" />
        <MetricCard label="Total Patients" value="30,000" color="#4a9eff" />
        <MetricCard label="Monthly Collections" value="$522K" color="#7dd3c0" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>📧 Mail</div>
          {[
            { from: "support@elation.com", subject: "API key renewal reminder — action needed", time: "06:30 AM" },
            { from: "waystar@clearinghouse.com", subject: "Monthly ERA/EFT summary ready for download", time: "06:02 AM" },
          ].map((m, i) => (
            <div key={i} style={{ padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 12, color: "#4a9eff", fontWeight: 500 }}>{m.from}</div>
                <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{m.subject}</div>
              </div>
              <div style={{ fontSize: 11, color: "#475569", whiteSpace: "nowrap" }}>{m.time}</div>
            </div>
          ))}
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>🏥 Compliance Overview</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Credentialing", value: "$83,000", color: "#7dd3c0" },
              { label: "Certifications", value: "$135,806", color: "#7dd3c0" },
              { label: "Audits", value: "$13,826", color: "#fbbf24" },
              { label: "Licenses", value: "$9,603,300", color: "#4a9eff" },
            ].map((c, i) => (
              <div key={i} style={{ padding: 10, background: "rgba(255,255,255,0.02)", borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: "#64748b" }}>{c.label}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: c.color }}>{c.value}</div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>⚡ Recent Activity</div>
          {TASKS.slice(0, 4).map((t, i) => (
            <div key={i} style={{ padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.03)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, color: "#e2e8f0" }}>{t.title}</div>
                <div style={{ fontSize: 11, color: "#475569" }}>{t.assigned}</div>
              </div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{t.due}</div>
            </div>
          ))}
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>📊 Analytics</div>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-end", height: 120 }}>
            {[65, 82, 45, 93, 71, 88, 56, 77, 94, 60, 85, 72].map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: "100%", height: v * 1.1, borderRadius: 4,
                  background: `linear-gradient(to top, rgba(74, 158, 255, 0.6), rgba(74, 158, 255, 0.15))`,
                }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 10, color: "#475569" }}>Jan</span>
            <span style={{ fontSize: 10, color: "#475569" }}>Dec</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PORTAL: RECEPTION
// ═══════════════════════════════════════════════════════════
function ReceptionPortal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.5s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>📅 Today's Appointments</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div><span style={{ fontSize: 36, fontWeight: 700, color: "#e2e8f0" }}>33</span><span style={{ fontSize: 12, color: "#64748b", marginLeft: 8 }}>Appointments</span></div>
          </div>
          {[
            { label: "Walk-Ins", value: "2" },
            { label: "Rescheduled", value: "1" },
            { label: "No-Shows", value: "0" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{s.value}</span>
            </div>
          ))}
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>✅ Eligibility</div>
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(125, 211, 192, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 24, color: "#7dd3c0" }}>✓</div>
            <div style={{ fontSize: 12, color: "#7dd3c0" }}>Completed</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#7dd3c0" }}>28</div>
          </div>
          <div style={{ textAlign: "center", padding: "12px 0", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(248, 113, 113, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px", fontSize: 18, color: "#f87171" }}>✕</div>
            <div style={{ fontSize: 12, color: "#f87171" }}>Pending</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#f87171" }}>5</div>
          </div>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>🤖 AI Receptionist Alerts</div>
          {[
            "Follow up with patient",
            "Return call from pharmacy",
          ].map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#f5c0bc" }} />
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{a}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>💬 Messages</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 6 }}>Reminder: Check with Dr. Lee</div>
        </GlassCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>🧑 Checked-In Patients</div>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 10 }}>Due Balance</div>
          {TODAY_APPTS.filter(a => a.status === "checked_in" || a.balance !== "$0.00").slice(0, 3).map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{a.patient}</div>
                <StatusBadge status={a.status} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: a.balance === "$0.00" ? "#7dd3c0" : "#fbbf24" }}>{a.balance}</div>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button style={{ flex: 1, padding: "10px", borderRadius: 8, border: "none", background: "rgba(74, 158, 255, 0.15)", color: "#4a9eff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Pay</button>
            <button style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#94a3b8", fontSize: 12, cursor: "pointer" }}>Write Off</button>
            <button style={{ flex: 1, padding: "10px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)", background: "transparent", color: "#94a3b8", fontSize: 12, cursor: "pointer" }}>Add Note</button>
          </div>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>📋 Schedule</div>
          <div style={{ overflowY: "auto", maxHeight: 220 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Time", "Patient", "Elig", "Copay", "Balance"].map(h => (
                    <th key={h} style={{ fontSize: 10, color: "#475569", fontWeight: 500, textAlign: "left", padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TODAY_APPTS.map((a, i) => (
                  <tr key={i}>
                    <td style={{ fontSize: 12, color: "#94a3b8", padding: "8px" }}>{a.time}</td>
                    <td style={{ fontSize: 12, color: "#e2e8f0", padding: "8px", fontWeight: 500 }}>{a.patient}</td>
                    <td style={{ padding: "8px" }}><StatusBadge status={a.eligibility} /></td>
                    <td style={{ fontSize: 12, color: "#94a3b8", padding: "8px" }}>{a.copay}</td>
                    <td style={{ fontSize: 12, color: a.balance === "$0.00" ? "#7dd3c0" : "#fbbf24", padding: "8px", fontWeight: 500 }}>{a.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PORTAL: PROVIDER (Dr. Rahman)
// ═══════════════════════════════════════════════════════════
function ProviderPortal() {
  const [view, setView] = useState("clinic");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.5s ease" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 8 }}>
        {["clinic", "finance"].map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "8px 28px", borderRadius: 20, border: "1px solid rgba(74, 158, 255, 0.15)",
            background: view === v ? "rgba(74, 158, 255, 0.1)" : "transparent",
            color: view === v ? "#e2e8f0" : "#64748b", cursor: "pointer",
            fontSize: 14, fontWeight: 500, textTransform: "capitalize", fontFamily: "inherit",
          }}>{v}</button>
        ))}
      </div>
      {view === "clinic" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <GlassCard>
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>Checked-In Patient</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#e2e8f0", marginBottom: 2 }}>Jane Thompson</div>
            <div style={{ fontSize: 13, color: "#fbbf24", fontWeight: 500 }}>Due</div>
            <div style={{ marginTop: 16, fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>Alerts</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>• Abnormal test result</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>• Patient's birthday</div>
          </GlassCard>
          <GlassCard>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {["Schedule", "Labs", "Rx Refills", "HR & Payroll", "Credentialing", "Legal", "Revalidations"].map(item => (
                <button key={item} style={{
                  padding: "10px 16px", borderRadius: 10,
                  border: "1px solid rgba(74, 158, 255, 0.1)", background: "rgba(255,255,255,0.02)",
                  color: "#e2e8f0", fontSize: 13, fontWeight: 500, cursor: "pointer",
                  textAlign: "center", fontFamily: "inherit",
                }}>{item}</button>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>Messaging</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 12 }}>3 new refill requests to approve</div>
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 12, color: "#475569", flex: 1 }}>Send a message...</span>
              <span style={{ color: "#4a9eff" }}>➤</span>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 6 }}>Labs</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#4a9eff" }}>4 <span style={{ fontSize: 12, fontWeight: 400, color: "#64748b" }}>results ready</span></div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 6 }}>Rx Refill Requests</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: "#fbbf24" }}>5 <span style={{ fontSize: 12, fontWeight: 400, color: "#64748b" }}>awaiting review</span></div>
            </div>
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 12, color: "#64748b" }}>Next Patient</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#e2e8f0" }}>Michael Rivera</div>
            </div>
          </GlassCard>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <MetricCard label="Required Income" value="$40,000" color="#fbbf24" />
          <MetricCard label="Liabilities" value="$62,000" color="#f87171" />
          <MetricCard label="Billing AR" value="$85,300" color="#4a9eff" sub="Remaining Denials: 6" />
          <MetricCard label="Patient AR" value="$10,500" color="#f5c0bc" sub="Over 30 Days: 54" />
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PORTAL: BILLING
// ═══════════════════════════════════════════════════════════
function BillingPortal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.5s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Claims Sent Today</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#7dd3c0" }}>45</div>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Denied Claims</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#f87171" }}>12</div>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Rejections</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#fbbf24" }}>6</div>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>🤖 AI Action Panel</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>• UHC denied GGM for missing DX</div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>• Refile 5 claims from Aetria</div>
        </GlassCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>Patient Balances (30+ Days)</div>
          {[
            { name: "Jones", amount: "$1,050" },
            { name: "Patel", amount: "$975" },
            { name: "Cooper", amount: "$860" },
            { name: "Nguyen", amount: "$775" },
            { name: "Lopez", amount: "$680" },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{p.name}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: "#fbbf24" }}>{p.amount}</span>
            </div>
          ))}
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Pending ERA/EFT</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#4a9eff" }}>14</div>
          <div style={{ marginTop: 12, fontSize: 12, color: "#64748b" }}>Top CPTs This Week</div>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Expected Weekly Revenue</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#7dd3c0" }}>$14,200</div>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>💬 Messages</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>Reminder: Follow up on Dr. Rahman's billing error</div>
        </GlassCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PORTAL: MA
// ═══════════════════════════════════════════════════════════
function MAPortal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.5s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>📅 Today's Appointments</div>
          {TODAY_APPTS.slice(0, 3).map((a, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{a.patient}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{a.type}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{a.time}</div>
                <StatusBadge status={a.status} />
              </div>
            </div>
          ))}
        </GlassCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <GlassCard>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>⚡ Quick Actions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {["Check-In Patient", "Take Vitals", "Room Assignment", "Add Notes", "Update Records"].map(a => (
                <button key={a} style={{
                  padding: "10px", borderRadius: 8, border: "1px solid rgba(74, 158, 255, 0.1)",
                  background: "rgba(74, 158, 255, 0.05)", color: "#4a9eff", fontSize: 12, fontWeight: 500,
                  cursor: "pointer", fontFamily: "inherit",
                }}>{a}</button>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>🧑‍🤝‍🧑 Patient Queue</div>
            {["Jackie Peterson", "Kevin Wang", "Peter Murphy"].map((p, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                <span style={{ fontSize: 12, color: "#e2e8f0" }}>{p}</span>
                <StatusBadge status="scheduled" />
              </div>
            ))}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PORTAL: NP
// ═══════════════════════════════════════════════════════════
function NPPortal() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.5s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>📋 Today's Schedule</div>
          {TODAY_APPTS.filter(a => a.provider === "Ruby NP").length === 0 ? (
            TODAY_APPTS.slice(0, 3).map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0" }}>{a.patient}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{a.type}</div>
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>{a.time}</div>
              </div>
            ))
          ) : null}
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>✅ Tasks</div>
          {TASKS.filter(t => t.assigned === "Michelle").slice(0, 3).map((t, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
              <div style={{ fontSize: 12, color: "#e2e8f0" }}>{t.title}</div>
              <div style={{ fontSize: 11, color: "#64748b" }}>{t.due}</div>
            </div>
          ))}
        </GlassCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>Patient Queue</div>
          {["Jackie Peterson", "Kevin Wang", "Peter Murphy"].map((p, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
              <span style={{ fontSize: 12, color: "#e2e8f0" }}>{p}</span>
              <span style={{ fontSize: 11, color: "#64748b" }}>08:33 AM</span>
            </div>
          ))}
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>💬 Messages</div>
          {["Erren Mogh Report", "Nurdy Petron"].map((m, i) => (
            <div key={i} style={{ fontSize: 12, color: "#94a3b8", padding: "6px 0" }}>{m}</div>
          ))}
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>🔗 Quick Links</div>
          {["Scores & Screenings", "GP Metlsoon"].map((l, i) => (
            <button key={i} style={{
              display: "block", width: "100%", padding: "8px 12px", marginBottom: 6,
              borderRadius: 8, border: "1px solid rgba(125, 211, 192, 0.15)",
              background: "transparent", color: "#7dd3c0", fontSize: 12, cursor: "pointer",
              textAlign: "left", fontFamily: "inherit",
            }}>{l}</button>
          ))}
        </GlassCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PORTAL: CREDENTIALING (sub-panel)
// ═══════════════════════════════════════════════════════════
function CredentialingPanel() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, animation: "fadeUp 0.5s ease" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>📝 Document Tracker</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Provider", "", "", ""].map((h, i) => (
                  <th key={i} style={{ fontSize: 10, color: "#475569", fontWeight: 500, textAlign: "left", padding: "6px 8px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{h || `Status ${i}`}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CREDENTIALS.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontSize: 12, color: "#e2e8f0", padding: "10px 8px", fontWeight: 500 }}>{c.provider}</td>
                  {c.statuses.map((s, j) => (
                    <td key={j} style={{ padding: "10px 8px", textAlign: "center" }}>
                      <span style={{ color: s === "active" ? "#7dd3c0" : s === "warning" ? "#fbbf24" : "#f87171", fontSize: 14 }}>
                        {s === "active" ? "✓" : "⚠"}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>📁 Documents Vault</div>
          {["BAA", "License", "NPPES", "CAQH", "CMS"].map(d => (
            <button key={d} style={{
              display: "block", width: "100%", padding: "8px 12px", marginBottom: 6,
              borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)", color: "#e2e8f0", fontSize: 12,
              cursor: "pointer", textAlign: "left", fontFamily: "inherit",
            }}>{d} →</button>
          ))}
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>🆕 New Practice Onboarding</div>
          {[
            { step: "EIN Registration", milestone: "M1" },
            { step: "NPPES", milestone: "M2" },
            { step: "CAQH Enrollment", milestone: "M3" },
            { step: "IL State App", milestone: "M4" },
            { step: "Clearinghouse", milestone: "M5" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>{s.step}</span>
              <span style={{ fontSize: 11, color: "#64748b" }}>{s.milestone}</span>
            </div>
          ))}
        </GlassCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>⚠️ Upcoming Expirations</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
            <span style={{ color: "#f87171" }}>⚠</span>
            <span style={{ fontSize: 12, color: "#e2e8f0" }}>DEA</span>
            <span style={{ fontSize: 11, color: "#f87171", marginLeft: "auto" }}>Next month</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0" }}>
            <span style={{ color: "#f87171" }}>⚠</span>
            <span style={{ fontSize: 12, color: "#e2e8f0" }}>State License</span>
            <span style={{ fontSize: 11, color: "#fbbf24", marginLeft: "auto" }}>45 days</span>
          </div>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>🌐 Portals</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
            {["Availity", "CAQH", "NPPES", "CMS"].map(p => (
              <button key={p} style={{
                padding: "8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)", color: "#94a3b8", fontSize: 12,
                cursor: "pointer", fontFamily: "inherit",
              }}>{p}</button>
            ))}
          </div>
        </GlassCard>
        <GlassCard>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 10 }}>🤖 Copilot</div>
          <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(255,255,255,0.03)", fontSize: 12, color: "#94a3b8" }}>
            Send IL app for Dr. Qazi to Medicaid
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
export default function SmartClinicOS() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subPanel, setSubPanel] = useState(null);

  const user = USERS[role];

  const portalMap = {
    admin: AdminPortal,
    reception: ReceptionPortal,
    ma: MAPortal,
    np: NPPortal,
    provider: ProviderPortal,
    billing: BillingPortal,
    manager: AdminPortal,
  };

  const Portal = subPanel === "credentialing" ? CredentialingPanel : portalMap[role];

  if (!loggedIn) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0a1520 0%, #0d1a2d 40%, #0f1e33 70%, #0a1520 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Outfit', 'DM Sans', sans-serif",
        position: "relative",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
        `}</style>
        <Particles />
        <div style={{
          width: 400, padding: 40, borderRadius: 20,
          background: "rgba(15, 25, 40, 0.7)",
          border: "1px solid rgba(74, 158, 255, 0.08)",
          backdropFilter: "blur(24px)", zIndex: 10,
          textAlign: "center",
        }}>
          <div style={{ fontSize: 28, fontWeight: 300, color: "#c5d5e8", letterSpacing: "-0.5px", marginBottom: 4, lineHeight: 1.2 }}>
            Elgin<br />Endocrinology<br />Clinic
          </div>
          <div style={{ height: 1, background: "rgba(74, 158, 255, 0.08)", margin: "20px 0" }} />
          <div style={{ marginBottom: 14 }}>
            <input
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                width: "100%", padding: "14px 18px", borderRadius: 10,
                border: "1px solid rgba(74, 158, 255, 0.1)", background: "rgba(255,255,255,0.03)",
                color: "#e2e8f0", fontSize: 14, outline: "none", fontFamily: "inherit",
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: "100%", padding: "14px 18px", borderRadius: 10,
                border: "1px solid rgba(74, 158, 255, 0.1)", background: "rgba(255,255,255,0.03)",
                color: "#e2e8f0", fontSize: 14, outline: "none", fontFamily: "inherit",
              }}
            />
          </div>
          <button
            onClick={() => setLoggedIn(true)}
            style={{
              width: "100%", padding: "14px", borderRadius: 10,
              border: "none", background: "linear-gradient(135deg, rgba(74, 158, 255, 0.2), rgba(74, 158, 255, 0.08))",
              color: "#c5d5e8", fontSize: 15, fontWeight: 500, cursor: "pointer",
              fontFamily: "inherit",
            }}
          >Sign In</button>
          <div style={{ fontSize: 12, color: "rgba(74, 158, 255, 0.4)", marginTop: 12, cursor: "pointer" }}>Forgot password?</div>
          <div style={{ marginTop: 20, fontSize: 11, color: "#334155" }}>
            Demo: Select role below
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center", marginTop: 8 }}>
            {ROLES.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 10, fontFamily: "inherit",
                border: role === r.id ? "1px solid rgba(74, 158, 255, 0.4)" : "1px solid rgba(255,255,255,0.06)",
                background: role === r.id ? "rgba(74, 158, 255, 0.1)" : "transparent",
                color: role === r.id ? "#4a9eff" : "#475569", cursor: "pointer",
              }}>{r.label}</button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0a1520 0%, #0d1a2d 40%, #0f1e33 70%, #0a1520 100%)",
      color: "#e2e8f0",
      fontFamily: "'Outfit', 'DM Sans', sans-serif",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@200;300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(74, 158, 255, 0.2); border-radius: 3px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <Particles />

      {/* Header */}
      <header style={{
        position: "relative", zIndex: 10,
        padding: "16px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0" }}>{user.practice}</span>
          </div>
          <div style={{ fontSize: 13, color: "#4a9eff", fontWeight: 400, opacity: 0.7 }}>{user.title}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Role Switcher */}
          <div style={{ display: "flex", gap: 4 }}>
            {ROLES.map(r => (
              <button key={r.id} onClick={() => { setRole(r.id); setSubPanel(null); }} style={{
                padding: "5px 10px", borderRadius: 6, fontSize: 10, fontFamily: "inherit",
                border: role === r.id ? "1px solid rgba(74, 158, 255, 0.3)" : "1px solid transparent",
                background: role === r.id ? "rgba(74, 158, 255, 0.08)" : "transparent",
                color: role === r.id ? "#4a9eff" : "#475569", cursor: "pointer",
              }}>{r.icon}</button>
            ))}
          </div>
          <ClockDisplay />
        </div>
      </header>

      {/* Sub-nav for panels */}
      {(role === "admin" || role === "manager" || role === "provider") && (
        <div style={{
          position: "relative", zIndex: 10,
          padding: "8px 32px", display: "flex", gap: 8,
          borderBottom: "1px solid rgba(255,255,255,0.02)",
        }}>
          <button onClick={() => setSubPanel(null)} style={{
            padding: "5px 14px", borderRadius: 6, fontSize: 11, fontFamily: "inherit",
            border: !subPanel ? "1px solid rgba(74, 158, 255, 0.2)" : "1px solid transparent",
            background: !subPanel ? "rgba(74, 158, 255, 0.06)" : "transparent",
            color: !subPanel ? "#4a9eff" : "#475569", cursor: "pointer",
          }}>Dashboard</button>
          <button onClick={() => setSubPanel("credentialing")} style={{
            padding: "5px 14px", borderRadius: 6, fontSize: 11, fontFamily: "inherit",
            border: subPanel === "credentialing" ? "1px solid rgba(74, 158, 255, 0.2)" : "1px solid transparent",
            background: subPanel === "credentialing" ? "rgba(74, 158, 255, 0.06)" : "transparent",
            color: subPanel === "credentialing" ? "#4a9eff" : "#475569", cursor: "pointer",
          }}>Credentialing</button>
        </div>
      )}

      {/* Main Content */}
      <main style={{ position: "relative", zIndex: 10, padding: "24px 32px" }}>
        <Portal />
      </main>

      {/* Copilot Bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 20,
        padding: "12px 32px",
        background: "rgba(10, 18, 28, 0.85)",
        backdropFilter: "blur(12px)",
        borderTop: "1px solid rgba(255,255,255,0.03)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <button style={{
          padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(74, 158, 255, 0.15)",
          background: "rgba(74, 158, 255, 0.06)", color: "#4a9eff", fontSize: 12,
          cursor: "pointer", fontFamily: "inherit", fontWeight: 500,
        }}>⚡ Copilot</button>
        <div style={{
          flex: 1, padding: "10px 16px", borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)",
          color: "#475569", fontSize: 13, fontFamily: "inherit",
        }}>Ask me anything...</div>
        <button style={{
          width: 36, height: 36, borderRadius: "50%",
          border: "1px solid rgba(74, 158, 255, 0.15)", background: "rgba(74, 158, 255, 0.06)",
          color: "#4a9eff", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
        }}>🎤</button>
        <button onClick={() => setLoggedIn(false)} style={{
          padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(248,113,113,0.15)",
          background: "transparent", color: "#f87171", fontSize: 11,
          cursor: "pointer", fontFamily: "inherit",
        }}>Logout</button>
      </div>
    </div>
  );
}
