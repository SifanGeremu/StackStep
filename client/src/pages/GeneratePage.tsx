/* Brief
   Reader: a learner who wants a new roadmap
   Question: which stack, and at what level, should this plan be for?
   Action: generate the roadmap
   Register: text
*/
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "@/formic/components/Alert";
import Button from "@/formic/components/Button";
import Input, { Field, Textarea } from "@/formic/components/Input";
import Select from "@/formic/components/Select";
import { useToast } from "@/formic/components/Toast";
import { iconFor } from "@/formic/components/primitives";
import { AuthedShell } from "@/components/Shell";
import { apiService } from "@/lib/api";
import type { AuthState } from "@/hooks/useAuth";

interface GeneratePageProps {
  auth: AuthState & { logout: () => void };
}

const LEVELS = [
  { value: "Beginner", label: "Beginner - Just starting out" },
  { value: "Intermediate", label: "Intermediate - Some experience" },
  { value: "Advanced", label: "Advanced - Experienced developer" },
];

export default function GeneratePage({ auth }: GeneratePageProps) {
  const navigate = useNavigate();
  const toast = useToast();
  const [techStack, setTechStack] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Beginner");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!techStack.trim()) {
      toast({ tone: "error", title: "Please enter a tech stack" });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiService.generateRoadmap(techStack, experienceLevel);

      console.log("Backend response:", response.data);

      const projectData = response.data.project || response.data;
      const id = projectData._id || projectData.id;

      if (!id) {
        console.error("No project ID found in response:", response.data);
        toast({ tone: "error", title: "Roadmap generated but no project ID returned" });
        return;
      }

      toast({ tone: "success", title: "Roadmap generated successfully!" });
      navigate(`/projects/${id}`);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to generate roadmap. Please try again.";

      toast({ tone: "error", title: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthedShell
      auth={auth}
      active="generate"
      title="Generate your roadmap"
      caption="Tell us which tech stack you want to learn, and we'll create a phased roadmap tailored to your level."
    >
      <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-2xl flex-col gap-6">
        <Field
          label="Tech stack"
          hint="E.g., MERN, Next.js + Tailwind, React + Firebase, Django + PostgreSQL"
        >
          <Textarea
            value={techStack}
            onChange={(e) => setTechStack(e.target.value)}
            placeholder="Enter the technologies you want to learn..."
            disabled={isLoading}
            rows={4}
          />
        </Field>

        <Field label="Your experience level">
          <Select
            options={LEVELS}
            value={experienceLevel}
            onChange={setExperienceLevel}
            disabled={isLoading}
          />
        </Field>

        <Button
          type="submit"
          variant="accent"
          fullWidth
          loading={isLoading}
          disabled={isLoading}
          icon={iconFor("Generate roadmap")}
        >
          {isLoading ? "Generating..." : "Generate roadmap"}
        </Button>

        <Alert tone="info" title="Be specific about the tech stack">
          Include frameworks, databases, and tools you want to learn. The roadmap comes back
          in phases, each with clear tasks.
        </Alert>
      </form>
    </AuthedShell>
  );
}
