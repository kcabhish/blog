import { withPageAuthRequired } from "@auth0/nextjs-auth0";

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