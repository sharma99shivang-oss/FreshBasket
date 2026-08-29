import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthShell, { Field, inputClass } from '../components/auth/AuthShell';
import { useDispatch } from 'react-redux';
import { resetUserPassword } from '../redux/slices/authSlice';

export default function ResetPasswordPage() {
  const { token } = useParams(); const navigate = useNavigate(); const dispatch = useDispatch(); const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const submit = async (values) => { const result = await dispatch(resetUserPassword({ token, ...values })); if (resetUserPassword.fulfilled.match(result)) { toast.success('Password reset successfully'); navigate('/'); } else toast.error(result.payload || 'Unable to reset password'); };
  return <AuthShell title="Choose a new password" subtitle="Use at least 8 characters to secure your account." footer={<Link className="font-bold text-brand-700 hover:underline" to="/login">Back to sign in</Link>}><form className="mt-7 space-y-4" onSubmit={handleSubmit(submit)} noValidate><Field label="New password" error={errors.password}><input className={inputClass} type="password" autoComplete="new-password" {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} /></Field><Field label="Confirm new password" error={errors.confirmPassword}><input className={inputClass} type="password" autoComplete="new-password" {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === watch('password') || 'Passwords do not match' })} /></Field><button disabled={isSubmitting} className="w-full rounded-xl bg-brand-600 py-3 font-bold text-white hover:bg-brand-700 disabled:opacity-60">{isSubmitting ? 'Saving…' : 'Reset password'}</button></form></AuthShell>;
}
