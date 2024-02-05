import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";

// This type of file is called the dynamic route in next js
export default function Post(props) {
  // console.log(props);
    return (
      <div>{props.postContent}</div>
    )
  }

  Post.getLayout = function getLayout(page, pageProps) {
    return <AppLayout {...pageProps}>{page}</AppLayout>
  }
  
  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx){
      const userSession = await getSession(ctx.req, ctx.res);
      const client = await clientPromise;
      const db = client.db("BlogTopia");
      const user = await db.collection("users").findOne({
        auth0Id: userSession.user.sub
      });
      const post = await db.collection("posts").findOne({
        _id: new ObjectId(ctx.params.postId),
        userId: user._id
      })

      // Redirect user to the new post if the post id does not exist
      if (!post){
        return {
          redirect: {
            destination: "/post/new",
            permanent: false
          }
        }
      }

      return {
        props: {
          postContent: post.postContent,
          title: post.title || null,
          metaDescripion: post.metaDescripion || null,
          keywords: post.keywords
        }
      }
    }
  });