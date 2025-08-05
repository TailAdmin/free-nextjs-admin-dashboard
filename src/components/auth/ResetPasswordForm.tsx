"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import apiClient from "@/lib/axiosConfig";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";

interface ResetPasswordFormProps {
  confirmKey?: string;
}

export default function ResetPasswordForm({ confirmKey }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [isKeyValid, setIsKeyValid] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // If confirmKey is provided, show reset form, otherwise show forgot password form
  const isResetMode = !!confirmKey;

  // Validate the confirm key when component mounts in reset mode
  useEffect(() => {
    if (isResetMode && confirmKey) {
      validateConfirmKey();
    }
  }, [isResetMode, confirmKey]);

  const validateConfirmKey = async () => {
    setIsValidatingKey(true);
    setError("");
    
    try {
      const response = await apiClient.get(`/auth/password/forgot/${confirmKey}/`);
      
      if (response.status === 200) {
        setIsKeyValid(true);
      } else {
        setError("Invalid or expired reset link. Please request a new password reset.");
        setIsKeyValid(false);
      }
    } catch (err: any) {
      setError("Invalid or expired reset link. Please request a new password reset.");
      setIsKeyValid(false);
    } finally {
      setIsValidatingKey(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;

    try {
      const response = await apiClient.post("/auth/password/forgot/", { email });
      setMessage("Password reset link has been sent to your email address.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    const formData = new FormData(e.target as HTMLFormElement);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.post(`/auth/password/forgot/${confirmKey}/`, {
        new_password: password,
        confirm_password: confirmPassword
      });
      
      setMessage("Password has been reset successfully. Redirecting to sign in...");
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while validating key
  if (isResetMode && isValidatingKey) {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
          <Link
            href="/signin"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Back to sign in
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="w-8 h-8 mx-auto animate-spin text-brand-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Validating Reset Link
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Please wait while we verify your password reset link...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if key is invalid
  if (isResetMode && !isValidatingKey && !isKeyValid) {
    return (
      <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
        <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
          <Link
            href="/signin"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <ChevronLeftIcon />
            Back to sign in
          </Link>
        </div>
        <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center dark:bg-red-900/20">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-2">
              Invalid Reset Link
            </h2>
            {error && (
              <div className="mb-5 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
              >
                Request New Reset Link
              </Link>
              <Link
                href="/signin"
                className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 transition rounded-lg border border-gray-300 hover:bg-gray-50 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/signin"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to sign in
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              {isResetMode ? "Reset Password" : "Forgot Password"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isResetMode
                ? "Enter your new password below."
                : "Enter your email address and we'll send you a link to reset your password."}
            </p>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-5 p-4 text-sm text-green-700 bg-green-100 rounded-lg border border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
              {message}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-5 p-4 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
              {error}
            </div>
          )}

          <div>
            <form onSubmit={isResetMode ? handleResetPassword : handleForgotPassword}>
              <div className="space-y-5">
                {!isResetMode ? (
                  /* Forgot Password Form */
                  <div>
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      required
                      disabled={isLoading}
                    />
                  </div>
                ) : (
                  /* Reset Password Form - Only show if key is valid */
                  <>
                    <div>
                      <Label>
                        New Password<span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          placeholder="Enter your new password"
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          required
                          disabled={isLoading}
                          minLength={8}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <Label>
                        Confirm New Password<span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          placeholder="Confirm your new password"
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          required
                          disabled={isLoading}
                          minLength={8}
                        />
                        <span
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showConfirmPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                          )}
                        </span>
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="w-4 h-4 mr-2 animate-spin"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {isResetMode ? "Resetting..." : "Sending..."}
                      </>
                    ) : (
                      <>{isResetMode ? "Reset Password" : "Send Reset Link"}</>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}