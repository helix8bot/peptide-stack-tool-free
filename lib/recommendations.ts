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
  "Sublingual drops (easy, no needles)": ["nad-plus"],
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
  glow: { label: "GLOW Blend", contains: ["ghk-cu", "bpc-157", "tb-500"] },
  wolverine: { label: "Wolverine Blend", contains: ["bpc-157", "tb-500"] },
  regeno: { label: "REGENO Blend", contains: ["bpc-157", "tb-500", "ghk-cu"] },
};

const recoveryBlendPriority: PeptideId[] = ["klow", "regeno", "glow", "wolverine"];
const recoveryBlendIds = new Set<PeptideId>(recoveryBlendPriority);
const standaloneRecoveryComponents = new Set<PeptideId>(["bpc-157", "tb-500", "ghk-cu"]);
const glp1Products: PeptideId[] = ["semaglutide", "tirzepatide", "retatrutide", "cagrilintide-glp1"];

const interactionLibrary: Partial<Record<PeptideId, string[]>> = {
  "bpc-157": [
    "BPC-157 can usually share the same recovery injection with TB-500 when both are part of the protocol.",
    "If KLOW, GLOW, Wolverine, or REGENO is already in the stack, standalone BPC-157 is redundant and should be removed.",
  ],
  "tb-500": [
    "TB-500 is commonly paired with BPC-157 in the same recovery window.",
    "If KLOW, GLOW, Wolverine, or REGENO is already in the stack, standalone TB-500 is redundant and should be removed.",
  ],
  "ghk-cu": [
    "GHK-Cu is usually better kept as its own topical routine instead of being forced into a GH-axis injection schedule.",
    "If KLOW, GLOW, or REGENO is already in the stack, separate standalone GHK-Cu is usually unnecessary unless there is a deliberate topical add-on reason.",
  ],
  klow: ["KLOW contains BPC-157 + TB-500 + GHK-Cu + KPV, so there is no need for separate BPC-157, TB-500, or GHK-Cu beside it."],
  glow: ["GLOW contains GHK-Cu + BPC-157 + TB-500, so there is no need for separate GHK-Cu, BPC-157, or TB-500 beside it."],
  wolverine: ["Wolverine contains BPC-157 + TB-500, so there is no need for separate BPC-157 or TB-500 beside it."],
  regeno: ["REGENO contains BPC-157 + TB-500 + GHK-Cu, so there is no need for separate BPC-157, TB-500, or GHK-Cu beside it."],
  semaglutide: ["Semaglutide should be the only GLP-1-family product in the stack."],
  tirzepatide: ["Tirzepatide should be the only GLP-1-family product in the stack."],
  retatrutide: ["Retatrutide should be the only GLP-1-family product in the stack."],
  "cagrilintide-glp1": ["Cagrilintide/GLP-1 should be the only GLP-1-family product in the stack."],
};

