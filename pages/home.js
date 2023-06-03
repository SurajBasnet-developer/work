// pages/index.js

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await axios.get("/api/posts");
      setPosts(response.data);
    } catch (error) {
      console.log("Error fetching posts:", error);
    }
  }

  return (
    <div>
      <h1>Home Page</h1>
      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>

            <Link href="/create">
              <h2>Create a new blog</h2>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
