import {Configuration, OpenAIApi} from 'openai';

export default async function handler(req, res) {
    const config =new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });
    const { topic, keywords } = req.body;
    const openai = new OpenAIApi(config);

    // const topic = "opening a business in VA";
    // const keywords = "first time business owner, registration fees"
    const prompt = `Generate me a blogpost on the following topic delimited by triple hyphens
    ---
    ${topic}
    ---
    Targeting the following comma-separated keywords delimited by triple hyphens:
    ---
    ${keywords}
    ---`;

    const userPrompt = `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
    The content should be formatted in SEO-fiendly HTML, limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, op, ul, i.`

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-1106",
        temperature: 0,
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

    console.log(response.data.choices[0]?.message?.content);
    res.status(200).json({ postContent: response.data.choices[0]?.message?.content });
  }