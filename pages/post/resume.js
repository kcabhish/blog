import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useState } from 'react';
import { AppLayout } from "../../components/AppLayout";
import { getAppProps } from "../../utils/getAppProps";

export default function ResumeBuilder(props) {
  const router = useRouter();

  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const response = await fetch('/api/generatePost', {
        method: "POST",
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ topic, keywords })
      });
      const json = await response.json();
      if (json?.postId) {
        // redirecting to the route
        router.push(`/post/${json.postId}`);
      }
    } catch (error) {
      setGenerating(false);
    }
  }
  return (
    <>
        <h3>Resume Builder</h3>
    </>
  )
}

ResumeBuilder.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

/**
 * getServerSideProps is a Next.js function that can be used fetch data and render the contents of a page at request time
 */
export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx){
    const props = await getAppProps(ctx);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false
        }
      }
    }
    return {
      props
    }
  }
});
