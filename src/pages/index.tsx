import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';
import { observer } from 'mobx-react-lite';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <img src='/img/events.png' />
      </div>
    </header>
  );
}

const Home = observer(() => {
  return (
    <Layout
      title="Events"
      description="Events Application">
      <HomepageHeader />
      <main>
      </main>
    </Layout>
  );
})

export default Home;
