import ForgotPassword from "@/components/auth/ForgotPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskFlow - Forgot Password"
};

export default function ForgotPasswordPage() {
  return <ForgotPassword />;
}
