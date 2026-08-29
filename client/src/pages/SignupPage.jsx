import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import AuthShell, { Field, inputClass } from '../components/auth/AuthShell';
import { registerUser } from '../redux/slices/authSlice';

export default function SignupPage() {
  const dispatch = useDispatch(); const navigate = useNavigate(); const { user, status } = useSelector((state) => state.auth);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  if (user) return <Navigate to="/" replace />;
  const submit = async (values) => { const { confirmPassword, ...payload } = values; const result = await dispatch(registerUser(payload)); if (registerUser.fulfilled.match(result)) { toast.success('Your account is ready!'); navigate('/'); } else toast.error(result.payload || 'Unable to create account'); };
  return <AuthShell title="Create your account" subtitle="Fresh groceries, delivered with less hassle." footer={<>Already have an account? <Link className="font-bold text-brand-700 hover:underline" to="/login">Sign in</Link></>}><form className="mt-7 space-y-4" onSubmit={handleSubmit(submit)} noValidate><Field label="Full name" error={errors.name}><input className={inputClass} autoComplete="name" {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Enter at least 2 characters' } })} /></Field><Field label="Email address" error={errors.email}><input className={inputClass} type="email" autoComplete="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} /></Field><Field label="Phone number" error={errors.phone}><input className={inputClass} type="tel" autoComplete="tel" {...register('phone', { required: 'Phone number is required', minLength: { value: 7, message: 'Enter a valid phone number' } })} /></Field><Field label="Password" error={errors.password}><input className={inputClass} type="password" autoComplete="new-password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} /></Field><Field label="Confirm password" error={errors.confirmPassword}><input className={inputClass} type="password" autoComplete="new-password" {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === watch('password') || 'Passwords do not match' })} /></Field><button disabled={status === 'loading'} className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-60">{status === 'loading' ? 'Creating account…' : 'Create account'}</button></form></AuthShell>;
}
