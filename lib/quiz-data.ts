export type GoalOption =
  | "Pain & Injury Recovery"
  | "Hair Restoration & Skin Health"
  | "Body Composition & Fat Loss"
  | "Longevity & Anti-Aging"
  | "Cognitive Performance & Focus"
  | "Sleep & Recovery";

export type ExperienceOption =
  | "Brand new — I want a simple starting point"
  | "I’ve been researching and want a smarter plan"
  | "I’ve explored a few compounds already"
  | "I’m experienced and comfortable with more nuance";

export type PriorityOption =
  | "Highest-confidence research first"
  | "I want the simplest path to evaluate"
  | "I care most about convenience"
  | "I want the most complete stack my budget allows";

export type HealthCondition =
  | "Chronic joint or tendon discomfort"
  | "Hair thinning or shedding"
  | "Low energy or fatigue"
  | "Poor sleep quality"
  | "Slow workout recovery"
  | "Digestive stress or gut sensitivity"
  | "Brain fog or poor focus"
  | "Visible skin aging or texture changes"
  | "Weight management resistance"
  | "None of these";

export type AgeRangeOption = "18-30" | "31-40" | "41-50" | "51-60" | "60+";

export type BudgetOption =
  | "Under $100"
  | "$100-200"
  | "$200-350"
  | "$350-500"
  | "$500+";

export type BlendPreferenceOption =
  | "Individual peptides (maximum control)"
  | "Ready-made blends (convenience)"
  | "Mix of both"
  | "Not sure";

export type AdministrationPreferenceOption =
  | "Sublingual drops (easy, no needles)"
  | "Nasal spray (fast absorption, simple)"
  | "Topical cream/serum (targeted application)"
  | "Subcutaneous injection (highest bioavailability)"
  | "Open to any method";

export type SensitivityOption =
  | "Very sensitive (start low)"
  | "Average"
  | "High tolerance (comfortable with standard protocols)";

export type LifestyleFactor =
  | "Regular exercise (3+ days/week)"
  | "High stress"
  | "Poor sleep (<6 hours)"
  | "Sedentary work"
  | "Active job"
  | "Outdoor/sun exposure";

export type TimelineExpectation =
  | "I want a 30-day starting plan"
  | "I’m thinking in 60-90 day phases"
  | "I’m building a long-term optimization plan";

export type QuizAnswers = {
  goal: GoalOption | "";
  experience: ExperienceOption | "";
  priority: PriorityOption | "";
  email: string;
  conditions: HealthCondition[];
  ageRange: AgeRangeOption | "";
  budget: BudgetOption | "";
  blendPreference: BlendPreferenceOption | "";
  administrationPreference: AdministrationPreferenceOption | "";
  supplementStack: string;
  previousExperience: string;
  sensitivity: SensitivityOption | "";
  lifestyleFactors: LifestyleFactor[];
  timeline: TimelineExpectation | "";
};

export type Citation = {
  label: string;
  doi?: string;
};

export type PeptideId =
  | "bpc-157"
  | "tb-500"
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
  | "klow"
  | "glow"
  | "semaglutide"
  | "tirzepatide"
  | "retatrutide";

export type DailyScheduleItem = {
  period: "Morning" | "Evening" | "Flexible";
  detail: string;
  fasted?: boolean;
};

export type PeptideProfile = {
  id: PeptideId;
  name: string;
  category: "peptide" | "blend" | "cofactor";
  whatItDoes: string;
  researchDosing?: string;
  protocolSummary?: string;
  frequency?: string;
  timingSuggestion?: string;
  cycleLength?: string;
  loadingPhase?: string;
  maintenancePhase?: string;
  routeNote?: string;
  blendIngredients?: PeptideId[];
  canCombineWith?: PeptideId[];
  shouldNotCombineWith?: string[];
  dailySchedule?: DailyScheduleItem[];
  warnings: string[];
  productNote?: string;
  citations: Citation[];
};

export const freeQuestions = [
  {
    id: "goal",
    title: "What are you hoping to improve first?",
    subtitle: "The main goal helps anchor the stack around the research category most relevant to the situation described.",
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
    title: "How familiar are you with peptides right now?",
    subtitle: "Experience level helps keep the result appropriately simple, balanced, or more advanced.",
    options: [
      "Brand new — I want a simple starting point",
      "I’ve been researching and want a smarter plan",
      "I’ve explored a few compounds already",
      "I’m experienced and comfortable with more nuance",
    ] satisfies ExperienceOption[],
  },
  {
    id: "priority",
    title: "What matters most in your recommendation?",
    subtitle: "This helps the output lean toward confidence, convenience, simplicity, or a more complete stack.",
    options: [
      "Highest-confidence research first",
      "I want the simplest path to evaluate",
      "I care most about convenience",
      "I want the most complete stack my budget allows",
    ] satisfies PriorityOption[],
  },
] as const;

