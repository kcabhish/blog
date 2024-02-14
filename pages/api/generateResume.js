import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { Configuration, OpenAIApi } from 'openai';
import clientPromise from '../../lib/mongodb';

export default withApiAuthRequired(async function handler(req, res) {

    const { user } = await getSession(req, res);
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
    const { title, description, resume } = req.body;

    console.log('IN GENERATE RESUME SECTION');
    console.log(req.body);


    if (!title || !description || !resume || title.length > 80 || description.length > 10000 || resume.length > 10000) {
        res.status(422);
        return;
    }

    const chatGptModel = 'gpt-3.5-turbo-1106';
    const config = new Configuration({
        apiKey: process.env.OPENAI_API_KEY
    });
    const openai = new OpenAIApi(config);

    const prompt = `Generate me a long and seo friendly post based on the following job description for the role of ${title} delimited by triple hyphens
    ---
    ${description}
    ---
    Using the resume below delimited by triple hyphens:
    ---
    ${resume}
    ---
    The output json must be in following format:
    {
        "jobTitle": "example title",
        "companyName": "Name of the company for which the job description is"
        "jobDescription": "example job description",
        "qualifications": "required qualifications for the job",
        "desiredQualifications": "provide info on the desired qualifications if it is present",
        "salaryRange": "Recommend salary range to the user based on their experience inrelation to the job description and current market evaluation",
        "benefits": "provide information on the benefit package",
        "analysis": "provide analysis for the candidate based on job description and resume",
        "coverLetter": "generate a professional cover letter with professional summary that showcases my skills and experience releven to ${title}",
        "isQualified": "return a boolean value as true if the user is qualified for the job else return false"
    }
    `;

    const jobAnalyzer = await openai.createChatCompletion({
        model: chatGptModel,
        messages: [
            {
                role: "system",
                content: `
                You are job description analyzer called Jaggu. You are designed to analyze the job description provided by the user.
                Your job is to extract and identify key elements such as job title, responsibilities, qualifications, salary range and any specific skills or requirements mentioned.
                You will provide honest feedback if the user is qualified for the job based upon the experience provided in the resume.
                If qualified you will suggest the salary range that the user can ask for based upon the current market value for the position.
                You will address the user by name provided.
                You will avoid using pronouns where ever possible.
                You are also designed to generate a professional coverletter for the job.
                You are designed to output markdown without frontmatter.
                `
            },
            {
                role: "user",
                content: prompt
            }],
        response_format: { type: "json_object" }
    });

    const jobAnalyzerResponse = jobAnalyzer.data.choices[0]?.message?.content;
    console.log(jobAnalyzerResponse);

    const { jobTitle, jobDescription, qualifications, desiredQualifications, salaryRange, benefits, analysis, isQualified, coverLetter, companyName } = JSON.parse(jobAnalyzerResponse);

    await db.collection("users").updateOne({
        auth0Id: user.sub
    }, {
        $inc: {
            availableTokens: -1
        }
    });
    const job = await db.collection("jobs").insertOne({
        title: jobTitle,
        description: jobDescription,
        qualifications, desiredQualifications, salaryRange, benefits, analysis, isQualified, coverLetter,companyName,
        userId: userProfile._id,
        created: new Date()
    })

    res.status(200).json({
        jobId: job.insertedId,
        title: jobTitle,
        description: jobDescription,
        qualifications,
        desiredQualifications,
        salaryRange,
        benefits,
        analysis,
        isQualified,
        coverLetter,
        companyName
    })
});