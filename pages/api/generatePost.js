import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Configuration, OpenAIApi } from 'openai';

export default withApiAuthRequired( async function handler(req, res) {

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
                content: "You are an SEO friendly blog post generator called BlogStandard. You are designed to output JSON, Do not include HTML tags in your outputs"
            },
            {
                role: "user",
                content: `Generate an SEO friendly title and SEO friendly meta description for the following blog post:
                        ${postContent}
                        ---
                        The output json must be in following format
                        {
                            "title":"example title",
                            "metaDescription": "example meta description"
                        }
                        `
            }],
        response_format: { "type": "json_object" }
    });

    const { title, metaDescription } = seoResponse.data.choices[0]?.message?.content || {};
    res.status(200).json({ post: { postContent, title, metaDescription } });
});