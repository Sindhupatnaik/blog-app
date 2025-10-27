'use client';

import { useEffect, useState } from 'react';
import styles from './dashboard.module.css';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function Dashboard(){
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);

  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch('/api/blogs');
        const all = await res.json();
        if (Array.isArray(all) && user) {
          setPosts(all.filter(b=>b.authorId===user.id || b.author?.id===user.id));
        } else {
          setPosts([]);
        }
      }catch(e){ setPosts([]); }
    }
    load();
  },[user]);

  if (!user) return (<div className={styles.wrap}><p className={styles.empty}>Please <Link href="/login">login</Link> to see your dashboard.</p></div>);

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Posts</h2>
        <Link href="/create"><button className={styles.btn}>Write Blog</button></Link>
      </div>
      <div className={styles.grid}>
        {posts.length===0 ? (
          <div className={styles.empty}>You have no posts yet. <Link href="/create">Write your first blog</Link>.</div>
        ) : posts.map(p=> (
          <div key={p.id} className={styles.card}>
            <h3>{p.title}</h3>
            <div className={styles.meta}>{new Date(p.createdAt).toLocaleString()}</div>
            <p className={styles.meta}>By {p.author?.name || 'You'}</p>
            <div className={styles.actions}>
              <Link className={styles.link} href={`/blog/${p.id}`}>View</Link>
              <Link className={styles.link} href={`/edit/${p.id}`}>Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
