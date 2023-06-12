import 'grapesjs/dist/css/grapes.min.css'
import { loadData } from "../../../../lib/destack/build/server";
import supabase from "../../../../supabase";

import { ContentProvider } from '../../../../lib/destack/build/browser'
import Script from "next/script";
import Head from "next/head";

export const getStaticPaths = async () => {
  const {data, error} = await supabase.from('Event').select('id').order('updated_at', { ascending: false }).limit(100)
  const paths = error ? [] : data.map((e) => ({ params: {id: `${e.id}`} }))
  return {
      paths,
      fallback: 'blocking'
  }
}

export const getStaticProps = async ({params}) => {
    const data = await loadData(params.id);
    return { props: { data }, revalidate: 60 };
  };


export default function Page(props) {
  const re = /<script\b[^>]*>([\s\S]*?)<\/script>/gm;
  let match;
  const scripts = []
  while (match = re.exec(props.data.content)) {
    // full match is in match[0], whereas captured groups are in ...[1], ...[2], etc.
    scripts.push(match[1]);
  }
  
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/swiper@7/swiper-bundle.min.css"
        />
      </Head>
      <ContentProvider {...props} />
      <Script src="https://kit.fontawesome.com/777c2040eb.js" />
      <Script src="//unpkg.com/alpinejs"></Script>
      <Script src="https://unpkg.com/swiper@7/swiper-bundle.min.js"></Script>
      {scripts.map((script, i) => (
        <Script strategy="lazyOnload" key={i}>
          {
            `${script.replace(/\\n/g, '').replace(/\\/g, '')}`
          }
        </Script>
      ))}
    </>
  )
}
