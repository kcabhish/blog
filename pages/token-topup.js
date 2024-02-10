import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

export default function TokenTopup() {
  const handleClick = async() => {
    const result = await fetch(`/api/addTokens`, {
      method: 'POST',
    });
    const json = await result.json();
    // The result payload will have the url of the session checkout so we will need to navigate to that page to load the stripe's checkout page.
    // The below code will redirect the application to that page
    window.location.href = json.session.url;
  }
    return (
      <div>
        <div>This is the token topup page</div>
        <button className='btn' onClick={handleClick}>Add Token</button>
      </div>
    )
  }
  
  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx){
      const props = await getAppProps(ctx);
      return {
        props
      }
    }
  });

  TokenTopup.getLayout = function getLayout(page, pageProps) {
    return <AppLayout {...pageProps}>{page}</AppLayout>
  }