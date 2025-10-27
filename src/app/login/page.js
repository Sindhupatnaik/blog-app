'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import { useAuth } from '../context/AuthContext';

export default function LoginPage(){
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try{
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (res.ok) {
        // store token and user
        login(data.user, data.token);
        // also set cookie for server-side APIs
        document.cookie = `auth_token=${data.token}; path=/`;
        router.push('/dashboard');
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch(err){
      setMessage('Server error');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Log in</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input className={styles.input} name="email" type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
        <input className={styles.input} name="password" type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        <button className={styles.button} type="submit">Login</button>
      </form>
      {message && <p className={message.includes('failed')||message.includes('error') ? styles.error : styles.success}>{message}</p>}
      <p className={styles.meta}>Don&apos;t have an account? <a href="/signup">Sign up</a></p>
    </div>
  );
}
