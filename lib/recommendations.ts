import {
  peptideProfiles,
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
  routeAdjustment?: string;
};

export type ResultMilestone = {
  label: string;
  detail: string;
};

export type ProtocolCalendarItem = {
  phase: string;
  detail: string;
};

export type QuizResult = {
  headline: string;
  summary: string;
  stackName: string;
  peptides: ResultPeptide[];
  timeline: ResultMilestone[];
  protocolCalendar: ProtocolCalendarItem[];
  citations: string[];
  researchNotes: string[];
  interactionWarnings: string[];
  upgradeMessage?: string;
};

const budgetRank: Record<BudgetOption, number> = {
  "Under $100": 1,
  "$100-200": 2,
  "$200-350": 3,
  "$350-500": 4,
  "$500+": 5,
};

const conditionMap: Partial<Record<HealthCondition, GoalOption>> = {
  "Chronic joint/tendon pain": "Pain & Injury Recovery",
  "Hair thinning or loss": "Hair Restoration & Skin Health",
  "Weight management struggles": "Body Composition & Fat Loss",
  "Signs of aging (skin/wrinkles)": "Longevity & Anti-Aging",
  "Brain fog/poor focus": "Cognitive Performance & Focus",
  "Poor sleep quality": "Sleep & Recovery",
};

const basePlans: Record<
  GoalOption,
  {
    stackName: string;
    summary: string;
    primary: PeptideId[];
    enhanced: PeptideId[];
    premium: PeptideId[];
    fastTrack: PeptideId[];
    longTermAdds: PeptideId[];
    oralFirst: PeptideId[];
    conditionAdds: Partial<Record<HealthCondition, PeptideId[]>>;
    rationale: Partial<Record<PeptideId, string>>;
  }
