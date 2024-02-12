import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { getAppProps } from "../../utils/getAppProps";

// This type of file is called the dynamic route in next js
export default function Job(props) {
    const {qualifications,
        title,
        description,
        desiredQualifications,
        salaryRange,
        benefits,
        analysis,
        isQualified,
        companyName,
        coverLetter} = props;
    return (
      <div className={`overflow-auto h-full ${isQualified === true ? 'bg-green-400': 'bg-red-400'} `}>
        <div className="max-w-screen-sm mx-auto">

          <div className="text-sm mt-6 font-bold p-2 bg-stone-200 rounded-sm">
            Job Title & Description
          </div>
          <div className="p-4 my-2 border border-stone-200 rounded-md">
            <div className="text-blue-600 text-2xl font-bold">
              {companyName} | {title}
            </div>
            <div className='mt-2'>
              {description}
            </div>
          </div>
          <DisplayCard title="Your Qualifications" description={analysis} />
          <DisplayCard title="Salary Range" description={salaryRange} />
          <DisplayCard title="Benefits" description={benefits} />
          <DisplayCard title="Qualifications" description={qualifications} />
          {desiredQualifications && <DisplayCard title="Desired Qualifications" description={desiredQualifications} />}
          <DisplayCard title="Cover Letter" description={coverLetter} />
        </div>
      </div>
    )
  }

  
const DisplayCard = (props) => {
  return (
    <>
      <div className="text-sm mt-6 font-bold p-2 bg-stone-200 rounded-sm">
        {props.title}
      </div>
      <div className="flex flex-wrap pt-2 gap-1 p-4 my-2 border border-stone-200 rounded-md">
        {props.description}
      </div>
    </>
  );
}


  Job.getLayout = function getLayout(page, pageProps) {
    return <AppLayout {...pageProps}>{page}</AppLayout>
  }
  
  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx){
      const props = await getAppProps(ctx);
      const userSession = await getSession(ctx.req, ctx.res);
      const client = await clientPromise;
      const db = client.db("BlogTopia");
      const user = await db.collection("users").findOne({
        auth0Id: userSession.user.sub
      });
      const job = await db.collection("jobs").findOne({
        _id: new ObjectId(ctx.params.jobId),
        userId: user._id
      })

      // Redirect user to the new post if the post id does not exist
      if (!job){
        return {
          redirect: {
            destination: "/resume/build",
            permanent: false
          }
        }
      }
      const {qualifications,
        desiredQualifications,
        salaryRange,
        benefits,
        analysis,
        companyName,
        isQualified,
        coverLetter} = job;
      console.log(job);
      return {
        props: {
          title: job.title || null,
          description: job.description || null,
          qualifications,
          desiredQualifications,
          salaryRange,
          benefits,
          analysis,
          isQualified,
          coverLetter,
          companyName,
          ...props
        }
      }
    }
  });