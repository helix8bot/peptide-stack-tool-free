import {
  peptideProfiles,
  type AdministrationPreferenceOption,
  type BlendPreferenceOption,
  type BudgetOption,
  type GoalOption,
  type HealthCondition,
  type PeptideId,
  type QuizAnswers,
} from "@/lib/quiz-data";

export type ResultPeptide = {
  id: PeptideId;
  whyChosen: string;
  dosingRange?: string;
  protocolSummary?: string;
  frequency?: string;
  routeAdjustment?: string;
  timingSuggestion?: string;
  cycleLength?: string;
  loadingPhase?: string;
  maintenancePhase?: string;
  interactionNotes: string[];
};

export type ResultMilestone = { label: string; detail: string };
export type ProtocolCalendarItem = { phase: string; detail: string };
export type DailyProtocolItem = { label: string; detail: string };

export type QuizResult = {
  headline: string;
  summary: string;
  stackName: string;
  peptides: ResultPeptide[];
  timeline: ResultMilestone[];
  protocolCalendar: ProtocolCalendarItem[];
  dailyProtocolSchedule: DailyProtocolItem[];
  citations: string[];
  researchNotes: string[];
  interactionWarnings: string[];
  stackVsGeneric: string[];
  educationalLinks: { label: string; href: string }[];
  reportIntro: string;
  complianceDisclaimer: string;
  upgradeMessage?: string;
};

const budgetRank: Record<BudgetOption, number> = { "Under $100": 1, "$100-200": 2, "$200-350": 3, "$350-500": 4, "$500+": 5 };
const conditionMap: Partial<Record<HealthCondition, GoalOption>> = {
  "Chronic joint or tendon discomfort": "Pain & Injury Recovery",
  "Hair thinning or shedding": "Hair Restoration & Skin Health",
  "Weight management resistance": "Body Composition & Fat Loss",
  "Visible skin aging or texture changes": "Longevity & Anti-Aging",
  "Brain fog or poor focus": "Cognitive Performance & Focus",
  "Poor sleep quality": "Sleep & Recovery",
};
const routeMatch: Partial<Record<AdministrationPreferenceOption, PeptideId[]>> = {
  "Sublingual drops (easy, no needles)": ["bpc-157", "nad-plus"],
  "Nasal spray (fast absorption, simple)": ["selank", "semax"],
  "Topical cream/serum (targeted application)": ["ghk-cu"],
};
const educationalLinks = [
  { label: "PeptideLaunch Hair Education", href: "https://peptidelaunch.com/hair" },
  { label: "PeptideLaunch Recovery Education", href: "https://peptidelaunch.com/recovery" },
  { label: "PeptideLaunch Longevity Education", href: "https://peptidelaunch.com/longevity" },
];

const blendDefinitions: Partial<Record<PeptideId, { contains: PeptideId[]; label: string }>> = {
  klow: { label: "KLOW Blend", contains: ["bpc-157", "tb-500", "ghk-cu"] },
  glow: { label: "GLOW Blend", contains: ["bpc-157", "tb-500"] },
};

const interactionLibrary: Partial<Record<PeptideId, string[]>> = {
  "bpc-157": [
    "BPC-157 can usually share the same recovery injection with TB-500 when both are part of the protocol.",
    "If KLOW or GLOW is already in the stack, separate standalone BPC-157 is usually redundant.",
  ],
  "tb-500": [
    "TB-500 is commonly paired with BPC-157 in the same recovery window and can often be combined in one syringe in educational stacking discussions.",
    "If KLOW or GLOW is already in the stack, separate standalone TB-500 is usually redundant.",
  ],
  "ghk-cu": [
    "GHK-Cu is usually better kept as its own topical routine instead of being forced into a GH-axis injection schedule.",
    "If KLOW is already in the stack, separate standalone GHK-Cu is usually unnecessary unless there is a deliberate topical add-on reason.",
  ],
  tesamorelin: ["Tesamorelin plus other GH-axis compounds increases complexity fast, so keep the plan intentional and fasted."],
  ipamorelin: ["If a blend already contains Ipamorelin, remove the standalone version to avoid duplicate GH-axis exposure."],
  "cjc-1295": ["If a blend already contains CJC-1295, remove the standalone version to avoid duplicate GH-axis exposure."],
  klow: ["KLOW contains BPC-157 + TB-500 + GHK-Cu + KPV, so there is no need for separate BPC-157, TB-500, or GHK-Cu beside it."],
  glow: ["GLOW contains BPC-157 + TB-500, so there is no need for separate BPC-157 or TB-500 beside it."],
};

