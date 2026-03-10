"use client";

import { useMemo, useState } from "react";
import {
  freeQuestions,
  fullQuestions,
  peptideProfiles,
  type DeliveryPreference,
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
  deliveryPreference: "",
  timeline: "",
};

const leadEndpoint = "https://services.leadconnectorhq.com/hooks/peptide-stack-free";

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function progressValue(stage: Stage, freeStep: number, fullStep: number) {
  if (stage === "intro") return 8;
  if (stage === "free") return 12 + freeStep * 12;
  if (stage === "email") return 48;
  if (stage === "freeResult") return 58;
  if (stage === "paywall") return 64;
  if (stage === "full") return 66 + fullStep * 6;
  return 100;
}

function deliveryLabel(preference: DeliveryPreference | "") {
  if (preference === "Prefer oral/topical only") return "Oral, topical, and intranasal-first research options prioritized";
  if (preference === "Comfortable with injections") return "Injection-capable protocols included when research context supports them";
  return "Balanced route-of-administration context";
}

export function QuizWidget({ embed = false }: QuizWidgetProps) {
  const [stage, setStage] = useState<Stage>("intro");
  const [answers, setAnswers] = useState<QuizAnswers>(initialAnswers);
  const [freeStep, setFreeStep] = useState(0);
  const [fullStep, setFullStep] = useState(0);
  const [leadStatus, setLeadStatus] = useState<"idle" | "submitting" | "submitted" | "saved-locally">("idle");
  const [leadError, setLeadError] = useState("");

  const freeResult = useMemo(() => {
    if (!answers.goal || !answers.experience || !answers.priority) return null;
    return buildResult(answers, false);
  }, [answers]);

  const fullResult = useMemo(() => {
    if (
      !answers.goal ||
      !answers.experience ||
      !answers.priority ||
      !answers.ageRange ||
      !answers.budget ||
      !answers.deliveryPreference ||
      !answers.timeline
    ) {
      return null;
    }

    return buildResult(answers, true);
  }, [answers]);

  const currentFreeQuestion = freeQuestions[freeStep];
  const currentFullQuestion = fullQuestions[fullStep];
  const progress = progressValue(stage, freeStep, fullStep);

  async function submitLead() {
    const email = answers.email.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!validEmail) {
      setLeadError("Enter a valid email to unlock your free peptide preview.");
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
        headers: {
          "Content-Type": "application/json",
        },
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

  function renderChoiceButton(option: string, selected: boolean, onClick: () => void) {
    return (
      <button
        key={option}
        type="button"
        onClick={onClick}
        className={classNames(
          "min-h-20 rounded-2xl border px-4 py-4 text-left text-sm font-medium transition-all duration-300 sm:px-5 sm:text-base",
          selected
            ? "border-teal-600 bg-teal-50 text-slate-900 shadow-[0_12px_30px_rgba(13,148,136,0.12)]"
            : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]",
        )}
      >
        {option}
      </button>
    );
  }

  function renderHeader() {
    if (embed) return null;

    return (
      <header className="print-hidden border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">Peptide Stack Tool</p>
              <h1 className="text-3xl font-semibold tracking-tight text-[#1B2A4A] sm:text-4xl">Research-based peptide quiz with free preview + full protocol</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                Based on Atlas&apos;s master reference. Every recommendation is framed around published research, compliance-safe language, and goal-matched stack logic.
              </p>
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
          <div className="inline-flex rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Free Lite + $147 Full Protocol</div>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-[#1B2A4A] sm:text-4xl">Find the peptide stack that best matches your research goal</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            The free version gives you a personalized preview. The full version adds research dosing ranges, stacking sequence, protocol calendar, interaction warnings, and citations from the master reference.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "3 free questions, 5 full-upgrade questions",
              "Goal-based stacks using real peptide literature",
              "Compliance-safe research wording throughout",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-700">{item}</div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => setStage("free")} className="rounded-full bg-[#1B2A4A] px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800">
              Start free assessment
            </button>
            <button type="button" onClick={() => setStage("paywall")} className="rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
              See full protocol upgrade
            </button>
          </div>
        </div>

        <aside className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#1B2A4A_0%,#24385e_100%)] p-6 text-white shadow-[0_24px_60px_rgba(27,42,74,0.22)] sm:p-8">
          <h3 className="text-lg font-semibold tracking-tight">What you get</h3>
          <div className="mt-6 space-y-4">
            {[
              "Goal-matched peptide names and why they were chosen",
              "PubMed-style citations pulled from Atlas reference",
              "Week 1-2, Week 3-4, Month 2-3 progression",
              "Research dosing ranges and interaction warnings in full results",
              "Consult-your-provider language and RUO framing throughout",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-100">{item}</div>
            ))}
          </div>
        </aside>
      </section>
    );
  }

  function renderFreeQuestion() {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Free Lite Question {freeStep + 1} of {freeQuestions.length}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1B2A4A] sm:text-3xl">{currentFreeQuestion.title}</h2>
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
          <p className="text-sm text-slate-500">Real peptide goals. No filler questions.</p>
        </div>
      </section>
    );
  }

  function renderEmailGate() {
    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Unlock your free results</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1B2A4A] sm:text-3xl">Enter your email to see your personalized peptide preview</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          This email capture submits to the configured webhook and also stores a local backup in the browser so leads are still captured even if the external endpoint is unavailable.
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
            {leadStatus === "submitting" ? "Saving..." : "Show free results"}
          </button>
        </div>
        {leadError ? <p className="mt-3 text-sm text-rose-600">{leadError}</p> : null}
      </section>
    );
  }

  function renderResult(resultType: "free" | "full") {
    const result = resultType === "free" ? freeResult : fullResult;
    if (!result) return null;

    return (
      <section className="space-y-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">{resultType === "free" ? "Free personalized preview" : "Full personalized protocol"}</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1B2A4A] sm:text-3xl">{result.headline}</h2>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">{result.summary}</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Current stack</p>
              <p className="mt-2 text-lg font-semibold text-[#1B2A4A]">{result.stackName}</p>
              <p className="mt-1 text-sm text-slate-600">{deliveryLabel(answers.deliveryPreference)}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#1B2A4A]">Recommended peptides</h3>
              <div className="mt-6 grid gap-4">
                {result.peptides.map((item) => {
                  const profile = peptideProfiles[item.id];
                  return (
                    <article key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-[#1B2A4A]">{profile.name}</h4>
                          <p className="mt-2 text-sm leading-6 text-slate-700">{profile.whatItDoes}</p>
                          <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#1B2A4A]">Why it was chosen for you:</span> {item.whyChosen}</p>
                          {resultType === "full" && item.dosingRange ? <p className="mt-2 text-sm leading-6 text-slate-600"><span className="font-semibold text-[#1B2A4A]">Research dosing range:</span> {item.dosingRange}</p> : null}
                          {item.routeAdjustment ? <p className="mt-2 text-sm leading-6 text-teal-800">{item.routeAdjustment}</p> : null}
                          {profile.productNote ? <p className="mt-2 text-sm leading-6 text-slate-600">{profile.productNote}</p> : null}
                        </div>
                        <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Based on published research</span>
                      </div>
                      <div className="mt-5 rounded-2xl border border-white bg-white p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Citations</p>
                        <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
                          {profile.citations.map((citation) => (
                            <li key={citation.label}>{citation.label}{citation.doi ? ` • DOI ${citation.doi}` : ""}</li>
                          ))}
                        </ul>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {resultType === "full" ? (
              <>
                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
                  <h3 className="text-xl font-semibold text-[#1B2A4A]">Interaction warnings</h3>
                  <div className="mt-5 grid gap-3">
                    {result.interactionWarnings.map((warning) => (
                      <div key={warning} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">{warning}</div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
                  <h3 className="text-xl font-semibold text-[#1B2A4A]">Protocol calendar</h3>
                  <div className="mt-5 grid gap-3">
                    {result.protocolCalendar.map((item) => (
                      <div key={item.phase} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
                        <p className="font-semibold text-[#1B2A4A]">{item.phase}</p>
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
              <h3 className="text-xl font-semibold text-[#1B2A4A]">Suggested timeline</h3>
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
              <h3 className="text-xl font-semibold text-[#1B2A4A]">Compliance + research notes</h3>
              <div className="mt-5 grid gap-3">
                {result.researchNotes.map((note) => (
                  <div key={note} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">{note}</div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#1B2A4A]">Research citations used in this result</h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                {result.citations.map((citation) => <li key={citation}>{citation}</li>)}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#f8fafc_0%,#eef6f6_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
              <h3 className="text-xl font-semibold text-[#1B2A4A]">Questionnaire summary</h3>
              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                <p><span className="font-semibold text-[#1B2A4A]">Goal:</span> {answers.goal}</p>
                <p><span className="font-semibold text-[#1B2A4A]">Experience:</span> {answers.experience}</p>
                <p><span className="font-semibold text-[#1B2A4A]">Priority:</span> {answers.priority}</p>
                {answers.ageRange ? <p><span className="font-semibold text-[#1B2A4A]">Age range:</span> {answers.ageRange}</p> : null}
                {answers.budget ? <p><span className="font-semibold text-[#1B2A4A]">Budget:</span> {answers.budget}</p> : null}
                {answers.timeline ? <p><span className="font-semibold text-[#1B2A4A]">Timeline:</span> {answers.timeline}</p> : null}
                {answers.conditions.length ? <p><span className="font-semibold text-[#1B2A4A]">Flags:</span> {answers.conditions.join(", ")}</p> : null}
              </div>
            </div>
          </div>
        </div>

        <div className="print-hidden flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-sm font-semibold text-[#1B2A4A]">{resultType === "free" ? result.upgradeMessage : "Consult a qualified healthcare provider before beginning any protocol."}</p>
            <p className="mt-1 text-sm text-slate-600">
              {resultType === "free"
                ? leadStatus === "saved-locally"
                  ? "Webhook was unavailable, so the lead was also stored locally in the browser as a backup."
                  : "Your email was submitted to the configured webhook and the free result rendered immediately."
                : "For research purposes only. Studies suggest potential benefits for specific goals, but no outcome is guaranteed."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {resultType === "free" ? (
              <button type="button" onClick={() => setStage("paywall")} className="rounded-full bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700">
                Unlock full protocol for $147
              </button>
            ) : null}
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
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Upgrade to full results</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1B2A4A] sm:text-3xl">Get your complete personalized protocol for $147</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
          The full version adds the last 5 questions, research dosing ranges, protocol calendar, interaction warnings, and a more tailored stack based on budget, injection preference, symptoms, and timeline.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            "Adds age, budget, symptoms, route preference, and timeline",
            "Shows research protocols have used ranges for each peptide",
            "Includes interaction warnings and calendar sequencing",
          ].map((item) => <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm font-medium text-slate-700">{item}</div>)}
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={() => { setStage("full"); setFullStep(0); }} className="rounded-full bg-[#1B2A4A] px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-800">
            Continue to full protocol
          </button>
          <button type="button" onClick={() => setStage(freeResult ? "freeResult" : "intro")} className="rounded-full border border-slate-300 px-6 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50">
            Back
          </button>
        </div>
      </section>
    );
  }

  function renderFullQuestion() {
    if (!currentFullQuestion) return null;
    const isMultiSelect = currentFullQuestion.id === "conditions";
    const currentValue = answers[currentFullQuestion.id];

    return (
      <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Full protocol question {fullStep + 1} of {fullQuestions.length}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#1B2A4A] sm:text-3xl">{currentFullQuestion.title}</h2>
        {"description" in currentFullQuestion && currentFullQuestion.description ? <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">{currentFullQuestion.description}</p> : null}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {"options" in currentFullQuestion && currentFullQuestion.options.map((option) => {
            const selected = isMultiSelect ? Array.isArray(currentValue) && currentValue.includes(option as (typeof answers.conditions)[number]) : currentValue === option;

            return renderChoiceButton(option, selected, () => {
              if (isMultiSelect) {
                const selectedOption = option as (typeof answers.conditions)[number];
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

              setAnswers((current) => ({ ...current, [currentFullQuestion.id]: option }));
            });
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" onClick={() => (fullStep === 0 ? setStage("paywall") : setFullStep((value) => value - 1))} className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            Back
          </button>
          <button type="button" onClick={() => (fullStep === fullQuestions.length - 1 ? setStage("fullResult") : setFullStep((value) => value + 1))} className="rounded-full bg-[#1B2A4A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
            {fullStep === fullQuestions.length - 1 ? "See full results" : "Continue"}
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
          <p>Disclaimer: For research purposes only. Based on published research and educational summaries. Consult a qualified healthcare provider before beginning any protocol.</p>
        </div>
      </footer>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fbfc_0%,#eef3f8_100%)] text-slate-900">
      {renderHeader()}
      <main className={classNames("mx-auto w-full", embed ? "max-w-5xl p-4 sm:p-6" : "max-w-6xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12")}>
        <div className="print-hidden mb-6 rounded-full border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex items-center justify-between px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <span>Quiz progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-[linear-gradient(90deg,#0D9488_0%,#1B2A4A_100%)] transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {stage === "intro" ? renderIntro() : null}
        {stage === "free" ? renderFreeQuestion() : null}
        {stage === "email" ? renderEmailGate() : null}
        {stage === "freeResult" ? renderResult("free") : null}
        {stage === "paywall" ? renderPaywall() : null}
        {stage === "full" ? renderFullQuestion() : null}
        {stage === "fullResult" ? renderResult("full") : null}
      </main>
      {renderFooter()}
    </div>
  );
}
