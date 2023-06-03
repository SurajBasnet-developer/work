import { MongoClient } from "mongodb";
import Cors from "cors";

const cors = Cors({
  origin: "*", // Replace with the origin(s) you want to allow
  methods: ["GET", "POST"], // Add the HTTP methods you want to allow
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

async function connectToDatabase() {
  const client = await MongoClient.connect(
    "mongodb+srv://surajdev:surajdev999@cluster0.9gj5ogk.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  return client.db();
}

export default async function handler(req, res) {
  await runMiddleware(req, res, cors); // Apply CORS middleware

  if (req.method === "GET") {
    const db = await connectToDatabase();
    const collection = db.collection("blog");

    const posts = await collection.find().toArray();
    res.status(200).json(posts);
  } else if (req.method === "POST") {
    const { title, content } = req.body;

    if (!title || !content) {
      res.status(400).json({ error: "Title and content are required." });
      return;
    }

    const db = await connectToDatabase();
    const collection = db.collection("blog");

    const post = { title, content };
    const result = await collection.insertOne(post);

    res.status(201).json({
      message: "Post created successfully",
      post_id: result.insertedId,
    });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