const basePlans: Record<GoalOption, { stackName: string; summary: string; primary: PeptideId[]; enhanced: PeptideId[]; premium: PeptideId[]; longTermAdds: PeptideId[]; conditionAdds: Partial<Record<HealthCondition, PeptideId[]>>; rationale: Partial<Record<PeptideId, string>>; genericComparison: string[] }> = {
  "Pain & Injury Recovery": {
    stackName: "Repair, Recovery & Inflammation Research Stack",
    summary: "For recovery goals, the engine starts with repair-first literature, then decides whether a convenience blend or standalone components make more sense.",
    primary: ["bpc-157"],
    enhanced: ["bpc-157", "tb-500"],
    premium: ["bpc-157", "tb-500", "ss-31", "klow"],
    longTermAdds: ["ss-31"],
    conditionAdds: { "Digestive stress or gut sensitivity": ["bpc-157"], "Slow workout recovery": ["ss-31"] },
    rationale: {
      "bpc-157": "You signaled a repair-first goal, so the stack opens with the clearest connective-tissue anchor.",
      "tb-500": "TB-500 was layered in because your answers support a broader remodeling strategy.",
      "ss-31": "SS-31 appears when recovery is tied to deeper mitochondrial resilience demands.",
      klow: "KLOW gives you the convenience version of BPC-157 + TB-500 + GHK-Cu + KPV, so the stack can stay cleaner without redundant standalone vials.",
    },
    genericComparison: [
      "A generic recovery result would show everyone BPC-157 and stop there. Your version also decides whether KLOW should replace the individual parts.",
      "The engine now removes redundant standalone peptides whenever a blend already contains them.",
    ],
  },
  "Hair Restoration & Skin Health": {
    stackName: "Hair, Scalp & Skin Research Stack",
    summary: "For hair and skin goals, the engine leans into follicle biology and convenience-first cosmetic consistency rather than forcing a generic peptide stack.",
    primary: ["ghk-cu"],
    enhanced: ["ghk-cu", "glow"],
    premium: ["ghk-cu", "glow", "nad-plus"],
    longTermAdds: ["nad-plus"],
    conditionAdds: { "Visible skin aging or texture changes": ["nad-plus"] },
    rationale: {
      "ghk-cu": "GHK-Cu is the cleanest first fit because it sits at the center of hair and skin signaling literature.",
      glow: "GLOW was surfaced as the convenience-first blend path, so users do not need separate BPC-157 and TB-500 when the blend already covers them.",
      "nad-plus": "NAD+ shows up when the profile expands beyond appearance alone and into resilience or healthy-aging context.",
    },
    genericComparison: [
      "A generic hair result would just show GHK-Cu. Your version decides whether a convenience blend like GLOW should replace standalone recovery components.",
    ],
  },
  "Body Composition & Fat Loss": {
    stackName: "Body Composition Research Stack",
    summary: "For body-composition goals, the engine favors adiposity and GH-axis literature first, then adds complexity only when answers support it.",
    primary: ["tesamorelin"],
    enhanced: ["tesamorelin", "ipamorelin"],
    premium: ["tesamorelin", "ipamorelin", "cjc-1295", "aod-9604"],
    longTermAdds: ["cjc-1295"],
    conditionAdds: { "Low energy or fatigue": ["ipamorelin"], "Weight management resistance": ["aod-9604"] },
    rationale: {
      tesamorelin: "Tesamorelin stayed central because it has the clearest clinical footing in this category.",
      ipamorelin: "Ipamorelin was added because your profile can support a fuller GH-pulse discussion.",
      "cjc-1295": "CJC-1295 only enters when the answers justify a more advanced GH-axis stack.",
      "aod-9604": "AOD-9604 appears when the intake leans more directly into fat-loss framing.",
    },
    genericComparison: ["Generic fat-loss outputs overstack GH-axis compounds immediately. Your result keeps complexity earned, not assumed."],
  },
  "Longevity & Anti-Aging": {
    stackName: "Longevity & Mitochondrial Research Stack",
    summary: "This pathway starts with metabolic and mitochondrial resilience themes, then decides how much exploratory healthy-aging literature actually belongs in the plan.",
    primary: ["mots-c"], enhanced: ["mots-c", "nad-plus"], premium: ["mots-c", "nad-plus", "epitalon", "ss-31"], longTermAdds: ["epitalon", "ss-31"],
    conditionAdds: { "Low energy or fatigue": ["nad-plus"], "Visible skin aging or texture changes": ["epitalon"] },
    rationale: { "mots-c": "MOTS-C gives the longevity category a grounded metabolic anchor.", "nad-plus": "NAD+ broadens the energy-and-repair conversation.", epitalon: "Epitalon is reserved for longer-horizon protocols.", "ss-31": "SS-31 appears when mitochondrial resilience deserves a deeper role." },
    genericComparison: ["A generic longevity stack throws every trendy molecule together. Your version filters for evidence confidence and timing."],
  },
  "Cognitive Performance & Focus": {
    stackName: "Cognition, Focus & Calm Research Stack",
    summary: "For cognitive goals, the engine separates stimulation from steadier calm-focus support.",
    primary: ["selank"], enhanced: ["selank", "semax"], premium: ["selank", "semax", "nad-plus"], longTermAdds: ["nad-plus"],
    conditionAdds: { "Brain fog or poor focus": ["semax"], "Low energy or fatigue": ["nad-plus"] },
    rationale: { selank: "Selank leads because your intake suggests calm-focus support matters.", semax: "Semax was added because your answers indicate attention and drive matter enough for a sharper layer.", "nad-plus": "NAD+ appears when the cognitive picture includes low energy or broader resilience concerns." },
    genericComparison: ["A generic focus stack would toss Selank and Semax into the same bucket for everyone. Your result differentiates between calm-focus and stimulation."],
  },
  "Sleep & Recovery": {
    stackName: "Sleep, Calm & Recovery Research Stack",
    summary: "When sleep is the main goal, the best result is rarely the most crowded one.",
    primary: ["selank"], enhanced: ["selank", "bpc-157"], premium: ["selank", "bpc-157", "mots-c", "dsip"], longTermAdds: ["mots-c", "dsip"],
    conditionAdds: { "Digestive stress or gut sensitivity": ["bpc-157"], "Low energy or fatigue": ["mots-c"] },
    rationale: { selank: "Selank leads because it gives the strongest calm-support angle without overcomplicating the plan.", "bpc-157": "BPC-157 was added because sleep complaints often overlap with recovery and gut-stress signals.", "mots-c": "MOTS-C shows up when sleep issues appear tied to broader resilience or energy regulation.", dsip: "DSIP stays contextual and short-cycle only." },
    genericComparison: ["A generic sleep result would show one calming peptide and move on. Your report looks at gut flags, fatigue, and recovery context before widening the stack."],
  },
};

