"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login, fetchUserData } from "@/lib/services/authService";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";
import Button from "@/components/ui/button/Button";

export default function SignInForm() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); 
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { setToken, setUser } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { access } = await login(username, password);
      setToken(access);

      const userData = await fetchUserData(access);
      setUser(userData);

      router.push("/");
    } catch {
      setError("Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>

      {error && (
        <p className="text-red-500 text-sm text-center mb-4">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pr-12"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            required
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pr-12"
          />
          {/* Toggle Password Visibility */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-9 text-sm text-gray-500 hover:text-black"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <Button
          type="submit"
          size="sm"
          className="w-full mt-4 flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="sm" message="Logging in..." />
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="flex items-center justify-between">
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
            Forgot password?
          </a>
        </div>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {"Don't have an account? "}
        <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
          Sign up
        </a>
      </div>
    </div>
  );
}