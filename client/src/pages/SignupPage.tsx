/* Brief
   Reader: a new learner
   Question: how do I create an account so I can generate a roadmap?
   Action: sign up, or sign in if they already have one
   Register: text
*/
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/formic/components/AppShell";
import Alert from "@/formic/components/Alert";
import Button from "@/formic/components/Button";
import Input, { Field } from "@/formic/components/Input";
import { Separator } from "@/formic/components/primitives";
import { useToast } from "@/formic/components/Toast";
import { apiService } from "@/lib/api";
import type { AuthState } from "@/hooks/useAuth";

interface SignupPageProps {
  auth: AuthState & { login: (token: string, email: string) => void };
}

export default function SignupPage({ auth }: SignupPageProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [auth.isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      toast({ tone: "error", title: "Please fill in all fields" });
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast({ tone: "error", title: "Passwords do not match" });
      return;
    }

    const passwordRules = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[@$!%*?&]/.test(password),
    ];

    if (!passwordRules.every(Boolean)) {
      const message =
        "Password must be 8+ characters and include uppercase, lowercase, number, and special character";
      setError(message);
      toast({ tone: "error", title: message });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.signup(email, password, name);

      const { token, user } = response.data;

      auth.login(token, user?.email || email);

      toast({ tone: "success", title: "Account created successfully!" });
      setTimeout(() => navigate("/dashboard"), 50);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.errors?.[0] ||
        err.response?.data?.message ||
        err.message ||
        "Signup failed. Please try again.";

      setError(errorMsg);
      toast({ tone: "error", title: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell rail="none" title="StackStep" caption="Create your account">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-8">
        <p className="text-body text-ink-2">
          Create an account to generate a roadmap and keep your progress.
        </p>

        {error && <Alert tone="error" title={error} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Full name">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              disabled={isLoading}
              autoComplete="name"
            />
          </Field>

          <Field label="Email address">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              autoComplete="email"
            />
          </Field>

          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </Field>

          <Field label="Confirm password">
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="new-password"
            />
          </Field>

          <Button type="submit" variant="accent" fullWidth loading={isLoading} disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        <Separator />

        <p className="text-center text-caption text-ink-2">
          Already have an account?{" "}
          <Button variant="link" onClick={() => navigate("/login")}>
            Sign in
          </Button>
        </p>
      </div>
    </AppShell>
  );
}