const basePlans: Record<GoalOption, { stackName: string; summary: string; primary: PeptideId[]; enhanced: PeptideId[]; premium: PeptideId[]; longTermAdds: PeptideId[]; conditionAdds: Partial<Record<HealthCondition, PeptideId[]>>; rationale: Partial<Record<PeptideId, string>>; genericComparison: string[] }> = {
  "Pain & Injury Recovery": {
    stackName: "Repair, Recovery & Inflammation Research Stack",
    summary: "For recovery goals, the engine starts with repair-first literature, then decides whether a convenience blend or standalone components make more sense.",
    primary: ["wolverine"],
    enhanced: ["klow", "ss-31"],
    premium: ["klow", "ss-31", "regeno"],
    longTermAdds: ["ss-31"],
    conditionAdds: { "Digestive stress or gut sensitivity": ["bpc-157"], "Slow workout recovery": ["ss-31"] },
    rationale: {
      wolverine: "Wolverine gives you a clean BPC-157 + TB-500 recovery entry point without juggling separate recovery vials.",
      klow: "KLOW gives you the broader convenience version of BPC-157 + TB-500 + GHK-Cu + KPV, so the stack stays cleaner without redundant standalone vials.",
      regeno: "REGENO is a broader recovery blend when the intake supports a more complete recovery-first stack.",
      "ss-31": "SS-31 appears when recovery is tied to deeper mitochondrial resilience demands.",
      "bpc-157": "BPC-157 appears as a standalone only when the intake clearly points away from a containing blend or mentions prior BPC-157 use directly.",
    },
    genericComparison: [
      "A generic recovery result would show everyone BPC-157 and TB-500 side by side. Your version decides whether KLOW, Wolverine, or REGENO should replace the individual parts.",
      "The engine removes redundant standalone peptides whenever a blend already contains them, and it also blocks the blend if standalone overlap is already intentional.",
    ],
  },
  "Hair Restoration & Skin Health": {
    stackName: "Hair, Scalp & Skin Research Stack",
    summary: "For hair and skin goals, the engine leans into follicle biology and convenience-first cosmetic consistency rather than forcing a generic peptide stack.",
    primary: ["ghk-cu"],
    enhanced: ["glow", "nad-plus"],
    premium: ["glow", "nad-plus", "ghk-cu"],
    longTermAdds: ["nad-plus"],
    conditionAdds: { "Visible skin aging or texture changes": ["nad-plus"] },
    rationale: {
      "ghk-cu": "GHK-Cu is the cleanest first fit because it sits at the center of hair and skin signaling literature.",
      glow: "GLOW was surfaced as the convenience-first blend path, so users do not need separate GHK-Cu, BPC-157, and TB-500 when the blend already covers them.",
      "nad-plus": "NAD+ shows up when the profile expands beyond appearance alone and into resilience or healthy-aging context.",
    },
    genericComparison: ["A generic hair result would just show GHK-Cu. Your version decides whether a convenience blend like GLOW should replace the overlapping standalone recovery components."],
  },
  "Body Composition & Fat Loss": {
    stackName: "Body Composition Research Stack",
    summary: "For body-composition goals, the engine chooses one GLP-1-family anchor, then adds only non-GLP-1 support when the answers justify it.",
    primary: ["semaglutide"],
    enhanced: ["semaglutide", "aod-9604"],
    premium: ["tirzepatide", "aod-9604", "tesamorelin"],
    longTermAdds: ["aod-9604"],
    conditionAdds: { "Low energy or fatigue": ["tesamorelin"], "Weight management resistance": ["aod-9604"] },
    rationale: {
      semaglutide: "Semaglutide is the cleanest first GLP-1 anchor for a straightforward weight-loss-first plan.",
      tirzepatide: "Tirzepatide only replaces Semaglutide when the intake supports a more advanced metabolic approach, but it never appears beside another GLP-1.",
      retatrutide: "Retatrutide is reserved for advanced investigational context and never appears beside another GLP-1.",
      "cagrilintide-glp1": "The cagrilintide/GLP-1 blend counts as your one GLP-1-family anchor, not an add-on beside another incretin.",
      "aod-9604": "AOD-9604 appears when the intake leans more directly into fat-loss framing without overlapping the GLP-1 receptor pathway.",
      tesamorelin: "Tesamorelin is non-GLP-1 support when the body-composition picture also points toward GH-axis context.",
    },
    genericComparison: ["Generic fat-loss outputs overstack incretins and GH-axis compounds immediately. Your result keeps one GLP-1-family anchor and earns any extra complexity."],
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

function freeText(text: string) { return text.toLowerCase(); }
function mentions(text: string, terms: string[]) { const t = freeText(text); return terms.some((term) => t.includes(term)); }

function applyBlendPreference(peptides: PeptideId[], answers: QuizAnswers, goal: GoalOption): PeptideId[] {
  const preference: BlendPreferenceOption | "" = answers.blendPreference;
  if (goal === "Pain & Injury Recovery") {
    if (preference === "Ready-made blends (convenience)") return unique(["klow", ...peptides]);
    if (preference === "Individual peptides (maximum control)") return unique(peptides.filter((id) => !["klow", "wolverine", "regeno"].includes(id)).concat(["bpc-157", "tb-500"]));
    if (preference === "Mix of both") return unique(["klow", ...peptides]);
  }
  if (goal === "Hair Restoration & Skin Health") {
    if (preference === "Ready-made blends (convenience)") return unique(["glow", ...peptides]);
    if (preference === "Individual peptides (maximum control)") return unique(peptides.filter((id) => id !== "glow").concat(["ghk-cu"]));
    if (preference === "Mix of both") return unique(["glow", ...peptides]);
  }
  return peptides;
}

function applyRoutePreference(peptides: PeptideId[], answers: QuizAnswers) {
  const route = answers.administrationPreference;
  if (!route || route === "Open to any method") return peptides;
  return unique([...(routeMatch[route] ?? []), ...peptides]);
}

function normalizeRecoveryBlends(peptides: PeptideId[]) {
  const recoveryBlends = recoveryBlendPriority.filter((id) => peptides.includes(id));
  if (!recoveryBlends.length) return peptides;

  const chosenBlend = recoveryBlends[0];
  return peptides.filter((id) => {
    if (recoveryBlendIds.has(id)) return id === chosenBlend;
    if (standaloneRecoveryComponents.has(id)) return false;
    return true;
  });
}

function enforceBlendDedup(peptides: PeptideId[], answers: QuizAnswers) {
  let next = [...peptides];
  const text = `${answers.supplementStack} ${answers.previousExperience}`;
  const manualStandaloneBpc = mentions(text, ["bpc-157", "bpc 157", "bpc157"]);
  const manualStandaloneTb = mentions(text, ["tb-500", "tb 500", "tb500"]);
  const manualStandaloneGhk = mentions(text, ["ghk-cu", "ghk cu", "ghkcu"]);

  if (manualStandaloneBpc || manualStandaloneTb || manualStandaloneGhk) {
    next = next.filter((id) => !recoveryBlendIds.has(id));
    if (manualStandaloneBpc) next.unshift("bpc-157");
    if (manualStandaloneTb) next.unshift("tb-500");
    if (manualStandaloneGhk) next.unshift("ghk-cu");
  }

  next = normalizeRecoveryBlends(next);

  const presentBlends = next.filter((id) => blendDefinitions[id]);
  if (presentBlends.length) {
    const blocked = new Set<PeptideId>();
    for (const blendId of presentBlends) {
      for (const component of blendDefinitions[blendId]!.contains) blocked.add(component);
    }
    next = next.filter((id) => !blocked.has(id) || Boolean(blendDefinitions[id]));
  }

  return unique(next);
}

function enforceSingleGlp1(peptides: PeptideId[], answers: QuizAnswers) {
  let next = [...peptides];
  const goal = determineGoal(answers);
  const wantsWeightLoss = goal === "Body Composition & Fat Loss" || answers.conditions.includes("Weight management resistance");

  if (wantsWeightLoss && !next.some((id) => glp1Products.includes(id))) {
    const advanced = answers.experience === "I’m experienced and comfortable with more nuance" || answers.priority === "I want the most complete stack my budget allows";
    next.unshift(advanced && answers.budget && budgetRank[answers.budget] >= 4 ? "tirzepatide" : "semaglutide");
  }

  const firstGlp1 = next.find((id) => glp1Products.includes(id));
  if (!firstGlp1) return next;
  return unique(next.filter((id) => id === firstGlp1 || !glp1Products.includes(id)));
}

function applyAdjustments(base: PeptideId[], answers: QuizAnswers, goal: GoalOption) {
  const plan = basePlans[goal];
  let peptides = [...base];
  if (answers.priority === "Highest-confidence research first") peptides = unique([...plan.primary, ...peptides.filter((id) => id !== "dsip")]);
  if (answers.priority === "I want the simplest path to evaluate") peptides = unique([...plan.primary]);
  if (answers.priority === "I care most about convenience") peptides = applyBlendPreference(peptides, { ...answers, blendPreference: (answers.blendPreference || "Ready-made blends (convenience)") as QuizAnswers["blendPreference"] }, goal);
  if (answers.priority === "I want the most complete stack my budget allows" && answers.budget && budgetRank[answers.budget] >= 3) peptides = unique([...peptides, ...plan.longTermAdds, ...plan.premium]);
  for (const condition of answers.conditions) { if (condition === "None of these") continue; const adds = plan.conditionAdds[condition]; if (adds) peptides = unique([...peptides, ...adds]); }
  if (goal === "Body Composition & Fat Loss" && (answers.conditions.includes("Chronic joint or tendon discomfort") || answers.conditions.includes("Slow workout recovery"))) {
    peptides = unique(["klow", ...peptides]);
  }
  if (answers.lifestyleFactors.includes("Regular exercise (3+ days/week)") && goal === "Pain & Injury Recovery") peptides = unique(["klow", ...peptides]);
  if (answers.lifestyleFactors.includes("Outdoor/sun exposure") && goal === "Hair Restoration & Skin Health") peptides = unique(["ghk-cu", ...peptides]);
  if (answers.lifestyleFactors.includes("Poor sleep (<6 hours)") && goal === "Longevity & Anti-Aging") peptides = unique(["nad-plus", ...peptides]);
  if (answers.timeline === "I want a 30-day starting plan") peptides = peptides.filter((id) => !["epitalon", "ss-31", "retatrutide"].includes(id));
  if (answers.timeline === "I’m building a long-term optimization plan") peptides = unique([...peptides, ...plan.longTermAdds]);
  peptides = applyRoutePreference(applyBlendPreference(peptides, answers, goal), answers);
  peptides = enforceBlendDedup(peptides, answers);
  peptides = enforceSingleGlp1(peptides, answers);
  if (answers.sensitivity === "Very sensitive (start low)") peptides = peptides.filter((id, index) => index < 3 || Boolean(blendDefinitions[id]));
  return unique(peptides);
}

function buildRouteAdjustment(id: PeptideId, answers: QuizAnswers) {
  const route = answers.administrationPreference;
  if (!route || route === "Open to any method") return undefined;
  if (route === "Subcutaneous injection (highest bioavailability)") return "Because you are comfortable with injections, the engine kept the strongest protocol-fit options on the table.";
  return peptideProfiles[id].routeNote;
}

function buildGoalMatchedReason(goal: GoalOption, peptideId: PeptideId) {
  const profile = peptideProfiles[peptideId];

  if (glp1Products.includes(peptideId)) {
    return `${profile.name} stayed in the stack because your intake pointed to body-composition and weight-management support, and the engine keeps incretin coverage to one GLP-1-family anchor.`;
  }

  if (["aod-9604", "tesamorelin"].includes(peptideId)) {
    return `${profile.name} stayed in the stack because your intake supported a body-composition-focused add-on without duplicating the GLP-1 pathway.`;
  }

  return `This compound stayed in the stack because it supports the ${goal.toLowerCase()} pathway you prioritized and still fit your route, budget, and complexity preferences.`;
}

function buildPeptideReason(goal: GoalOption, peptideId: PeptideId, answers: QuizAnswers): ResultPeptide {
  const plan = basePlans[goal];
  const profile = peptideProfiles[peptideId];
  const blend = blendDefinitions[peptideId];
  const blendNote = blend ? `${profile.name} (contains ${blend.contains.map((id) => peptideProfiles[id].name).join(" + ")}) — the engine kept this as your one recovery blend and removed overlapping standalone components to avoid redundancy.` : undefined;
  return {
    id: peptideId,
    whyChosen: blendNote ?? plan.rationale[peptideId] ?? buildGoalMatchedReason(goal, peptideId),
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

  for (const id of peptides) {
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
    { label: "Combination + safety notes", detail: warnings.length ? warnings.join(" ") : "Main reduction comes from combining compatible recovery compounds, removing redundant standalone peptides when a blend already contains them, and keeping GLP-1 products to one per stack." },
    { label: "Total daily injections", detail: `Estimated routine: ${Math.max(1, injections)} injections or application blocks per day after compatibility-based consolidation.` },
  ];
}

function buildResearchNotes(answers: QuizAnswers, goal: GoalOption, isFull: boolean) {
  const notes = [
    "This tool compiles publicly available research for educational purposes only. It is not medical advice.",
    "Every dosing mention is framed as published research or internal educational protocol language, not a personal recommendation.",
    `Your result was adjusted for ${goal.toLowerCase()} goals, plus the constraints you shared around budget, sensitivity, and administration style.`,
    "The engine removes overlapping standalone compounds when a containing blend is selected, and it limits GLP-1-family products to one per stack.",
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
    "Only one GLP-1-family product should appear in the same stack because these products overlap heavily in receptor pathway coverage.",
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
    headline: isFull ? `Your personalized ${goal.toLowerCase()} protocol` : `Your personalized ${goal.toLowerCase()} report`,
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
    upgradeMessage: undefined,
  };
}
