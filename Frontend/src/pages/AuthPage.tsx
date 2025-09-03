import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useProfile } from '../lib/profileContext';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
// import { Globe } from '../components/ui/magicui/globe';
import { motion as m } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Typography } from '../components/ui/typography';

const FormPanel: React.FC<{
  mode: 'signin' | 'signup',
  signinForm: any,
  signupForm: any,
  handleSignin: any,
  handleSignup: any,
  handleSigninChange: any,
  handleSignupChange: any,
  showSigninPassword: boolean,
  setShowSigninPassword: any,
  showSignupPassword: boolean,
  setShowSignupPassword: any,
  loading: boolean,
  message: string,
  setMessage?: any,
  forgotOpen?: boolean,
  setForgotOpen?: any,
  forgotEmail?: string,
  setForgotEmail?: any,
  forgotMsg?: string,
  setForgotMsg?: any
}> = (props) => {
  const {
    mode, signinForm, signupForm, handleSignin, handleSignup, handleSigninChange, handleSignupChange,
    showSigninPassword, setShowSigninPassword, showSignupPassword, setShowSignupPassword,
    loading, message, setMessage, forgotOpen, setForgotOpen, forgotEmail, setForgotEmail, forgotMsg, setForgotMsg
  } = props;
  return (
    <m.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto"
    >
      <Card className="shadow-none border-0 bg-transparent p-0 transition-all duration-500 hover:scale-[1.02] hover:shadow-emerald-300">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6 gap-2 animate-fade-in"
        >
          <Button
            variant={mode === 'signin' ? 'default' : 'outline'}
            className={cn(
              'mr-2 transition-all duration-300',
              mode === 'signin' && 'scale-105 shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-700 text-white',
              'hover:scale-110 hover:shadow-emerald-200 active:scale-95'
            )}
            onClick={() => { props.setMessage(''); props.setForgotOpen && props.setForgotOpen(false); props.setForgotMsg && props.setForgotMsg(''); props.setForgotEmail && props.setForgotEmail(''); if (mode !== 'signin') props.setMessage && props.setMessage(''); }}
          >
            Sign In
          </Button>
          <Button
            variant={mode === 'signup' ? 'default' : 'outline'}
            className={cn(
              'transition-all duration-300',
              mode === 'signup' && 'scale-105 shadow-lg bg-gradient-to-r from-emerald-500 to-emerald-700 text-white',
              'hover:scale-110 hover:shadow-emerald-200 active:scale-95'
            )}
            onClick={() => { props.setMessage(''); props.setForgotOpen && props.setForgotOpen(false); props.setForgotMsg && props.setForgotMsg(''); props.setForgotEmail && props.setForgotEmail(''); if (mode !== 'signup') props.setMessage && props.setMessage(''); }}
          >
            Sign Up
          </Button>
        </motion.div>
        <AnimatePresence mode="wait">
          {mode === 'signin' ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h2" size="xl" weight="bold" className="mb-6 text-center bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">Sign In</Typography>
              </motion.div>
              <motion.form
                onSubmit={handleSignin}
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div>
                  <Label htmlFor="signin-email">Email</Label>
                  <Input id="signin-email" name="email" type="email" value={signinForm.email} onChange={handleSigninChange} required />
                </div>
                <div>
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      name="password"
                      type={showSigninPassword ? 'text' : 'password'}
                      value={signinForm.password}
                      onChange={handleSigninChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSigninPassword((v: boolean) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showSigninPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-emerald-700 hover:underline focus:outline-none"
                    onClick={() => { props.setForgotOpen(true); props.setForgotEmail(signinForm.email); props.setForgotMsg(''); }}
                  >
                    Forgot password?
                  </button>
                </div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-md" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </motion.div>
                {/* Forgot Password Modal */}
                <AnimatePresence>
                  {props.forgotOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs relative"
                      >
                        <button
                          className="absolute top-2 right-2 text-gray-400 hover:text-emerald-600 text-xl font-bold"
                          onClick={() => props.setForgotOpen(false)}
                          aria-label="Close"
                        >
                          ×
                        </button>
                        <Typography variant="h3" size="lg" weight="bold" className="mb-2 text-center">Reset Password</Typography>
                        <Typography variant="p" size="sm" className="mb-4 text-center text-gray-500">Enter your email to receive a reset link.</Typography>
                        <form
                          onSubmit={e => {
                            e.preventDefault();
                            props.setForgotMsg('');
                            setTimeout(() => {
                              props.setForgotMsg('If this email exists, a reset link has been sent.');
                            }, 1200);
                          }}
                          className="space-y-4"
                        >
                          <Input
                            type="email"
                            placeholder="Email address"
                            value={props.forgotEmail}
                            onChange={e => props.setForgotEmail(e.target.value)}
                            required
                          />
                          <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-md">Send Reset Link</Button>
                          {props.forgotMsg && (
                            <div className="text-emerald-600 text-xs text-center mt-2 animate-fade-in">{props.forgotMsg}</div>
                          )}
                        </form>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Typography variant="h2" size="xl" weight="bold" className="mb-6 text-center bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">Sign Up</Typography>
              </motion.div>
              <motion.form
                onSubmit={handleSignup}
                className="space-y-4"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <div>
                  <Label htmlFor="signup-name">Name</Label>
                  <Input id="signup-name" name="name" value={signupForm.name} onChange={handleSignupChange} required />
                </div>
                <div>
                  <Label htmlFor="signup-email">Email</Label>
                  <Input id="signup-email" name="email" type="email" value={signupForm.email} onChange={handleSignupChange} required />
                </div>
                <div>
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      name="password"
                      type={showSignupPassword ? 'text' : 'password'}
                      value={signupForm.password}
                      onChange={handleSignupChange}
                      required
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword((v: boolean) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-emerald-600 focus:outline-none"
                      tabIndex={-1}
                    >
                      {showSignupPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-md" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                  </Button>
                </motion.div>
              </motion.form>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {message && (
            <motion.div
              className={cn(
                'mt-4 text-center',
                message.toLowerCase().includes('success') ? 'text-emerald-600' : 'text-red-500'
              )}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4 }}
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </m.div>
  );
};

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [signinForm, setSigninForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  // Avatar removed for signup
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const navigate = useNavigate();
  const { setProfile } = useProfile();

  const handleSigninChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSigninForm({ ...signinForm, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  // Avatar upload removed

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signinForm),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Signin successful!');
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        if (data.user) {
          setProfile({
            name: data.user.name,
            email: data.user.email,
            avatar: data.user.avatar || ''
          });
          localStorage.setItem('profile', JSON.stringify({
            name: data.user.name,
            email: data.user.email,
            avatar: data.user.avatar || ''
          }));
        }
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setMessage(data.message || 'Signin failed');
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const payload = { ...signupForm };
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Signup successful!');
        setProfile({
          name: signupForm.name,
          email: signupForm.email,
          avatar: ''
        });
        localStorage.setItem('profile', JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          avatar: ''
        }));
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (err) {
      setMessage('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-200 via-emerald-100 to-white px-2">
      {/* MagicUI floating shapes */}
      <m.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute top-10 left-10 w-32 h-32 bg-emerald-300/30 rounded-full blur-2xl z-0 animate-float-slow"
      />
      <m.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.4 }}
        className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl z-0 animate-float"
      />
      <div className="relative z-10 w-full max-w-4xl flex flex-col md:flex-row items-stretch justify-center gap-0">
        {/* Left Card */}
        <Card className="flex-1 rounded-2xl md:rounded-l-2xl md:rounded-r-none shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-400 text-white flex flex-col justify-center items-center min-h-[400px] p-8 md:p-12">
          <CardContent className="flex flex-col items-center justify-center h-full w-full">
            {mode === 'signin' ? (
              <>
                <Typography variant="h2" size="2xl" weight="bold" className="mb-4 text-center drop-shadow-lg">
                  Welcome Back!
                </Typography>
                <Typography variant="p" className="mb-8 text-center text-white/90 text-lg">
                  To keep connected with us please login with your personal info
                </Typography>
                <m.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outline"
                    className={cn(
                      'rounded-full px-8 py-2 border-2 text-lg font-bold transition-all shadow-md',
                      'border-white text-black hover:bg-white/10'
                    )}
                    onClick={() => {
                      setMode('signup');
                      setMessage('');
                    }}
                  >
                    SIGN UP
                  </Button>
                </m.div>
              </>
            ) : (
              <>
                <Typography variant="h2" size="2xl" weight="bold" className="mb-4 text-center drop-shadow-lg">
                  Hello, Friend!
                </Typography>
                <Typography variant="p" className="mb-8 text-center text-white/90 text-lg">
                  Enter your personal details and start your journey with us
                </Typography>
                <m.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="outline"
                    className={cn(
                      'rounded-full px-8 py-2 border-2 text-lg font-bold transition-all shadow-md',
                      'border-white text-black hover:bg-white/10'
                    )}
                    onClick={() => {
                      setMode('signin');
                      setMessage('');
                    }}
                  >
                    SIGN IN
                  </Button>
                </m.div>
              </>
            )}
          </CardContent>
        </Card>
        {/* Right Card */}
        <Card className="flex-1 rounded-2xl md:rounded-r-2xl md:rounded-l-none shadow-lg bg-white flex flex-col justify-center items-center min-h-[400px] p-8 md:p-12">
          <CardContent className="flex flex-col items-center justify-center h-full w-full">
            <FormPanel
              mode={mode}
              signinForm={signinForm}
              signupForm={signupForm}
              handleSignin={handleSignin}
              handleSignup={handleSignup}
              handleSigninChange={handleSigninChange}
              handleSignupChange={handleSignupChange}
              showSigninPassword={showSigninPassword}
              setShowSigninPassword={setShowSigninPassword}
              showSignupPassword={showSignupPassword}
              setShowSignupPassword={setShowSignupPassword}
              loading={loading}
              message={message}
              setMessage={setMessage}
              forgotOpen={forgotOpen}
              setForgotOpen={setForgotOpen}
              forgotEmail={forgotEmail}
              setForgotEmail={setForgotEmail}
              forgotMsg={forgotMsg}
              setForgotMsg={setForgotMsg}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
