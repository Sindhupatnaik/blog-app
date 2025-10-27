'use client';

import { useState } from 'react';
import styles from './signup.module.css';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('Signup successful! Redirecting to login...');
        setFormData({ name: '', email: '', password: '' });
        setTimeout(()=>router.push('/login'), 900);
      } else {
        setMessage(data.error || 'Error during signup');
      }
    } catch (error) {
      setMessage('Error connecting to server');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Sign Up</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input className={styles.input} type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
        <input className={styles.input} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input className={styles.input} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit" className={styles.button}>Sign Up</button>
      </form>
      {message && <p className={message.includes('successful') ? styles.success : styles.error}>{message}</p>}
    </div>
  );
}