> = {
  "Pain & Injury Recovery": {
    stackName: "Repair & Recovery Research Stack",
    summary:
      "Based on published research, this pathway centers on connective-tissue repair signaling first, then layers broader recovery support if budget, experience, and timeline allow.",
    primary: ["bpc-157"],
    enhanced: ["bpc-157", "tb-500"],
    premium: ["bpc-157", "tb-500", "ss-31", "klow"],
    fastTrack: ["bpc-157", "tb-500"],
    longTermAdds: ["ss-31"],
    oralFirst: ["bpc-157", "ghk-cu"],
    conditionAdds: {
      "Slow workout recovery": ["ss-31"],
      "Gut/digestive issues": ["bpc-157"],
    },
    rationale: {
      "bpc-157": "Chosen because your goal points toward tendon, ligament, or gut-repair research themes where BPC-157 is the clearest literature anchor.",
      "tb-500": "Added to broaden the stack toward cell migration and tissue remodeling research when a stronger recovery stack is appropriate.",
      "ss-31": "Added when the profile suggests mitochondrial repair and deeper recovery capacity may matter, especially for longer timelines or fatigue-heavy profiles.",
      klow: "Included as an optional product-context note because KLOW combines BPC-157, TB-500, GHK-Cu, and KPV in a recovery-oriented blend.",
      "ghk-cu": "Added in injection-averse contexts as a topical-friendly recovery adjunct for localized healing support discussion.",
    },
  },
  "Hair Restoration & Skin Health": {
    stackName: "Hair & Skin Support Research Stack",
    summary:
      "Research suggests GHK-Cu is the core anchor for follicle and skin-support education, with cofactors and blend context layered around it rather than replacing it.",
    primary: ["ghk-cu"],
    enhanced: ["ghk-cu", "glow"],
    premium: ["ghk-cu", "glow", "nad-plus"],
    fastTrack: ["ghk-cu"],
    longTermAdds: ["nad-plus"],
    oralFirst: ["ghk-cu", "glow"],
    conditionAdds: {
      "Signs of aging (skin/wrinkles)": ["nad-plus"],
    },
    rationale: {
      "ghk-cu": "Chosen because GHK-Cu has the strongest hair and skin literature in the master reference, including follicle and dermal-remodeling discussion.",
      glow: "Added as our GLOW blend concept for people who want a broader hair and skin support framework built around GHK-Cu.",
      "nad-plus": "Added when the profile includes broader aging or energy-support context alongside cosmetic goals.",
    },
  },
  "Body Composition & Fat Loss": {
    stackName: "Body Composition Research Stack",
    summary:
      "This stack prioritizes peptides with the clearest GH-axis and adiposity-related research backing, then expands only if budget and experience support more complexity.",
    primary: ["tesamorelin"],
    enhanced: ["tesamorelin", "ipamorelin"],
    premium: ["tesamorelin", "ipamorelin", "cjc-1295", "aod-9604"],
    fastTrack: ["tesamorelin", "aod-9604"],
    longTermAdds: ["cjc-1295"],
    oralFirst: ["aod-9604"],
    conditionAdds: {
      "Low energy/fatigue": ["ipamorelin"],
      "Weight management struggles": ["aod-9604"],
    },
    rationale: {
      tesamorelin: "Chosen because Tesamorelin has the most established clinical literature in this category and is the cleanest first anchor for body-composition research.",
      ipamorelin: "Added when the stack can support a second GH-pulse input and the user is beyond true beginner status.",
      "cjc-1295": "Added for experienced users who want a fuller GH-axis stack rather than a single-anchor protocol.",
      "aod-9604": "Added when the goal is especially fat-loss oriented and a fragment-based adiposity discussion is relevant.",
    },
  },
  "Longevity & Anti-Aging": {
    stackName: "Longevity Research Stack",
    summary:
      "This pathway uses mitochondrial and healthy-aging research themes, starting with metabolic resilience and layering more exploratory peptides only when the questionnaire supports it.",
    primary: ["mots-c"],
    enhanced: ["mots-c", "nad-plus"],
    premium: ["mots-c", "nad-plus", "epitalon", "ss-31"],
    fastTrack: ["mots-c"],
    longTermAdds: ["epitalon", "ss-31"],
    oralFirst: ["nad-plus"],
    conditionAdds: {
      "Low energy/fatigue": ["nad-plus"],
      "Signs of aging (skin/wrinkles)": ["epitalon"],
    },
    rationale: {
      "mots-c": "Chosen because MOTS-C is the strongest metabolic and mitochondrial anchor in the master reference for longevity-oriented goals.",
      "nad-plus": "Added to support a broader cellular-energy discussion and because it pairs naturally with mitochondrial resilience themes.",
      epitalon: "Added only for longer-term optimization because the literature is more exploratory and is best kept in a longevity context, not a quick-results context.",
      "ss-31": "Added when the goal extends beyond longevity branding into mitochondrial membrane repair and resilience research.",
    },
  },
  "Cognitive Performance & Focus": {
    stackName: "Cognitive Performance Research Stack",
    summary:
      "Research suggests cognitive stacks work best when they start with calm-focus and neurotrophic support, then add metabolic support if brain fog or fatigue are part of the intake.",
    primary: ["selank"],
    enhanced: ["selank", "semax"],
    premium: ["selank", "semax", "nad-plus"],
    fastTrack: ["selank", "semax"],
    longTermAdds: ["nad-plus"],
    oralFirst: ["selank", "semax", "nad-plus"],
    conditionAdds: {
      "Brain fog/poor focus": ["semax"],
      "Low energy/fatigue": ["nad-plus"],
    },
    rationale: {
      selank: "Chosen because Selank is the most balanced first recommendation when the goal is focus with a calm, lower-friction profile.",
      semax: "Added when the intake points more toward BDNF and attention-support discussion rather than calm alone.",
      "nad-plus": "Added when mental performance is paired with low energy or a longer-term optimization mindset.",
    },
  },
  "Sleep & Recovery": {
    stackName: "Sleep & Recovery Research Stack",
    summary:
      "This stack favors calmer, shorter-acting options first, then adds broader recovery support if the questionnaire suggests low energy, gut issues, or longer-term resilience goals.",
    primary: ["selank"],
    enhanced: ["selank", "bpc-157"],
    premium: ["selank", "bpc-157", "mots-c", "dsip"],
    fastTrack: ["selank", "bpc-157"],
    longTermAdds: ["mots-c", "dsip"],
    oralFirst: ["selank", "bpc-157"],
    conditionAdds: {
      "Gut/digestive issues": ["bpc-157"],
      "Low energy/fatigue": ["mots-c"],
    },
    rationale: {
      selank: "Chosen because Selank is the clearest match for calming, GABAergic, sleep-adjacent research discussion.",
      "bpc-157": "Added when sleep complaints overlap with gut or recovery complaints, since the gut-brain-axis angle matters here.",
      "mots-c": "Added for users aiming at broader recovery capacity and metabolic resilience rather than sleep alone.",
      dsip: "Included only as contextual sleep support because the literature is thinner than for Selank or MOTS-C.",
    },
  },
};

function unique<T>(items: T[]) {
  return Array.from(new Set(items));
}

function determineGoal(answers: QuizAnswers): GoalOption {
  if (answers.goal) return answers.goal;
  const inferred = answers.conditions.find((condition) => conditionMap[condition]);
  return inferred ? conditionMap[inferred]! : "Pain & Injury Recovery";
}

