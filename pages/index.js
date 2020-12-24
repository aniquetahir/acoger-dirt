import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import PostDisplay from "../components/post-display";
import useSWR from "swr";

export const fetcher = (...args)=>fetch(...args).then(res=>res.json());

export async function getStaticProps() {
    const allPostsData = getSortedPostsData()
    return {
        props: {
            allPostsData
        }
    }
}

export default function Home({allPostsData}) {
  return (
      <Layout home>
        <Head>
          <title>{siteTitle}</title>
        </Head>
          <PostDisplay posts={useSWR('api/posts_sample', fetcher, {refreshInterval: 1000})} />
        {/*<section className={utilStyles.headingMd}>*/}
        {/*  <p>[Your Self Introduction]</p>*/}
        {/*  <p>*/}
        {/*    (This is a sample website - you’ll be building a site like this on{' '}*/}
        {/*    <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)*/}
        {/*  </p>*/}
        {/*</section>*/}
        {/*  <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>*/}
        {/*      <h2 className={utilStyles.headingLg}>Blog</h2>*/}
        {/*      <ul className={utilStyles.list}>*/}
        {/*          {allPostsData.map(({ id, date, title }) => (*/}
        {/*              <li className={utilStyles.listItem} key={id}>*/}
        {/*                  {title}*/}
        {/*                  <br />*/}
        {/*                  {id}*/}
        {/*                  <br />*/}
        {/*                  {date}*/}
        {/*              </li>*/}
        {/*          ))}*/}
        {/*      </ul>*/}
        {/*  </section>*/}
      </Layout>
  )
}
