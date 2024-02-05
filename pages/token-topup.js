import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";

export default function TokenTopup() {
  const handleClick = async() => {
    await fetch(`/api/addTokens`, {
      method: 'POST',
    });
  }
    return (
      <div>
        <div>This is the token topup page</div>
        <button className='btn' onClick={handleClick}>Add Token</button>
      </div>
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