'use client';

import { useState } from 'react';
import styles from './create.module.css';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Create(){
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e)=>{
    e.preventDefault();
    setMsg('');
    try{
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, content })
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard');
      } else {
        setMsg(data.error || 'Error creating post');
      }
    }catch(e){ setMsg('Server error'); }
  };

  if (!user) return <div className={styles.wrap}><p className={styles.meta}>Please <a href="/login">login</a> to write a blog.</p></div>;

  return (
    <div className={styles.wrap}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input className={styles.input} value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" required />
        <textarea className={styles.textarea} value={content} onChange={e=>setContent(e.target.value)} placeholder="Write your blog content here..." required />
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className={styles.btn} type="submit">Publish</button>
          {msg && <span className={styles.meta}>{msg}</span>}
        </div>
      </form>
    </div>
  );
}