function unique<T>(items: T[]) { return Array.from(new Set(items)); }
function determineGoal(answers: QuizAnswers): GoalOption { if (answers.goal) return answers.goal; const inferred = answers.conditions.find((c) => conditionMap[c]); return inferred ? conditionMap[inferred]! : "Pain & Injury Recovery"; }
function determineBaseStack(answers: QuizAnswers, goal: GoalOption) { const plan = basePlans[goal]; const budget = answers.budget ? budgetRank[answers.budget] : 2; if (answers.experience === "Brand new — I want a simple starting point" || budget <= 2) return [...plan.primary]; if (answers.experience === "I’m experienced and comfortable with more nuance" || budget >= 4) return [...plan.premium]; return [...plan.enhanced]; }

function applyBlendPreference(peptides: PeptideId[], answers: QuizAnswers, goal: GoalOption): PeptideId[] {
  const preference: BlendPreferenceOption | "" = answers.blendPreference;
  if (goal === "Pain & Injury Recovery") {
    if (preference === "Ready-made blends (convenience)") return unique(["klow", ...peptides]);
    if (preference === "Individual peptides (maximum control)") return unique(peptides.filter((id) => id !== "klow").concat(["bpc-157", "tb-500"]));
    if (preference === "Mix of both") return unique(["klow", "bpc-157", "tb-500", ...peptides]);
  }
  if (goal === "Hair Restoration & Skin Health") {
    if (preference === "Ready-made blends (convenience)") return unique(["glow", ...peptides]);
    if (preference === "Individual peptides (maximum control)") return unique(peptides.filter((id) => id !== "glow").concat(["ghk-cu"]));
    if (preference === "Mix of both") return unique(["glow", "ghk-cu", ...peptides]);
  }
  return peptides;
}

