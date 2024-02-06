import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Configuration, OpenAIApi } from 'openai';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired( async function handler(req, res) {

    const {user} = await getSession(req,res);
    const client = await clientPromise;
    const db = client.db('BlogTopia');

    const userProfile = await db.collection("users").findOne({
        auth0Id: user.sub
    });

    // shortcircuit if there are no tokens available
    if (userProfile?.avaibaleTokens) {
        // user is autherised but not permitted
        res.status(403);
        return;
    }

    const chatGptModel = 'gpt-3.5-turbo-1106';
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });
    const { topic, keywords } = req.body;
    const openai = new OpenAIApi(config);

    const prompt = `Generate me a long and seo friendly blogpost on the following topic delimited by triple hyphens
    ---
    ${topic}
    ---
    Targeting the following comma-separated keywords delimited by triple hyphens:
    ---
    ${keywords}
    ---
    `;

    const response = await openai.createChatCompletion({
        model: chatGptModel,
        messages: [
            {
                role: "system",
                content: "You are an SEO friendly blog post generator called BlogStandard. You are designed to output markdown without frontmatter"
            },
            {
                role: "user",
                content: prompt
            }],
    });

    const postContent = response.data.choices[0]?.message?.content;

    const seoResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-1106",
        messages: [
            {
                role: "system",
                content: "You are an SEO friendly blog post generator called BlogStandard. You are designed to output JSON, Do not include HTML tags in your output"
            },
            {
                role: "user",
                content: `Generate an SEO friendly title and SEO friendly meta description for the following blog post:
                        ${postContent}
                        ---
                        The output json must be in following format:
                        {
                            "title": "example title",
                            "metaDescription": "example meta description"
                        }
                        `
            }],
        response_format: { type: "json_object" }
    });

    const payload = seoResponse.data.choices[0]?.message?.content;

    const { title, metaDescription } = JSON.parse(payload);
    // console.log(payload);
    // console.log(title);
    // console.log(metaDescription);
    // decreasing the token after post generation
    await db.collection("users").updateOne({
        auth0Id: user.sub
    },{
        $inc: {
            availableTokens: -1
        }
    });
    const post = await db.collection("posts").insertOne({
        postContent,
        title,
        metaDescription,
        topic,
        keywords,
        userId: userProfile._id,
        created: new Date()
    })

    res.status(200).json({
        // insertedId is generated from the insertOne method above
        postId: post.insertedId,
    });
});