function determineBaseStack(answers: QuizAnswers, goal: GoalOption) {
  const plan = basePlans[goal];
  const budget = answers.budget ? budgetRank[answers.budget] : 2;
  const beginner = answers.experience === "Complete beginner (never used)";
  const advanced = answers.experience === "Experienced (used multiple protocols)";

  if (beginner || budget <= 2) return [...plan.primary];
  if (budget <= 3 || answers.experience === "Done some research (haven't started)") return [...plan.enhanced];
  if (advanced || budget >= 4) return [...plan.premium];
  return [...plan.enhanced];
}

function applyAdjustments(base: PeptideId[], answers: QuizAnswers, goal: GoalOption) {
  const plan = basePlans[goal];
  let peptides = [...base];

  if (answers.priority === "Fastest results timeline") {
    peptides = unique([...plan.fastTrack, ...peptides]);
  }

  if (answers.priority === "Simplest protocol (fewest injections)") {
    peptides = unique([...plan.primary]);
  }

  if (answers.priority === "Strongest research backing") {
    peptides = unique([...plan.primary, ...peptides.filter((id) => id !== "dsip")]);
  }

  if (answers.priority === "Best value for budget" && peptides.length > 2) {
    peptides = peptides.slice(0, 2);
  }

  if (answers.deliveryPreference === "Prefer oral/topical only") {
    peptides = unique([...plan.oralFirst, ...peptides.filter((id) => !["tb-500", "cjc-1295", "ipamorelin", "ss-31", "epitalon", "mots-c", "tesamorelin", "dsip"].includes(id))]);
  }

  for (const condition of answers.conditions) {
    if (condition === "None of these") continue;
    const adds = plan.conditionAdds[condition];
    if (adds) peptides = unique([...peptides, ...adds]);
  }

  if (answers.timeline === "Quick wins (30 days)") {
    peptides = unique([...plan.fastTrack, ...peptides.filter((id) => !["epitalon"].includes(id))]);
  }

  if (answers.timeline === "Long-term optimization (6+ months)") {
    peptides = unique([...peptides, ...plan.longTermAdds]);
  }

  return peptides;
}

function buildPeptideReason(goal: GoalOption, peptideId: PeptideId, answers: QuizAnswers) {
  const plan = basePlans[goal];
  const profile = peptideProfiles[peptideId];
  const whyChosen = plan.rationale[peptideId] ?? `Chosen because it supports the ${goal.toLowerCase()} goal based on published research.`;

  let routeAdjustment: string | undefined;
  if (answers.deliveryPreference === "Prefer oral/topical only") {
    if (peptideId === "bpc-157") routeAdjustment = "Because you prefer to avoid injections, this result prioritizes oral BPC-157 discussion first and keeps route comparisons educational.";
    if (peptideId === "ghk-cu") routeAdjustment = "Because you prefer to avoid injections, this result prioritizes topical GHK-Cu context for scalp and skin support.";
    if (peptideId === "selank" || peptideId === "semax") routeAdjustment = "Because you prefer to avoid injections, this result prioritizes intranasal delivery context rather than subcutaneous-first protocols.";
    if (peptideId === "nad-plus") routeAdjustment = "Because you prefer to avoid injections, the emphasis stays on NAD+ pathway education rather than injectable-only formats.";
  }

  return {
    id: peptideId,
    whyChosen,
    dosingRange: profile.researchDosing,
    routeAdjustment,
  };
}

function buildTimeline(goal: GoalOption, peptides: PeptideId[]): ResultMilestone[] {
  const first = peptides[0];
  const second = peptides[1];
  const remainder = peptides.slice(2);
  const firstName = peptideProfiles[first]?.name ?? "the primary peptide";
  const secondName = second ? peptideProfiles[second].name : "a secondary peptide";
  const remainderNames = remainder.map((id) => peptideProfiles[id].name).join(", ");

  return [
    {
      label: "Week 1-2",
      detail: `Start with ${firstName} as the primary ${goal.toLowerCase()} anchor. Research suggests this gives the cleanest first signal before too many variables are layered in.`,
    },
    {
      label: "Week 3-4",
      detail: second
        ? `Add ${secondName} if the stack still matches the original goal and complexity is justified. In published research discussions, this is where a second mechanism is often introduced.`
        : `Continue reviewing ${firstName} before adding complexity. Simpler protocols often make the clearest educational comparison.` ,
    },
    {
      label: "Month 2-3",
      detail: remainder.length
        ? `Build toward the full stack by considering ${remainderNames}. Longer review windows are usually where mitochondrial, longevity, or tertiary support layers make the most sense.`
        : `Reassess whether a fuller stack is even necessary. Many users are better served by staying focused rather than automatically expanding.`,
    },
  ];
}

