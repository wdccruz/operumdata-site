import type { CSSProperties } from "react";
import type { SiteContent } from "@/lib/site-content";

/* -------------------------------------------------------------------------- */
/* Hero: OperumData coordination layer                                         */
/* Client requirements -> coordination core -> local network -> execution,     */
/* closing the loop back into the client's Physical AI / robotics program.     */
/* -------------------------------------------------------------------------- */

const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

const REQ_TOPS = [130, 220, 310];
const GROUP_Y = [140, 216, 292, 368];

const TRACES = {
  loop: "M105 440 V360",
  req: ["M170 155 H214 V238 H270", "M170 245 H230 V258 H270", "M170 335 H214 V278 H270"],
  core: ["M390 218 H426 V140 H462", "M390 246 H442 V216 H462", "M390 270 H442 V292 H462", "M390 298 H426 V368 H462"],
  exec: ["M580 140 H616 V236 H646", "M580 216 H602 V250 H646", "M580 292 H602 V266 H646", "M580 368 H616 V280 H646"],
  out: "M676 288 V440",
};

// Timeline of one 8 s cycle (seconds).
const T = {
  loop: 0,
  cards: 0.9,
  req: [0.6, 0.8, 1.0],
  core: 1.9,
  coreOut: [2.2, 2.35, 2.5, 2.65],
  group: 3.3,
  execIn: [4.2, 4.35, 4.5, 4.65],
  exec: 5.5,
  out: 5.8,
  band: 7.0,
};

function Pulse({ d, at }: { d: string; at: number }) {
  return (
    <>
      <path className="cm-rail" d={d} />
      <path className="cm-pulse" d={d} pathLength="100" style={delay(at)} />
    </>
  );
}

