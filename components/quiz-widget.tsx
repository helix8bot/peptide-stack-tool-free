"use client";

import { useMemo, useState } from "react";
import {
  administrationMeta,
  freeQuestions,
  fullQuestions,
  peptideProfiles,
  type AdministrationPreferenceOption,
  type QuizAnswers,
} from "@/lib/quiz-data";
import { buildResult } from "@/lib/recommendations";

type QuizWidgetProps = {
  embed?: boolean;
};

type Stage = "intro" | "questions" | "result";

const initialAnswers: QuizAnswers = {
  goal: "",
  experience: "",
  priority: "",
  email: "",
  conditions: [],
  ageRange: "",
  budget: "",
  blendPreference: "",
  administrationPreference: "",
  supplementStack: "",
  previousExperience: "",
  sensitivity: "",
  lifestyleFactors: [],
  timeline: "",
};

const allQuestions = [...freeQuestions, ...fullQuestions];

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function totalSteps() {
  return allQuestions.length + 1;
}

function currentStep(stage: Stage, step: number) {
  if (stage === "intro") return 1;
  if (stage === "questions") return step + 2;
  return totalSteps();
}

function progressValue(stage: Stage, step: number) {
  return Math.min(100, Math.round((currentStep(stage, step) / totalSteps()) * 100));
}

function isQuestionAnswered(question: (typeof allQuestions)[number], answers: QuizAnswers) {
  const value = answers[question.id as keyof QuizAnswers];
  if (!("type" in question)) return Boolean(value);
  if (question.type === "text") return typeof value === "string";
  if (question.type === "multi") return Array.isArray(value) && (question.id === "lifestyleFactors" ? true : value.length > 0);
  return Boolean(value);
}

function routeSummary(preference: AdministrationPreferenceOption | "") {
  if (!preference) return "Administration style not selected yet";
  const meta = administrationMeta[preference];
  return `${preference} — Pro: ${meta.pros} Con: ${meta.cons}`;
}

function handlePrint() {
  window.print();
}

