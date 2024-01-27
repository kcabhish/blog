import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { AppLayout } from "../../components/AppLayout";
import { useState } from 'react';
import Markdown from "react-markdown";

export default function NewPost(props) {
  const [postContent, setPostContent] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch('/api/generatePost', {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ topic, keywords })
    });
    const json = await response.json();
    setPostContent(json.postContent);
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <string>
              Generate a blog post on the topic of:
            </string>
          </label>
          <textarea className="resize-none border borser-slate-500 w-fll block my-2 px-4 py-2 rounded-sm" value={topic} onChange={(e) => setTopic(e.target.value)}/>
        </div>
        <div>
          <label>
            <string>
              Targeting the following keywords:
            </string>
          </label>
          <textarea className="resize-none border borser-slate-500 w-fll block my-2 px-4 py-2 rounded-sm" value={keywords} onChange={(e) => setKeywords(e.target.value)}/>
        </div>
        <button type="submit" className="btn">
          Generate
        </button>
        <Markdown>
          {postContent}
        </Markdown>
      </form>
      {/* <div className="max-w-screen-sm p-10" dangerouslySetInnerHTML={{__html: postContent}} /> */}
    </div>
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
