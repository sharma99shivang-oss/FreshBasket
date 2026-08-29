import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthShell, { Field, inputClass } from '../components/auth/AuthShell';
import { requestPasswordReset } from '../services/authService';

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false); const [devToken, setDevToken] = useState(null); const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const submit = async ({ email }) => { setLoading(true); try { const data = await requestPasswordReset(email); setSent(true); setDevToken(data.resetToken || null); toast.success('Reset instructions requested'); } catch (error) { toast.error(error.response?.data?.message || 'Unable to request a reset'); } finally { setLoading(false); } };
  return <AuthShell title="Reset your password" subtitle="Enter your email and we’ll send reset instructions." footer={<Link className="font-bold text-brand-700 hover:underline" to="/login">Back to sign in</Link>}>{sent ? <div className="mt-7 rounded-xl bg-brand-50 p-4 text-sm text-brand-700">If there’s an account for that email, password reset instructions are on their way.{devToken && <Link className="mt-3 block font-bold underline" to={`/reset-password/${devToken}`}>Continue with the local development reset link</Link>}</div> : <form className="mt-7 space-y-4" onSubmit={handleSubmit(submit)} noValidate><Field label="Email address" error={errors.email}><input className={inputClass} type="email" autoComplete="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} /></Field><button disabled={loading} className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-60">{loading ? 'Sending…' : 'Send reset instructions'}</button></form>}</AuthShell>;
}
