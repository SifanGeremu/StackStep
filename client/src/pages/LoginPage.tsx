/* Brief
   Reader: a returning learner
   Question: how do I get back into my roadmaps?
   Action: sign in, or create an account
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

interface LoginPageProps {
  auth: AuthState & { login: (token: string, email: string) => void };
}

export default function LoginPage({ auth }: LoginPageProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  console.log("Current API base URL:", import.meta.env.VITE_API_URL);

  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate("/dashboard");
    }
  }, [auth.isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      toast({ tone: "error", title: "Please fill in all fields" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);

      const { token, user } = response.data;

      auth.login(token, user?.email || email);

      toast({ tone: "success", title: "Welcome back!" });
      navigate("/dashboard");
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";

      setError(errorMsg);
      toast({ tone: "error", title: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell rail="none" title="StackStep" caption="Sign in to your account">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 py-8">
        <p className="text-body text-ink-2">
          Sign in to open the roadmaps you have already generated.
        </p>

        {error && <Alert tone="error" title={error} />}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              autoComplete="current-password"
            />
          </Field>

          <Button type="submit" variant="accent" fullWidth loading={isLoading} disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <Separator />

        <p className="text-center text-caption text-ink-2">
          Don&apos;t have an account?{" "}
          <Button variant="link" onClick={() => navigate("/signup")}>
            Sign up
          </Button>
        </p>
      </div>
    </AppShell>
  );
}
