import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';
import Layout from '@components/layout';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig value={{ fetcher: (url: string) => fetch(url).then(res => res.json()) }}>
      <div className="w-full h-full max-w-full overflow-hidden">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </div>
    </SWRConfig>
  )
}

export default MyApp
