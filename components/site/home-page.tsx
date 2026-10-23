import { CONTACT_EMAIL, content, langHref, type Lang } from "@/lib/site-content";
import { SiteScript } from "./site-script";
import { Bridge, FieldNetwork, HeroSystem, RealWorkLinks, ServiceGlyph } from "./visuals";

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  id,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  id: string;
}) {
  return (
    <div className="section-heading reveal">
      <div className="section-heading__meta">
        <span className="section-heading__index">{index}</span>
        <span>{eyebrow}</span>
      </div>
      <div className="section-heading__body">
        <h2 id={id}>{title}</h2>
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}

function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const items: { code: Lang; short: string; name: string; hrefLang: string }[] = [
    { code: "en", short: "EN", name: "English", hrefLang: "en" },
    { code: "pt", short: "PT", name: "Português", hrefLang: "pt-BR" },
  ];
  return (
    <nav className="lang-switch" aria-label={label}>
      {items.map((item) =>
        item.code === lang ? (
          <span key={item.code} className="lang-switch__item is-current" aria-current="true" lang={item.hrefLang}>
            <abbr title={item.name}>{item.short}</abbr>
          </span>
        ) : (
          <a
            key={item.code}
            className="lang-switch__item"
            href={langHref[lang][item.code]}
            hrefLang={item.hrefLang}
            lang={item.hrefLang}
            aria-label={item.name}
          >
            {item.short}
          </a>
        ),
      )}
    </nav>
  );
}

function Wordmark({ label }: { label: string }) {
  return (
    <a className="wordmark" href="#top" aria-label={label}>
      <span className="wordmark__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32">
          <rect x="1.5" y="1.5" width="29" height="29" />
          <circle cx="16" cy="16" r="6.5" />
          <path className="wordmark__tick" d="M16 1.5v7M16 23.5v7" />
          <circle className="wordmark__dot" cx="16" cy="16" r="2.4" />
        </svg>
      </span>
      <span>OperumData</span>
    </a>
  );
}