export function QuizWidget({ embed = false }: QuizWidgetProps) {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [step, setStep] = useState(0);

  const result = useMemo(() => buildResult(answers, true), [answers]);
  const currentQuestion = allQuestions[step];
  const progress = progressValue(stage, step);
  const stepLabel = `Step ${currentStep(stage, step)} of ${totalSteps()}`;

  function resetQuiz() {
    setAnswers(initialAnswers);
    setStage("intro");
    setStep(0);
  }

  function renderChoiceButton(option: string, selected: boolean, onClick: () => void, detail?: string) {
    return (
      <button
        key={option}
        type="button"
        onClick={onClick}
        className={classNames(
          "min-h-24 rounded-[1.5rem] border px-4 py-4 text-left transition-all duration-300 sm:px-5",
          selected
            ? "border-teal-600 bg-teal-50 text-slate-900 shadow-[0_12px_30px_rgba(13,148,136,0.12)]"
            : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]",
        )}
      >
        <div className="text-sm font-semibold sm:text-base">{option}</div>
        {detail ? <div className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">{detail}</div> : null}
      </button>
    );
  }

  function renderHeader() {
    if (embed) return null;

    return (
      <header className="print-hidden border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-6 sm:px-8 lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">Peptide Stack Tool</p>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-semibold tracking-tight text-[#0B1426] sm:text-4xl">A smarter peptide research stack builder — educational, not a generic quiz</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Warm, research-grounded, and personalized. Answer the full intake once and get the complete report instantly — with stack logic, timing notes, citations, and a print-ready PDF.
              </p>
            </div>
            <div className="rounded-3xl border border-teal-100 bg-teal-50 px-5 py-4 text-sm text-teal-900">
              <div className="font-semibold">Unlimited access • Full report included</div>
              <div className="mt-1 text-teal-800/80">Research-backed framework • Compliance-first language • Print-ready PDF</div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  function renderIntro() {
    return (
      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Full access included</div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#0B1426] sm:text-4xl">Get a research-backed peptide stack report matched to your goal, routine, and preferences</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Whether you care about healing, hair, body composition, focus, sleep, or longevity, this tool builds a more thoughtful result around the research pathways most relevant to you.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "13-question intake with full report unlocked",
              "Blend dedup logic for KLOW and GLOW",
              "Single-GLP-1 enforcement for weight-loss stacks",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => setStage("questions")} className="rounded-full bg-[#0B1426] px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800">
              Start assessment
            </button>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#0B1426_0%,#24385e_100%)] p-6 text-white shadow-[0_24px_60px_rgba(27,42,74,0.22)] sm:p-8">
          <h3 className="text-lg font-semibold tracking-tight">What you get</h3>
          <div className="mt-6 space-y-4">
            {[
              "Goal-matched peptides or blends with plain-English explanations",
              "Research-protocol dosing language with citations for every peptide shown",
              "Morning vs evening timing suggestions and interaction notes",
              "30 / 60 / 90 day research protocol calendar built from the intake",
              "A print-ready PDF-style report you can save immediately",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-100">
                {item}
              </div>
            ))}
          </div>
        </aside>
      </section>
    );
  }

  function renderQuestionCard(question: (typeof allQuestions)[number]) {
    const value = answers[question.id as keyof QuizAnswers];
    const isSimple = !("type" in question);
    const isMulti = !isSimple && question.type === "multi";
    const isText = !isSimple && question.type === "text";

    return (
      <section className="question-card rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Assessment question {step + 1} of {allQuestions.length}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0B1426] sm:text-3xl">{question.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{question.subtitle}</p>

        {isText ? (
          <div className="mt-8">
            <textarea
              value={String(value ?? "")}
              onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
              placeholder={question.placeholder}
              rows={5}
              className="min-h-40 w-full rounded-[1.5rem] border border-slate-300 px-4 py-4 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {("options" in question ? question.options : []).map((option) => {
              const selected = isMulti ? Array.isArray(value) && value.includes(option as never) : value === option;
              const detail = question.id === "administrationPreference" ? `${administrationMeta[option as AdministrationPreferenceOption].pros} ${administrationMeta[option as AdministrationPreferenceOption].cons}` : undefined;

              return renderChoiceButton(option, selected, () => {
                if (question.id === "conditions") {
                  const selectedOption = option as QuizAnswers["conditions"][number];
                  setAnswers((current) => {
                    const currentSelections = current.conditions;
                    let nextSelections = currentSelections.includes(selectedOption)
                      ? currentSelections.filter((item) => item !== selectedOption)
                      : [...currentSelections, selectedOption];
                    if (selectedOption === "None of these") nextSelections = ["None of these"];
                    else nextSelections = nextSelections.filter((item) => item !== "None of these");
                    return { ...current, conditions: nextSelections };
                  });
                  return;
                }

                if (question.id === "lifestyleFactors") {
                  const selectedOption = option as QuizAnswers["lifestyleFactors"][number];
                  setAnswers((current) => {
                    const currentSelections = current.lifestyleFactors;
                    const nextSelections = currentSelections.includes(selectedOption)
                      ? currentSelections.filter((item) => item !== selectedOption)
                      : [...currentSelections, selectedOption];
                    return { ...current, lifestyleFactors: nextSelections };
                  });
                  return;
                }

                setAnswers((current) => ({ ...current, [question.id]: option }));
              }, detail);
            })}
          </div>
        )}

        {question.id === "administrationPreference" && answers.administrationPreference ? (
          <div className="mt-5 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-4 text-sm leading-6 text-teal-900">
            {routeSummary(answers.administrationPreference)}
          </div>
        ) : null}

        {question.id === "lifestyleFactors" ? (
          <p className="mt-4 text-sm text-slate-500">Multi-select if needed. Leaving this blank is okay.</p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => (step === 0 ? setStage("intro") : setStep((value) => value - 1))} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Back
          </button>
          <button
            type="button"
            disabled={!isQuestionAnswered(question, answers)}
            onClick={() => (step === allQuestions.length - 1 ? setStage("result") : setStep((value) => value + 1))}
            className="rounded-full bg-[#0B1426] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step === allQuestions.length - 1 ? "See full report" : "Continue"}
          </button>
        </div>
      </section>
    );
  }

  function renderResult() {
    return (
      <section className="space-y-6 report-shell">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Full research-based stack report</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#0B1426] sm:text-3xl">{result.headline}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{result.summary}</p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">{result.reportIntro}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 lg:max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current stack</p>
              <p className="mt-2 text-lg font-semibold text-[#0B1426]">{result.stackName}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{routeSummary(answers.administrationPreference)}</p>
              <div className="mt-4 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">Unlimited access unlocked</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#0B1426]">Recommended research stack</h3>
              <div className="mt-6 grid gap-4">
                {result.peptides.map((item) => {
                  const profile = peptideProfiles[item.id];
                  return (
                    <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-[#0B1426]">{profile.name}</h4>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{profile.whatItDoes}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#0B1426]">Why it made your stack:</span> {item.whyChosen}</p>
                          {item.dosingRange ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#0B1426]">Dosing range:</span> {item.dosingRange}</p> : null}
                          {item.protocolSummary ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#0B1426]">Most commonly studied research protocol:</span> {item.protocolSummary}</p> : null}
                          {item.frequency ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#0B1426]">Frequency:</span> {item.frequency}</p> : null}
                          {item.timingSuggestion ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#0B1426]">Timing:</span> {item.timingSuggestion}</p> : null}
                          {item.cycleLength ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#0B1426]">Cycle length:</span> {item.cycleLength}</p> : null}
                          {item.loadingPhase ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#0B1426]">Loading phase:</span> {item.loadingPhase}</p> : null}
                          {item.maintenancePhase ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#0B1426]">Maintenance phase:</span> {item.maintenancePhase}</p> : null}
                          {item.routeAdjustment ? <p className="mt-2 text-sm leading-6 text-teal-800">{item.routeAdjustment}</p> : null}
                          {profile.productNote ? <p className="mt-2 text-sm leading-6 text-slate-600">{profile.productNote}</p> : null}
                        </div>
                        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Research context</span>
                      </div>
                      <div className="mt-5 grid gap-4 lg:grid-cols-2">
                        <div className="rounded-2xl border border-white bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Interaction notes</p>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                            {item.interactionNotes.map((note) => <li key={note}>{note}</li>)}
                          </ul>
                        </div>
                        <div className="rounded-2xl border border-white bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Citations</p>
                          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                            {profile.citations.map((citation) => <li key={citation.label}>{citation.label}{citation.doi ? ` • DOI ${citation.doi}` : ""}</li>)}
                          </ul>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {[{ title: "This stack vs generic results", items: result.stackVsGeneric }, { title: "Research notes + compliance", items: result.researchNotes }, { title: "Interaction notes across the stack", items: result.interactionWarnings }].map((section) => (
              <div key={section.title} className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
                <h3 className="text-xl font-semibold text-[#0B1426]">{section.title}</h3>
                <div className="mt-5 grid gap-3">
                  {section.items.map((item) => (
                    <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">{item}</div>
                  ))}
                </div>
              </div>
            ))}

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#0B1426]">30 / 60 / 90 day protocol calendar</h3>
              <div className="mt-5 grid gap-3">
                {result.protocolCalendar.map((item) => (
                  <div key={item.phase} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
                    <p className="font-semibold text-[#0B1426]">{item.phase}</p>
                    <p className="mt-2">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#0B1426]">Suggested rollout</h3>
              <div className="mt-5 space-y-4">
                {result.timeline.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-[#0B1426]">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#0B1426]">Daily research protocol schedule</h3>
              <div className="mt-5 grid gap-3">
                {result.dailyProtocolSchedule.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
                    <p className="font-semibold text-[#0B1426]">{item.label}</p>
                    <p className="mt-2">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#0B1426]">PeptideLaunch education links</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {result.educationalLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noreferrer" className="font-semibold text-teal-700 hover:text-teal-800">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f6_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#0B1426]">Intake summary</h3>
              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                <p><span className="font-semibold text-[#0B1426]">Goal:</span> {answers.goal || "—"}</p>
                <p><span className="font-semibold text-[#0B1426]">Experience:</span> {answers.experience || "—"}</p>
                <p><span className="font-semibold text-[#0B1426]">Priority:</span> {answers.priority || "—"}</p>
                {answers.ageRange ? <p><span className="font-semibold text-[#0B1426]">Age range:</span> {answers.ageRange}</p> : null}
                {answers.budget ? <p><span className="font-semibold text-[#0B1426]">Budget:</span> {answers.budget}</p> : null}
                {answers.blendPreference ? <p><span className="font-semibold text-[#0B1426]">Blend preference:</span> {answers.blendPreference}</p> : null}
                {answers.administrationPreference ? <p><span className="font-semibold text-[#0B1426]">Administration style:</span> {answers.administrationPreference}</p> : null}
                {answers.sensitivity ? <p><span className="font-semibold text-[#0B1426]">Sensitivity:</span> {answers.sensitivity}</p> : null}
                {answers.timeline ? <p><span className="font-semibold text-[#0B1426]">Timeline:</span> {answers.timeline}</p> : null}
                {answers.conditions.length ? <p><span className="font-semibold text-[#0B1426]">Conditions:</span> {answers.conditions.join(", ")}</p> : null}
                {answers.lifestyleFactors.length ? <p><span className="font-semibold text-[#0B1426]">Lifestyle factors:</span> {answers.lifestyleFactors.join(", ")}</p> : null}
                {answers.supplementStack ? <p><span className="font-semibold text-[#0B1426]">Current supplements:</span> {answers.supplementStack}</p> : null}
                {answers.previousExperience ? <p><span className="font-semibold text-[#0B1426]">Previous peptide context:</span> {answers.previousExperience}</p> : null}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#0B1426]">Research citations used in this report</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {result.citations.map((citation) => <li key={citation}>{citation}</li>)}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <h3 className="text-xl font-semibold text-[#0B1426]">Full compliance disclaimer</h3>
          <p className="mt-4 text-sm leading-7 text-slate-700">{result.complianceDisclaimer}</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">This tool compiles publicly available research for educational purposes only. It is not medical advice. Consult a qualified healthcare provider before beginning any protocol.</p>
        </div>

        <div className="print-hidden flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-semibold text-[#0B1426]">The report is ready to print or save as a PDF.</p>
            <p className="mt-1 text-sm text-slate-600">Use the print button to save this as a PDF. The print view is styled as a downloadable research report.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={handlePrint} className="rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700">
              Download PDF report
            </button>
            <button type="button" onClick={resetQuiz} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Start over
            </button>
          </div>
        </div>
      </section>
    );
  }

  function renderFooter() {
    if (embed) return null;
    return (
      <footer className="print-hidden border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm leading-7 text-slate-600 sm:px-8 lg:px-10">
          <p>This tool compiles publicly available research for educational purposes only. It is not medical advice. Consult a qualified healthcare provider before beginning any protocol.</p>
          <p className="text-slate-500">Powered by PeptideLaunch | peptidelaunch.com</p>
        </div>
      </footer>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfc_0%,#eef3f8_100%)] text-slate-900">
      {renderHeader()}
      <main className={classNames("mx-auto w-full", embed ? "max-w-5xl p-4 sm:p-6" : "max-w-6xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12")}>
        <div className="print-hidden mb-6 rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:text-sm">
            <span>Quiz progress</span>
            <span>{stepLabel}</span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-4 text-sm text-slate-500">
            <span>{progress}% complete</span>
            <span>{stage === "result" ? "Report ready" : "Personalized as you go"}</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-[linear-gradient(90deg,#0D9488_0%,#0B1426_100%)] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {stage === "intro" ? renderIntro() : null}
        {stage === "questions" && currentQuestion ? renderQuestionCard(currentQuestion) : null}
        {stage === "result" ? renderResult() : null}
      </main>
      {renderFooter()}
    </div>
  );
}
