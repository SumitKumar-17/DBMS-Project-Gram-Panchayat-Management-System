"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/auth.service";
import { UserType } from "@/types/auth";
import Link from "next/link";
import Cookies from "js-cookie";

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "citizen" as UserType,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(formData);
      console.log("Login response:", response);

      if (response.code === 0 && response.data && response.token) {
        // Store token in cookie
        Cookies.set("token", response.token, {
          expires: 1, // 1 day
          path: "/",
        });

        // Update auth context
        login(response.data);

        // Redirect
        const redirectPath = getRedirectPath(response.data.userType);
        console.log("Redirecting to:", redirectPath);
        router.push(redirectPath);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during login",
      );
    } finally {
      setLoading(false);
    }
  };

  const getRedirectPath = (userType: UserType): string => {
    switch (userType) {
      case "employee":
        return "/employee/dashboard";
      case "citizen":
        return "/citizen/dashboard";
      case "monitor":
        return "/monitor/dashboard";
      default:
        return "/";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      {error && (
        <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-md border border-red-200">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="userType"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Login As
        </label>
        <select
          id="userType"
          value={formData.userType}
          onChange={(e) =>
            setFormData({ ...formData, userType: e.target.value as UserType })
          }
          className="mt-1 block w-full px-3 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
        >
          <option value="citizen">Citizen</option>
          <option value="employee">Panchayat Employee</option>
          <option value="monitor">Government Monitor</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full px-3 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
          placeholder="Enter your email"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="mt-1 block w-full px-3 py-2 text-gray-700 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ease-in-out"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        {loading ? (
          <span className="inline-flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign in"
        )}
      </button>

      <div className="text-center mt-6">
        <Link
          href="/signup"
          className="text-sm text-indigo-600 hover:text-indigo-500 font-medium transition duration-150 ease-in-out"
        >
          Don&apos;t have an account? <span className="underline">Sign up</span>
        </Link>
      </div>
    </form>
  );
}