export function HeroSystem({ t }: { t: SiteContent["hero"] }) {
  return (
    <figure className="hero-system">
      <div className="hero-system__frame" data-anim>
        <div className="hero-system__bar" aria-hidden="true">
          <span>
            <span className="signal-dot" />
            {t.frameTitle}
          </span>
          <span>{t.frameMode} · BR</span>
        </div>

        <svg className="hero-svg" viewBox="0 0 760 500" role="img" aria-label={t.visualLabel}>
          <defs>
            <pattern id="cm-dots" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.9" />
            </pattern>
            <radialGradient id="cm-core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect className="cm-dots" x="0" y="0" width="760" height="500" fill="url(#cm-dots)" />

          {/* column headings */}
          <g className="cm-heads">
            <text x="40" y="70">{t.cols.req}</text>
            <text x="330" y="70" textAnchor="middle">{t.cols.core}</text>
            <text x="470" y="70">{t.cols.net}</text>
            <text x="676" y="70" textAnchor="middle">{t.cols.exec}</text>
          </g>
          <g className="cm-rules">
            <line x1="40" x2="170" y1="84" y2="84" />
            <line x1="270" x2="390" y1="84" y2="84" />
            <line x1="470" x2="600" y1="84" y2="84" />
            <line x1="640" x2="712" y1="84" y2="84" />
          </g>

          {/* traces + pulses */}
          <g className="cm-traces">
            <Pulse d={TRACES.loop} at={T.loop} />
            {TRACES.req.map((d, i) => <Pulse key={d} d={d} at={T.req[i]} />)}
            {TRACES.core.map((d, i) => <Pulse key={d} d={d} at={T.coreOut[i]} />)}
            {TRACES.exec.map((d, i) => <Pulse key={d} d={d} at={T.execIn[i]} />)}
            <Pulse d={TRACES.out} at={T.out} />
          </g>

          {/* client requirement cards */}
          {t.reqs.map((req, i) => {
            const y = REQ_TOPS[i];
            return (
              <g className="cm-card" key={req.title} style={delay(T.cards + i * 0.1)}>
                <rect x="40" y={y} width="130" height="50" />
                <text className="cm-card__title" x="52" y={y + 22}>{req.title}</text>
                <text className="cm-card__sub" x="52" y={y + 38}>{req.sub}</text>
                <rect className="cm-port" x="167" y={y + 22} width="6" height="6" />
              </g>
            );
          })}

          {/* coordination core */}
          <circle cx="330" cy="258" r="96" fill="url(#cm-core-glow)" className="cm-core-glow" />
          <g className="cm-core" style={delay(T.core)}>
            <rect className="cm-core__frame" x="270" y="198" width="120" height="120" />
            <path className="cm-core__corners" d="M262 206 V190 H278 M382 190 H398 V206 M398 310 V326 H382 M278 326 H262 V310" />
            <circle className="cm-core__ring" cx="330" cy="258" r="48" />
            <circle className="cm-core__ring2" cx="330" cy="258" r="38" />
            <circle className="cm-core__flash" cx="330" cy="258" r="48" style={delay(T.core)} />
            <text className="cm-core__title" x="330" y="261" textAnchor="middle">{t.coreTitle}</text>
            <text className="cm-core__sub" x="330" y="345" textAnchor="middle">{t.coreSub}</text>
            {[238, 258, 278].map((y) => <rect key={`l${y}`} className="cm-port" x="267" y={y - 3} width="6" height="6" />)}
            {[218, 246, 270, 298].map((y) => <rect key={`r${y}`} className="cm-port" x="387" y={y - 3} width="6" height="6" />)}
          </g>

          {/* local network groups */}
          {t.groups.map((group, g) => {
            const y = GROUP_Y[g];
            return (
              <g className="cm-group" key={group}>
                <text className="cm-group__label" x="470" y={y - 13}>{group}</text>
                {Array.from({ length: 5 }).map((_, i) => (
                  <rect
                    key={i}
                    className="cm-node"
                    x={470 + i * 22}
                    y={y - 5}
                    width="10"
                    height="10"
                    style={delay(T.group + g * 0.15 + i * 0.09)}
                  />
                ))}
                <line className="cm-group__bus" x1="470" x2="568" y1={y + 10} y2={y + 10} />
                <rect className="cm-port" x="459" y={y - 3} width="6" height="6" />
                <rect className="cm-port" x="577" y={y - 3} width="6" height="6" />
              </g>
            );
          })}

          {/* field execution */}
          <g className="cm-exec" style={delay(T.exec)}>
            <rect className="cm-exec__frame" x="646" y="228" width="60" height="60" />
            {Array.from({ length: 9 }).map((_, i) => (
              <rect
                key={i}
                className="cm-exec__cell"
                x={656 + (i % 3) * 15}
                y={238 + Math.floor(i / 3) * 15}
                width="9"
                height="9"
                style={delay(T.exec + ((i * 4) % 9) * 0.06)}
              />
            ))}
            <text className="cm-exec__label" x="676" y="310" textAnchor="middle">{t.execLabel}</text>
          </g>

          {/* client program band (closes the loop) */}
          <g className="cm-band" style={delay(T.band)}>
            <rect x="40" y="440" width="680" height="44" />
            <text className="cm-band__left" x="128" y="467">→ {t.band}</text>
            <text className="cm-band__right" x="704" y="467" textAnchor="end">{t.bandRight}</text>
          </g>
        </svg>

        <ol className="hero-stages">
          {t.stages.map((stage, i) => (
            <li key={stage} style={delay(i * 2)}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {stage}
            </li>
          ))}
        </ol>
      </div>
      <div className="visual-footer">
        <figcaption className="visual-caption">{t.caption}</figcaption>
        <button className="motion-toggle" type="button" data-motion-toggle aria-pressed="false">
          <span className="motion-toggle__pause"><span aria-hidden="true">❚❚ </span>{t.pause}</span>
          <span className="motion-toggle__play"><span aria-hidden="true">▶ </span>{t.play}</span>
        </button>
      </div>
    </figure>
  );
}

/* -------------------------------------------------------------------------- */
/* Why: the operating bridge between now and future                           */
/* -------------------------------------------------------------------------- */

export function Bridge({ t }: { t: SiteContent["why"] }) {
  return (
    <div className="bridge reveal" data-anim aria-label={t.bridgeLabel} role="group">
      <div className="bridge__head" aria-hidden="true">
        <span>{t.nowLabel}</span>
        <span className="bridge__hub-label">{t.hub}</span>
        <span>{t.futureLabel}</span>
      </div>
      <ul className="bridge__rows">
        {t.rows.map((row, i) => (
          <li className="bridge__row" key={row.now} style={{ ["--i" as string]: i }}>
            <strong className="bridge__now">{row.now}</strong>
            <span className="bridge__link" aria-hidden="true">
              <i />
            </span>
            <strong className="bridge__future">{row.future}</strong>
            <p className="bridge__text">{row.text}</p>
          </li>
        ))}
      </ul>
      <span className="bridge__spine" aria-hidden="true" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* What we do: small line glyphs                                              */
/* -------------------------------------------------------------------------- */

export function ServiceGlyph({ index }: { index: number }) {
  const glyphs = [
    // field ops: crosshair over terrain
    <g key="0">
      <circle cx="24" cy="22" r="11" />
      <path d="M24 5v8M24 31v8M7 22h8M33 22h8" />
      <circle className="glyph-hot" cx="24" cy="22" r="3" />
      <path d="M4 44h40" />
    </g>,
    // environment qualification: building + check
    <g key="1">
      <path d="M6 44V16l14-8 14 8v28" />
      <path d="M13 22h4M23 22h4M13 30h4M23 30h4M17 44v-7h6v7" />
      <path className="glyph-hot" d="M32 34l4 4 8-9" />
    </g>,
    // participants: connected people
    <g key="2">
      <circle cx="10" cy="14" r="4" />
      <circle cx="38" cy="14" r="4" />
      <circle className="glyph-hot" cx="24" cy="28" r="5" />
      <path d="M13 17l7 8M35 17l-7 8M4 30c0-5 3-8 6-8M44 30c0-5-3-8-6-8M16 44c0-6 3-9 8-9s8 3 8 9" />
    </g>,
    // hardware custody: case + cycle
    <g key="3">
      <rect x="6" y="16" width="26" height="20" />
      <path d="M14 16v-4h10v4M6 24h26" />
      <path className="glyph-hot" d="M38 14a10 10 0 0 1 2 16M40 30l-4 1M38 14l3-3" />
    </g>,
    // pilot: bracketed play
    <g key="4">
      <path d="M10 8H4v32h6M38 8h6v32h-6" />
      <path className="glyph-hot" d="M19 16l12 8-12 8z" />
    </g>,
    // visibility: signal bars + scan
    <g key="5">
      <path d="M8 40V30M16 40V22M24 40V26M32 40V14M40 40V20" />
      <path className="glyph-hot" d="M4 12c8-6 32-6 40 0" />
    </g>,
  ];
  return (
    <svg className="service-glyph" viewBox="0 0 48 48" aria-hidden="true">
      {glyphs[index]}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Real work -> AI training: connection matrix                                 */
/* -------------------------------------------------------------------------- */

export function RealWorkLinks({ t }: { t: SiteContent["realWork"] }) {
  const envCount = t.environments.length;
  const capCount = t.capabilities.length;
  return (
    <svg className="rw-links" viewBox="0 0 100 600" preserveAspectRatio="none" aria-hidden="true">
      {t.environments.map((env, i) =>
        env.caps.map((cap) => {
          const y1 = ((i + 0.5) / envCount) * 600;
          const y2 = ((cap + 0.5) / capCount) * 600;
          const d = `M0 ${y1} C55 ${y1} 45 ${y2} 100 ${y2}`;
          return (
            <g className="rw-link" data-env={i} key={`${i}-${cap}`}>
              <path className="rw-link__rail" d={d} vectorEffect="non-scaling-stroke" />
              <path
                className="rw-link__flow"
                d={d}
                vectorEffect="non-scaling-stroke"
                style={{ animationDelay: `${-((i * 7 + cap * 3) % 10) * 0.3}s` }}
              />
            </g>
          );
        }),
      )}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Brazil field network: living graph                                          */
/* -------------------------------------------------------------------------- */

const CX = 400;
const CY = 300;
const TYPE_ANGLES = [-90, -30, 30, 90, 150, 210];

function polar(r: number, deg: number): [number, number] {
  const rad = (deg * Math.PI) / 180;
  return [Math.round((CX + r * Math.cos(rad)) * 10) / 10, Math.round((CY + r * Math.sin(rad)) * 10) / 10];
}

function networkNodes() {
  return TYPE_ANGLES.map((angle) => [
    polar(132, angle),
    polar(214, angle - 14),
    polar(224, angle + 15),
  ]);
}

function NodeShape({ type, x, y, size }: { type: number; x: number; y: number; size: number }) {
  const s = size;
  switch (type) {
    case 0: // protocol: document square
      return <rect x={x - s} y={y - s} width={s * 2} height={s * 2} />;
    case 1: // company: diamond
      return <polygon points={`${x},${y - s * 1.3} ${x + s * 1.3},${y} ${x},${y + s * 1.3} ${x - s * 1.3},${y}`} />;
    case 2: // worksite: triangle
      return <polygon points={`${x},${y - s * 1.3} ${x + s * 1.25},${y + s} ${x - s * 1.25},${y + s}`} />;
    case 3: // participant: circle
      return <circle cx={x} cy={y} r={s * 1.1} />;
    case 4: // hardware: wide rect
      return <rect x={x - s * 1.3} y={y - s * 0.8} width={s * 2.6} height={s * 1.6} />;
    default: // field ops: ring
      return <circle className="net-ring-node" cx={x} cy={y} r={s * 1.15} />;
  }
}

export function FieldNetwork({ t }: { t: SiteContent["network"] }) {
  const nodes = networkNodes();
  // Activation paths visit one node of every type, in operating order.
  const patterns = [
    [1, 0, 2, 1, 0, 2],
    [0, 2, 1, 0, 2, 1],
    [2, 1, 0, 2, 1, 0],
  ];
  const paths = patterns.map((pattern) => {
    const pts = pattern.map((nodeIdx, typeIdx) => nodes[typeIdx][nodeIdx]);
    return `M${CX} ${CY} ` + pts.map(([x, y]) => `L${x} ${y}`).join(" ") + ` L${CX} ${CY}`;
  });

  return (
    <figure className="field-network reveal" data-anim>
      <div className="field-network__frame">
        <div className="field-network__label">
          <span className="signal-dot" aria-hidden="true" />
          {t.graphLabel}
        </div>
        <svg viewBox="0 0 800 600" role="img" aria-label={t.graphAria}>
          <defs>
            <linearGradient id="net-sweep" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0" />
              <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0.22" />
            </linearGradient>
            <radialGradient id="net-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
            </radialGradient>
          </defs>

          <g className="net-rings">
            <circle cx={CX} cy={CY} r="132" />
            <circle className="net-rings__outer" cx={CX} cy={CY} r="219" />
            <circle className="net-rings__faint" cx={CX} cy={CY} r="270" />
          </g>

          <g className="net-sweep">
            <path d={`M${CX} ${CY} L${CX + 270} ${CY} A270 270 0 0 0 ${polar(270, -38)[0]} ${polar(270, -38)[1]} Z`} fill="url(#net-sweep)" />
          </g>

          {/* static links */}
          <g className="net-links">
            {nodes.map((group, ti) => (
              <g key={ti}>
                <line x1={CX} y1={CY} x2={group[0][0]} y2={group[0][1]} />
                <line x1={group[0][0]} y1={group[0][1]} x2={group[1][0]} y2={group[1][1]} />
                <line x1={group[0][0]} y1={group[0][1]} x2={group[2][0]} y2={group[2][1]} />
                <line
                  className="net-links__cross"
                  x1={group[2][0]}
                  y1={group[2][1]}
                  x2={nodes[(ti + 1) % 6][1][0]}
                  y2={nodes[(ti + 1) % 6][1][1]}
                />
              </g>
            ))}
          </g>

          {/* activation paths */}
          {paths.map((d, i) => (
            <g className={`net-path net-path--${i}`} key={i}>
              <path className="net-path__glow" d={d} pathLength="100" />
              <path className="net-path__line" d={d} pathLength="100" />
            </g>
          ))}

          {/* nodes */}
          {nodes.map((group, ti) => (
            <g className={`net-type net-type--${ti}`} key={ti}>
              {group.map(([x, y], ni) => (
                <g
                  className="net-node"
                  key={ni}
                  style={{ animationDelay: `${-((ti * 3 + ni * 5) % 9) * 0.5}s` }}
                >
                  <NodeShape type={ti} x={x} y={y} size={ni === 0 ? 7 : 5} />
                </g>
              ))}
              <text
                className="net-type__label"
                x={polar(132, TYPE_ANGLES[ti])[0]}
                y={polar(132, TYPE_ANGLES[ti])[1] + (TYPE_ANGLES[ti] === 90 ? 30 : -18)}
                textAnchor="middle"
              >
                {t.types[ti]}
              </text>
            </g>
          ))}

          {/* hub */}
          <circle cx={CX} cy={CY} r="70" fill="url(#net-core)" className="net-core-glow" />
          <g className="net-hub">
            <rect x={CX - 72} y={CY - 20} width="144" height="40" />
            <text x={CX} y={CY + 5} textAnchor="middle">OPERUMDATA</text>
          </g>

          {/* activation readout */}
          <g className="net-readout">
            <text className="net-readout__label" x="24" y="574">{t.activation}</text>
            {t.protocols.map((p, i) => (
              <text className={`net-readout__value net-readout__value--${i}`} key={p} x="188" y="574">
                → {p}
              </text>
            ))}
          </g>
        </svg>
        <ul className="field-network__legend" aria-hidden="true">
          {t.types.map((type, i) => (
            <li key={type}>
              <svg viewBox="0 0 20 20" className={`net-type--${i}`}>
                <NodeShape type={i} x={10} y={10} size={5} />
              </svg>
              {type}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
