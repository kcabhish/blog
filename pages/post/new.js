import { withPageAuthRequired } from "@auth0/nextjs-auth0"

export default function NewPost() {
  return (
    <div>This is the new page</div>
  )
}

/**
 * getServerSideProps is a Next.js function that can be used fetch data and render the contents of a page at request time
 */
export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  };
});
