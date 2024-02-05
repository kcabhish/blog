import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { AppLayout } from "../../components/AppLayout";
import { useState } from 'react';
import Markdown from "react-markdown";

export default function NewPost(props) {
  const [postContent, setPostContent] = useState("");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    const response = await fetch('/api/generatePost', {
      method: "POST",
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ topic, keywords })
    });
    const json = await response.json();
    setPostContent(json.post.postContent);
    setGenerating(false);
  }
  return (
    <>
    {generating && (<div><h3>Generating Content ...</h3></div>)}
    {!generating && (<div className="w-full h-full flex flex-col overflow-auto">
      <form onSubmit={handleSubmit} className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
        <div>
          <label>
            <strong>
              Generate a blog post on the topic of:
            </strong>
          </label>
          <textarea className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={topic} onChange={(e) => setTopic(e.target.value)}/>
        </div>
        <div>
          <label>
            <strong>
              Targeting the following keywords:
            </strong>
          </label>
          <textarea className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={keywords} onChange={(e) => setKeywords(e.target.value)}/>
        </div>
        <button type="submit" className="btn">
          Generate
        </button>
        <Markdown>
          {postContent}
        </Markdown>
      </form>
    </div>)}
    </>
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
