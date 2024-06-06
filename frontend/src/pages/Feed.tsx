import { useEffect, useState } from "react";
import TweetDev from "../components/TweetDev";
import "../styles/Feed.css";
import { getSession } from "../services/sessionService";
import { fetchPosts } from "../api/post";
import { Post } from "../interfaces";
function Feed() {
    const [posts, setPosts] = useState<Post[]>([]);

        useEffect(() => {
            const fetchData = async () => {
              try {
                const sessionToken = getSession();
                
                if (sessionToken) {
                  const postsData = await fetchPosts(sessionToken);
                  setPosts(postsData);
                  console.log(postsData)
                } else {
                  console.error("Error fetching posts");
                }
              } catch (error) {
                console.error("Error fetching posts:", error);
              }
            };
        
            fetchData();
          }, []);
    return (
        <div className="feed-container">
              {posts.map((_, index) => (
          <TweetDev key={index} postInfo={posts[index]} />
        ))}
        </div>
    );
}

export default Feed;