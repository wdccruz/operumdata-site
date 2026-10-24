import type { CSSProperties } from "react";
import type { SiteContent } from "@/lib/site-content";

/* -------------------------------------------------------------------------- */
/* Hero background: an atmospheric coordination network                       */
/* OperumData sits at the core; typed hubs (protocol, companies, worksites,    */
/* professionals, hardware, execution) branch into satellites, with a dim far  */
/* layer for depth. Generated deterministically at build time.                 */
/* -------------------------------------------------------------------------- */

type P = { x: number; y: number };
type Link = { a: P; b: P; d: string; kind: "core" | "hub" | "mesh" | "far" };

function prng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const r1 = (n: number) => Math.round(n * 10) / 10;
const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);

function curve(a: P, b: P, bend: number) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const len = dist(a, b) || 1;
  const nx = -(b.y - a.y) / len;
  const ny = (b.x - a.x) / len;
  return `M${r1(a.x)} ${r1(a.y)} Q${r1(mx + nx * len * bend)} ${r1(my + ny * len * bend)} ${r1(b.x)} ${r1(b.y)}`;
}

function buildNetwork() {
  const rand = prng(20261024);
  const core: P = { x: 1160, y: 430 };
  const hubAngles = [-150, -92, -32, 28, 88, 150];
  const hubs: P[] = hubAngles.map((deg) => {
    const a = ((deg + (rand() - 0.5) * 16) * Math.PI) / 180;
    const r = 235 + rand() * 60;
    return { x: core.x + Math.cos(a) * r * 1.3, y: core.y + Math.sin(a) * r * 0.82 };
  });
  const sats: { p: P; hub: number }[] = [];
  hubs.forEach((h, hi) => {
    for (let i = 0; i < 5; i++) {
      const a = ((hubAngles[hi] + (rand() - 0.5) * 150) * Math.PI) / 180;
      const r = 80 + rand() * 105;
      sats.push({ p: { x: h.x + Math.cos(a) * r * 1.2, y: h.y + Math.sin(a) * r * 0.85 }, hub: hi });
    }
  });
  const far: P[] = [];
  let guard = 0;
  while (far.length < 34 && guard++ < 2000) {
    const p = { x: 420 + 1200 * Math.sqrt(rand()), y: 30 + rand() * 840 };
    if ([core, ...hubs, ...sats.map((s) => s.p), ...far].every((q) => dist(p, q) > 70)) far.push(p);
  }

  const links: Link[] = [];
  const add = (a: P, b: P, kind: Link["kind"]) => links.push({ a, b, kind, d: curve(a, b, (rand() - 0.5) * 0.3) });
  hubs.forEach((h) => add(core, h, "core"));
  sats.forEach((s) => add(hubs[s.hub], s.p, "hub"));
  sats.forEach((s, i) => {
    let best = -1;
    let bd = 210;
    sats.forEach((o, j) => {
      if (o.hub !== s.hub && j > i && dist(s.p, o.p) < bd) {
        bd = dist(s.p, o.p);
        best = j;
      }
    });
    if (best >= 0) add(s.p, sats[best].p, "mesh");
  });
  const pool = [...far, ...sats.map((s) => s.p)];
  far.forEach((p) => {
    pool
      .filter((q) => q !== p)
      .map((q) => ({ q, dd: dist(p, q) }))
      .sort((m, n) => m.dd - n.dd)
      .slice(0, 2)
      .forEach(({ q, dd }) => dd < 240 && add(p, q, "far"));
  });

  return { core, hubs, sats, far, links };
}

const NET = buildNetwork();

const anim = (dur: number, delay: number): CSSProperties =>
  ({ ["--dur" as string]: `${dur}s`, ["--delay" as string]: `${delay}s` }) as CSSProperties;

export function HeroBackground({ t }: { t: SiteContent["hero"] }) {
  const { core, hubs, sats, far, links } = NET;
  const rand = prng(7);
  const coreLinks = links.filter((l) => l.kind === "core");
  const hubLinks = links.filter((l) => l.kind === "hub");
  const pulseHub = hubLinks.filter((_, i) => i % 3 === 0);

  return (
    <div className="hero-bg" data-anim aria-hidden="true">
      <svg className="hero-bg__svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <radialGradient id="hb-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0.28" />
            <stop offset="45%" stopColor="#ff5a1f" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* far layer: depth */}
        <g className="hb-layer hb-layer--far">
          {links.filter((l) => l.kind === "far").map((l) => (
            <path key={l.d} className="hb-link hb-link--far" d={l.d} />
          ))}
          {far.map((p, i) => (
            <circle key={i} className="hb-node hb-node--far" cx={r1(p.x)} cy={r1(p.y)} r="1.6" style={anim(7 + rand() * 6, -rand() * 12)} />
          ))}
          {[
            [560, 140], [760, 780], [1480, 120], [1520, 760], [880, 90], [1300, 840],
          ].map(([x, y]) => (
            <path key={`${x}-${y}`} className="hb-tick" d={`M${x - 6} ${y} H${x + 6} M${x} ${y - 6} V${y + 6}`} />
          ))}
        </g>

        {/* mid layer: satellites and mesh */}
        <g className="hb-layer hb-layer--mid">
          {links.filter((l) => l.kind === "mesh").map((l) => (
            <path key={l.d} className="hb-link hb-link--mesh" d={l.d} />
          ))}
          {hubLinks.map((l) => (
            <path key={l.d} className="hb-link hb-link--hub" d={l.d} style={anim(8 + rand() * 7, -rand() * 14)} />
          ))}
          {sats.map((s, i) => (
            <circle key={i} className="hb-node hb-node--sat" cx={r1(s.p.x)} cy={r1(s.p.y)} r="2.3" style={anim(6 + rand() * 6, -rand() * 12)} />
          ))}
          {pulseHub.map((l, i) => (
            <path key={`p${i}`} className="hb-pulse hb-pulse--small" d={l.d} pathLength="100" style={anim(9 + rand() * 9, -rand() * 18)} />
          ))}
        </g>

        {/* near layer: core and hubs */}
        <g className="hb-layer hb-layer--near">
          <circle className="hb-core-glow" cx={core.x} cy={core.y} r="220" fill="url(#hb-core)" />
          {coreLinks.map((l) => (
            <path key={l.d} className="hb-link hb-link--core" d={l.d} style={anim(9 + rand() * 6, -rand() * 15)} />
          ))}
          {coreLinks.map((l, i) => (
            <path key={`cp${i}`} className="hb-pulse" d={l.d} pathLength="100" style={anim(10 + i * 1.7, -rand() * 16)} />
          ))}
          {hubs.map((h, i) => (
            <g key={i} className="hb-hub" style={anim(8 + rand() * 5, -rand() * 12)}>
              <circle className="hb-hub__halo" cx={r1(h.x)} cy={r1(h.y)} r="11" />
              <circle className="hb-hub__dot" cx={r1(h.x)} cy={r1(h.y)} r="3.4" />
              <text className="hb-label" x={r1(h.x + 18)} y={r1(h.y - 14)}>{t.nodeLabels[i]}</text>
            </g>
          ))}
          <g className="hb-core">
            <circle className="hb-core__orbit" cx={core.x} cy={core.y} r="64" />
            <circle className="hb-core__ring" cx={core.x} cy={core.y} r="30" />
            <circle className="hb-core__dot" cx={core.x} cy={core.y} r="6" />
            <text className="hb-label hb-label--core" x={core.x} y={core.y + 96} textAnchor="middle">OPERUMDATA</text>
          </g>
        </g>
      </svg>
    </div>
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