export const fullQuestions = [
  {
    id: "conditions",
    type: "multi" as const,
    title: "Which of these are part of the picture for you right now?",
    subtitle: "These signals help prioritize the mechanisms that deserve the most attention in the research stack.",
    options: [
      "Chronic joint or tendon discomfort",
      "Hair thinning or shedding",
      "Low energy or fatigue",
      "Poor sleep quality",
      "Slow workout recovery",
      "Digestive stress or gut sensitivity",
      "Brain fog or poor focus",
      "Visible skin aging or texture changes",
      "Weight management resistance",
      "None of these",
    ] satisfies HealthCondition[],
  },
  {
    id: "ageRange",
    type: "single" as const,
    title: "Which age range best fits you?",
    subtitle: "Age doesn’t decide everything, but it helps contextualize recovery pace, cosmetic goals, and protocol expectations.",
    options: ["18-30", "31-40", "41-50", "51-60", "60+"] satisfies AgeRangeOption[],
  },
  {
    id: "budget",
    type: "single" as const,
    title: "What monthly budget feels realistic for this research plan?",
    subtitle: "Budget context avoids a one-size-fits-all stack that looks great on paper but feels unrealistic in practice.",
    options: ["Under $100", "$100-200", "$200-350", "$350-500", "$500+"] satisfies BudgetOption[],
  },
  {
    id: "blendPreference",
    type: "single" as const,
    title: "Do you prefer individual peptides or ready-made blends?",
    subtitle: "This helps us decide whether to spotlight component-level control or convenience-first blend options like KLOW or GLOW.",
    options: [
      "Individual peptides (maximum control)",
      "Ready-made blends (convenience)",
      "Mix of both",
      "Not sure",
    ] satisfies BlendPreferenceOption[],
  },
  {
    id: "administrationPreference",
    type: "single" as const,
    title: "Which administration style feels most realistic for you?",
    subtitle: "Route matters because it changes what kinds of protocols make sense to highlight first.",
    options: [
      "Sublingual drops (easy, no needles)",
      "Nasal spray (fast absorption, simple)",
      "Topical cream/serum (targeted application)",
      "Subcutaneous injection (highest bioavailability)",
      "Open to any method",
    ] satisfies AdministrationPreferenceOption[],
  },
  {
    id: "supplementStack",
    type: "text" as const,
    title: "List any supplements you currently take",
    subtitle: "This gives us context for overlap, stacking complexity, and how conservative the protocol should feel.",
    placeholder: "Example: magnesium glycinate, omega-3s, vitamin D, collagen, creatine…",
  },
  {
    id: "previousExperience",
    type: "text" as const,
    title: "Have you explored any peptides before? Which ones, and how did they go?",
    subtitle: "Past response matters. Good recommendations should build on what your body and routine have already tolerated.",
    placeholder: "Example: researched BPC-157, tried GHK-Cu serum, didn’t like injections, felt great on nasal peptides…",
  },
  {
    id: "sensitivity",
    type: "single" as const,
    title: "How would you describe your sensitivity to new supplements or compounds?",
    subtitle: "This helps us frame a gentler ramp or a more standard protocol cadence in the report.",
    options: [
      "Very sensitive (start low)",
      "Average",
      "High tolerance (comfortable with standard protocols)",
    ] satisfies SensitivityOption[],
  },
  {
    id: "lifestyleFactors",
    type: "multi" as const,
    title: "Which lifestyle factors are most relevant right now?",
    subtitle: "These factors affect recovery, inflammation, sleep quality, skin exposure, and how aggressive a protocol should look.",
    options: [
      "Regular exercise (3+ days/week)",
      "High stress",
      "Poor sleep (<6 hours)",
      "Sedentary work",
      "Active job",
      "Outdoor/sun exposure",
    ] satisfies LifestyleFactor[],
  },
  {
    id: "timeline",
    type: "single" as const,
    title: "What kind of timeline are you planning around?",
    subtitle: "This helps the report separate a clean 30-day starting plan from a longer 60/90-day buildout.",
    options: [
      "I want a 30-day starting plan",
      "I’m thinking in 60-90 day phases",
      "I’m building a long-term optimization plan",
    ] satisfies TimelineExpectation[],
  },
] as const;