function applyRoutePreference(peptides: PeptideId[], answers: QuizAnswers) {
  const route = answers.administrationPreference;
  if (!route || route === "Open to any method") return peptides;
  return unique([...(routeMatch[route] ?? []), ...peptides]);
}

function dedupeBlendComponents(peptides: PeptideId[]) {
  const present = new Set(peptides);
  const blocked = new Set<PeptideId>();
  for (const id of peptides) {
    const blend = blendDefinitions[id];
    if (!blend) continue;
    for (const component of blend.contains) blocked.add(component);
    if (id === "klow") blocked.add("ghk-cu");
  }
  return peptides.filter((id) => !blocked.has(id) || !!blendDefinitions[id]);
}

function applyAdjustments(base: PeptideId[], answers: QuizAnswers, goal: GoalOption) {
  const plan = basePlans[goal];
  let peptides = [...base];
  if (answers.priority === "Highest-confidence research first") peptides = unique([...plan.primary, ...peptides.filter((id) => id !== "dsip")]);
  if (answers.priority === "I want the simplest path to evaluate") peptides = unique([...plan.primary]);
  if (answers.priority === "I care most about convenience") peptides = applyBlendPreference(peptides, { ...answers, blendPreference: (answers.blendPreference || "Ready-made blends (convenience)") as QuizAnswers["blendPreference"] }, goal);
  if (answers.priority === "I want the most complete stack my budget allows" && answers.budget && budgetRank[answers.budget] >= 3) peptides = unique([...peptides, ...plan.longTermAdds, ...plan.premium]);
  for (const condition of answers.conditions) { if (condition === "None of these") continue; const adds = plan.conditionAdds[condition]; if (adds) peptides = unique([...peptides, ...adds]); }
  if (answers.lifestyleFactors.includes("Regular exercise (3+ days/week)") && goal === "Pain & Injury Recovery") peptides = unique(["tb-500", ...peptides]);
  if (answers.lifestyleFactors.includes("Outdoor/sun exposure") && goal === "Hair Restoration & Skin Health") peptides = unique(["ghk-cu", ...peptides]);
  if (answers.lifestyleFactors.includes("Poor sleep (<6 hours)") && goal === "Longevity & Anti-Aging") peptides = unique(["nad-plus", ...peptides]);
  if (answers.timeline === "I want a 30-day starting plan") peptides = peptides.filter((id) => !["epitalon", "ss-31"].includes(id));
  if (answers.timeline === "I’m building a long-term optimization plan") peptides = unique([...peptides, ...plan.longTermAdds]);
  peptides = dedupeBlendComponents(applyRoutePreference(applyBlendPreference(peptides, answers, goal), answers));
  if (answers.sensitivity === "Very sensitive (start low)") peptides = peptides.filter((id, index) => index < 3 || !!blendDefinitions[id]);
  return unique(peptides);
}

function buildRouteAdjustment(id: PeptideId, answers: QuizAnswers) {
  const route = answers.administrationPreference;
  if (!route || route === "Open to any method") return undefined;
  if (route === "Subcutaneous injection (highest bioavailability)") return "Because you are comfortable with injections, the engine kept the strongest protocol-fit options on the table.";
  return peptideProfiles[id].routeNote;
}

