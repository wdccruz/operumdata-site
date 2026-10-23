import type { SiteContent } from "@/lib/site-content";

/* -------------------------------------------------------------------------- */
/* Hero: human work -> field capture -> data -> model -> robot                 */
/* -------------------------------------------------------------------------- */

export function HeroSystem({ t }: { t: SiteContent["hero"] }) {
  const floorX = [-140, 40, 220, 400, 580, 760, 940];
  return (
    <figure className="hero-system">
      <div className="hero-system__frame" data-anim>
        <svg
          className="hero-svg"
          viewBox="0 0 760 560"
          role="img"
          aria-label={t.visualLabel}
        >
          <defs>
            <radialGradient id="hs-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0.32" />
              <stop offset="60%" stopColor="#ff5a1f" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="hs-cone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="hs-scan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff5a1f" stopOpacity="0" />
              <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0.5" />
            </linearGradient>
            <clipPath id="hs-floor">
              <rect x="0" y="436" width="760" height="124" />
            </clipPath>
            <clipPath id="hs-capture">
              <rect x="52" y="128" width="266" height="328" />
            </clipPath>
          </defs>

          {/* floor */}
          <g className="hs-floor" clipPath="url(#hs-floor)">
            {[446, 462, 486, 520, 560].map((y) => (
              <line key={y} x1="0" x2="760" y1={y} y2={y} />
            ))}
            {floorX.map((x) => (
              <line key={x} x1="380" y1="372" x2={x} y2="560" />
            ))}
          </g>
          <line className="hs-horizon" x1="24" x2="736" y1="436" y2="436" />

          {/* orbit rings around the model */}
          <circle className="hs-glow" cx="418" cy="246" r="150" fill="url(#hs-glow)" />
          <g className="hs-orbit">
            <circle cx="418" cy="246" r="118" />
            <circle className="hs-orbit__outer" cx="418" cy="246" r="168" />
          </g>

          {/* labels */}
          <text className="hs-label hs-label--strong" x="52" y="60">{t.now}</text>
          <text className="hs-label hs-label--strong" x="740" y="60" textAnchor="end">{t.future}</text>
          <line className="hs-rule" x1="52" x2="300" y1="74" y2="74" />
          <line className="hs-rule" x1="492" x2="740" y1="74" y2="74" />

          {/* ---- human worker ---- */}
          <g className="hs-human">
            {/* workbench */}
            <g className="hs-bench">
              <rect x="196" y="300" width="104" height="8" />
              <line x1="206" y1="308" x2="206" y2="436" />
              <line x1="290" y1="308" x2="290" y2="436" />
            </g>
            <g className="hs-object">
              <rect x="250" y="280" width="34" height="20" />
              <line x1="256" y1="287" x2="278" y2="287" />
              <line x1="256" y1="294" x2="270" y2="294" />
            </g>

            {/* egocentric field of view from head-mounted camera */}
            <polygon className="hs-cone" points="156,166 304,250 232,306" fill="url(#hs-cone)" />
            <line className="hs-cone-edge" x1="156" y1="166" x2="304" y2="250" />
            <line className="hs-cone-edge" x1="156" y1="166" x2="232" y2="306" />

            {/* skeleton */}
            <g className="hs-bones">
              <line x1="140" y1="186" x2="140" y2="204" />
              <line x1="116" y1="204" x2="164" y2="204" />
              <line x1="140" y1="204" x2="142" y2="300" />
              <line x1="128" y1="304" x2="158" y2="304" />
              <line x1="128" y1="304" x2="120" y2="370" />
              <line x1="120" y1="370" x2="114" y2="436" />
              <line x1="158" y1="304" x2="170" y2="368" />
              <line x1="170" y1="368" x2="178" y2="436" />
              <line x1="116" y1="204" x2="102" y2="258" />
              <line x1="102" y1="258" x2="128" y2="294" />
            </g>
            <circle className="hs-head" cx="140" cy="170" r="15" />
            <rect className="hs-cam" x="150" y="160" width="11" height="7" />
            <g className="hs-joints">
              {[
                [140, 204], [116, 204], [164, 204], [142, 300], [128, 304], [158, 304],
                [120, 370], [170, 368], [114, 436], [178, 436], [102, 258], [128, 294],
              ].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="3.2" />
              ))}
            </g>

            {/* working arm (animated) */}
            <g className="hs-arm-upper">
              <line className="hs-bone" x1="164" y1="204" x2="196" y2="250" />
              <g className="hs-arm-fore">
                <line className="hs-bone" x1="196" y1="250" x2="232" y2="264" />
                <g className="hs-tool">
                  <line x1="232" y1="264" x2="252" y2="279" />
                  <rect x="224" y="262" width="8" height="11" />
                </g>
                <circle className="hs-joint hs-joint--hot" cx="232" cy="264" r="3.6" />
              </g>
              <circle className="hs-joint" cx="196" cy="250" r="3.2" />
            </g>

            {/* tags */}
            <text className="hs-tag" x="58" y="196">{t.tags.pose}</text>
            <line className="hs-leader" x1="84" y1="200" x2="112" y2="204" />
            <text className="hs-tag hs-tag--hands" x="212" y="328">{t.tags.hands}</text>
            <text className="hs-tag hs-tag--hot hs-tag--tool" x="230" y="226">{t.tags.tool}</text>
          </g>

          {/* capture frame + scan */}
          <g className="hs-capture">
            <path d="M52 146 V128 H70 M300 128 H318 V146 M318 438 V456 H300 M70 456 H52 V438" />
            <text className="hs-tag hs-tag--hot" x="52" y="118">● {t.tags.capture}</text>
            <g clipPath="url(#hs-capture)">
              <rect className="hs-scan" x="52" y="96" width="266" height="34" fill="url(#hs-scan)" />
            </g>
          </g>

          {/* ---- data stream ---- */}
          <g className="hs-stream">
            <path className="hs-stream__rail" d="M318 236 C344 236 346 212 372 212" />
            <path className="hs-stream__rail" d="M318 276 C344 276 346 252 372 252" />
            <path className="hs-stream__rail" d="M318 318 C344 318 346 284 372 284" />
            <path className="hs-stream__pulse" pathLength="100" d="M318 236 C344 236 346 212 372 212" />
            <path className="hs-stream__pulse hs-d2" pathLength="100" d="M318 276 C344 276 346 252 372 252" />
            <path className="hs-stream__pulse hs-d3" pathLength="100" d="M318 318 C344 318 346 284 372 284" />
          </g>
          <text className="hs-tag" x="346" y="186" textAnchor="middle">{t.tags.data}</text>

          {/* ---- model grid ---- */}
          <g className="hs-model">
            {Array.from({ length: 16 }).map((_, i) => {
              const col = i % 4;
              const row = Math.floor(i / 4);
              return (
                <rect
                  key={i}
                  x={372 + col * 24}
                  y={200 + row * 24}
                  width="20"
                  height="20"
                  style={{ animationDelay: `${((col * 3 + row * 5) % 8) * -0.45}s` }}
                />
              );
            })}
          </g>
          <text className="hs-tag hs-tag--strong" x="418" y="316" textAnchor="middle">{t.tags.model}</text>

          {/* ---- model -> robot ---- */}
          <g className="hs-stream">
            <path className="hs-stream__rail" d="M468 236 C506 236 524 312 606 318" />
            <path className="hs-stream__rail" d="M468 268 C500 268 526 392 596 404" />
            <path className="hs-stream__pulse hs-d4" pathLength="100" d="M468 236 C506 236 524 312 606 318" />
            <path className="hs-stream__pulse hs-d5" pathLength="100" d="M468 268 C500 268 526 392 596 404" />
          </g>
          <text className="hs-tag" x="740" y="230" textAnchor="end">{t.tags.policy}</text>

          {/* ---- robot arm ---- */}
          <g className="hs-robot">
            <rect className="hs-robot__surface" x="664" y="330" width="80" height="6" />
            <g className="hs-object hs-object--robot">
              <rect x="690" y="304" width="34" height="26" />
              <line x1="696" y1="312" x2="718" y2="312" />
              <line x1="696" y1="320" x2="710" y2="320" />
            </g>
            <line className="hs-bench-leg" x1="736" y1="336" x2="736" y2="436" />
            <rect className="hs-robot__plate" x="566" y="430" width="108" height="10" />
            <rect className="hs-robot__turret" x="598" y="404" width="44" height="26" rx="3" />
            <g className="hs-robot-link1">
              <line className="hs-link-outer" x1="620" y1="404" x2="620" y2="326" />
              <line className="hs-link-inner" x1="620" y1="404" x2="620" y2="326" />
              <g className="hs-robot-link2">
                <line className="hs-link-outer" x1="620" y1="326" x2="690" y2="296" />
                <line className="hs-link-inner" x1="620" y1="326" x2="690" y2="296" />
                <g className="hs-gripper">
                  <polyline points="690,296 704,282 714,286" />
                  <polyline points="690,296 700,310 712,308" />
                </g>
                <circle className="hs-rjoint" cx="690" cy="296" r="7" />
                <circle className="hs-rjoint__core" cx="690" cy="296" r="2.6" />
              </g>
              <circle className="hs-rjoint" cx="620" cy="326" r="9" />
              <circle className="hs-rjoint__core" cx="620" cy="326" r="3" />
            </g>
            <circle className="hs-rjoint" cx="620" cy="404" r="10" />
            <circle className="hs-rjoint__core" cx="620" cy="404" r="3.4" />
          </g>
        </svg>

        <ol className="hero-stages" aria-label="HUMAN → ROBOT">
          {t.stages.map((stage, i) => (
            <li key={stage} style={{ animationDelay: `${i * 1.5}s` }}>
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
