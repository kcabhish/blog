import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useState } from 'react';
import { AppLayout } from "../../components/AppLayout";
import { getAppProps } from "../../utils/getAppProps";
import { sanitizeString } from "../../utils/utils";
import Markdown from "react-markdown";

export default function ResumeBuilder(props) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [resume, setResume] = useState("");
  const [generating, setGenerating] = useState(false);

  const [resDescription, setResDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    const sanitizedTitle = sanitizeString(title).trim();
    const sanitizedDescription = sanitizeString(description).trim();
    const sanitizedResume = sanitizeString(resume).trim();

    try {
      const response = await fetch('/api/generateResume', {
        method: "POST",
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ title: sanitizedTitle, description: sanitizedDescription, resume: sanitizedResume })
      });
      const json = await response.json();
      // setResDescription(json?.jobDescription);
      if (json?.jobId) {
        // redirecting to the route
        router.push(`/resume/${json.jobId}`);
      }
    } catch (error) {
      setGenerating(false);
    }
  }
  return (
    <div className="h-full overflow-hidden">
      {generating && (
      <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
        <FontAwesomeIcon icon={faBrain} className="text-8xl"/>
        <h6>Generating...</h6>
      </div>
     )}
     {!generating && (<div className="w-full h-full flex flex-col overflow-auto">
      <form onSubmit={handleSubmit} className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
          <div>
            <label>
              <strong>
                Enter Job Title
              </strong>
            </label>
            <input type="text" placeholder="eg: Senior Software Engineer" className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={title} onChange={(e) => setTitle(e.target.value)}/>
          </div>
          <div>
            <label>
              <strong>
                Enter Job Description
              </strong>
            </label>
            <textarea
              placeholder="Copy the job description and paste it here" 
              className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm h-96"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <small className="block mb-2">Word Count : {description.length}</small>
          </div>
          <div>
            <label>
              <strong>
                Enter Job Resume
              </strong>
            </label>
            <textarea
              placeholder="Copy the contents of your resume and paste it here" 
              className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm h-96"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
             <small className="block mb-2">Word Count : {resume.length}</small>
          </div>
          <button type="submit" className="btn" disabled={!description.trim() || !resume.trim()}>
            Analyze
          </button>
      </form>
      </div>)}
    </div>
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