function buildPeptideReason(goal: GoalOption, peptideId: PeptideId, answers: QuizAnswers): ResultPeptide {
  const plan = basePlans[goal];
  const profile = peptideProfiles[peptideId];
  const blend = blendDefinitions[peptideId];
  const blendNote = blend ? `${profile.name} (contains ${blend.contains.map((id) => peptideProfiles[id].name).join(" + ")}) — no need for separate ${blend.contains.map((id) => peptideProfiles[id].name).join(" or ")}.` : undefined;
  return {
    id: peptideId,
    whyChosen: blendNote ?? plan.rationale[peptideId] ?? `This compound stayed in the stack because it supports the ${goal.toLowerCase()} pathway you prioritized and still fit your route, budget, and complexity preferences.`,
    dosingRange: profile.researchDosing,
    protocolSummary: profile.protocolSummary,
    frequency: profile.frequency,
    routeAdjustment: buildRouteAdjustment(peptideId, answers),
    timingSuggestion: profile.timingSuggestion,
    cycleLength: profile.cycleLength,
    loadingPhase: profile.loadingPhase,
    maintenancePhase: profile.maintenancePhase,
    interactionNotes: interactionLibrary[peptideId] ?? ["This compound was included as part of a broader goal-matched stack rather than as a standalone generic pick."],
  };
}

function buildTimeline(goal: GoalOption, peptides: PeptideId[]): ResultMilestone[] {
  const names = peptides.map((id) => peptideProfiles[id].name);
  return [
    { label: "Week 1-2", detail: `Start with ${names[0] ?? "your primary anchor"} so the protocol stays interpretable from day one.` },
    { label: "Week 3-4", detail: names[1] ? `If the stack still feels aligned, introduce or continue ${names[1]} as the secondary layer.` : "If the result stayed intentionally simple, hold the base protocol steady instead of adding noise." },
    { label: "Month 2-3", detail: names.slice(2).length ? `The full protocol window is where ${names.slice(2).join(", ")} may continue or rotate in as the deeper layer.` : `For ${goal.toLowerCase()}, a cleaner stack may genuinely be the better long-view play.` },
  ];
}

function buildProtocolCalendar(peptides: PeptideId[]): ProtocolCalendarItem[] {
  return [
    { phase: "Week 1-2: establish the base", detail: `Start with ${peptideProfiles[peptides[0]]?.name ?? "the lead compound"} and keep other variables steady.` },
    { phase: "Week 3-4: confirm fit", detail: `Layer in or continue ${peptideProfiles[peptides[1]]?.name ?? "the existing protocol"} only if the original goal still points in the same direction.` },
    { phase: "Month 2-3: complete the personalized stack", detail: peptides.slice(2).length ? `Use the later phase for ${peptides.slice(2).map((id) => peptideProfiles[id].name).join(", ")} only if the added complexity still feels justified.` : "Reassess whether a fuller stack is even necessary." },
  ];
}

function buildDailyProtocolSchedule(peptides: PeptideId[]): DailyProtocolItem[] {
  const morning: string[] = [];
  const evening: string[] = [];
  const warnings: string[] = [];
  let injections = 0;

  const hasBpc = peptides.includes("bpc-157");
  const hasTb = peptides.includes("tb-500");
  const hasKlow = peptides.includes("klow");
  const hasGlow = peptides.includes("glow");

  if (hasKlow) { morning.push("KLOW Blend (contains BPC-157 + TB-500 + GHK-Cu + KPV) — single convenience injection."); injections += 1; }
  else if (hasGlow) { morning.push("GLOW Blend (contains BPC-157 + TB-500) — single convenience injection."); injections += 1; }
  else if (hasBpc && hasTb) { morning.push("BPC-157 + TB-500 can combine in the same syringe — 1 morning recovery injection."); injections += 1; }
  else {
    if (hasBpc) { morning.push("BPC-157 fasted in the morning."); injections += 1; }
    if (hasTb) { evening.push("TB-500 on designated recovery days."); injections += 1; }
  }

  for (const id of peptides) {
    if (["bpc-157", "tb-500", "klow", "glow"].includes(id)) continue;
    const profile = peptideProfiles[id];
    for (const item of profile.dailySchedule ?? []) {
      const line = `${profile.name}: ${item.detail}`;
      if (item.period === "Morning") morning.push(line);
      else if (item.period === "Evening") evening.push(line);
      else warnings.push(line);
    }
    if (profile.shouldNotCombineWith?.length) warnings.push(...profile.shouldNotCombineWith.map((w) => `${profile.name}: ${w}`));
    if (profile.category !== "cofactor" && !["ghk-cu", "selank", "semax"].includes(id)) injections += 1;
  }

  return [
    { label: "Morning", detail: morning.length ? morning.join(" ") : "No dedicated morning compounds required." },
    { label: "Evening", detail: evening.length ? evening.join(" ") : "No dedicated evening compounds required." },
    { label: "Combination + safety notes", detail: warnings.length ? warnings.join(" ") : "Main reduction comes from combining compatible recovery compounds and removing redundant standalone peptides when a blend already contains them." },
    { label: "Total daily injections", detail: `Estimated routine: ${Math.max(1, injections)} injections or application blocks per day after compatibility-based consolidation.` },
  ];
}