export default function HomePage({ lang }: { lang: Lang }) {
  const t = content[lang];
  const mailto = (subject: string, body?: string) =>
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ""}`;
  const year = new Date().getFullYear();

  return (
    <div className="site" id="top" lang={t.htmlLang}>
      <a className="skip-link" href="#content">
        {t.skip}
      </a>

      <header className="site-header">
        <div className="shell site-header__inner">
          <Wordmark label={t.homeLabel} />

          <nav className="desktop-nav" aria-label={t.mainNavLabel}>
            {t.nav.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="site-header__actions">
            <LangSwitch lang={lang} label={t.langLabel} />
            <a className="btn btn--primary btn--sm header-cta" href="#contact">
              {t.headerCta}
            </a>
            <details className="mobile-nav">
              <summary aria-label={t.menuLabel}>
                <span aria-hidden="true" className="mobile-nav__bars">
                  <i />
                  <i />
                </span>
                {t.menu}
              </summary>
              <nav aria-label={t.mobileNavLabel}>
                {t.nav.map((item) => (
                  <a key={item.id} href={`#${item.id}`}>
                    {item.label}
                  </a>
                ))}
                <a className="mobile-nav__cta" href="#contact">
                  {t.headerCta}
                </a>
              </nav>
            </details>
          </div>
        </div>
      </header>

      <main id="content">
        {/* ------------------------------------------------------------ HERO */}
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__backdrop" aria-hidden="true">
            <span className="hero__beam" />
            <span className="hero__grid-floor" />
          </div>
          <div className="shell hero__grid">
            <div className="hero__content">
              <div className="eyebrow">
                <span className="signal-dot" aria-hidden="true" />
                {t.hero.eyebrow}
              </div>
              <h1 id="hero-title">
                {t.hero.titleA} <em>{t.hero.titleEm}</em> {t.hero.titleB}
              </h1>
              <p className="hero__lead">{t.hero.lead}</p>
              <div className="hero__actions">
                <a className="btn btn--primary" href="#contact">
                  {t.hero.primary}
                  <span aria-hidden="true" className="btn__arrow">→</span>
                </a>
                <a className="btn btn--ghost" href="#method">
                  {t.hero.secondary}
                </a>
              </div>
              <ul className="hero__principles" aria-label={t.hero.principlesLabel}>
                {t.hero.principles.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <HeroSystem t={t.hero} />
          </div>
        </section>

        {/* ---------------------------------------------------------- TICKER */}
        <div className="ticker" data-anim>
          <ul className="ticker__list">
            {t.ticker.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <ul className="ticker__list" aria-hidden="true">
            {t.ticker.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {/* ------------------------------------------------------------- WHY */}
        <section className="section section--why" id="why" aria-labelledby="why-title">
          <div className="shell why-layout">
            <div>
              <SectionHeading id="why-title" index={t.why.index} eyebrow={t.why.eyebrow} title={t.why.title} />
              <div className="why-copy reveal">
                {t.why.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <Bridge t={t.why} />
          </div>
        </section>

        {/* ----------------------------------------------------- WHAT WE DO */}
        <section className="section section--what" id="what-we-do" aria-labelledby="what-title">
          <div className="shell">
            <SectionHeading
              id="what-title"
              index={t.what.index}
              eyebrow={t.what.eyebrow}
              title={t.what.title}
              description={t.what.description}
            />
            <ul className="service-grid">
              {t.what.items.map((item, i) => (
                <li className="service-card reveal" key={item.title} style={{ ["--i" as string]: i }}>
                  <div className="service-card__top">
                    <span className="service-card__code">OPS / {String(i + 1).padStart(2, "0")}</span>
                    <ServiceGlyph index={i} />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                  <span className="service-card__bar" aria-hidden="true" />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------ REAL WORK */}
        <section className="section section--realwork" id="real-work" aria-labelledby="realwork-title">
          <div className="shell">
            <SectionHeading
              id="realwork-title"
              index={t.realWork.index}
              eyebrow={t.realWork.eyebrow}
              title={t.realWork.title}
              description={t.realWork.description}
            />

            <div className="rw reveal" data-rw data-anim>
              <div className="rw__col rw__col--env">
                <div className="rw__label">{t.realWork.envLabel}</div>
                <ol className="rw__list">
                  {t.realWork.environments.map((env, i) => (
                    <li className="rw-env" key={env.title} data-env-row={i}>
                      <span className="rw-env__code">ENV / {String(i + 1).padStart(2, "0")}</span>
                      <strong>{env.title}</strong>
                      <span className="rw-env__text">{env.text}</span>
                      <span className="rw-env__caps">
                        {env.caps.map((c) => (
                          <span key={c}>{t.realWork.capabilities[c].title}</span>
                        ))}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rw__col rw__col--links" aria-hidden="true">
                <RealWorkLinks t={t.realWork} />
              </div>
              <div className="rw__col rw__col--cap">
                <div className="rw__label">{t.realWork.capLabel}</div>
                <ol className="rw__list">
                  {t.realWork.capabilities.map((cap, i) => (
                    <li
                      className="rw-cap"
                      key={cap.title}
                      data-envs={t.realWork.environments
                        .map((env, ei) => (env.caps.includes(i) ? ei : -1))
                        .filter((ei) => ei >= 0)
                        .join(" ")}
                    >
                      <strong>{cap.title}</strong>
                      <span>{cap.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rw__output">
                <span className="rw__output-line" aria-hidden="true" />
                <strong>
                  <span aria-hidden="true">→ </span>
                  {t.realWork.output}
                </strong>
                <span className="rw__output-tags" aria-hidden="true">
                  ROBOTICS · PHYSICAL AI · EMBODIED SYSTEMS
                </span>
              </div>
            </div>
            <p className="rw__hint reveal">{t.realWork.hint}</p>
            <p className="section-disclaimer reveal">{t.realWork.disclaimer}</p>
          </div>
        </section>

        {/* -------------------------------------------------------- NETWORK */}
        <section className="section section--network" id="network" aria-labelledby="network-title">
          <div className="shell">
            <SectionHeading id="network-title" index={t.network.index} eyebrow={t.network.eyebrow} title={t.network.title} />
            <div className="network-layout">
              <div className="network-copy reveal">
                {t.network.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <div className="network-steps">
                  <div className="mono-label">{t.network.stepsLabel}</div>
                  <ol>
                    {t.network.steps.map((step, i) => (
                      <li key={step} style={{ ["--i" as string]: i }}>
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="network-base">
                  <strong>
                    <span className="signal-dot" aria-hidden="true" />
                    {t.network.base}
                  </strong>
                  <span>{t.network.baseNote}</span>
                </div>
              </div>
              <FieldNetwork t={t.network} />
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- METHOD */}
        <section className="section section--method" id="method" aria-labelledby="method-title">
          <div className="shell">
            <SectionHeading
              id="method-title"
              index={t.method.index}
              eyebrow={t.method.eyebrow}
              title={t.method.title}
              description={t.method.description}
            />
            <div className="method reveal" data-anim>
              <div className="method__track" aria-hidden="true">
                <span className="method__rail" />
                <span className="method__token" />
                <span className="method__gate" />
              </div>
              <ol className="method__steps">
                {t.method.steps.map((step, i) => (
                  <li className={`method-step${i === 2 ? " method-step--pilot" : ""}`} key={step.label}>
                    <span className="method-step__node" aria-hidden="true" />
                    <span className="method-step__num">{String(i + 1).padStart(2, "0")}</span>
                    <h3>{step.label}</h3>
                    <p>{step.text}</p>
                  </li>
                ))}
              </ol>
              <div className="method__gate-note">
                <strong>{t.method.gate}</strong>
                <p>{t.method.gateText}</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- TRUST */}
        <section className="section section--trust" id="trust" aria-labelledby="trust-title">
          <div className="shell">
            <SectionHeading
              id="trust-title"
              index={t.trust.index}
              eyebrow={t.trust.eyebrow}
              title={t.trust.title}
              description={t.trust.description}
            />
            <div className="trust-layout">
              <div className="control-console reveal" data-anim>
                <div className="control-console__header">
                  <span>{t.trust.consoleTitle}</span>
                  <span className="control-console__mode">
                    <span className="signal-dot" aria-hidden="true" />
                    {t.trust.consoleMode}
                  </span>
                </div>
                <ul className="control-list">
                  {t.trust.items.map((item, i) => (
                    <li className="control-row" key={item.title} style={{ ["--i" as string]: i }}>
                      <span className="control-row__code">CTRL / {String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                      <span className="control-row__status">
                        <i aria-hidden="true" />
                        {item.status}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="control-console__footer">{t.trust.consoleFooter}</div>
              </div>

              <div className="trust-side">
                <div className="custody reveal" data-anim>
                  <div className="mono-label">{t.trust.custodyLabel}</div>
                  <ol className="custody__flow">
                    {t.trust.custody.map((step, i) => (
                      <li key={step} style={{ ["--i" as string]: i }}>
                        <span>{String(i + 1).padStart(2, "0")}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <span className="custody__token" aria-hidden="true" />
                </div>
                <div className="quality reveal">
                  <div className="mono-label">{t.trust.qualityLabel}</div>
                  <h3>{t.trust.qualityTitle}</h3>
                  <p>{t.trust.qualityText}</p>
                  <ul>
                    {t.trust.qualityList.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="quality__note">{t.trust.qualityNote}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- EXPERIENCE */}
        <section className="section section--experience" id="experience" aria-labelledby="experience-title">
          <div className="shell experience-layout">
            <div>
              <SectionHeading id="experience-title" index={t.experience.index} eyebrow={t.experience.eyebrow} title={t.experience.title} />
              <div className="experience-copy reveal">
                {t.experience.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
            <ol className="timeline reveal" data-anim>
              {t.experience.timeline.map((item, i) => (
                <li key={item.year} className={i === 1 ? "is-now" : undefined}>
                  <span className="timeline__year">{item.year}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ------------------------------------------------------------ FAQ */}
        <section className="section section--faq" id="faq" aria-labelledby="faq-title">
          <div className="shell faq-layout">
            <SectionHeading id="faq-title" index={t.faq.index} eyebrow={t.faq.eyebrow} title={t.faq.title} />
            <div className="faq-list reveal">
              {t.faq.items.map((item, i) => (
                <details className="faq-item" key={item.q}>
                  <summary>
                    <span className="faq-item__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="faq-item__q">{item.q}</span>
                    <span className="faq-item__icon" aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------ CTA */}
        <section className="final-cta" id="contact" aria-labelledby="contact-title">
          <div className="final-cta__glow" aria-hidden="true" />
          <div className="shell final-cta__grid">
            <div className="final-cta__content reveal">
              <div className="eyebrow">
                <span className="signal-dot" aria-hidden="true" />
                {t.cta.eyebrow}
              </div>
              <h2 id="contact-title">{t.cta.title}</h2>
              <p>{t.cta.text}</p>
              <div className="final-cta__actions">
                <a className="btn btn--primary btn--lg" href={mailto(t.cta.emailSubject, t.cta.emailBody)}>
                  {t.cta.primary}
                  <span aria-hidden="true" className="btn__arrow">→</span>
                </a>
                <a className="btn btn--ghost btn--lg" href={mailto(t.cta.emailSubject)}>
                  {t.cta.secondary}
                </a>
              </div>
              {CONTACT_EMAIL ? null : <p className="final-cta__note">{t.cta.placeholder}</p>}
            </div>
            <div className="brief reveal">
              <div className="mono-label">{t.cta.briefLabel}</div>
              <ol>
                {t.cta.brief.map((item, i) => (
                  <li key={item}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__grid">
          <div className="site-footer__brand">
            <Wordmark label={t.footer.top} />
            <p>{t.footer.tagline}</p>
          </div>
          <div className="footer-meta">
            <span>{t.footer.base}</span>
            <span>{t.footer.mode}</span>
            <LangSwitch lang={lang} label={t.langLabel} />
          </div>
          <nav aria-label={t.footer.navLabel}>
            {t.nav.map((item) => (
              <a key={item.id} href={`#${item.id}`}>
                {item.label}
              </a>
            ))}
            <a href="#contact">{t.headerCta}</a>
          </nav>
        </div>
        <div className="shell site-footer__bottom">
          <span>
            © {year} {t.footer.rights}
          </span>
          <a href="#top">{t.footer.top} ↑</a>
        </div>
      </footer>
      <SiteScript />
    </div>
  );
}
