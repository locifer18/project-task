"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("action", step === 1 ? "send-otp" : "verify-otp");
      fd.append("name", formData.name.trim());
      fd.append("email", formData.email.trim());
      fd.append("password", formData.password.trim());
      fd.append("phone", formData.phone.trim());
      if (otp) fd.append("otp", otp);

      const res = await fetch("/api/auth/signup", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");

      if (step === 1) { setStep(2); return; }
      window.location.href = "/signin";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {step === 1 ? "Fill in your details to get started" : "Enter the OTP sent to your email"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {step === 1 ? (
          <>
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john@example.com" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Min. 8 characters"
                  value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeIcon size={18} /> : <EyeClosedIcon size={18} />}
                </button>
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone <span className="text-gray-400 font-normal">(optional)</span></Label>
              <Input id="phone" type="tel" placeholder="+1 234 567 8900" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </>
        ) : (
          <div>
            <Label htmlFor="otp">Verification Code</Label>
            <Input id="otp" type="text" placeholder="Enter 6-digit OTP" value={otp}
              onChange={(e) => setOtp(e.target.value)} autoComplete="off" required />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              We sent a code to <span className="font-medium text-gray-700 dark:text-gray-300">{formData.email}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <Button type="submit" className="w-full" size="sm"
          disabled={loading || (step === 2 && otp.length !== 6)}>
          {loading ? "Please wait..." : step === 1 ? "Continue" : "Create Account"}
        </Button>

        {step === 2 && (
          <Button type="button" variant="outline" className="w-full" size="sm" onClick={() => setStep(1)}>
            Back
          </Button>
        )}
      </form>

      <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{" "}
        <Link href="/signin" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
          Sign In
        </Link>
      </p>
    </div>
  );
}
