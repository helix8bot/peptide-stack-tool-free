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

type Stage = "intro" | "free" | "email" | "freeResult" | "paywall" | "full" | "fullResult";

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

const leadEndpoint = "https://services.leadconnectorhq.com/hooks/peptide-stack-free";
const fullProtocolPrice = 147;

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function totalSteps() {
  return freeQuestions.length + fullQuestions.length + 1;
}

function currentStep(stage: Stage, freeStep: number, fullStep: number) {
  if (stage === "intro") return 1;
  if (stage === "free") return freeStep + 1;
  if (stage === "email") return freeQuestions.length + 1;
  if (stage === "freeResult" || stage === "paywall") return freeQuestions.length + 1;
  if (stage === "full") return freeQuestions.length + 1 + fullStep + 1;
  return totalSteps();
}

function progressValue(stage: Stage, freeStep: number, fullStep: number) {
  return Math.min(100, Math.round((currentStep(stage, freeStep, fullStep) / totalSteps()) * 100));
}

function isFreeQuestionComplete(answers: QuizAnswers) {
  return Boolean(answers.goal && answers.experience && answers.priority);
}

function isFullQuestionAnswered(question: (typeof fullQuestions)[number], answers: QuizAnswers) {
  const value = answers[question.id as keyof QuizAnswers];
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
  const [freeStep, setFreeStep] = useState(0);
  const [fullStep, setFullStep] = useState(0);
  const [leadStatus, setLeadStatus] = useState<"idle" | "submitting" | "submitted" | "saved-locally">("idle");
  const [leadError, setLeadError] = useState("");

  const freeResult = useMemo(() => (isFreeQuestionComplete(answers) ? buildResult(answers, false) : null), [answers]);
  const fullResult = useMemo(() => buildResult(answers, true), [answers]);

  const currentFreeQuestion = freeQuestions[freeStep];
  const currentFullQuestion = fullQuestions[fullStep];
  const progress = progressValue(stage, freeStep, fullStep);
  const stepLabel = `Step ${currentStep(stage, freeStep, fullStep)} of ${totalSteps()}`;

  async function submitLead() {
    const email = answers.email.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!validEmail) {
      setLeadError("Please enter a valid email to unlock your free preview.");
      return;
    }

    setLeadError("");
    setLeadStatus("submitting");

    const payload = {
      email,
      quizType: "free-lite",
      submittedAt: new Date().toISOString(),
      answers: {
        goal: answers.goal,
        experience: answers.experience,
        priority: answers.priority,
      },
      source: "peptide-stack-tool",
    };

    try {
      await fetch(leadEndpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
      localStorage.setItem(`peptide-stack-lead:${email}`, JSON.stringify(payload));
      setLeadStatus("submitted");
    } catch {
      localStorage.setItem(`peptide-stack-lead:${email}`, JSON.stringify(payload));
      setLeadStatus("saved-locally");
    } finally {
      setStage("freeResult");
    }
  }

  function resetQuiz() {
    setAnswers(initialAnswers);
    setStage("intro");
    setFreeStep(0);
    setFullStep(0);
    setLeadStatus("idle");
    setLeadError("");
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
              <h1 className="text-3xl font-semibold tracking-tight text-[#1B2A4A] sm:text-4xl">A smarter peptide protocol builder that feels like a consult, not a generic quiz</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Warm, research-grounded, and personalized. The free preview gives you the direction. The full report gives you the complete 30/60/90 day protocol, timing notes, stack logic, and print-ready PDF.
              </p>
            </div>
            <div className="rounded-3xl border border-teal-100 bg-teal-50 px-5 py-4 text-sm text-teal-900">
              <div className="font-semibold">Join 500+ researchers using personalized protocols</div>
              <div className="mt-1 text-teal-800/80">Research-backed framework • Compliance-first language • Print-ready report</div>
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
          <div className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Free preview + full report</div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#1B2A4A] sm:text-4xl">Get a personalized peptide stack that actually matches your goal, routine, and preferences</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Whether you care about healing, hair, body composition, focus, sleep, or longevity, this tool builds a more thoughtful result around the research pathways most relevant to you.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "3 free questions + 10 full protocol questions",
              "KLOW and GLOW blend logic built into the recommendation engine",
              "Downloadable print-ready report styled like a premium consult",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-700">
                {item}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => setStage("free")} className="rounded-full bg-[#1B2A4A] px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800">
              Start free assessment
            </button>
            <button type="button" onClick={() => setStage("paywall")} className="rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              See the full $147 report
            </button>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#1B2A4A_0%,#24385e_100%)] p-6 text-white shadow-[0_24px_60px_rgba(27,42,74,0.22)] sm:p-8">
          <h3 className="text-lg font-semibold tracking-tight">What the full version includes</h3>
          <div className="mt-6 space-y-4">
            {[
              "Goal-matched peptides or blends with plain-English explanations",
              "Research-protocol dosing language with citations for every peptide shown",
              "Morning vs evening timing suggestions and interaction notes",
              "30 / 60 / 90 day protocol calendar built from your intake",
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

  function renderFreeQuestion() {
    return (
      <section className="question-card rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Free preview question {freeStep + 1} of {freeQuestions.length}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1B2A4A] sm:text-3xl">{currentFreeQuestion.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{currentFreeQuestion.subtitle}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {currentFreeQuestion.options.map((option) =>
            renderChoiceButton(option, answers[currentFreeQuestion.id] === option, () => {
              setAnswers((current) => ({ ...current, [currentFreeQuestion.id]: option }));
              if (freeStep === freeQuestions.length - 1) {
                setStage("email");
                return;
              }
              setFreeStep((value) => value + 1);
            }),
          )}
        </div>
        <div className="mt-8 flex justify-between">
          <button type="button" onClick={() => (freeStep === 0 ? setStage("intro") : setFreeStep((value) => value - 1))} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Back
          </button>
          <p className="text-sm text-slate-500">Fast to finish. Smart enough to matter.</p>
        </div>
      </section>
    );
  }

  function renderEmailGate() {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Unlock your personalized preview</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1B2A4A] sm:text-3xl">Enter your email to see your custom stack preview</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          We&apos;ll show your personalized result instantly. Your email also gets stored locally as a backup if the webhook is unavailable.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
          <input
            type="email"
            value={answers.email}
            onChange={(event) => setAnswers((current) => ({ ...current, email: event.target.value }))}
            placeholder="you@example.com"
            className="min-h-14 rounded-2xl border border-slate-300 px-4 text-base text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
          />
          <button type="button" onClick={submitLead} disabled={leadStatus === "submitting"} className="min-h-14 rounded-2xl bg-[#1B2A4A] px-6 text-base font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
            {leadStatus === "submitting" ? "Saving..." : "Show my free preview"}
          </button>
        </div>
        {leadError ? <p className="mt-3 text-sm text-rose-600">{leadError}</p> : null}
      </section>
    );
  }

  function renderPreviewUpsell() {
    return (
      <div className="print-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
          <div className="blur-sm opacity-70">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Full report preview</p>
                <h4 className="mt-2 text-lg font-semibold text-[#1B2A4A]">30 / 60 / 90 day protocol calendar</h4>
                <div className="mt-4 space-y-3 text-sm text-slate-600">
                  <div className="rounded-2xl border border-slate-200 p-3">Week 1-2: establish your primary anchor</div>
                  <div className="rounded-2xl border border-slate-200 p-3">Week 3-4: add your secondary layer</div>
                  <div className="rounded-2xl border border-slate-200 p-3">Month 2-3: complete the personalized stack</div>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Inside the full version</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                  <li>Research-protocol dosing ranges with citations</li>
                  <li>Timing suggestions for morning and evening windows</li>
                  <li>Interaction notes between compounds in your stack</li>
                  <li>Your stack vs generic comparison</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/45">
            <div className="rounded-full bg-[#1B2A4A] px-6 py-3 text-center text-sm font-semibold text-white shadow-xl sm:text-base">
              Unlock your complete personalized protocol — ${fullProtocolPrice}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function renderQuestionCard(question: (typeof fullQuestions)[number]) {
    const value = answers[question.id as keyof QuizAnswers];
    const isMulti = question.type === "multi";
    const isText = question.type === "text";

    return (
      <section className="question-card rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Full protocol question {fullStep + 1} of {fullQuestions.length}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1B2A4A] sm:text-3xl">{question.title}</h2>
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
            {question.options.map((option) => {
              const selected = isMulti
                ? Array.isArray(value) && value.includes(option as never)
                : value === option;
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
          <button type="button" onClick={() => (fullStep === 0 ? setStage("paywall") : setFullStep((value) => value - 1))} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Back
          </button>
          <button
            type="button"
            onClick={() => (fullStep === fullQuestions.length - 1 ? setStage("fullResult") : setFullStep((value) => value + 1))}
            className="rounded-full bg-[#1B2A4A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {fullStep === fullQuestions.length - 1 ? "See full report" : "Continue"}
          </button>
        </div>
      </section>
    );
  }

  function renderResult(type: "free" | "full") {
    const result = type === "free" ? freeResult : fullResult;
    if (!result) return null;

    return (
      <section className="space-y-6 report-shell">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">{type === "free" ? "Free personalized preview" : "Full personalized protocol report"}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1B2A4A] sm:text-3xl">{result.headline}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{result.summary}</p>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-700 sm:text-base">{result.reportIntro}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 lg:max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current stack</p>
              <p className="mt-2 text-lg font-semibold text-[#1B2A4A]">{result.stackName}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{routeSummary(answers.administrationPreference)}</p>
              <div className="mt-4 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800">Join 500+ researchers using personalized protocols</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#1B2A4A]">Your recommended stack</h3>
              <div className="mt-6 grid gap-4">
                {result.peptides.map((item) => {
                  const profile = peptideProfiles[item.id];
                  return (
                    <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-[#1B2A4A]">{profile.name}</h4>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{profile.whatItDoes}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#1B2A4A]">Why it made your stack:</span> {item.whyChosen}</p>
                          {type === "full" && item.dosingRange ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#1B2A4A]">Dosing range:</span> {item.dosingRange}</p> : null}
                          {type === "full" && item.protocolSummary ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#1B2A4A]">Most commonly studied research protocol:</span> {item.protocolSummary}</p> : null}
                          {type === "full" && item.frequency ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#1B2A4A]">Frequency:</span> {item.frequency}</p> : null}
                          {type === "full" && item.timingSuggestion ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#1B2A4A]">Timing:</span> {item.timingSuggestion}</p> : null}
                          {type === "full" && item.cycleLength ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#1B2A4A]">Cycle length:</span> {item.cycleLength}</p> : null}
                          {type === "full" && item.loadingPhase ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#1B2A4A]">Loading phase:</span> {item.loadingPhase}</p> : null}
                          {type === "full" && item.maintenancePhase ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#1B2A4A]">Maintenance phase:</span> {item.maintenancePhase}</p> : null}
                          {item.routeAdjustment ? <p className="mt-2 text-sm leading-6 text-teal-800">{item.routeAdjustment}</p> : null}
                          {profile.productNote ? <p className="mt-2 text-sm leading-6 text-slate-600">{profile.productNote}</p> : null}
                        </div>
                        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Research context</span>
                      </div>
                      {type === "full" ? (
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
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </div>

            {type === "full" ? (
              <>
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
                  <h3 className="text-xl font-semibold text-[#1B2A4A]">Your stack vs generic</h3>
                  <div className="mt-5 grid gap-3">
                    {result.stackVsGeneric.map((item) => (
                      <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">{item}</div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
                  <h3 className="text-xl font-semibold text-[#1B2A4A]">30 / 60 / 90 day protocol calendar</h3>
                  <div className="mt-5 grid gap-3">
                    {result.protocolCalendar.map((item) => (
                      <div key={item.phase} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
                        <p className="font-semibold text-[#1B2A4A]">{item.phase}</p>
                        <p className="mt-2">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
                  <h3 className="text-xl font-semibold text-[#1B2A4A]">Your daily protocol schedule</h3>
                  <div className="mt-5 grid gap-3">
                    {result.dailyProtocolSchedule.map((item) => (
                      <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
                        <p className="font-semibold text-[#1B2A4A]">{item.label}</p>
                        <p className="mt-2">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#1B2A4A]">Suggested rollout</h3>
              <div className="mt-5 space-y-4">
                {result.timeline.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-[#1B2A4A]">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#1B2A4A]">Research notes + compliance</h3>
              <div className="mt-5 grid gap-3">
                {result.researchNotes.map((note) => (
                  <div key={note} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">{note}</div>
                ))}
              </div>
            </div>

            {type === "full" ? (
              <>
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
                  <h3 className="text-xl font-semibold text-[#1B2A4A]">Interaction notes across the stack</h3>
                  <div className="mt-5 grid gap-3">
                    {result.interactionWarnings.map((warning) => (
                      <div key={warning} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">{warning}</div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
                  <h3 className="text-xl font-semibold text-[#1B2A4A]">PeptideLaunch education links</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                    {result.educationalLinks.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} target="_blank" rel="noreferrer" className="font-semibold text-teal-700 hover:text-teal-800">{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
                  <h3 className="text-xl font-semibold text-[#1B2A4A]">Research citations used in this report</h3>
                  <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                    {result.citations.map((citation) => <li key={citation}>{citation}</li>)}
                  </ul>
                </div>
              </>
            ) : null}

            <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f6_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#1B2A4A]">Your intake summary</h3>
              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                <p><span className="font-semibold text-[#1B2A4A]">Goal:</span> {answers.goal || "—"}</p>
                <p><span className="font-semibold text-[#1B2A4A]">Experience:</span> {answers.experience || "—"}</p>
                <p><span className="font-semibold text-[#1B2A4A]">Priority:</span> {answers.priority || "—"}</p>
                {answers.ageRange ? <p><span className="font-semibold text-[#1B2A4A]">Age range:</span> {answers.ageRange}</p> : null}
                {answers.budget ? <p><span className="font-semibold text-[#1B2A4A]">Budget:</span> {answers.budget}</p> : null}
                {answers.blendPreference ? <p><span className="font-semibold text-[#1B2A4A]">Blend preference:</span> {answers.blendPreference}</p> : null}
                {answers.administrationPreference ? <p><span className="font-semibold text-[#1B2A4A]">Administration style:</span> {answers.administrationPreference}</p> : null}
                {answers.sensitivity ? <p><span className="font-semibold text-[#1B2A4A]">Sensitivity:</span> {answers.sensitivity}</p> : null}
                {answers.timeline ? <p><span className="font-semibold text-[#1B2A4A]">Timeline:</span> {answers.timeline}</p> : null}
                {answers.conditions.length ? <p><span className="font-semibold text-[#1B2A4A]">Conditions:</span> {answers.conditions.join(", ")}</p> : null}
                {answers.lifestyleFactors.length ? <p><span className="font-semibold text-[#1B2A4A]">Lifestyle factors:</span> {answers.lifestyleFactors.join(", ")}</p> : null}
                {answers.supplementStack ? <p><span className="font-semibold text-[#1B2A4A]">Current supplements:</span> {answers.supplementStack}</p> : null}
                {answers.previousExperience ? <p><span className="font-semibold text-[#1B2A4A]">Previous peptide context:</span> {answers.previousExperience}</p> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <h3 className="text-xl font-semibold text-[#1B2A4A]">Full compliance disclaimer</h3>
          <p className="mt-4 text-sm leading-7 text-slate-700">{result.complianceDisclaimer}</p>
          <p className="mt-3 text-sm leading-7 text-slate-700">This tool compiles publicly available research for educational purposes only. It is not medical advice. Consult a qualified healthcare provider before beginning any protocol.</p>
        </div>

        {type === "free" ? renderPreviewUpsell() : null}

        <div className="print-hidden flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-semibold text-[#1B2A4A]">{type === "free" ? result.upgradeMessage : "Your report is ready to print or save as a PDF."}</p>
            <p className="mt-1 text-sm text-slate-600">
              {type === "free"
                ? leadStatus === "saved-locally"
                  ? "Webhook was unavailable, so your lead was also stored locally in this browser as a backup."
                  : "Your email was captured and your personalized preview is ready."
                : "Use the print button to save this as a PDF. The print view is styled to function as your downloadable report."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {type === "free" ? (
              <button type="button" onClick={() => { setStage("paywall"); setFullStep(0); }} className="rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700">
                Unlock full protocol — ${fullProtocolPrice}
              </button>
            ) : (
              <button type="button" onClick={handlePrint} className="rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700">
                Download PDF report
              </button>
            )}
            <button type="button" onClick={resetQuiz} className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              Start over
            </button>
          </div>
        </div>
      </section>
    );
  }

  function renderPaywall() {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Upgrade to the full report</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1B2A4A] sm:text-3xl">Unlock your complete personalized protocol for ${fullProtocolPrice}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          The full version adds 10 intake questions, blend-vs-individual logic, timing suggestions, interaction notes, stack-vs-generic comparisons, and a print-ready report you can save as a PDF.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            "Adds blend preference, administration style, sensitivity, lifestyle, supplement stack, and previous peptide context",
            "Shows research-protocol dosing language with citations for every peptide included",
            "Includes a 30/60/90 day calendar and downloadable PDF-style report",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-700">{item}</div>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => { setStage("full"); setFullStep(0); }} className="rounded-full bg-[#1B2A4A] px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800">
            Continue to the full report
          </button>
          <button type="button" onClick={() => setStage(freeResult ? "freeResult" : "intro")} className="rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50">
            Back
          </button>
        </div>
      </section>
    );
  }

  function renderFooter() {
    if (embed) return null;
    return (
      <footer className="print-hidden border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm leading-7 text-slate-600 sm:px-8 lg:px-10">
          <p>This tool compiles publicly available research for educational purposes only. It is not medical advice. Consult a qualified healthcare provider before beginning any protocol.</p>
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
            <span>{stage === "fullResult" ? "Report ready" : "Personalized as you go"}</span>
          </div>
          <div className="mt-3 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-[linear-gradient(90deg,#0D9488_0%,#1B2A4A_100%)] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {stage === "intro" ? renderIntro() : null}
        {stage === "free" ? renderFreeQuestion() : null}
        {stage === "email" ? renderEmailGate() : null}
        {stage === "freeResult" ? renderResult("free") : null}
        {stage === "paywall" ? renderPaywall() : null}
        {stage === "full" && currentFullQuestion ? renderQuestionCard(currentFullQuestion) : null}
        {stage === "fullResult" ? renderResult("full") : null}
      </main>
      {renderFooter()}
    </div>
  );
}