function buildResearchNotes(answers: QuizAnswers, goal: GoalOption, isFull: boolean) {
  const notes = [
    "This tool compiles publicly available research for educational purposes only. It is not medical advice.",
    "Every dosing mention is framed as published research or internal educational protocol language, not a personal recommendation.",
    `Your result was adjusted for ${goal.toLowerCase()} goals, plus the constraints you shared around budget, sensitivity, and administration style.`,
  ];
  if (answers.supplementStack.trim()) notes.push(`Current supplement context considered: ${answers.supplementStack.trim()}.`);
  if (answers.previousExperience.trim()) notes.push(`Previous peptide context considered: ${answers.previousExperience.trim()}.`);
  if (isFull && answers.lifestyleFactors.length) notes.push(`Lifestyle factors shaping the report: ${answers.lifestyleFactors.join(", ")}.`);
  return notes;
}

function buildWarnings(peptides: PeptideId[]) {
  return unique(peptides.flatMap((id) => peptideProfiles[id].warnings).concat([
    "Stacking multiple GH-axis compounds increases the need to think about glucose regulation, IGF-1 context, and overall protocol complexity.",
    "Blends simplify logistics, but once a blend is in the stack the matching standalone peptides should usually be removed to avoid redundant exposure.",
    "If pregnancy, breastfeeding, cancer history, psychiatric medication use, endocrine medication use, or anticoagulation is part of the picture, a qualified healthcare provider should review the protocol context first.",
  ]));
}
function buildCitations(peptides: PeptideId[]) { return unique(peptides.flatMap((id) => peptideProfiles[id].citations.map((c) => `${c.label}${c.doi ? ` • DOI ${c.doi}` : ""}`))); }

export function buildResult(answers: QuizAnswers, isFull: boolean): QuizResult {
  const goal = determineGoal(answers);
  const plan = basePlans[goal];
  let peptides = determineBaseStack(answers, goal);
  peptides = applyAdjustments(peptides, answers, goal);
  peptides = isFull ? peptides.slice(0, 4) : peptides.slice(0, 2);
  const resultPeptides = peptides.map((id) => buildPeptideReason(goal, id, answers));
  return {
    headline: isFull ? `Your personalized ${goal.toLowerCase()} protocol` : `Your personalized ${goal.toLowerCase()} preview`,
    summary: plan.summary,
    stackName: plan.stackName,
    peptides: resultPeptides,
    timeline: buildTimeline(goal, peptides),
    protocolCalendar: buildProtocolCalendar(peptides),
    dailyProtocolSchedule: buildDailyProtocolSchedule(peptides),
    citations: buildCitations(peptides),
    researchNotes: buildResearchNotes(answers, goal, isFull),
    interactionWarnings: buildWarnings(peptides),
    stackVsGeneric: plan.genericComparison,
    educationalLinks,
    reportIntro: "This report is designed to feel like the condensed version of a high-end consultation: clear, practical, research-grounded, and tailored to the signals you gave us.",
    complianceDisclaimer: "This tool compiles publicly available research for educational purposes only. It is not medical advice. Consult a qualified healthcare provider before beginning any protocol.",
    upgradeMessage: isFull ? undefined : "Unlock the full $147 protocol to see the complete stack, comprehensive dosing research with citations, daily schedule logic, and interaction guidance.",
  };
}
