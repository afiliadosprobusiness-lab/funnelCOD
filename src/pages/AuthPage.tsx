import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { toast } from "@/hooks/use-toast";
import {
  SUPERADMIN_DEFAULT_PASSWORD,
  SUPERADMIN_EMAIL,
  ensureAuthSeed,
  loginWithGoogle,
  loginWithPassword,
  registerWithPassword,
} from "@/store/auth-store";
import { GoogleProfile } from "@/types/auth";
import { useAuthUser } from "@/hooks/use-auth";

interface RedirectState {
  from?: string;
}

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAuthUser();
  const [activeTab, setActiveTab] = useState<"login" | "register">(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    return tab === "register" ? "register" : "login";
  });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectPath = useMemo(() => {
    const state = (location.state || {}) as RedirectState;
    return state.from || "/dashboard";
  }, [location.state]);

  useEffect(() => {
    ensureAuthSeed();
  }, []);

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, redirectPath, user]);

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    if (tab === "register" || tab === "login") {
      setActiveTab(tab);
    }
  }, [location.search]);

  const handleGoogleLogin = (profile: GoogleProfile) => {
    const result = loginWithGoogle(profile);
    if (!result.ok) {
      toast({
        title: "Google login failed",
        description: result.error || "Try again in a moment.",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Welcome", description: `Signed in as ${result.user?.email}` });
    navigate("/dashboard", { replace: true });
  };

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const result = loginWithPassword(loginForm);
    setIsSubmitting(false);
    if (!result.ok) {
      toast({ title: "Login failed", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "Welcome back", description: `Signed in as ${result.user?.email}` });
    navigate(redirectPath, { replace: true });
  };

  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      toast({ title: "Cannot register", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    const result = registerWithPassword({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password,
    });
    setIsSubmitting(false);
    if (!result.ok) {
      toast({ title: "Cannot register", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "Account created", description: "Your account is ready." });
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100">
      <div className="mx-auto flex w-full max-w-md flex-col gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 self-center rounded-lg px-2 py-1 text-sm text-slate-300 transition hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/70"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
            <Layers className="h-4 w-4 text-white" />
          </span>
          FunnelCOD
        </Link>

        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Access your account</CardTitle>
            <CardDescription className="text-slate-300">
              Login with Google or register with email and password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-800 text-slate-300">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4 pt-4">
                <GoogleSignInButton
                  onSuccess={handleGoogleLogin}
                  onError={(message) => toast({ title: "Google login error", description: message, variant: "destructive" })}
                />
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-700" />
                  </div>
                  <p className="relative mx-auto w-fit bg-slate-900 px-2 text-xs text-slate-400">or</p>
                </div>
                <form className="space-y-3" onSubmit={handleLoginSubmit}>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      autoComplete="email"
                      value={loginForm.email}
                      onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      autoComplete="current-password"
                      value={loginForm.password}
                      onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                      required
                    />
                  </div>
                  <Button className="w-full btn-gradient" type="submit" disabled={isSubmitting}>
                    Sign in
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="space-y-4 pt-4">
                <GoogleSignInButton
                  onSuccess={handleGoogleLogin}
                  onError={(message) => toast({ title: "Google login error", description: message, variant: "destructive" })}
                />
                <div className="relative py-1">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-700" />
                  </div>
                  <p className="relative mx-auto w-fit bg-slate-900 px-2 text-xs text-slate-400">or</p>
                </div>
                <form className="space-y-3" onSubmit={handleRegisterSubmit}>
                  <div className="space-y-1.5">
                    <Label htmlFor="register-name">Name</Label>
                    <Input
                      id="register-name"
                      autoComplete="name"
                      value={registerForm.name}
                      onChange={(event) => setRegisterForm((prev) => ({ ...prev, name: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      autoComplete="email"
                      value={registerForm.email}
                      onChange={(event) => setRegisterForm((prev) => ({ ...prev, email: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      autoComplete="new-password"
                      value={registerForm.password}
                      onChange={(event) => setRegisterForm((prev) => ({ ...prev, password: event.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="register-password-confirm">Confirm password</Label>
                    <Input
                      id="register-password-confirm"
                      type="password"
                      autoComplete="new-password"
                      value={registerForm.confirmPassword}
                      onChange={(event) => setRegisterForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                      required
                    />
                  </div>
                  <Button className="w-full btn-gradient" type="submit" disabled={isSubmitting}>
                    Create account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/50">
          <CardContent className="pt-6">
            <p className="text-xs text-slate-300">Default superadmin access</p>
            <p className="mt-1 text-xs text-slate-400">Email: {SUPERADMIN_EMAIL}</p>
            <p className="text-xs text-slate-400">Password: {SUPERADMIN_DEFAULT_PASSWORD}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
