'use client';

import { useState } from 'react';
import { useStorage } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Lock, Cloud, HardDrive } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { adapter, mode, isReady } = useStorage();

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 4) {
      setError(`Password must be at least ${mode === 'local' ? '4' : '6'} characters`);
      setLoading(false);
      return;
    }

    try {
      const result = isLogin
        ? await adapter.signIn!(email, password)
        : await adapter.signUp!(email, password);

      if (result.error) {
        setError(result.error.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/logs');
          router.refresh();
        }, 500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md glass border-slate-800">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <CardDescription>
            {mode === 'local' ? (
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <HardDrive className="w-4 h-4" />
                <span>Local Storage Mode</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 text-slate-400">
                <Cloud className="w-4 h-4" />
                <span>Cloud Sync Mode</span>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-red-500/10 border-red-500/50 text-red-400">
                {error}
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-500/10 border-green-500/50 text-green-400">
                {isLogin ? 'Signed in!' : 'Account created!'} Redirecting...
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">
                {mode === 'local' ? 'Username' : 'Email'}
              </Label>
              <Input
                id="email"
                type={mode === 'local' ? 'text' : 'email'}
                placeholder={mode === 'local' ? 'your-username' : 'you@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || success}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {mode === 'local' ? 'PIN (4+ digits)' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={mode === 'local' ? 'Enter 4+ digit PIN' : 'At least 6 characters'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || success}
              />
            </div>
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm {mode === 'local' ? 'PIN' : 'Password'}
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading || success}
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-12 text-lg bg-blue-500 hover:bg-blue-600"
              disabled={loading || success}
            >
              {loading ? (isLogin ? 'Signing in...' : 'Creating account...') : 
               success ? 'Success!' : 
               isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-slate-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setSuccess(false);
              }}
              className="text-blue-500 hover:text-blue-400 underline"
              disabled={loading || success}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
          
          {mode === 'local' && (
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/50 rounded-lg text-xs text-yellow-400">
              <strong>Note:</strong> Local mode stores data only in your browser. 
              Use Settings to export/backup your data.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
