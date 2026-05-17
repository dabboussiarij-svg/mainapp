import { useState } from "react";

// Professional color palette - consistent with Flask template
const COLORS = {
  primary: "#185fa5",
  success: "#2d8a4e",
  danger: "#c0392b",
  warning: "#BA7517",
  neutral: "#888780",
  textPrimary: "#2c3e50",
  textSecondary: "#7f8c8d",
  border: "#ecf0f1",
  bg: "#f8f9fa",
};

const CRITICALITY = { low: "Basse", medium: "Moyenne", high: "Haute", critical: "Critique" };

// Inject CSS custom properties for consistency
const cssVariables = `
  :root {
    --color-primary: ${COLORS.primary};
    --color-success: ${COLORS.success};
    --color-danger: ${COLORS.danger};
    --color-warning: ${COLORS.warning};
    --color-neutral: ${COLORS.neutral};
    --color-text-primary: ${COLORS.textPrimary};
    --color-text-secondary: ${COLORS.textSecondary};
    --color-border: ${COLORS.border};
    --color-border-secondary: ${COLORS.border};
    --color-border-tertiary: ${COLORS.border};
    --color-background-primary: white;
    --color-background-secondary: ${COLORS.bg};
    --color-background-tertiary: ${COLORS.bg};
    --color-background-success: ${COLORS.success};
    --color-background-info: #E8F4F8;
    --color-text-info: #185fa5;
    --color-border-info: #B3E5FC;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --font-sans: system-ui, -apple-system, sans-serif;
  }
`;

// Create and inject style element
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = cssVariables;
  document.head.appendChild(styleEl);
}

const MACHINE_TYPES = [
  { value: "komax355_segma688_alpha550", label: "KOMAX 355 / SEGMA688 / ALPHA 550 UTP" },
  { value: "ps9550_ps9580_ulmer", label: "PS9550 / PS9580 / ULMER" },
  { value: "bt712_bt722_bt752", label: "BT 712 / BT722 / BT752 (Semi-auto)" },
  { value: "cc36sp", label: "CC36 SP (avec ACD/SmartDetect)" },
];

const STATUS = { OK: "OK", NOK: "NOK", NA: "N/A" };

const StatusBtn = ({ value, current, onChange }) => {
  const styles = {
    OK: { bg: value === current ? COLORS.success : "transparent", color: value === current ? "#fff" : COLORS.success, border: `1.5px solid ${COLORS.success}` },
    NOK: { bg: value === current ? COLORS.danger : "transparent", color: value === current ? "#fff" : COLORS.danger, border: `1.5px solid ${COLORS.danger}` },
    "N/A": { bg: value === current ? COLORS.neutral : "transparent", color: value === current ? "#fff" : COLORS.neutral, border: `1.5px solid ${COLORS.neutral}` },
  };
  return (
    <button
      onClick={() => onChange(value)}
      style={{
        padding: "4px 12px", borderRadius: 6, fontSize: 12, fontWeight: 500,
        cursor: "pointer", transition: "all 0.15s", ...styles[value]
      }}
    >
      {value}
    </button>
  );
};

const CheckRow = ({ label, note, value, onChange, withPhoto }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12,
    alignItems: "center", padding: "10px 0",
    borderBottom: `0.5px solid ${COLORS.border}`
  }}>
    <div>
      <p style={{ margin: 0, fontSize: 14, color: COLORS.textPrimary, lineHeight: 1.5, fontWeight: 500 }}>{label}</p>
      {note && <p style={{ margin: "2px 0 0", fontSize: 12, color: COLORS.textSecondary }}>{note}</p>}
    </div>
    {withPhoto && (
      <label style={{
        fontSize: 11, color: COLORS.primary, cursor: "pointer",
        border: `0.5px solid ${COLORS.primary}`, borderRadius: 6,
        padding: "4px 8px", whiteSpace: "nowrap", transition: "all 0.2s"
      }}>
        <i className="ti ti-camera" style={{ marginRight: 4, fontSize: 12 }} />
        Photo
        <input type="file" accept="image/*" style={{ display: "none" }} />
      </label>
    )}
    <div style={{ display: "flex", gap: 6 }}>
      {Object.values(STATUS).map(s => (
        <StatusBtn key={s} value={s} current={value} onChange={onChange} />
      ))}
    </div>
  </div>
);

