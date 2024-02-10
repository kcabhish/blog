
import Cors from 'micro-cors';
import stripeInit from 'stripe';
import clientPromise from '../../../lib/mongodb';
import { verifyStripe } from '../../../utils/verifyStripe';

const cors = Cors({
    allowMethods: ['POST', 'HEAD']
});

export const config = {
    api: {
        bodyParser: false
    }
};

const stripe = stripeInit(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const connectToDatabase = async () => {
    const client = await clientPromise;
    return client.db("BlogTopia");
};

const handlePaymentIntentSucceeded = async (event) => {
    const db = await connectToDatabase();
    const paymentIntent = event.data.object;
    const auth0Id = paymentIntent.metadata.sub;


    try {
        await db.collection("users").updateOne({
            auth0Id
        }, {
            $inc: {
                availableTokens: 10
            },
            $setOnInsert: {
                auth0Id
            }
        }, {
            upsert: true
        });
    } catch (error) {
        console.error('Error while updating user:', error);
        throw error;
    }
};

const handler = async (req, res) => {
    console.log("Handler getting hit");

    if (req.method !== 'POST') {
        res.status(405).end(); // Method Not Allowed
        return;
    }

    let event;
    try {
        event = await verifyStripe({
            req,
            stripe,
            endpointSecret
        });
    } catch (error) {
        console.error("Error verifying Stripe event:", error);
        res.status(400).json({ error: 'Invalid request' });
        return;
    }

    switch (event.type) {
        case 'payment_intent.succeeded':
            try {
                await handlePaymentIntentSucceeded(event);
            } catch (error) {
                console.error("Error handling payment intent:", error);
                res.status(500).json({ error: 'Internal server error' });
                return;
            }
            break;
        default:
            console.log("Unhandled Event", event.type);
    }

    res.status(200).json({ received: true });
};

export default cors(handler);
