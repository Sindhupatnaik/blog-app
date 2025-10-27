'use client';

import { useEffect, useState } from 'react';
import styles from './blogs.module.css';
import Link from 'next/link';

export default function BlogsPage(){
  const [blogs, setBlogs] = useState([]);

  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch('/api/blogs');
        const data = await res.json();
        setBlogs(Array.isArray(data)?data:[]);
      }catch(e){ setBlogs([]); }
    }
    load();
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