function buildProtocolCalendar(peptides: PeptideId[]) {
  const first = peptides[0] ? peptideProfiles[peptides[0]].name : "Primary peptide";
  const second = peptides[1] ? peptideProfiles[peptides[1]].name : undefined;
  const extras = peptides.slice(2).map((id) => peptideProfiles[id].name);

  return [
    {
      phase: "Week 1-2",
      detail: `Baseline phase: begin with ${first}. Track the goal-specific metric you care about most and avoid changing multiple variables at once.`,
    },
    {
      phase: "Week 3-4",
      detail: second
        ? `Expansion phase: layer in ${second} only if the first step still fits your goal, budget, and tolerance for complexity.`
        : "Hold phase: keep the protocol simple and continue logging observations.",
    },
    {
      phase: "Month 2-3",
      detail: extras.length
        ? `Full-stack phase: consider whether ${extras.join(", ")} belongs in the protocol. Long-term additions should be driven by the original goal, not by novelty.`
        : "Review phase: decide whether to stay with the starter protocol or graduate to a more advanced stack.",
    },
  ];
}

function buildResearchNotes(answers: QuizAnswers, goal: GoalOption, isFull: boolean) {
  const notes = [
    "For research purposes only. This tool summarizes published research and educational stack ideas rather than medical treatment.",
    "Consult a qualified healthcare provider before beginning any protocol, especially if you have a medical condition, take medications, or are considering combining multiple compounds.",
    "Studies suggest potential benefits for specific goals, but outcomes vary and many peptide data sets remain preclinical or early-stage.",
    "Never interpret the ranges below as instructions. When a range is shown, it means research protocols have used that range in specific study or educational contexts.",
  ];

  if (answers.deliveryPreference === "Prefer oral/topical only") {
    notes.push("Because you selected oral/topical only, this result deprioritized injection-heavy stacks and elevated topical, oral, or intranasal options where possible.");
  }

  if (answers.timeline === "Long-term optimization (6+ months)") {
    notes.push(`Because you selected a longer timeline, the ${goal.toLowerCase()} stack includes slower-burn options that may fit a longer optimization horizon better than a quick-results goal.`);
  }

  if (isFull && answers.conditions.length && !answers.conditions.includes("None of these")) {
    notes.push(`The following intake flags shaped the stack emphasis: ${answers.conditions.join(", ")}.`);
  }

  return notes;
}

function buildWarnings(peptides: PeptideId[]) {
  return unique(
    peptides.flatMap((id) => peptideProfiles[id].warnings).concat([
      "Avoid assuming peptides with similar goals are interchangeable; mechanism, route, and evidence quality differ.",
      "If you are pregnant, breastfeeding, managing cancer, or using endocrine, psychiatric, or glucose-lowering medications, consult a qualified healthcare provider before exploring any peptide protocol.",
    ]),
  );
}

function buildCitations(peptides: PeptideId[]) {
  return unique(
    peptides.flatMap((id) => peptideProfiles[id].citations.map((citation) => `${citation.label}${citation.doi ? ` • DOI ${citation.doi}` : ""}`)),
  );
}

export function buildResult(answers: QuizAnswers, isFull: boolean): QuizResult {
  const goal = determineGoal(answers);
  const plan = basePlans[goal];

  let peptides = determineBaseStack(answers, goal);
  peptides = applyAdjustments(peptides, answers, goal);

  if (!isFull) {
    peptides = peptides.slice(0, Math.max(1, Math.min(2, peptides.length)));
  } else {
    peptides = peptides.slice(0, 4);
  }

  const resultPeptides = peptides.map((peptideId) => buildPeptideReason(goal, peptideId, answers));

  return {
    headline: isFull ? `${goal} — full personalized protocol` : `${goal} — free personalized preview`,
    summary: plan.summary,
    stackName: plan.stackName,
    peptides: resultPeptides,
    timeline: buildTimeline(goal, peptides),
    protocolCalendar: buildProtocolCalendar(peptides),
    citations: buildCitations(peptides),
    researchNotes: buildResearchNotes(answers, goal, isFull),
    interactionWarnings: buildWarnings(peptides),
    upgradeMessage: isFull
      ? undefined
      : "Get your complete personalized protocol with dosing research, stacking guide, interaction warnings, and timeline for $147.",
  };
}
