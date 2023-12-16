import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";

export default function TokenTopup() {
    return (
      <div>This is the token topup page</div>
    )
  }
  
  export const getServerSideProps = withPageAuthRequired(() => {
    return {
      props: {}
    };
  });

  TokenTopup.getLayout = function getLayout(page, pageProps) {
    return <AppLayout {...pageProps}>{page}</AppLayout>
  }