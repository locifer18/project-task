import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TaskFlow - Sign Up"
};

export default function SignUp() {
  return <SignUpForm />;
}
