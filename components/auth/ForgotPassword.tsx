"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeClosed, EyeIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

const ForgotPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isEnabled, setEnabled] = useState<boolean>(false);

    // const handleSendOtp = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError("");
    // const TrimEmail = email.trim()
    // const TrimPass = email.trim()
    //     try {
    //         const res = await fetch("/api/auth/forgot-password", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ TrimEmail, action: "send-otp" }),
    //         });

    //         const data = await res.json();
    //         if (!res.ok) throw new Error(data.error || "Failed to send OTP");

    //         setStep(2);
    //     } catch (err) {
    //         setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const trimmedEmail = email.trim();

        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: trimmedEmail,   // ✅ CORRECT KEY
                    action: "send-otp",
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send OTP");

            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // const handleResetPassword = async (e) => {
    //     e.preventDefault();
    //     setLoading(true);
    //     setError("");
    //     const TrimEmail = email.trim()
    //     const TrimPass = newPassword.trim()
    //     const TrimOtp = otp.trim()
    //     try {
    //         const res = await fetch("/api/auth/forgot-password", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ TrimEmail, TrimOtp, TrimPass, action: "reset-password" }),
    //         });

    //         const data = await res.json();
    //         if (!res.ok) throw new Error(data.error || "Failed to reset password");

    //         toast.success("Password reset successfully!");
    //         window.location.href = "/signin";
    //     } catch (err) {
    //         setError(err.message);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleResetPassword = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  const trimmedEmail = email.trim();
  const trimmedOtp = otp.trim();
  const trimmedPassword = newPassword.trim();

  try {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: trimmedEmail,        // ✅
        otp: trimmedOtp,            // ✅
        newPassword: trimmedPassword, // ✅
        action: "reset-password",
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to reset password");

    toast.success("Password reset successfully!");
    window.location.href = "/signin";
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Reset Password
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {step === 1 && "Enter your email to receive OTP"}
                            {step === 2 && "Enter the OTP sent to your email and new password"}
                        </p>
                    </div>

                    {step === 1 && (
                        <form onSubmit={handleSendOtp}>
                            <div className="space-y-6">
                                <div>
                                    <Label>Email <span className="text-error-500">*</span></Label>
                                    <Input
                                        placeholder="Enter your email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <div>
                                    <Button type="submit" className="w-full" size="sm" disabled={loading || !email}>
                                        {loading ? "Sending OTP..." : "Send OTP"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleResetPassword}>
                            <div className="space-y-6">
                                <div>
                                    <Label>OTP <span className="text-error-500">*</span></Label>
                                    <Input
                                        placeholder="Enter 6-digit OTP"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => { setOtp(e.target.value), setEnabled(e.target.value.length === 6 && true) }}
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>New Password <span className="text-error-500">*</span></Label>
                                    <div className="relative">
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                        <span
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                                            ) : (
                                                <EyeClosed className="fill-gray-500 dark:fill-gray-400" />
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {error && <p className="text-red-500 text-sm">{error}</p>}

                                <div>
                                    <Button type="submit" className="w-full" size="sm" disabled={loading || !isEnabled || !newPassword}>
                                        {loading ? "Resetting..." : "Reset Password"}
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}

                </div>
                <div className="mt-6">
                    <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                        Remember your password?
                        <Link
                            href="/signin"
                            className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                        >
                            {" "}Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword