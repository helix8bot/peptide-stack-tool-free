export type GoalOption =
  | "Pain & Injury Recovery"
  | "Hair Restoration & Skin Health"
  | "Body Composition & Fat Loss"
  | "Longevity & Anti-Aging"
  | "Cognitive Performance & Focus"
  | "Sleep & Recovery";

export type ExperienceOption =
  | "Complete beginner (never used)"
  | "Done some research (haven't started)"
  | "Currently using 1-2 peptides"
  | "Experienced (used multiple protocols)";

export type PriorityOption =
  | "Strongest research backing"
  | "Fastest results timeline"
  | "Simplest protocol (fewest injections)"
  | "Best value for budget";

export type HealthCondition =
  | "Chronic joint/tendon pain"
  | "Hair thinning or loss"
  | "Low energy/fatigue"
  | "Poor sleep quality"
  | "Slow workout recovery"
  | "Gut/digestive issues"
  | "Brain fog/poor focus"
  | "Signs of aging (skin/wrinkles)"
  | "Weight management struggles"
  | "None of these";

export type AgeRangeOption = "18-30" | "31-40" | "41-50" | "51-60" | "60+";

export type BudgetOption =
  | "Under $100"
  | "$100-200"
  | "$200-350"
  | "$350-500"
  | "$500+";

export type DeliveryPreference =
  | "Comfortable with injections"
  | "Prefer oral/topical only"
  | "Open to either";

export type TimelineExpectation =
  | "Quick wins (30 days)"
  | "Moderate (60-90 days)"
  | "Long-term optimization (6+ months)";

export type QuizAnswers = {
  goal: GoalOption | "";
  experience: ExperienceOption | "";
  priority: PriorityOption | "";
  email: string;
  conditions: HealthCondition[];
  ageRange: AgeRangeOption | "";
  budget: BudgetOption | "";
  deliveryPreference: DeliveryPreference | "";
  timeline: TimelineExpectation | "";
};

export type Citation = {
  label: string;
  doi?: string;
};

export type PeptideId =
  | "bpc-157"
  | "tb-500"
  | "ss-31"
  | "ghk-cu"
  | "tesamorelin"
  | "ipamorelin"
  | "cjc-1295"
  | "aod-9604"
  | "mots-c"
  | "epitalon"
  | "nad-plus"
  | "selank"
  | "semax"
  | "dsip"
  | "klow"
  | "glow";

export type PeptideProfile = {
  id: PeptideId;
  name: string;
  category: "peptide" | "blend" | "cofactor";
  whatItDoes: string;
  researchDosing?: string;
  routeNote?: string;
  warnings: string[];
  productNote?: string;
  citations: Citation[];
};

export const freeQuestions = [
  {
    id: "goal",
    title: "What's your primary health goal?",
    options: [
      "Pain & Injury Recovery",
      "Hair Restoration & Skin Health",
      "Body Composition & Fat Loss",
      "Longevity & Anti-Aging",
      "Cognitive Performance & Focus",
      "Sleep & Recovery",
    ] satisfies GoalOption[],
  },
  {
    id: "experience",
    title: "What's your experience with peptides?",
    options: [
      "Complete beginner (never used)",
      "Done some research (haven't started)",
      "Currently using 1-2 peptides",
      "Experienced (used multiple protocols)",
    ] satisfies ExperienceOption[],
  },
  {
    id: "priority",
    title: "What matters most to you?",
    options: [
      "Strongest research backing",
      "Fastest results timeline",
      "Simplest protocol (fewest injections)",
      "Best value for budget",
    ] satisfies PriorityOption[],
  },
] as const;

export const fullQuestions = [
  {
    id: "conditions",
    title: "Select all that apply to you:",
    description: "Multi-select. This helps tailor the research stack and what gets prioritized first.",
    options: [
      "Chronic joint/tendon pain",
      "Hair thinning or loss",
      "Low energy/fatigue",
      "Poor sleep quality",
      "Slow workout recovery",
      "Gut/digestive issues",
      "Brain fog/poor focus",
      "Signs of aging (skin/wrinkles)",
      "Weight management struggles",
      "None of these",
    ] satisfies HealthCondition[],
  },
  {
    id: "ageRange",
    title: "Age range?",
    options: ["18-30", "31-40", "41-50", "51-60", "60+"] satisfies AgeRangeOption[],
  },
  {
    id: "budget",
    title: "Monthly budget for your protocol?",
    options: [
      "Under $100",
      "$100-200",
      "$200-350",
      "$350-500",
      "$500+",
    ] satisfies BudgetOption[],
  },
  {
    id: "deliveryPreference",
    title: "How do you feel about subcutaneous injections?",
    options: [
      "Comfortable with injections",
      "Prefer oral/topical only",
      "Open to either",
    ] satisfies DeliveryPreference[],
  },
  {
    id: "timeline",
    title: "What's your target timeline?",
    options: [
      "Quick wins (30 days)",
      "Moderate (60-90 days)",
      "Long-term optimization (6+ months)",
    ] satisfies TimelineExpectation[],
  },
] as const;

