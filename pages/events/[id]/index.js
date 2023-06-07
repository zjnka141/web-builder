import { useRouter } from "next/router"
import { ContentProvider } from '../../../lib/destack/build/browser'
import 'grapesjs/dist/css/grapes.min.css'
import { loadData } from "../../../lib/destack/build/server";
import supabase from "../../../supabase";
import { useEffect } from "react";
import Link from "next/link";

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
    const router = useRouter()
    const id = props.data.id
  
    useEffect(() => {
      const revalidatePath = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_URL}/api/revalidate?path=events__${id}`)
      };
  
      router.events.on("routeChangeStart", revalidatePath);
  
      return () => {
        router.events.off("routeChangeStart", revalidatePath);
      };
    }, [])
    return (
        <div style={{height: '100%'}}>
            <Link href={`/events/${id}/published`} >
              <div className="w-48 mt-2 cursor-pointer ml-auto text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800">
                Go to public page
              </div>
            </Link>
            <ContentProvider {...props} showEditorInProd />
        </div>)
}
