'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './edit.module.css';

export default function EditPage(){
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const router = useRouter();

  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (res.ok){ setTitle(data.title); setContent(data.content); }
        setLoading(false);
      }catch(e){ setLoading(false); }
    }
    if (id) load();
  },[id]);

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try{
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/blogs/${id}`, { method: 'PUT', headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify({ title, content }) });
      const data = await res.json();
      if (res.ok) router.push(`/blog/${id}`);
      else setMsg(data.error||'Update failed');
    }catch(e){ setMsg('Server error'); }
  };

  if (loading) return <div style={{padding:20}}>Loading...</div>;

  return (
    <div className={styles.wrap}>
      <h2>Edit Post</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input className={styles.input} value={title} onChange={e=>setTitle(e.target.value)} required />
        <textarea className={styles.textarea} value={content} onChange={e=>setContent(e.target.value)} required />
        <div style={{display:'flex',gap:8}}>
          <button className={styles.btn} type="submit">Save</button>
          {msg && <span className={styles.meta}>{msg}</span>}
        </div>
      </form>
    </div>
  );
}
