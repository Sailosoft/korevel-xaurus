import {useEffect, useRef, useState} from 'react';
import type {ReactNode, RefObject} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  to: string;
  icon: ReactNode;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Guides',
    to: '/docs/guides',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
      </svg>
    ),
    description: (
      <>
        Step-by-step how-tos for working with this knowledge base: getting
        started, writing and organizing notes, adding book chapters, and
        deploying the site.
      </>
    ),
  },
  {
    title: 'Docs',
    to: '/docs/reference',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    ),
    description: (
      <>
        Reference material to look up in a hurry: the Git workflow cheat
        sheet, Docusaurus configuration, Markdown and MDX syntax, and every
        project command.
      </>
    ),
  },
  {
    title: 'Book',
    to: '/docs/book',
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    description: (
      <>
        The Engineering Handbook - a six-chapter walk through environment
        setup, code quality, testing, delivery, documentation, and operating
        the systems you ship.
      </>
    ),
  },
];

function useReveal<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      {threshold: 0.15, rootMargin: '0px 0px -5% 0px'},
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, shown];
}

function Feature({
  title,
  to,
  icon,
  description,
  index,
}: FeatureItem & {index: number}) {
  const [ref, shown] = useReveal<HTMLDivElement>();
  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <div
        ref={ref}
        className={clsx(styles.reveal, shown && styles.revealShown)}
        style={{transitionDelay: `${index * 120}ms`}}>
        <Link className={styles.featureCard} to={to}>
          <span className={styles.featureIcon}>{icon}</span>
          <Heading as="h3" className={styles.featureTitle}>
            {title}
          </Heading>
          <p className={styles.featureDescription}>{description}</p>
          <span className={styles.featureCta}>
            Explore
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features} id="explore">
      <div className="container">
        <div className={styles.sectionHeader}>
          <p className={styles.sectionEyebrow}>Browse</p>
          <Heading as="h2" className={styles.sectionTitle}>
            Pick a collection
          </Heading>
          <p className={styles.sectionLead}>
            Follow the guides for hands-on tasks, look things up in the
            reference, or read the handbook cover to cover.
          </p>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={props.title} index={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
