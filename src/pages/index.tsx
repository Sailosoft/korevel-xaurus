import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function scrollToSections() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('explore')?.scrollIntoView({
    behavior: reduced ? 'auto' : 'smooth',
    block: 'start',
  });
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner, 'kx-animated-bg')}>
      <div className={styles.heroBackdrop} aria-hidden="true">
        <span className={styles.orbA} />
        <span className={styles.orbB} />
        <span className={styles.orbC} />
        <span className={styles.heroGrid} />
      </div>

      <div className={clsx('container', styles.heroContent)}>
        <div className="kx-rise" style={{animationDelay: '50ms'}}>
          <p className={styles.heroBadge}>
            <span className={styles.badgeDot} aria-hidden="true" />
            Guides · Docs · Book
          </p>
        </div>

        <div className="kx-rise" style={{animationDelay: '150ms'}}>
          <Heading as="h1" className={styles.heroTitle}>
            <span className="kx-gradient-text">{siteConfig.title}</span>
          </Heading>
        </div>

        <div className="kx-rise" style={{animationDelay: '300ms'}}>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
        </div>

        <div
          className={clsx(styles.buttons, 'kx-rise')}
          style={{animationDelay: '450ms'}}>
          <Link
            className={clsx(styles.heroButtonPrimary, 'kx-animated-gradient')}
            to="/docs/book">
            Read the Book
          </Link>
          <Link className={styles.heroButtonGhost} to="/docs/guides">
            Browse Guides
          </Link>
        </div>
      </div>

      <div className={clsx(styles.scrollWrap, 'kx-rise')} style={{animationDelay: '750ms'}}>
        <button
          type="button"
          className={styles.scrollCue}
          onClick={scrollToSections}
          aria-label="Scroll to the collections">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </header>
  );
}

function HomepageCta() {
  return (
    <section className={clsx(styles.ctaSection, 'kx-animated-cta-bg')}>
      <div className="container">
        <Heading as="h2" className={styles.ctaTitle}>
          Start where it suits you
        </Heading>
        <p className={styles.ctaText}>
          New here? Begin with the Getting started guide for a tour of the
          knowledge base, or open the handbook and read it cover to cover.
        </p>
        <div className={styles.buttons}>
          <Link
            className={clsx(styles.heroButtonPrimary, 'kx-animated-gradient')}
            to="/docs/guides/getting-started">
            Get started
          </Link>
          <Link className={styles.heroButtonGhost} to="/docs/book">
            Read the Book
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout description="A personal knowledge base of guides, reference docs, and an engineering handbook.">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <HomepageCta />
      </main>
    </Layout>
  );
}
