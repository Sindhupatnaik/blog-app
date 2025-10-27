'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './blog.module.css';
import { useAuth } from '../../context/AuthContext';

export default function BlogDetail(){
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState('');
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(()=>{
    async function load(){
      try{
        const res = await fetch(`/api/blogs/${id}`);
        const data = await res.json();
        if (res.ok) setBlog(data);
        else setError(data.error||'Not found');
      }catch(e){ setError('Server error'); }
    }
    if (id) load();
  },[id]);

  const handleDelete = async ()=>{
    if (!confirm('Delete this post?')) return;
    try{
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) router.push('/dashboard');
      else alert(data.error||'Delete failed');
    }catch(e){ alert('Server error'); }
  };

  if (error) return <div style={{padding:20}}>{error}</div>;
  if (!blog) return <div style={{padding:20}}>Loading...</div>;

  return (
    <article className={styles.wrap}>
      <h1 className={styles.title}>{blog.title}</h1>
      <div className={styles.meta}>By {blog.author?.name} • {new Date(blog.createdAt).toLocaleString()}</div>
      <div className={styles.content}>{blog.content}</div>
      {user && (user.id===blog.authorId || user.id===blog.author?.id) && (
        <div style={{marginTop:16}}>
          <a href={`/edit/${blog.id}`} style={{marginRight:8}}>Edit</a>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </article>
  );
}
