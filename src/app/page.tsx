import Link from "next/link";

const games = [
  {
    id: "nba-2k26",
    title: "NBA 2K26",
    tools: [
      {
        name: "Build Planner",
        description:
          "Input your MyPLAYER build and get auto-computed max potentials, badge eligibility, VC upgrade suggestions, and cap breaker optimization.",
        href: "/build",
        cta: "Start Building",
        features: [
          "Auto max potentials from height, weight, wingspan, and position",
          "43 badges with Bronze through Legend tier requirements",
          "VC optimizer ranked by badge impact per VC spent",
          "Cap breaker allocation plans with specialization constraints",
        ],
      },
    ],
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col px-4 py-16">
      <h1 className="mb-4 text-4xl font-bold text-accent">BurgBuild</h1>
      <p className="mb-12 text-lg text-muted">
        Tools and guides for the games we play.
      </p>

      {games.map((game) => (
        <section key={game.id} className="mb-10">
          <h2 className="mb-6 text-sm font-bold uppercase tracking-widest text-muted">
            {game.title}
          </h2>
          <div className="space-y-6">
            {game.tools.map((tool) => (
              <article
                key={tool.name}
                className="rounded-lg border border-border bg-card p-6"
              >
                <h3 className="mb-2 text-2xl font-semibold text-accent">
                  NBA 2K26 Build Planner
                </h3>
                <p className="mb-6 text-muted">{tool.description}</p>
                <div className="mb-6 flex flex-wrap gap-4">
                  <Link
                    href={tool.href}
                    className="rounded-lg bg-accent px-6 py-3 font-medium text-background hover:opacity-90"
                  >
                    {tool.cta}
                  </Link>
                  <Link
                    href="/results"
                    className="rounded-lg border border-border px-6 py-3 hover:bg-background"
                  >
                    View Results
                  </Link>
                </div>
                <ul className="space-y-2 text-sm text-muted">
                  {tool.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
