"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Bot, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { registerUser } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function RegisterPage() {
  const { toast } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    dob: "",              // YYYY-MM-DD
    profilePicture: "",   // URL (optional)
    password: "",
    confirmPassword: "",
  });

  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) =>
    setFormData((p) => ({ ...p, [field]: value }));

  const getPasswordStrength = (p: string) => {
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[a-z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch =
    formData.password === formData.confirmPassword && formData.confirmPassword !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast({ title: "Accept the terms", description: "Please agree to continue.", variant: "destructive" });
      return;
    }
    if (!passwordsMatch || passwordStrength < 3) {
      toast({ title: "Weak or mismatched password", description: "Fix password issues to continue.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // Map UI fields → API schema
      const payload = {
        full_name: formData.name.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone.trim(),
        country: formData.country.trim() || "PK",
        date_of_birth: formData.dob ? new Date(formData.dob).toISOString() : undefined,
        profile_picture: formData.profilePicture || "",
        password: formData.password,
      };

      await registerUser(payload);

      toast({ title: "Account created", description: "You can sign in now." });
      // redirect to login or chat
      window.location.href = "/login";
    } catch (err: any) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Registration failed. Please check your details.";
      toast({ title: "Error", description: apiMsg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-teal-400 transition-colors mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Chat
        </Link>

        <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-white">Create Account</CardTitle>
              <CardDescription className="text-gray-400">Join us and start your AI journey today</CardDescription>
            </div>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Full name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <Input id="name" type="text" placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500/20" required />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500/20" required />
              </div>

              {/* Phone + Country in a row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+92xxxxxxxxxx"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-gray-300">Country</Label>
                  <Input id="country" type="text" placeholder="PK"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500/20" />
                </div>
              </div>

              {/* DOB + Profile picture URL */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-gray-300">Date of Birth</Label>
                  <Input id="dob" type="date"
                    value={formData.dob}
                    onChange={(e) => handleInputChange("dob", e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pp" className="text-gray-300">Profile Picture URL</Label>
                  <Input id="pp" type="url" placeholder="https://..."
                    value={formData.profilePicture}
                    onChange={(e) => handleInputChange("profilePicture", e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500/20" />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500/20 pr-10" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i < passwordStrength
                              ? passwordStrength <= 2
                                ? "bg-red-500"
                                : passwordStrength <= 3
                                  ? "bg-yellow-500"
                                  : "bg-teal-500"
                              : "bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      Password strength: {passwordStrength <= 2 ? "Weak" : passwordStrength <= 3 ? "Medium" : "Strong"}
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-teal-500 focus:ring-teal-500/20 pr-10" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-xs">
                    {passwordsMatch ? (
                      <>
                        <Check className="w-3 h-3 text-teal-500" />
                        <span className="text-teal-500">Passwords match</span>
                      </>
                    ) : (
                      <span className="text-red-400">Passwords don't match</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={acceptTerms}
                  onCheckedChange={(c) => setAcceptTerms(c as boolean)}
                  className="border-gray-600 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500" />
                <Label htmlFor="terms" className="text-sm text-gray-300 leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-teal-400 hover:text-teal-300 transition-colors">Terms of Service</Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-teal-400 hover:text-teal-300 transition-colors">Privacy Policy</Link>
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit"
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg hover:shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !acceptTerms || !passwordsMatch || passwordStrength < 3}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account...
                  </div>
                ) : ("Create Account")}
              </Button>

              <div className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-teal-400 hover:text-teal-300 transition-colors font-medium">
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
