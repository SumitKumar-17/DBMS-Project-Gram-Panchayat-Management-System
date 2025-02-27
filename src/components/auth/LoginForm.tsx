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
          : "An error occurred during login"
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <div>
        <label
          htmlFor="userType"
          className="block text-sm font-medium text-gray-700"
        >
          Login As
        </label>
        <select
          id="userType"
          value={formData.userType}
          onChange={(e) =>
            setFormData({ ...formData, userType: e.target.value as UserType })
          }
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="citizen">Citizen</option>
          <option value="employee">Panchayat Employee</option>
          <option value="monitor">Government Monitor</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="text-center">
        <Link
          href="/signup"
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </form>
  );
}
