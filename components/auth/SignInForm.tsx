"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import React, { useState } from "react";
import Link from "next/link";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid credentials");
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Sign in to your TaskFlow account
        </p>
      </div>

      <form onSubmit={handleSignin} className="space-y-5">
        <div>
          <Label htmlFor="email">Email or Employee ID</Label>
          <Input
            id="email"
            type="text"
            placeholder="your@email.com or emp-001"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeIcon size={18} /> : <EyeClosedIcon size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex items-center justify-end">
          <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="sm" disabled={loading || !email || !password}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