const Section = ({ title, icon, children, color = COLORS.primary }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
      paddingBottom: 8, borderBottom: `2px solid ${color}`
    }}>
      <i className={`ti ti-${icon}`} style={{ fontSize: 18, color, fontWeight: 600 }} />
      <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COLORS.textPrimary, letterSpacing: "-0.3px" }}>{title}</h3>
    </div>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    <label style={{ 
      fontSize: 11, 
      fontWeight: 700, 
      color: COLORS.textSecondary, 
      textTransform: "uppercase", 
      letterSpacing: "0.05em"
    }}>
      {label}
    </label>
    {children}
  </div>
);

const inputStyle = {
  padding: "8px 10px", borderRadius: 8, fontSize: 14,
  border: `0.5px solid ${COLORS.border}`,
  background: COLORS.bg,
  color: COLORS.textPrimary, width: "100%", boxSizing: "border-box"
};

export default function App() {
  // Check for pre-selected data from data attributes or global variables
  const containerEl = typeof document !== 'undefined' ? document.currentScript?.parentElement : null;
  const preSelectedTechnician = containerEl?.dataset?.technicianName || window.__conditionalReport?.technicianName || "";
  const preSelectedMachine = containerEl?.dataset?.machineName || window.__conditionalReport?.machineName || "";
  const preSelectedZone = containerEl?.dataset?.zone || window.__conditionalReport?.zone || "";
  const isPreSelected = !!(preSelectedTechnician && preSelectedMachine);

  const [machine, setMachine] = useState(preSelectedMachine || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const checkItems = [
    { id: 1, label: "Machine propre", note: "État de la propreté générale" },
    { id: 2, label: "Absence d'anomalies visuelles", note: "Vérifier fuites, fissures, corrosion" },
    { id: 3, label: "Vibrations anormales", note: "Écouter et ressentir pendant fonctionnement" },
    { id: 4, label: "Bruits anormaux", note: "Grincements, cliquetis, sifflements" },
    { id: 5, label: "Résidus de coupe présents", note: "Vérifier accumulation de débris" },
    { id: 6, label: "État général des lames", note: "Aspect, brillance, déformations" },
    { id: 7, label: "Usure des lames", note: "Vérifier uniformité et progression" },
    { id: 8, label: "Absence de fissures", note: "Inspectez la surface entière" },
    { id: 9, label: "Absence d'ébréchures", note: "Vérifier les arêtes et tranchants" },
    { id: 10, label: "Alignement des lames", note: "Vérifier parallélisme et positionnement" },
    { id: 11, label: "Absence de déformations", note: "Vérifier planéité et rectitude" },
    { id: 12, label: "Vérification caméra effectuée", note: "Inspection détaillée avec caméra USB" },
    { id: 13, label: "État des arêtes de coupe", note: "Partie opérative des lames" },
    { id: 14, label: "Position des couteaux", note: "Vérifier écartement et positionnement" },
    { id: 15, label: "Mouvement vertical", note: "Course et fluidité du mouvement" },
    { id: 16, label: "Qualité du dénudage", note: "Uniformité et propreté" },
    { id: 17, label: "Évacuation des résidus", note: "Absence de blocage ou accumulation" },
    { id: 18, label: "État du mécanisme", note: "Fluide, sans blocage" },
    { id: 19, label: "Montage du bloc lame", note: "Fixation et stabilité" },
    { id: 20, label: "État du serrage", note: "Vis et boulons correctement serrés" },
    { id: 21, label: "Absence de jeu mécanique", note: "Vérifier rigidité du bloc" },
    { id: 22, label: "Positionnement des composants", note: "Alignement et positionnement corrects" },
    { id: 23, label: "Test fonctionnel", note: "Fonctionnement sans à-coups" },
    { id: 24, label: "Nettoyage effectué", note: "Machine complètement nettoyée" },
    { id: 25, label: "Zone sécurisée", note: "Aucun débris ou objet traînant" },
    { id: 26, label: "Résidus évacués", note: "Tous les débris collectés" },
    { id: 27, label: "Machine opérationnelle", note: "Prêt pour la production" },
    { id: 28, label: "Anomalies détectées", note: "Vérifier anomalies générales" },
  ];

  const [checks, setChecks] = useState(
    Object.fromEntries(checkItems.map(item => [item.id, ""]))
  );

  const [remarks, setRemarks] = useState(
    Object.fromEntries(checkItems.map(item => [item.id, ""]))
  );

  const [time, setTime] = useState(
    Object.fromEntries(checkItems.map(item => [item.id, ""]))
  );

  const filteredItems = checkItems.filter(item =>
    item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.note.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = Object.values(checks).filter(v => v).length;
  const totalCount = checkItems.length;
  const estimatedDuration = 204; // minutes

  const handleSetCheck = (id, value) => {
    setChecks(prev => ({ ...prev, [id]: value }));
  };

  const handleSetRemark = (id, value) => {
    setRemarks(prev => ({ ...prev, [id]: value }));
  };

  const handleSetTime = (id, value) => {
    setTime(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!machine || !date) {
      alert("Veuillez sélectionner une machine et une date d'intervention");
      return;
    }
    setFormSubmitted(true);
    // In real implementation, submit the form data
    setTimeout(() => {
      alert("Rapport soumis avec succès!");
      setFormSubmitted(false);
    }, 1000);
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", background: COLORS.bg, minHeight: "100vh", paddingBottom: "2rem" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: `1px solid ${COLORS.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: "0 0 0.25rem", fontSize: 28, fontWeight: 700, color: COLORS.textPrimary }}>
              <i className="ti ti-calendar" style={{ marginRight: 8 }} />
              Monthly Preventive Systematic Maintenance
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: COLORS.textSecondary }}>Complete your monthly preventive maintenance tasks</p>
          </div>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: "8px 16px", border: `1px solid ${COLORS.border}`, background: "white",
              borderRadius: 6, cursor: "pointer", fontSize: 13, color: COLORS.textPrimary, fontWeight: 600,
              transition: "all 0.2s"
            }}
          >
            ← Back to Reports
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 1.5rem" }}>
        <form onSubmit={handleSubmit}>
          {/* Machine & Date Selection */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 24 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Select Machine</label>
              <select
                value={machine}
                onChange={(e) => setMachine(e.target.value)}
                disabled={isPreSelected}
                style={{
                  width: "100%", padding: "10px 12px", fontSize: 15, fontWeight: 500,
                  border: `1px solid ${COLORS.border}`, borderRadius: 8, background: "white",
                  color: COLORS.textPrimary, cursor: isPreSelected ? "default" : "pointer"
                }}
              >
                <option value="">— Sélectionner —</option>
                {MACHINE_TYPES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: COLORS.textSecondary, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Execution Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: "100%", padding: "10px 12px", fontSize: 15, fontWeight: 500,
                  border: `1px solid ${COLORS.border}`, borderRadius: 8, background: "white",
                  color: COLORS.textPrimary
                }}
              />
            </div>
          </div>

          {/* Info Bar */}
          <div style={{
            background: COLORS.success, color: "white", borderRadius: 12, padding: "1.25rem 1.5rem",
            marginBottom: 24, display: "flex", alignItems: "center", gap: 12
          }}>
            <i className="ti ti-checkbox" style={{ fontSize: 32 }} />
            <div>
              <h2 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Monthly Tasks ({totalCount} items)</h2>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.9 }}>
                <i className="ti ti-clock" style={{ marginRight: 4, fontSize: 14 }} />
                Estimated total Duration: {estimatedDuration} minutes
              </p>
            </div>
          </div>

          {/* Search */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <i className="ti ti-search" style={{
                position: "absolute", left: 12, fontSize: 18, color: COLORS.textSecondary
              }} />
              <input
                type="text"
                placeholder="Search for monthly task..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%", paddingLeft: 40, paddingRight: 12, padding: "10px 12px 10px 40px",
                  fontSize: 14, border: `1px solid ${COLORS.border}`, borderRadius: 8,
                  background: "white", color: COLORS.textPrimary
                }}
              />
              <span style={{
                position: "absolute", right: 12, fontSize: 12, fontWeight: 700,
                color: COLORS.success, background: COLORS.bg, padding: "4px 8px", borderRadius: 4
              }}>
                {filteredItems.length} task(s)
              </span>
            </div>
          </div>

          {/* Task Table */}
          <div style={{
            background: "white", borderRadius: 12, border: `1px solid ${COLORS.border}`,
            overflow: "hidden", marginBottom: 24
          }}>
            {/* Table Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "60px 300px 200px 150px 100px 200px",
              gap: 16, padding: "16px 20px", background: COLORS.bg,
              borderBottom: `2px solid ${COLORS.success}`, alignItems: "center"
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.success, textTransform: "uppercase" }}>N°</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.success, textTransform: "uppercase" }}>Task Description</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.success, textTransform: "uppercase" }}>Criteria</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.success, textTransform: "uppercase" }}>OK / NOK</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.success, textTransform: "uppercase" }}>Time (min)</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.success, textTransform: "uppercase" }}>Remarks</div>
            </div>

            {/* Task Rows */}
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                style={{
                  display: "grid", gridTemplateColumns: "60px 300px 200px 150px 100px 200px",
                  gap: 16, padding: "12px 20px", borderBottom: `1px solid ${COLORS.border}`,
                  alignItems: "center", background: idx % 2 === 0 ? "white" : COLORS.bg,
                  transition: "all 0.2s"
                }}
              >
                {/* N° */}
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.primary }}>
                  {item.id}
                </div>

                {/* Task Description */}
                <div style={{ fontSize: 13, color: COLORS.textPrimary }}>
                  <p style={{ margin: "0 0 2px", fontWeight: 600 }}>{item.label}</p>
                  <p style={{ margin: 0, fontSize: 11, color: COLORS.textSecondary }}>{item.note}</p>
                </div>

                {/* Criteria (empty for now) */}
                <div style={{ fontSize: 12, color: COLORS.textSecondary }}>—</div>

                {/* OK / NOK Buttons */}
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => handleSetCheck(item.id, "OK")}
                    style={{
                      padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                      cursor: "pointer", transition: "all 0.15s",
                      background: checks[item.id] === "OK" ? COLORS.success : "transparent",
                      color: checks[item.id] === "OK" ? "white" : COLORS.success,
                      border: `1px solid ${COLORS.success}`
                    }}
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetCheck(item.id, "NOK")}
                    style={{
                      padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4,
                      cursor: "pointer", transition: "all 0.15s",
                      background: checks[item.id] === "NOK" ? COLORS.danger : "transparent",
                      color: checks[item.id] === "NOK" ? "white" : COLORS.danger,
                      border: `1px solid ${COLORS.danger}`
                    }}
                  >
                    NOK
                  </button>
                </div>

                {/* Time Input */}
                <input
                  type="number"
                  min="0"
                  max="999"
                  placeholder="—"
                  value={time[item.id]}
                  onChange={(e) => handleSetTime(item.id, e.target.value)}
                  style={{
                    width: "100%", padding: "6px 8px", fontSize: 12, border: `1px solid ${COLORS.border}`,
                    borderRadius: 4, background: "white", color: COLORS.textPrimary, textAlign: "center"
                  }}
                />

                {/* Remarks */}
                <input
                  type="text"
                  placeholder="Add remarks..."
                  value={remarks[item.id]}
                  onChange={(e) => handleSetRemark(item.id, e.target.value)}
                  style={{
                    width: "100%", padding: "6px 8px", fontSize: 12, border: `1px solid ${COLORS.border}`,
                    borderRadius: 4, background: "white", color: COLORS.textPrimary
                  }}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => window.history.back()}
              style={{
                padding: "10px 24px", fontSize: 14, fontWeight: 700, borderRadius: 8,
                cursor: "pointer", background: "white", color: COLORS.textPrimary,
                border: `1px solid ${COLORS.border}`, transition: "all 0.2s"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formSubmitted}
              style={{
                padding: "10px 24px", fontSize: 14, fontWeight: 700, borderRadius: 8,
                cursor: formSubmitted ? "not-allowed" : "pointer", background: COLORS.success,
                color: "white", border: "none", transition: "all 0.2s",
                opacity: formSubmitted ? 0.7 : 1
              }}
            >
              <i className="ti ti-check" style={{ marginRight: 6 }} />
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

  if (submitted) {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "2rem 1rem" }}>
        <h2 className="sr-only">Rapport soumis avec succès</h2>
        <div style={{
          textAlign: "center", padding: "3rem 2rem",
          border: `0.5px solid ${COLORS.border}`,
          borderRadius: "var(--border-radius-lg)",
          background: "#fff"
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: COLORS.success,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 1.5rem",
            boxShadow: `0 4px 12px rgba(45, 138, 78, 0.2)`
          }}>
            <i className="ti ti-check" style={{ fontSize: 32, color: "#fff", fontWeight: 700 }} />
          </div>
          <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700, color: COLORS.textPrimary }}>Rapport soumis avec succès</h2>
          <p style={{ color: COLORS.textSecondary, margin: "0 0 24px", fontWeight: 500 }}>
            Le rapport de maintenance a été enregistré pour <strong>{form.machine && machineInfo?.label}</strong>
          </p>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, margin: "0 0 28px"
          }}>
            {[
              { label: "Contrôles OK", val: okCount, color: COLORS.success },
              { label: "Contrôles NOK", val: nokCount, color: COLORS.danger },
              { label: "Total effectués", val: totalChecks, color: COLORS.primary },
            ].map(({ label, val, color }) => (
              <div key={label} style={{
                padding: "12px", background: COLORS.bg,
                borderRadius: "var(--border-radius-md)", border: `0.5px solid ${COLORS.border}`
              }}>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color }}>{val}</p>
                <p style={{ margin: 0, fontSize: 12, color: COLORS.textSecondary, fontWeight: 600 }}>{label}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setSubmitted(false); setStep(0); setForm(f => ({ ...f, technicien: "", machine: "", machineArea: "", machineSap: "", compteur: "", observations: "", technicianSignature: "", supervisorSignature: "" })); setChecks(Object.fromEntries(Object.keys(checks).map(k => [k, null]))); setAnomalyData({detected: false, criticality: "low", description: "", adjustmentDone: false, bladeReplacement: false, headAdjustment: false, maintenanceEscalation: false, sparePartsUsed: ""}); }}
            style={{ ...inputStyle, width: "auto", padding: "10px 28px", cursor: "pointer", background: COLORS.primary, color: "#fff", border: "none", fontWeight: 700, boxShadow: `0 2px 8px rgba(24, 95, 165, 0.2)` }}
          >
            Nouveau rapport
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "var(--font-sans)" }}>
      <h2 className="sr-only">Rapport de maintenance préventive conditionnelle — Tête de coupe</h2>

      {/* Header */}
      <div style={{
        background: "#fff",
        border: `0.5px solid ${COLORS.border}`,
        borderRadius: "var(--border-radius-lg)", padding: "1.25rem 1.5rem",
        marginBottom: 20, borderLeft: `3px solid ${COLORS.primary}`
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: COLORS.primary, textTransform: "uppercase", letterSpacing: "0.08em" }}>SEBN TN — Service Maintenance</p>
            <h1 style={{ margin: "4px 0 2px", fontSize: 18, fontWeight: 700, color: COLORS.textPrimary }}>
              Rapport de maintenance préventive conditionnelle
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: COLORS.textSecondary }}>
              Inspection basée sur l'état machine
            </p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <p style={{ margin: 0, fontSize: 11, color: COLORS.textSecondary }}>Réf. PMC-AA-TN</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: COLORS.textSecondary }}>Maintenance conditionnelle</p>
          </div>
        </div>
      </div>

      {/* Progress stepper */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 24, gap: 0 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : "none" }}>
            <div
              onClick={() => i < step && setStep(i)}
              style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, cursor: i < step ? "pointer" : "default",
                background: i < step ? COLORS.success : i === step ? COLORS.primary : COLORS.bg,
                color: i <= step ? "#fff" : COLORS.textSecondary,
                border: i === step ? "none" : `0.5px solid ${COLORS.border}`,
                transition: "all 0.2s ease",
                boxShadow: i === step ? `0 2px 8px rgba(24, 95, 165, 0.2)` : "none"
              }}
            >
              {i < step ? <i className="ti ti-check" style={{ fontSize: 14 }} /> : i + 1}
            </div>
            <span style={{
              fontSize: 12, marginLeft: 6, color: i === step ? COLORS.textPrimary : COLORS.textSecondary,
              fontWeight: i === step ? 600 : 400, whiteSpace: "nowrap"
            }}>{s}</span>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: i < step ? COLORS.success : COLORS.border, margin: "0 8px" }} />
            )}
          </div>
        ))}
      </div>

      <div style={{
        background: "#fff",
        border: `0.5px solid ${COLORS.border}`,
        borderRadius: "var(--border-radius-lg)", padding: "1.5rem"
      }}>

        {/* STEP 0: Identification */}
        {step === 0 && (
          <div>
            {/* Show this section only if data is not pre-selected */}
            {!isPreSelected && (
              <Section title="Informations générales" icon="clipboard-text" color="#185fa5">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <Field label="Technicien">
                    <input style={inputStyle} placeholder="Nom du technicien" value={form.technicien} onChange={e => setField("technicien", e.target.value)} />
                  </Field>
                  <Field label="Date d'intervention">
                    <input type="date" style={inputStyle} value={form.date} onChange={e => setField("date", e.target.value)} />
                  </Field>
                  <Field label="Type de machine">
                    <select style={inputStyle} value={form.machine} onChange={e => setField("machine", e.target.value)}>
                      <option value="">— Sélectionner —</option>
                      {MACHINE_TYPES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Zone / Workstation">
                    <input style={inputStyle} placeholder="Ex: K355 — P1 Automat" value={form.machineArea} onChange={e => setField("machineArea", e.target.value)} />
                  </Field>
                </div>
              </Section>
            )}
            
            {/* Show summary if data is pre-selected */}
            {isPreSelected && (
              <Section title="Informations sélectionnées" icon="clipboard-text" color="#2d8a4e">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div style={{ padding: "12px", background: COLORS.bg, borderRadius: "8px", border: `0.5px solid ${COLORS.border}` }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: COLORS.textSecondary, textTransform: "uppercase" }}>Technicien</p>
                    <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>{form.technicien}</p>
                  </div>
                  <div style={{ padding: "12px", background: COLORS.bg, borderRadius: "8px", border: `0.5px solid ${COLORS.border}` }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: COLORS.textSecondary, textTransform: "uppercase" }}>Date d'intervention</p>
                    <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>{new Date(form.date).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div style={{ padding: "12px", background: COLORS.bg, borderRadius: "8px", border: `0.5px solid ${COLORS.border}` }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: COLORS.textSecondary, textTransform: "uppercase" }}>Type de machine</p>
                    <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>{machineInfo?.label || form.machine}</p>
                  </div>
                  <div style={{ padding: "12px", background: COLORS.bg, borderRadius: "8px", border: `0.5px solid ${COLORS.border}` }}>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: COLORS.textSecondary, textTransform: "uppercase" }}>Zone / Workstation</p>
                    <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: COLORS.textPrimary }}>{form.machineArea || "N/A"}</p>
                  </div>
                </div>
              </Section>
            )}
          </div>
        )}

        {/* STEP 1: État Général */}
        {step === 1 && (
          <div>
            <Section title="État général de la machine" icon="eye" color="#185fa5">
              <CheckRow label="Machine propre" note="État de la propreté générale" value={checks.machine_clean} onChange={v => setCheck("machine_clean", v)} />
              <CheckRow label="Absence d'anomalies visuelles" note="Vérifier fuites, fissures, corrosion" value={checks.visual_anomaly} onChange={v => setCheck("visual_anomaly", v)} />
              <CheckRow label="Vibrations anormales" note="Écouter et ressentir pendant fonctionnement" value={checks.abnormal_vibration} onChange={v => setCheck("abnormal_vibration", v)} />
              <CheckRow label="Bruits anormaux" note="Grincements, cliquetis, sifflements" value={checks.abnormal_noise} onChange={v => setCheck("abnormal_noise", v)} />
              <CheckRow label="Résidus de coupe présents" note="Vérifier accumulation de débris" value={checks.cutting_residue} onChange={v => setCheck("cutting_residue", v)} />
            </Section>
          </div>
        )}

        {/* STEP 2: Lames & Caméra */}
        {step === 2 && (
          <div>
            <Section title="Contrôle des lames" icon="blade" color="#3B6D11">
              <CheckRow label="État général des lames" note="Aspect, brillance, déformations" value={checks.blade_condition} onChange={v => setCheck("blade_condition", v)} withPhoto />
              <CheckRow label="Usure des lames" note="Vérifier uniformité et progression" value={checks.blade_wear} onChange={v => setCheck("blade_wear", v)} />
              <CheckRow label="Absence de fissures" note="Inspectez la surface entière" value={checks.blade_crack} onChange={v => setCheck("blade_crack", v)} />
              <CheckRow label="Absence d'ébréchures" note="Vérifier les arêtes et tranchants" value={checks.blade_chip} onChange={v => setCheck("blade_chip", v)} />
              <CheckRow label="Alignement des lames" note="Vérifier parallélisme et positionnement" value={checks.blade_alignment} onChange={v => setCheck("blade_alignment", v)} />
              <CheckRow label="Absence de déformations" note="Vérifier planéité et rectitude" value={checks.blade_deformation} onChange={v => setCheck("blade_deformation", v)} />
            </Section>

            <Section title="Vérification caméra USB" icon="camera" color="#534AB7">
              <CheckRow label="Vérification caméra effectuée" note="Inspection détaillée avec caméra USB" value={checks.camera_check} onChange={v => setCheck("camera_check", v)} withPhoto />
              <CheckRow label="État des arêtes de coupe" note="Partie opérative des lames" value={checks.blade_edge_status} onChange={v => setCheck("blade_edge_status", v)} />
            </Section>
          </div>
        )}

        {/* STEP 3: Dénudage & Bloc */}
        {step === 3 && (
          <div>
            <Section title="Contrôle du dénudage" icon="tool" color="#185fa5">
              <CheckRow label="Position des couteaux" note="Vérifier écartement et positionnement" value={checks.knife_position} onChange={v => setCheck("knife_position", v)} />
              <CheckRow label="Mouvement vertical" note="Course et fluidité du mouvement" value={checks.v_movement} onChange={v => setCheck("v_movement", v)} />
              <CheckRow label="Qualité du dénudage" note="Uniformité et propreté" value={checks.stripping_quality} onChange={v => setCheck("stripping_quality", v)} />
              <CheckRow label="Évacuation des résidus" note="Absence de blocage ou accumulation" value={checks.residue_removal} onChange={v => setCheck("residue_removal", v)} />
              <CheckRow label="État du mécanisme" note="Fluide, sans blocage" value={checks.mechanism_status} onChange={v => setCheck("mechanism_status", v)} />
            </Section>

            <Section title="Contrôle du bloc lame" icon="package" color="#3B6D11">
              <CheckRow label="Montage du bloc lame" note="Fixation et stabilité" value={checks.blade_block_mounting} onChange={v => setCheck("blade_block_mounting", v)} />
              <CheckRow label="État du serrage" note="Vis et boulons correctement serrés" value={checks.tightening_status} onChange={v => setCheck("tightening_status", v)} />
              <CheckRow label="Absence de jeu mécanique" note="Vérifier rigidité du bloc" value={checks.mechanical_play} onChange={v => setCheck("mechanical_play", v)} />
              <CheckRow label="Positionnement des composants" note="Alignement et positionnement corrects" value={checks.component_positioning} onChange={v => setCheck("component_positioning", v)} />
              <CheckRow label="Test fonctionnel" note="Fonctionnement sans à-coups" value={checks.functional_test} onChange={v => setCheck("functional_test", v)} />
            </Section>
          </div>
        )}

        {/* STEP 4: Nettoyage & Anomalies */}
        {step === 4 && (
          <div>
            <Section title="Nettoyage et sécurité" icon="broom" color="#185fa5">
              <CheckRow label="Nettoyage effectué" note="Machine complètement nettoyée" value={checks.cleaning_done} onChange={v => setCheck("cleaning_done", v)} />
              <CheckRow label="Zone sécurisée" note="Aucun débris ou objet traînant" value={checks.secured_area} onChange={v => setCheck("secured_area", v)} />
              <CheckRow label="Résidus évacués" note="Tous les débris collectés" value={checks.waste_removed} onChange={v => setCheck("waste_removed", v)} />
              <CheckRow label="Machine opérationnelle" note="Prêt pour la production" value={checks.machine_operational} onChange={v => setCheck("machine_operational", v)} />
            </Section>

            <Section title="Anomalies détectées" icon="alert-triangle" color="#c0392b">
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={anomalyData.detected} onChange={e => setAnomaly("detected", e.target.checked)} style={{ width: 18, height: 18 }} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>Anomalie détectée</span>
                </label>
              </div>
              {anomalyData.detected && (
                <>
                  <Field label="Niveau de criticité">
                    <select style={inputStyle} value={anomalyData.criticality} onChange={e => setAnomaly("criticality", e.target.value)}>
                      {Object.entries(CRITICALITY).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </Field>
                  <Field label="Description de l'anomalie">
                    <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Décrire l'anomalie détectée" value={anomalyData.description} onChange={e => setAnomaly("description", e.target.value)} />
                  </Field>
                </>
              )}
            </Section>
          </div>
        )}

        {/* STEP 5: Actions Correctives */}
        {step === 5 && (
          <div>
            <Section title="Actions correctives effectuées" icon="tools" color="#185fa5">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={anomalyData.adjustmentDone} onChange={e => setAnomaly("adjustmentDone", e.target.checked)} style={{ width: 18, height: 18 }} />
                  <span>Ajustement effectué</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={anomalyData.bladeReplacement} onChange={e => setAnomaly("bladeReplacement", e.target.checked)} style={{ width: 18, height: 18 }} />
                  <span>Remplacement de lames</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={anomalyData.headAdjustment} onChange={e => setAnomaly("headAdjustment", e.target.checked)} style={{ width: 18, height: 18 }} />
                  <span>Ajustement tête de coupe</span>
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={anomalyData.maintenanceEscalation} onChange={e => setAnomaly("maintenanceEscalation", e.target.checked)} style={{ width: 18, height: 18 }} />
                  <span>Escalade maintenance requise</span>
                </label>
              </div>
              <Field label="Pièces de rechange utilisées" style={{ marginTop: 16 }}>
                <input style={inputStyle} placeholder="Ex: Lames de coupe, joints" value={anomalyData.sparePartsUsed} onChange={e => setAnomaly("sparePartsUsed", e.target.value)} />
              </Field>
            </Section>

            <Section title="Observations et remarques" icon="note" color="#888780">
              <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} placeholder="Détails de la maintenance effectuée, anomalies constatées, actions prises…" value={form.observations} onChange={e => setField("observations", e.target.value)} />
            </Section>
          </div>
        )}

        {/* STEP 6: Résumé & Signatures */}
        {step === 6 && (
          <div>
            <Section title="Résumé de l'intervention" icon="checkmark-circle" color="#2d8a4e">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 16 }}>
                <div style={{ padding: 12, background: "#DFF5D8", borderRadius: 6, border: "1px solid #7CB342" }}>
                  <div style={{ fontSize: 11, color: "#558B2F", fontWeight: 600, textTransform: "uppercase" }}>Checks OK</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#2d8a4e", marginTop: 4 }}>{Object.values(checks).filter(v => v === "OK").length}</div>
                </div>
                <div style={{ padding: 12, background: "#FFEBEE", borderRadius: 6, border: "1px solid #EF5350" }}>
                  <div style={{ fontSize: 11, color: "#C62828", fontWeight: 600, textTransform: "uppercase" }}>Checks NOK</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "#c0392b", marginTop: 4 }}>{Object.values(checks).filter(v => v === "NOK").length}</div>
                </div>
              </div>

              {anomalyData.detected && (
                <div style={{
                  padding: 12, background: "#FAECE7", borderRadius: 6,
                  border: `1px solid #F0997B`, marginTop: 12
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#4A1B0C", marginBottom: 8 }}>
                    <i className="ti ti-alert-triangle" style={{ marginRight: 6 }} aria-hidden="true" />
                    Anomalie détectée : {CRITICALITY[anomalyData.criticality] || "N/A"}
                  </div>
                  <p style={{ fontSize: 13, margin: 0, color: "#4A1B0C", lineHeight: 1.5 }}>
                    {anomalyData.description}
                  </p>
                  <div style={{ fontSize: 12, marginTop: 8, paddingTop: 8, borderTop: "1px solid #F0997B", color: "#5C2C1F" }}>
                    <strong>Actions :</strong> {[anomalyData.adjustmentDone && "Ajustement", anomalyData.bladeReplacement && "Remplacement", anomalyData.headAdjustment && "Ajust. tête", anomalyData.maintenanceEscalation && "Escalade"].filter(Boolean).join(", ") || "Aucune"}
                  </div>
                </div>
              )}
            </Section>

            <Section title="Validation finale" icon="signature" color="#185fa5">
              <Field label="Technicien">
                <input style={inputStyle} placeholder="Nom du technicien" value={form.technicianSignature} onChange={e => setField("technicianSignature", e.target.value)} />
              </Field>
              <Field label="Chef d'équipe maintenance">
                <input style={inputStyle} placeholder="Nom du responsable" value={form.supervisorSignature} onChange={e => setField("supervisorSignature", e.target.value)} />
              </Field>
            </Section>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, gap: 12 }}>
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            ...inputStyle, width: "auto", padding: "9px 20px", cursor: step === 0 ? "not-allowed" : "pointer",
            opacity: step === 0 ? 0.4 : 1, display: "flex", alignItems: "center", gap: 6,
            background: "#fff", color: COLORS.textPrimary, fontWeight: 700, border: `1px solid ${COLORS.border}`
          }}
        >
          <i className="ti ti-arrow-left" style={{ fontSize: 14 }} aria-hidden="true" />
          Précédent
        </button>

        <span style={{ fontSize: 12, color: COLORS.textSecondary, fontWeight: 700 }}>
          Étape {step + 1} / {steps.length}
        </span>

        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
            style={{
              ...inputStyle, width: "auto", padding: "9px 20px", cursor: "pointer",
              background: COLORS.primary, color: "#fff", border: "none", fontWeight: 700,
              display: "flex", alignItems: "center", gap: 6, boxShadow: `0 2px 8px rgba(24, 95, 165, 0.2)`
            }}
          >
            Suivant
            <i className="ti ti-arrow-right" style={{ fontSize: 14 }} aria-hidden="true" />
          </button>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!form.technicien || !form.machine}
            style={{
              ...inputStyle, width: "auto", padding: "9px 20px",
              cursor: (!form.technicien || !form.machine) ? "not-allowed" : "pointer",
              background: (!form.technicien || !form.machine) ? COLORS.textSecondary : COLORS.success,
              color: "#fff",
              border: "none", fontWeight: 700, display: "flex", alignItems: "center", gap: 6,
              opacity: (!form.technicien || !form.machine) ? 0.6 : 1,
              boxShadow: (!form.technicien || !form.machine) ? "none" : `0 2px 8px rgba(45, 138, 78, 0.2)`
            }}
          >
            <i className="ti ti-check" style={{ fontSize: 14 }} aria-hidden="true" />
            Soumettre le rapport
          </button>
        )}
      </div>
    </div>
  );
}
