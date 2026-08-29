import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import AuthShell, { Field, inputClass } from '../components/auth/AuthShell';
import { loginUser } from '../redux/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch(); const navigate = useNavigate(); const location = useLocation(); const { user, status } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: '', password: '' } });
  if (user) return <Navigate to="/" replace />;
  const submit = async (values) => { const result = await dispatch(loginUser(values)); if (loginUser.fulfilled.match(result)) { toast.success(`Welcome back, ${result.payload.user.name.split(' ')[0]}!`); navigate(location.state?.from || '/'); } else toast.error(result.payload || 'Unable to sign in'); };
  return <AuthShell title="Welcome back" subtitle="Sign in to manage your FreshBasket orders." footer={<>New to FreshBasket? <Link className="font-bold text-brand-700 hover:underline" to="/signup">Create an account</Link></>}><form className="mt-7 space-y-4" onSubmit={handleSubmit(submit)} noValidate><Field label="Email address" error={errors.email}><input className={inputClass} type="email" autoComplete="email" {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' } })} /></Field><Field label="Password" error={errors.password}><input className={inputClass} type="password" autoComplete="current-password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })} /></Field><div className="text-right"><Link to="/forgot-password" className="text-sm font-semibold text-brand-700 hover:underline">Forgot password?</Link></div><button disabled={status === 'loading'} className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60">{status === 'loading' ? 'Signing in…' : 'Sign in'}</button></form></AuthShell>;
}
