import { withPageAuthRequired } from "@auth0/nextjs-auth0";

// This type of file is called the dynamic route in next js
export default function Post() {
    return (
      <div>This is the Post page</div>
    )
  }
  
  export const getServerSideProps = withPageAuthRequired(() => {
    return {
      props: {}
    };
  });