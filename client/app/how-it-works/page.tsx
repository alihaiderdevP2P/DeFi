import Link from "next/link";

const steps = [
  {
    title: "Create Campaign",
    description:
      "Set your title, story, funding goal, deadline, and hero image to launch a credible campaign page.",
  },
  {
    title: "Receive Donations",
    description:
      "Supporters connect wallets and donate directly to your campaign through transparent smart contract flows.",
  },
  {
    title: "Track Progress",
    description:
      "Monitor funding status in real time from the dashboard and keep supporters informed with updates.",
  },
  {
    title: "Withdraw Or Refund",
    description:
      "Owners can withdraw when goals are met, and refund flows are available when requirements are not met.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-8">
      <section className="app-panel p-6 md:p-8">
        <p className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
          Product Guide
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">How It Works</h1>
        <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">
          A professional crowdfunding workflow designed for transparent fundraising and
          predictable campaign operations.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <article key={step.title} className="app-panel p-5">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
              Step {index + 1}
            </p>
            <h2 className="mt-1 text-lg font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{step.description}</p>
          </article>
        ))}
      </section>

      <section className="app-panel flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="text-xl font-semibold">Ready to launch?</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Start your campaign in a few minutes.
          </p>
        </div>
        <Link href="/create" className="app-button-primary">
          Create Campaign
        </Link>
      </section>
    </div>
  );
}
