import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';
import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/hooks';

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value) || key === 'root' || key === 'store' || key === 'rootStore') {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <img src='/img/events.png'/>
      </div>
    </header>
  );
}

const Home = observer(() => {
  const {siteConfig} = useDocusaurusContext();
  const eventStore = useStore('eventStore');
  const userStore = useStore('userStore');
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <pre>
          <code>
            { JSON.stringify(userStore.current, getCircularReplacer(), 2)}
          </code>
        </pre>
        <pre>
          <code>
            { JSON.stringify(userStore.current?.untisTeacher?.lessons?.map(l => `${l.subjectName}: ${l.startTimeStr}-${l.endTimeStr}`), getCircularReplacer(), 2)}
          </code>
        </pre>
        <div className="container">
          <div className="row">
          <div className="col col--6">
            <h1 className="hero__title">Events</h1>
            <pre>
              <code>
                {JSON.stringify(eventStore.events.slice(), getCircularReplacer(), 2)}
              </code>
            </pre>

          </div>
            <div className="col col--6">
            <h1 className="hero__title">Users</h1>
              <pre>
                <code>
                  {JSON.stringify(userStore.users, getCircularReplacer(), 2)}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
})

export default Home;