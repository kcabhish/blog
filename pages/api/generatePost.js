import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Configuration, OpenAIApi } from 'openai';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db('BlogTopia');

    const userProfile = await db
      .collection('users')
      .findOne({ auth0Id: user.sub });

    // Validate user and tokens
    if (!userProfile || userProfile.availableTokens <= 0) {
      return res
        .status(403)
        .json({ error: 'Insufficient tokens or unauthorized access' });
    }

    const { topic, keywords } = req.body;

    // Validate request body
    if (!topic || !keywords || topic.length > 80 || keywords.length > 80) {
      return res
        .status(422)
        .json({ error: 'Invalid topic or keywords length' });
    }

    // OpenAI Configuration
    const openai = new OpenAIApi(
      new Configuration({ apiKey: process.env.OPENAI_API_KEY })
    );

    const chatGptModel = 'gpt-4o';

    // Generate Blog Content
    const blogPrompt = `
      Generate a long, SEO-friendly blog post on the following topic:
      ---
      ${topic}
      ---
      Targeting these comma-separated keywords:
      ---
      ${keywords}
      ---
    `;

    const blogResponse = await openai.createChatCompletion({
      model: chatGptModel,
      messages: [
        {
          role: 'system',
          content:
            'You are an SEO-friendly blog post generator called BlogStandard. Output markdown without frontmatter.',
        },
        { role: 'user', content: blogPrompt },
      ],
    });

    const postContent = blogResponse.data.choices?.[0]?.message?.content;
    if (!postContent) {
      return res.status(500).json({ error: 'Failed to generate blog post' });
    }

    // Generate SEO Metadata
    const seoPrompt = `
      Generate an SEO-friendly title and meta description for the following blog post:
      ---
      ${postContent}
      ---
      Output JSON format:
      {
        "title": "Example title",
        "metaDescription": "Example meta description"
      }
    `;

    const seoResponse = await openai.createChatCompletion({
      model: chatGptModel,
      messages: [
        {
          role: 'system',
          content:
            'You are an SEO-friendly blog post generator called BlogStandard. Output JSON only, without HTML tags.',
        },
        { role: 'user', content: seoPrompt },
      ],
      response_format: { type: 'json_object' },
    });

    const seoData = seoResponse.data.choices?.[0]?.message?.content;
    if (!seoData) {
      return res.status(500).json({ error: 'Failed to generate SEO metadata' });
    }

    const { title, metaDescription } = JSON.parse(seoData);

    // Decrease token count and insert post atomically
    const [updateResult, post] = await Promise.all([
      db
        .collection('users')
        .updateOne({ auth0Id: user.sub }, { $inc: { availableTokens: -1 } }),
      db.collection('posts').insertOne({
        postContent,
        title,
        metaDescription,
        topic,
        keywords,
        userId: userProfile._id,
        created: new Date(),
      }),
    ]);

    if (!updateResult.modifiedCount) {
      return res.status(500).json({ error: 'Failed to update token count' });
    }

    res.status(200).json({ postId: post.insertedId });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