export const administrationMeta: Record<AdministrationPreferenceOption, { pros: string; cons: string }> = {
  "Sublingual drops (easy, no needles)": {
    pros: "Easy, familiar, and low-friction for beginners.",
    cons: "Not every peptide is commonly researched in this format.",
  },
  "Nasal spray (fast absorption, simple)": {
    pros: "Simple and often preferred for nootropic-style protocols.",
    cons: "Works best for a narrower set of compounds.",
  },
  "Topical cream/serum (targeted application)": {
    pros: "Great when the goal is localized skin or scalp support.",
    cons: "Not ideal for every systemic goal.",
  },
  "Subcutaneous injection (highest bioavailability)": {
    pros: "Most commonly discussed in published peptide protocol literature.",
    cons: "Highest friction if you dislike needles or complex routines.",
  },
  "Open to any method": {
    pros: "Gives the engine freedom to match the strongest fit first.",
    cons: "May surface both simple and higher-friction options.",
  },
};

export const peptideProfiles: Record<PeptideId, PeptideProfile> = {
  "bpc-157": {
    id: "bpc-157",
    name: "BPC-157",
    category: "peptide",
    whatItDoes:
      "BPC-157 is commonly studied for connective-tissue signaling, fibroblast migration, angiogenesis support, and gut-associated repair pathways in preclinical research.",
    researchDosing:
      "250-500 mcg administered once or twice daily.",
    protocolSummary:
      "The most commonly studied research protocol for BPC-157 is 250-500 mcg administered once or twice daily for 4-8 weeks. Source: Seiwerth S, et al. Curr Pharm Des. 2018;24(18):1990-2001 and internal pain-recovery protocol synthesis.",
    frequency: "Once or twice daily",
    timingSuggestion: "Most educational recovery protocols place BPC-157 in the morning fasted and again in the evening, often separated from meals.",
    cycleLength: "4-8 weeks",
    loadingPhase: "250 mcg twice daily is the common starting protocol in internal recovery materials.",
    maintenancePhase: "250 mcg once daily or every other day once the primary recovery window is complete.",
    canCombineWith: ["tb-500"],
    dailySchedule: [{ period: "Morning", detail: "250 mcg fasted; can share the same syringe with TB-500 when both are included.", fasted: true }, { period: "Evening", detail: "250 mcg 30-60 minutes before bed in twice-daily protocols." }],
    warnings: [
      "Human safety data remains limited.",
      "Angiogenesis-sensitive contexts, pregnancy, cancer history, active infection, or anticoagulation deserve extra caution.",
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
      "TB-500 is studied for cell migration, tissue remodeling, angiogenesis, and recovery signaling in musculoskeletal and wound-healing models.",
    researchDosing:
      "2-5 mg administered twice weekly during loading, then 2-5 mg once weekly for maintenance.",
    protocolSummary:
      "The most commonly studied research protocol for TB-500 is 2-5 mg administered twice weekly for 4-6 weeks, followed by 2-5 mg once weekly for another 4-6 weeks. Source: Goldstein AL, et al. Expert Opin Biol Ther. 2012;12(1):37-51 and internal pain-recovery protocol synthesis.",
    frequency: "Twice weekly loading, then once weekly maintenance",
    timingSuggestion: "Often scheduled in the evening or on designated recovery days; less meal-sensitive than GH-axis peptides.",
    cycleLength: "8-12 weeks total",
    loadingPhase: "2.5 mg twice weekly for the first 4-6 weeks.",
    maintenancePhase: "2.5 mg once weekly or every 7-10 days.",
    canCombineWith: ["bpc-157"],
    warnings: [
      "Human data is limited and much of the literature is preclinical.",
      "Use extra caution in malignancy, pregnancy, abnormal angiogenesis, or concurrent experimental immunomodulator contexts.",
    ],
    citations: [
      { label: "Goldstein AL, et al. Expert Opin Biol Ther. 2012;12(1):37-51", doi: "10.1517/14712598.2012.634793" },
      { label: "Philp D, et al. J Cell Physiol. 2007;208(1):195-200", doi: "10.1002/jcp.20687" },
      { label: "Bock-Marquette I, et al. Nature. 2004;432(7016):466-472", doi: "10.1038/nature03000" },
    ],
  },
  "ghk-cu": {
    id: "ghk-cu",
    name: "GHK-Cu",
    category: "peptide",
    whatItDoes:
      "GHK-Cu is studied for collagen remodeling, fibroblast signaling, antioxidant activity, scalp biology, and skin-quality support.",
    researchDosing:
      "1-2 mm topical serum concentration or 1-2 mg injectable research context once daily depending on route.",
    protocolSummary:
      "The most commonly studied research protocol for GHK-Cu is a once-daily scalp or skin application for 8-12 weeks, with injectable research discussions usually centered around 1-2 mg daily in short cycles. Source: Pickart L, Margolina A. Int J Mol Sci. 2018;19(7):1987 and Pickart L, et al. BioMed Res Int. 2012;2012:648108.",
    frequency: "Once daily",
    timingSuggestion: "Usually applied in the morning or evening as a consistent scalp/skin routine; topical use is not meal-sensitive.",
    cycleLength: "8-12 weeks",
    loadingPhase: "Not typically described as a loading protocol in cosmetic literature.",
    maintenancePhase: "Continue once daily 3-5 times weekly after the initial cycle if the protocol is being maintained.",
    shouldNotCombineWith: ["Avoid mixing GHK-Cu in the same syringe with growth-hormone-axis peptides because route and pH targets differ."],
    warnings: [
      "Local irritation and broader copper exposure context matter.",
      "Human intervention data remains limited outside cosmetic applications.",
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
    whatItDoes: "Tesamorelin is a synthetic GHRH analog studied clinically for GH pulse support and downstream IGF-1 effects, especially in visceral adiposity literature.",
    researchDosing:
      "2 mg once daily.",
    protocolSummary:
      "The most commonly studied research protocol for Tesamorelin is 2 mg administered once daily for 8-12 weeks, typically in a fasted or bedtime GH-axis schedule. Source: Falutz J, et al. N Engl J Med. 2007;357:2359-2370.",
    frequency: "Once daily",
    cycleLength: "8-12 weeks",
    loadingPhase: "No distinct loading phase in the core clinical literature.",
    maintenancePhase: "Continue 2 mg daily only within the studied cycle window.",
    dailySchedule: [{ period: "Evening", detail: "2 mg on an empty stomach before bed or separated from carbs." }],
    timingSuggestion: "Growth-hormone-axis research protocols are commonly studied on an empty stomach and often placed before bed or away from carbohydrate-heavy meals.",
    warnings: ["Watch IGF-1 elevation, glucose tolerance, active malignancy, pregnancy, and concurrent GH-axis compounds."],
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
    whatItDoes: "Ipamorelin is a ghrelin receptor agonist studied for amplifying growth-hormone pulses with a more selective profile than older GHRPs.",
    researchDosing:
      "200-300 mcg once daily, sometimes twice daily in advanced GH-axis protocols.",
    protocolSummary:
      "The most commonly studied research protocol for Ipamorelin is 200-300 mcg administered once daily, often before bed, for 8-12 weeks. Source: Raun K, et al. Eur J Endocrinol. 1998;139(5):552-561 and GH-axis protocol synthesis in the master reference.",
    frequency: "Once daily",
    cycleLength: "8-12 weeks",
    loadingPhase: "Commonly started at 200 mcg nightly.",
    maintenancePhase: "Maintain nightly dosing or pair with a GH-axis blend instead of adding more standalone secretagogues.",
    shouldNotCombineWith: ["Avoid stacking on top of an Ipamorelin-containing blend unless there is a deliberate override."],
    dailySchedule: [{ period: "Evening", detail: "200-300 mcg fasted before bed; can pair with CJC-1295 or Tesamorelin only when the protocol explicitly calls for GH-axis stacking." }],
    timingSuggestion: "Growth-hormone peptides are commonly researched on an empty stomach before bed or separated from meals when a cleaner GH pulse is the goal.",
    warnings: ["GH/IGF-axis effects can matter for glucose regulation, malignancy, pregnancy, and stacking with other secretagogues."],
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
    whatItDoes: "CJC-1295 is a GHRH analog studied for pituitary GH release and IGF-1 elevation, with DAC and no-DAC variants behaving differently.",
    researchDosing:
      "100-300 mcg once daily for no-DAC or 1-2 mg once weekly for DAC protocols.",
    protocolSummary:
      "The most commonly studied research protocol for CJC-1295 is 100-300 mcg administered once daily in no-DAC protocols or 1-2 mg once weekly in DAC protocols for 8-12 weeks. Source: Teichman SL, et al. J Clin Endocrinol Metab. 2006;91(3):799-805.",
    frequency: "Daily (no-DAC) or weekly (DAC)",
    cycleLength: "8-12 weeks",
    loadingPhase: "Not usually separated from maintenance beyond choosing DAC vs no-DAC.",
    maintenancePhase: "Stay within the chosen DAC/no-DAC schedule rather than layering both forms.",
    shouldNotCombineWith: ["Avoid duplicate use if a CJC-1295 + Ipamorelin blend is already in the stack."],
    dailySchedule: [{ period: "Evening", detail: "Fasted evening window for no-DAC; DAC protocols are commonly scheduled on fixed weekly days." }],
    timingSuggestion: "GH-axis stacks commonly position CJC-1295 around evening or fasting windows, though scheduling varies by DAC versus no-DAC design.",
    warnings: ["GH-axis cautions apply: glucose issues, edema context, malignancy, and overlap with other secretagogues."],
    citations: [
      { label: "Teichman SL, et al. J Clin Endocrinol Metab. 2006;91(3):799-805", doi: "10.1210/jc.2005-1532" },
      { label: "Ionescu M, Frohman LA. J Clin Endocrinol Metab. 2006;91(12):4792-4797", doi: "10.1210/jc.2006-1226" },
    ],
  },
  "aod-9604": {
    id: "aod-9604",
    name: "AOD-9604",
    category: "peptide",
    whatItDoes: "AOD-9604 is a modified hGH fragment studied for lipolysis and fat-metabolism signaling without the full anabolic GH profile.",
    researchDosing:
      "250-500 mcg once daily.",
    protocolSummary:
      "The most commonly studied research protocol for AOD-9604 is 250-500 mcg administered once daily for 8-12 weeks, commonly in a fasted morning body-composition routine. Source: Ng FM, et al. Obes Res. 2000;8(7):529-537.",
    frequency: "Once daily",
    cycleLength: "8-12 weeks",
    loadingPhase: "No distinct loading phase typically described.",
    maintenancePhase: "Continue the same daily schedule for the defined cycle only.",
    dailySchedule: [{ period: "Morning", detail: "250-500 mcg fasted earlier in the day." }],
    timingSuggestion: "Body-composition research discussions often place fragment-based protocols earlier in the day or around fasted windows, depending on the study model.",
    warnings: ["Long-term data is limited.", "Endocrine disorders, metabolic polypharmacy, pregnancy, and malignancy deserve caution."],
    citations: [
      { label: "Ng FM, et al. Obes Res. 2000;8(7):529-537" },
      { label: "Heffernan MA, et al. hGH fragment literature summaries" },
      { label: "Kemp M, et al. J Endocrinol. 2009" },
    ],
  },
  "mots-c": {
    id: "mots-c",
    name: "MOTS-C",
    category: "peptide",
    whatItDoes: "MOTS-C is a mitochondrial-derived peptide studied for AMPK activation, metabolic stress adaptation, insulin sensitivity, and exercise-mimetic signaling.",
    researchDosing:
      "5-10 mg 2-3 times weekly.",
    protocolSummary:
      "The most commonly studied research protocol for MOTS-C is 5-10 mg administered 2-3 times weekly for 4-6 weeks, usually on active days or earlier in the day. Source: Lee C, et al. Cell Metab. 2015;21(3):443-454 and Reynolds JC, et al. Cell Metab. 2021;33(4):805-815.e7.",
    frequency: "2-3 times weekly",
    cycleLength: "4-6 weeks",
    loadingPhase: "No universal loading phase; most protocols keep the same intermittent cadence throughout.",
    maintenancePhase: "Pause or reassess after the cycle rather than running continuously.",
    dailySchedule: [{ period: "Morning", detail: "5-10 mg on training or high-demand days; usually kept away from late evening." }],
    timingSuggestion: "Metabolic and mitochondrial research protocols often place MOTS-C earlier in the day or around training days rather than late evening.",
    warnings: ["Human data remains limited.", "Glucose-lowering therapies, intense training stress, pregnancy, and cachexia contexts deserve caution."],
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
    whatItDoes: "Epitalon is a synthetic tetrapeptide studied for circadian regulation, telomerase-related hypotheses, and healthy-aging exploration.",
    researchDosing:
      "5-10 mg daily in short cycles.",
    protocolSummary:
      "The most commonly studied research protocol for Epitalon is 5-10 mg administered once daily for 10-20 days, then repeated in periodic cycles. Source: Khavinson VKh, et al. Bull Exp Biol Med. 2003;135(5):509-512.",
    frequency: "Once daily in cycles",
    cycleLength: "10-20 days per cycle",
    loadingPhase: "The cycle itself functions as the primary loading period.",
    maintenancePhase: "No daily maintenance; repeat only in spaced cycles.",
    dailySchedule: [{ period: "Evening", detail: "Usually framed as a once-daily cyclical longevity protocol." }],
    timingSuggestion: "Longevity and circadian research discussions typically frame Epitalon in structured cycles rather than indefinite daily background use.",
    warnings: ["Human data is small and region-specific.", "Keep anti-aging language exploratory, not definitive."],
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
    whatItDoes: "NAD+ is a central redox cofactor studied for mitochondrial energy production, DNA repair, sirtuin activity, and cellular bioenergetics.",
    researchDosing:
      "250-500 mg 1-3 times weekly or 500-1000 mg IV-format educational equivalents depending on route.",
    protocolSummary:
      "The most commonly studied research protocol for NAD+ is route-specific, commonly framed as 250-500 mg administered 1-3 times weekly for 4-8 weeks in educational longevity protocols. Source: Yoshino J, et al. Science. 2021;372(6547):1224-1229.",
    frequency: "1-3 times weekly",
    cycleLength: "4-8 weeks",
    loadingPhase: "Some protocols start with more frequent exposure during the first 1-2 weeks.",
    maintenancePhase: "Reduce to weekly support once the initial block is complete.",
    dailySchedule: [{ period: "Morning", detail: "Earlier-day use is favored because NAD+ can feel stimulating." }],
    timingSuggestion: "Energy-support discussions often place NAD+ earlier in the day because some people report it feels more activating than evening-friendly.",
    warnings: ["Clinical use can involve flushing or nausea depending on route.", "Polypharmacy, methylation context, and cancer-metabolism discussions require care."],
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
    whatItDoes: "Selank is a tuftsin-derived peptide studied for calm-focus support, GABAergic modulation, stress resilience, and neuroimmune signaling.",
    researchDosing:
      "250-500 mcg once or twice daily intranasally.",
    protocolSummary:
      "The most commonly studied research protocol for Selank is 250-500 mcg administered once or twice daily for 10-14 days in intranasal protocols. Source: Zozulya AA, et al. Bull Exp Biol Med. 2008;146(3):334-338.",
    frequency: "Once or twice daily",
    cycleLength: "10-14 days",
    loadingPhase: "Typically begins at 250 mcg once daily.",
    maintenancePhase: "Use the lowest effective intranasal frequency for the rest of the short cycle.",
    dailySchedule: [{ period: "Morning", detail: "250-500 mcg for calm-focus support." }, { period: "Evening", detail: "Optional second dose when a calmer evening protocol is preferred." }],
    routeNote: "Often favored when someone wants a low-friction, non-injection-first cognition or calm-support option.",
    timingSuggestion: "Calm-focus protocols are commonly researched in the morning or early afternoon, while more relaxing use-cases are sometimes discussed later in the day.",
    warnings: ["Western safety data is sparse.", "Sedatives, anxiolytics, psychiatric polypharmacy, and pregnancy require caution."],
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
    whatItDoes: "Semax is an ACTH(4-10)-derived peptide studied for BDNF-related signaling, attention support, and neurotrophic activity.",
    researchDosing:
      "200-600 mcg once or twice daily intranasally.",
    protocolSummary:
      "The most commonly studied research protocol for Semax is 200-600 mcg administered once or twice daily for 10-14 days, usually earlier in the day. Source: Ashmarin IP, et al. Neurosci Behav Physiol. 1997;27(4):409-413.",
    frequency: "Once or twice daily",
    cycleLength: "10-14 days",
    loadingPhase: "Begin at the low end of the range for the first several days.",
    maintenancePhase: "Hold at the chosen dose only for the short cognitive cycle.",
    dailySchedule: [{ period: "Morning", detail: "Primary focus-oriented dose." }, { period: "Flexible", detail: "Optional second early-afternoon dose; avoid late-evening use." }],
    routeNote: "Usually introduced as an intranasal option when the goal is focus without an injection-first plan.",
    timingSuggestion: "Focus-oriented Semax research is commonly discussed earlier in the day rather than late evening.",
    warnings: ["Safety literature outside Russian clinical practice is limited.", "Stimulants, psychiatric medications, seizure history, and pregnancy require caution."],
    citations: [
      { label: "Ashmarin IP, et al. Neurosci Behav Physiol. 1997;27(4):409-413" },
      { label: "Levitskaya NG, et al. Bull Exp Biol Med. 2008;146(3):322-325" },
      { label: "Grivennikov IA, Dolotov OV. Russ J Bioorg Chem. 2007;33(6):589-598" },
    ],
  },
  klow: {
    id: "klow",
    name: "KLOW Blend",
    category: "blend",
    whatItDoes: "KLOW is a recovery-oriented blend that combines BPC-157, TB-500, GHK-Cu, and KPV for a broader healing and inflammation-support framework.",
    researchDosing:
      "500-1000 mcg daily, interpreted through the underlying BPC-157, TB-500, GHK-Cu, and KPV literature.",
    protocolSummary:
      "The most commonly studied research protocol for KLOW is 500-1000 mcg administered once daily for 4-8 weeks, while its component logic follows BPC-157 and TB-500 recovery literature. Source: internal pain-recovery protocol synthesis plus the component citations in this tool.",
    frequency: "Once daily",
    timingSuggestion: "Usually framed as a single convenience-focused recovery injection in the morning or evening.",
    cycleLength: "4-8 weeks",
    loadingPhase: "Daily use during the active recovery window.",
    maintenancePhase: "Reduce to 3-5 days weekly or discontinue once the primary recovery block ends.",
    blendIngredients: ["bpc-157", "tb-500", "ghk-cu"],
    canCombineWith: [],
    shouldNotCombineWith: ["Do not duplicate standalone BPC-157, TB-500, or GHK-Cu beside KLOW unless there is a deliberate reason to override convenience logic."],
    dailySchedule: [{ period: "Morning", detail: "Single convenience-focused recovery injection; no separate BPC-157, TB-500, or GHK-Cu needed." }],
    productNote: "KLOW blend contains BPC-157 + TB-500 + GHK-Cu + KPV. Available from research peptide suppliers.",
    warnings: ["Blend language should stay educational and tied to the component research rather than overstating direct blend-specific evidence."],
    citations: [{ label: "Component rationale drawn from BPC-157, TB-500, and GHK-Cu literature in the master reference" }],
  },
  glow: {
    id: "glow",
    name: "GLOW Blend",
    category: "blend",
    whatItDoes: "GLOW is a convenience-forward recovery and appearance blend that combines GHK-Cu, BPC-157, and TB-500.",
    researchDosing:
      "Component-equivalent dosing interpreted through the underlying GHK-Cu, BPC-157, and TB-500 literature.",
    protocolSummary:
      "GLOW is treated as a convenience-first replacement for separate GHK-Cu, BPC-157, and TB-500 discussions, using constituent literature rather than direct blend trials.",
    frequency: "Daily blend use with TB-500-equivalent weekly exposure",
    timingSuggestion: "Most convenient when used as a once-daily blend so separate GHK-Cu, BPC-157, and TB-500 vials are not needed.",
    cycleLength: "4-8 weeks",
    loadingPhase: "Daily blend use across the active cycle.",
    maintenancePhase: "Scale down once the main recovery or cosmetic-support window is complete.",
    blendIngredients: ["ghk-cu", "bpc-157", "tb-500"],
    shouldNotCombineWith: ["Do not duplicate standalone GHK-Cu, BPC-157, or TB-500 when GLOW is already in the stack."],
    dailySchedule: [{ period: "Morning", detail: "Single convenience-focused injection replacing separate GHK-Cu, BPC-157, and TB-500." }],
    productNote: "GLOW blend contains GHK-Cu + BPC-157 + TB-500, so separate GHK-Cu, BPC-157, or TB-500 is usually unnecessary. Available from research peptide suppliers.",
    warnings: ["Keep blend language cosmetic, educational, and research-oriented."],
    citations: [{ label: "Component rationale drawn from GHK-Cu, BPC-157, and TB-500 literature in the master reference" }],
  },
  semaglutide: {
    id: "semaglutide",
    name: "Semaglutide",
    category: "peptide",
    whatItDoes: "Semaglutide is a single-target GLP-1 receptor agonist — the most widely studied compound in the incretin class. It works by mimicking the GLP-1 hormone, which slows gastric emptying, reduces appetite signaling, and supports insulin sensitivity. As a single agonist, it targets one receptor pathway (GLP-1), making it the most established and well-documented entry point for incretin-based weight-management research.",
    researchDosing: "Trial- and label-based weekly titration.",
    protocolSummary: "Semaglutide protocols are titration-based and should remain tied to published label and trial context. Most research begins at low doses and titrates upward over several weeks.",
    frequency: "Weekly titration-based schedule",
    timingSuggestion: "Usually treated as a standalone weekly GLP-1 anchor. Only one incretin-class compound should be used at a time — do not stack with other GLP-1, GIP, or glucagon agonists.",
    cycleLength: "Multi-week titration",
    loadingPhase: "Start low and titrate per published study or label context.",
    maintenancePhase: "Hold at the lowest effective protocol tier under qualified supervision.",
    productNote: "Single agonist (GLP-1 only) — the most established incretin compound with the largest body of published clinical trial data. Available from research peptide suppliers.",
    warnings: ["Do not stack with other GLP-1, GIP, or incretin agonists in the same protocol — only one incretin-class compound at a time.", "GI effects, pancreatitis/gallbladder history, thyroid tumor warnings (MTC/MEN2), pregnancy, and diabetic-medication interactions require caution."],
    citations: [
      { label: "Wilding JPH, et al. N Engl J Med. 2021;384:989-1002", doi: "10.1056/NEJMoa2032183" },
      { label: "Davies M, et al. Lancet. 2021;397(10278):971-984", doi: "10.1016/S0140-6736(21)00213-0" },
    ],
  },
  tirzepatide: {
    id: "tirzepatide",
    name: "Tirzepatide",
    category: "peptide",
    whatItDoes: "Tirzepatide is a dual-target GLP-1 + GIP receptor agonist — meaning it activates two incretin pathways simultaneously. GLP-1 handles appetite suppression and gastric emptying, while GIP (glucose-dependent insulinotropic polypeptide) adds a second metabolic lever that enhances insulin sensitivity and may improve fat metabolism through different signaling. The dual mechanism is why clinical trials have shown stronger average weight-loss outcomes compared to single GLP-1 agonists alone.",
    researchDosing: "Trial- and label-based weekly titration.",
    protocolSummary: "Tirzepatide protocols are titration-based and should remain tied to published trial and label context. The dual-agonist mechanism means titration speed and tolerability may differ from single-agonist compounds.",
    frequency: "Weekly titration-based schedule",
    timingSuggestion: "Use as one incretin anchor only. The dual GLP-1 + GIP mechanism means this compound already covers two receptor pathways — adding another GLP-1 product would create dangerous overlap.",
    cycleLength: "Multi-week titration",
    loadingPhase: "Start low and titrate per published study or label context.",
    maintenancePhase: "Hold at the lowest effective protocol tier under qualified supervision.",
    productNote: "Dual agonist (GLP-1 + GIP) — activates two incretin pathways for potentially stronger metabolic effects than single-target GLP-1 compounds. Available from research peptide suppliers.",
    warnings: ["Do not stack with other GLP-1, GIP, or incretin agonists in the same protocol — only one incretin-class compound at a time.", "GI effects, pancreatitis/gallbladder history, pregnancy, and diabetic-medication interactions require caution.", "The dual-agonist mechanism may produce stronger effects and side effects compared to single GLP-1 agonists."],
    citations: [
      { label: "Jastreboff AM, et al. N Engl J Med. 2022;387:205-216", doi: "10.1056/NEJMoa2206038" },
      { label: "Frias JP, et al. N Engl J Med. 2021;385:503-515", doi: "10.1056/NEJMoa2107519" },
    ],
  },
  retatrutide: {
    id: "retatrutide",
    name: "Retatrutide",
    category: "peptide",
    whatItDoes: "Retatrutide is a triple-target GLP-1 + GIP + Glucagon receptor agonist — the most advanced incretin-class compound currently in clinical research. It activates three metabolic pathways simultaneously: GLP-1 for appetite suppression and gastric emptying, GIP for enhanced insulin sensitivity and fat metabolism, and Glucagon for direct energy expenditure and hepatic fat mobilization. The triple mechanism has shown the strongest weight-loss outcomes in early clinical trials, though the research is still earlier-stage compared to single and dual agonists.",
    researchDosing: "Trial-based weekly titration — investigational compound.",
    protocolSummary: "Retatrutide remains investigational with ongoing Phase 3 trials. All dosing context should be discussed only within published study parameters.",
    frequency: "Weekly titration-based schedule",
    timingSuggestion: "Use as one incretin anchor only. The triple GLP-1 + GIP + Glucagon mechanism covers three receptor pathways — never combine with any other incretin-class compound.",
    cycleLength: "Multi-week titration (investigational)",
    loadingPhase: "Start low and titrate only within published study context.",
    maintenancePhase: "Investigational context only — long-term maintenance data is still being collected.",
    productNote: "Triple agonist (GLP-1 + GIP + Glucagon) — the most potent incretin-class compound in current clinical research, targeting three metabolic pathways simultaneously. Available from research peptide suppliers. Earlier-stage research compared to single and dual agonists.",
    warnings: ["Do not stack with other GLP-1, GIP, or incretin agonists in the same protocol — only one incretin-class compound at a time.", "Investigational status means long-term safety data is limited.", "The triple-agonist mechanism produces the strongest metabolic effects and may carry proportionally stronger side-effect potential.", "GI effects, pancreatitis/gallbladder history, pregnancy, and diabetic-medication interactions require extra caution."],
    citations: [
      { label: "Jastreboff AM, et al. N Engl J Med. 2023;389:514-526", doi: "10.1056/NEJMoa2301972" },
      { label: "Rosenstock J, et al. Lancet. 2023;402(10401):529-544", doi: "10.1016/S0140-6736(23)01053-X" },
    ],
  },
};
