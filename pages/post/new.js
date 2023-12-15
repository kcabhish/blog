import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { AppLayout } from "../../components/AppLayout";

export default function NewPost() {
  return (
    <div>This is the new page</div>
  )
}

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

/**
 * getServerSideProps is a Next.js function that can be used fetch data and render the contents of a page at request time
 */
export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  };
});
