// src/components/auth/SignInForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { login, fetchUserData, forgotPassword } from "@/lib/services/authService";
import { useAuthStore } from "@/lib/stores/useAuthStore";
import LoadingSpinner from "@/components/ui/loading/LoadingSpinner";
import Button from "@/components/ui/button/Button";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import { toast } from "sonner";

export default function SignInForm() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const { isOpen: isForgotModalOpen, openModal: openForgotModal, closeModal: closeForgotModal } = useModal();
    const [forgotEmail, setForgotEmail] = useState<string>("");
    const [forgotLoading, setForgotLoading] = useState<boolean>(false);
    const [forgotError, setForgotError] = useState<string>("");

    const { setToken, setUser } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { access } = await login(username, password);
            setToken(access);

            const userData = await fetchUserData();
            setUser(userData);

            router.push("/");
        } catch (err: any) {
            console.error("Login error:", err); // Log error lengkap
            let errorMessage = "Username atau password salah.";
            // Coba ambil pesan error dari respons API jika ada (dari Axios error object)
            if (err.response && err.response.data && err.response.data.detail) {
                errorMessage = err.response.data.detail;
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
            toast.error(errorMessage); // Tampilkan toast error juga
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotError("");
        setForgotLoading(true);

        if (!forgotEmail) {
            setForgotError("Email tidak boleh kosong.");
            setForgotLoading(false);
            return;
        }

        try {
            await forgotPassword({ email: forgotEmail });
            toast.success("Link reset password telah dikirim ke email Anda.");
            setForgotEmail(""); // Kosongkan input email
            closeForgotModal(); // Tutup modal setelah sukses
        } catch (err: any) {
            console.error("Forgot password error:", err);
            const errorMessage = err.message || "Gagal mengirim link reset password. Silakan coba lagi.";
            setForgotError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign In</h2>
            
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
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); openForgotModal(); }}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                    >
                        Forgot password?
                    </a>
                </div>
            </form>


            {/* --- Modal Forgot Password --- */}
            <Modal isOpen={isForgotModalOpen} onClose={closeForgotModal} className="max-w-[400px] m-4">
                <div className="no-scrollbar relative w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-6">
                    <h4 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90 text-center">
                        Lupa Kata Sandi?
                    </h4>
                    <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 text-center">
                        Masukkan email Anda dan kami akan mengirimkan link untuk mereset kata sandi Anda.
                    </p>

                    {forgotError && (
                        <p className="text-red-500 text-sm text-center mb-4">{forgotError}</p>
                    )}

                    <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                id="forgotEmail"
                                type="email"
                                value={forgotEmail}
                                onChange={(e) => setForgotEmail(e.target.value)}
                                placeholder="nama@email.com"
                                required
                                className="w-full px-4 py-2 border text-gray-500 dark:text-gray-400 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="sm"
                            className="w-full mt-4 flex items-center justify-center gap-2"
                            disabled={forgotLoading}
                        >
                            {forgotLoading ? (
                                <LoadingSpinner size="sm" message="Mengirim..." />
                            ) : (
                                "Kirim Link Reset"
                            )}
                        </Button>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
