import { AppLayout } from "../components/AppLayout"

export default function Home() {
  return (
    <div>
      <div>Home</div>
    </div>
  )
}

Home.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}
