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
      <Script>
        {`
          const initLib = function () {
            const swiper = new Swiper(".mySwiper", {
              slidesPerView: 1,
              spaceBetween: 30,
              centeredSlides: true,
              autoplay: {
                delay: 2500,
                disableOnInteraction: false,
              },
              pagination: {
                el: ".swiper-pagination",
                clickable: true,
              },
              navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              },
            });
            console.log("swiper :>> ", swiper);
          };
          if (typeof Swiper == "undefined") {
              const script = document.createElement("script");
              script.onload = initLib;
              script.src = "https://unpkg.com/swiper@7/swiper-bundle.min.js";
              document.body.appendChild(script);
          } else {
              initLib();
          }
        `}
      </Script>
    </>
  )
}
