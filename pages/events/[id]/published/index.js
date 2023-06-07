import 'grapesjs/dist/css/grapes.min.css'
import { loadData } from "../../../../lib/destack/build/server";
import supabase from "../../../../supabase";

import { ContentProvider } from '../../../../lib/destack/build/browser'
import Script from "next/script";

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
  
  return (
    <>
      <ContentProvider {...props} />
      <Script src="https://kit.fontawesome.com/777c2040eb.js" />
    </>
  )
}