export const peptideProfiles: Record<PeptideId, PeptideProfile> = {
  "bpc-157": {
    id: "bpc-157",
    name: "BPC-157",
    category: "peptide",
    whatItDoes:
      "BPC-157 is a stable gastric pentadecapeptide studied for angiogenesis signaling, fibroblast migration, tendon and ligament healing, and gut-support pathways in preclinical models.",
    researchDosing:
      "Published and internal research summaries commonly reference preclinical dosing around 10 mcg/kg, with educational human-equivalent ranges often discussed around 200-500 mcg/day depending on route and context.",
    routeNote:
      "Injection-averse users often ask about oral BPC-157, but route comparisons should stay framed as research-context only.",
    warnings: [
      "Human safety data is limited.",
      "Use caution in angiogenesis-sensitive settings, pregnancy, cancer history, anticoagulation, or active infection contexts.",
    ],
    citations: [
      { label: "Seiwerth S, et al. Curr Pharm Des. 2018;24(18):1990-2001", doi: "10.2174/1381612824666180412144511" },
      { label: "Sikiric P, et al. Curr Pharm Des. 2020;26(25):2979-3007", doi: "10.2174/1381612826666200219161658" },
      { label: "Chang CH, et al. J Appl Physiol. 2011;110(3):774-780", doi: "10.1152/japplphysiol.00945.2010" },
    ],
  },
  "tb-500": {
    id: "tb-500",
    name: "TB-500",
    category: "peptide",
    whatItDoes:
      "TB-500 is a thymosin beta-4 fragment studied for actin binding, cell migration, angiogenesis, matrix remodeling, and wound-healing support in preclinical models.",
    researchDosing:
      "Research-oriented summaries often discuss 2-10 mg/week experimental contexts, with common educational references around 2-5 mg twice weekly during early loading periods.",
    warnings: [
      "Limited human data.",
      "Use caution around malignancy, pregnancy, abnormal angiogenesis, or concurrent experimental immunomodulators.",
    ],
    citations: [
      { label: "Goldstein AL, et al. Expert Opin Biol Ther. 2012;12(1):37-51", doi: "10.1517/14712598.2012.634793" },
      { label: "Philp D, et al. J Cell Physiol. 2007;208(1):195-200", doi: "10.1002/jcp.20687" },
      { label: "Bock-Marquette I, et al. Nature. 2004;432(7016):466-472", doi: "10.1038/nature03000" },
    ],
  },
  "ss-31": {
    id: "ss-31",
    name: "SS-31 (Elamipretide)",
    category: "peptide",
    whatItDoes:
      "SS-31 is a mitochondria-targeted tetrapeptide studied for cardiolipin binding, electron transport efficiency, ROS reduction, and mitochondrial membrane stabilization.",
    warnings: [
      "Investigational context only.",
      "Pregnancy, cancer, and interaction data remain limited.",
    ],
    citations: [
      { label: "Szeto HH. Pharm Res. 2014;31(8):1961-1969", doi: "10.1007/s11095-013-1226-7" },
      { label: "Daubert MA, et al. Circ Heart Fail. 2017;10(12):e004389", doi: "10.1161/CIRCHEARTFAILURE.117.004389" },
      { label: "Karaa A, et al. Genet Med. 2018;20(12):1594-1602", doi: "10.1038/gim.2018.35" },
    ],
  },
  "ghk-cu": {
    id: "ghk-cu",
    name: "GHK-Cu",
    category: "peptide",
    whatItDoes:
      "GHK-Cu is an endogenous copper-binding tripeptide studied for collagen and elastin remodeling, fibroblast signaling, antioxidant effects, and hair and skin biology.",
    routeNote:
      "For injection-averse users, topical/cosmetic-context education is usually the first discussion point.",
    warnings: [
      "Topical irritation and copper exposure context should be considered.",
      "Human intervention data is limited outside cosmetic applications.",
    ],
    citations: [
      { label: "Pickart L, Margolina A. Int J Mol Sci. 2018;19(7):1987", doi: "10.3390/ijms19071987" },
      { label: "Pickart L, et al. BioMed Res Int. 2012;2012:648108", doi: "10.1155/2012/648108" },
      { label: "Pickart L, et al. BioMed Res Int. 2014;2014:151479", doi: "10.1155/2014/151479" },
    ],
  },
  tesamorelin: {
    id: "tesamorelin",
    name: "Tesamorelin",
    category: "peptide",
    whatItDoes:
      "Tesamorelin is a synthetic GHRH analog studied clinically for pulsatile GH release and downstream IGF-1 effects, with the best-established literature in visceral adiposity settings.",
    researchDosing:
      "Most clinical literature centers on 2 mg once daily in approved-use studies, while research summaries sometimes frame a broader 1-2 mg/day discussion.",
    warnings: [
      "Watch IGF-1 elevation, glucose intolerance, active malignancy, pregnancy, and concurrent GH-axis agents.",
    ],
    citations: [
      { label: "Falutz J, et al. N Engl J Med. 2007;357:2359-2370", doi: "10.1056/NEJMoa064318" },
      { label: "Stanley TL, Grinspoon SK. Expert Opin Pharmacother. 2012;13(14):2155-2166", doi: "10.1517/14656566.2012.717851" },
      { label: "Koutkia P, et al. Clin Infect Dis. 2010;50(5):729-735", doi: "10.1086/650534" },
    ],
  },
  ipamorelin: {
    id: "ipamorelin",
    name: "Ipamorelin",
    category: "peptide",
    whatItDoes:
      "Ipamorelin is a selective ghrelin receptor agonist studied for growth hormone pulse amplification with relatively minimal cortisol and prolactin activity compared with older GHRPs.",
    warnings: [
      "GH/IGF-axis effects can matter for glucose regulation, malignancy, pregnancy, and stacking with other secretagogues.",
    ],
    citations: [
      { label: "Raun K, et al. Eur J Endocrinol. 1998;139(5):552-561", doi: "10.1530/eje.0.1390552" },
      { label: "Gobburu JV, et al. Pharm Res. 1999;16(9):1412-1416", doi: "10.1023/A:1011947611357" },
      { label: "Johansen PB, et al. Growth Horm IGF Res. 1999;9(2):106-113", doi: "10.1054/ghir.1999.0090" },
    ],
  },
  "cjc-1295": {
    id: "cjc-1295",
    name: "CJC-1295",
    category: "peptide",
    whatItDoes:
      "CJC-1295 is a GHRH analog studied for pituitary GH release and IGF-1 elevation, with DAC and no-DAC variants carrying different kinetics.",
    warnings: [
      "Same GH-axis cautions apply: glucose issues, edema/carpal tunnel context, malignancy, and stacking with other secretagogues.",
    ],
    citations: [
      { label: "Teichman SL, et al. J Clin Endocrinol Metab. 2006;91(3):799-805", doi: "10.1210/jc.2005-1532" },
      { label: "Ionescu M, Frohman LA. J Clin Endocrinol Metab. 2006;91(12):4792-4797", doi: "10.1210/jc.2006-1226" },
    ],
  },
  "aod-9604": {
    id: "aod-9604",
    name: "AOD-9604",
    category: "peptide",
    whatItDoes:
      "AOD-9604 is a modified hGH fragment studied for lipolysis and fat-metabolism signaling without the full anabolic profile of growth hormone.",
    warnings: [
      "Long-term safety data is limited.",
      "Use caution in endocrine disorders, metabolic polypharmacy, pregnancy, and malignancy contexts.",
    ],
    citations: [
      { label: "Ng FM, et al. Obes Res. 2000;8(7):529-537" },
      { label: "Heffernan MA, et al. obesity literature on hGH fragment 176-191" },
      { label: "Kemp M, et al. J Endocrinol. 2009" },
    ],
  },
  "mots-c": {
    id: "mots-c",
    name: "MOTS-C",
    category: "peptide",
    whatItDoes:
      "MOTS-C is a mitochondrial-derived peptide studied for AMPK activation, metabolic stress adaptation, insulin sensitivity, and exercise-mimetic signaling.",
    researchDosing:
      "Human exploratory literature is limited, but educational summaries commonly discuss 5-10 mg research contexts in longevity circles.",
    warnings: [
      "Human data is limited.",
      "Use caution around glucose-lowering therapies, intense training stress, pregnancy, and cachexia contexts.",
    ],
    citations: [
      { label: "Lee C, et al. Cell Metab. 2015;21(3):443-454", doi: "10.1016/j.cmet.2015.02.009" },
      { label: "Reynolds JC, et al. Cell Metab. 2021;33(4):805-815.e7", doi: "10.1016/j.cmet.2021.03.001" },
      { label: "Kim KH, et al. Proc Natl Acad Sci USA. 2018;115(48):12375-12380", doi: "10.1073/pnas.1811989115" },
    ],
  },
  epitalon: {
    id: "epitalon",
    name: "Epitalon",
    category: "peptide",
    whatItDoes:
      "Epitalon is a synthetic tetrapeptide studied for telomerase activity, circadian regulation, pineal signaling, and healthy-aging hypotheses.",
    warnings: [
      "Human data remains small and region-specific.",
      "Avoid strong anti-aging claims and keep this firmly exploratory.",
    ],
    citations: [
      { label: "Khavinson VKh, et al. Bull Exp Biol Med. 2003;135(5):509-512" },
      { label: "Khavinson V, et al. Neuro Endocrinol Lett. 2002;23 Suppl 1:44-47" },
      { label: "Anisimov VN, et al. Exp Gerontol. 2003;38(1-2):41-46", doi: "10.1016/S0531-5565(02)00174-0" },
    ],
  },
  "nad-plus": {
    id: "nad-plus",
    name: "NAD+",
    category: "cofactor",
    whatItDoes:
      "NAD+ is a central redox cofactor studied in mitochondrial energy production, DNA repair, sirtuin and PARP biology, and aging-related bioenergetics.",
    warnings: [
      "Clinical use can involve flushing or nausea depending on route.",
      "Use caution around methylation support context, polypharmacy, and cancer-metabolism discussions.",
    ],
    citations: [
      { label: "Yoshino J, et al. Science. 2021;372(6547):1224-1229", doi: "10.1126/science.abe9985" },
      { label: "Rajman L, Chwalek K, Sinclair DA. Cell Metab. 2018;27(3):529-547", doi: "10.1016/j.cmet.2018.02.011" },
      { label: "Covarrubias AJ, et al. Nat Rev Mol Cell Biol. 2021;22:119-141", doi: "10.1038/s41580-020-00313-x" },
    ],
  },
  selank: {
    id: "selank",
    name: "Selank",
    category: "peptide",
    whatItDoes:
      "Selank is a tuftsin-derived peptide studied for GABAergic modulation, stress resilience, immune-neuro interaction, and calm-focus effects in preclinical and Russian clinical literature.",
    researchDosing:
      "Research discussions often reference intranasal use around 250-500 mcg, though protocol details vary and should remain educational only.",
    routeNote:
      "Selank is often favored when someone prefers intranasal, non-injection-first research options.",
    warnings: [
      "Western safety data is sparse.",
      "Use caution with sedatives, anxiolytics, psychiatric polypharmacy, and pregnancy.",
    ],
    citations: [
      { label: "Zozulya AA, et al. Bull Exp Biol Med. 2008;146(3):334-338" },
      { label: "Andreeva LA, et al. Neurosci Behav Physiol. 2010;40(7):745-748" },
      { label: "Volkova A, et al. Bull Exp Biol Med. 2016;161(4):470-473" },
    ],
  },
  semax: {
    id: "semax",
    name: "Semax",
    category: "peptide",
    whatItDoes:
      "Semax is an ACTH(4-10)-derived peptide studied for neurotrophic signaling, BDNF modulation, attention and focus, and stress adaptation.",
    researchDosing:
      "Research discussions often reference intranasal 200-600 mcg contexts, but published protocols vary and should stay study-tethered only.",
    routeNote:
      "Semax is commonly positioned as an intranasal option when injections are not preferred.",
    warnings: [
      "Safety literature is limited outside Russian clinical practice.",
      "Use caution with stimulants, psychiatric medications, seizure history, and pregnancy.",
    ],
    citations: [
      { label: "Ashmarin IP, et al. Neurosci Behav Physiol. 1997;27(4):409-413" },
      { label: "Levitskaya NG, et al. Bull Exp Biol Med. 2008;146(3):322-325" },
      { label: "Grivennikov IA, Dolotov OV. Russ J Bioorg Chem. 2007;33(6):589-598" },
    ],
  },
  dsip: {
    id: "dsip",
    name: "DSIP",
    category: "peptide",
    whatItDoes:
      "DSIP is a sleep-related peptide sometimes discussed in recovery circles, but the evidence base remains limited compared with other tools in this quiz.",
    warnings: ["Keep DSIP clearly contextual because the literature support is thin."],
    citations: [{ label: "Limited literature support in the master reference; contextual only" }],
  },
  klow: {
    id: "klow",
    name: "KLOW Blend",
    category: "blend",
    whatItDoes:
      "KLOW is an internal blend concept that combines BPC-157, TB-500, GHK-Cu, and KPV for multi-pathway recovery positioning.",
    productNote: "Our product note: KLOW blend ($175) contains BPC-157 + TB-500 + GHK-Cu + KPV.",
    warnings: ["Blend language should stay educational and anchored to the underlying component literature."],
    citations: [
      { label: "BPC-157, TB-500, and GHK-Cu literature from the master reference support the blend rationale" },
    ],
  },
  glow: {
    id: "glow",
    name: "GLOW Blend",
    category: "blend",
    whatItDoes:
      "GLOW is a GHK-Cu-driven internal hair and skin support concept used to organize cosmetic and follicle-support research discussion.",
    productNote: "Our product note: GLOW blend is positioned around GHK-Cu-led hair and skin support education.",
    warnings: ["Keep blend language cosmetic/research-oriented and avoid treatment claims."],
    citations: [{ label: "Pickart GHK-Cu literature underpins the blend rationale" }],
  },
};
