'use client';

import { useEffect, useState } from 'react';
import styles from './blogs.module.css';
import Link from 'next/link';

export default function BlogsPage(){
  const [blogs, setBlogs] = useState([]);

  useEffect(()=>{
    // Sample blogs data
    const sampleBlogs = [
      {
        id: 1,
        title: "The Future of Web Development: What's Next in 2026",
        content: "As we approach 2026, the landscape of web development continues to evolve at an unprecedented pace. From WebAssembly becoming mainstream to AI-powered development tools, we're seeing a radical transformation in how we build for the web. Edge computing and serverless architectures are becoming the new normal, while frameworks like Next.js and Remix are pushing the boundaries of what's possible on the web platform.",
        author: { name: "Sarah Chen" },
        createdAt: "2025-10-15T10:00:00Z"
      },
      {
        id: 2,
        title: "Mastering Modern CSS Techniques",
        content: "CSS has come a long way from being just a styling language. With features like CSS Grid, Container Queries, and CSS Custom Properties, we now have powerful tools to create responsive and maintainable layouts. This post explores advanced CSS techniques that will elevate your web design skills and help you create more elegant solutions.",
        author: { name: "Alex Rodriguez" },
        createdAt: "2025-10-20T15:30:00Z"
      },
      {
        id: 3,
        title: "Building Sustainable and Scalable Applications",
        content: "Scalability isn't just about handling more users – it's about creating sustainable systems that can grow and adapt over time. This guide covers essential principles of building scalable applications, from choosing the right architecture to implementing efficient caching strategies and optimizing database queries.",
        author: { name: "Maya Patel" },
        createdAt: "2025-10-25T09:15:00Z"
      },
      {
        id: 4,
        title: "The Impact of AI on Software Development",
        content: "Artificial Intelligence is revolutionizing how we write and maintain code. From intelligent code completion to automated testing and bug detection, AI tools are becoming an integral part of the modern developer's toolkit. Learn how to leverage these tools effectively while understanding their limitations and potential pitfalls.",
        author: { name: "James Wilson" },
        createdAt: "2025-11-01T14:45:00Z"
      }
    ];
    setBlogs(sampleBlogs);
  },[]);

  return (
    <div className={styles.wrap}>
      <h2>All Blogs</h2>
      <div className={styles.grid}>
        {blogs.map(b=> (
          <div className={styles.card} key={b.id}>
            <h3 className={styles.title}><Link href={`/blog/${b.id}`}>{b.title}</Link></h3>
            <p className={styles.snippet}>{b.content.length>200?b.content.substring(0,200)+'...':b.content}</p>
            <div className={styles.meta}>By {b.author?.name || 'Unknown'} • {new Date(b.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
