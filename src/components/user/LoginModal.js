"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import React from "react";
import Image from "next/image";
import { FaGooglePlusSquare, FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { useAuth } from "@/contexts/AuthContext";
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, googleProvider, sendPasswordResetEmail } from "@/lib/firebase";

export default function LoginModal({ open, onOpenChange }) {
  const [formMode, setFormMode] = useState("social");
  const [registerError, setRegisterError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const { login } = useAuth();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-white sm:max-w-[700px] grid grid-cols-2 gap-6 bg-gray-900">
        {/* Left: Ảnh */}
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="/Login_pic.png"
            alt="login_picture"
            layout="fill"
            objectFit="cover"
          />
        </div>

        {/* Right: Form hoặc Social login */}
        <div className="flex flex-col justify-between">
          <div className="flex flex-col items-center text-center text-white">
            <DialogHeader>
              <DialogTitle>
                {formMode === "register"
                  ? "Create an Account"
                  : "Welcome to Cookies Website!"}
              </DialogTitle>
              <DialogDescription>
                {formMode === "register"
                  ? "Register to join our community."
                  : "Sign in to explore more exciting content."}
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Nội dung động: login / register / social */}
          <div className="text-black py-4">
            {formMode === "social" && (
              <div className="grid gap-4">
                <Button 
                  className="w-full justify-center hover-orange-bg" 
                  variant="outline"
                  onClick={async () => {
                    try {
                      const result = await signInWithPopup(auth, googleProvider);
                      const idToken = await result.user.getIdToken();
                      
                      const res = await fetch("http://103.253.145.7:3000/api/users/google-auth", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ 
                          idToken,
                          user: {
                            username: result.user.displayName || result.user.email.split('@')[0],
                            photoURL: result.user.photoURL
                          }
                        }),
                        credentials: "include",
                      });
                      
                      const data = await res.json();
                      
                      if (!res.ok) {
                        throw new Error(data.message || "Google login failed");
                      }
                      
                      await login();
                      alert("Google login successful!");
                      onOpenChange(false);
                    } catch (error) {
                      alert(error.message);
                    }
                  }}
                >
                  <FaGooglePlusSquare className="mr-2 h-4 w-4" />
                  Login with Google
                </Button>
                <Button
                  className="w-full justify-center hover-orange-bg"
                  variant="outline"
                  onClick={() => setFormMode("login")}
                >
                  Login with Email & Password
                </Button>
              </div>
            )}

            {formMode === "login" && (
              <>
                <form className="flex flex-col space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const email = e.target.email.value;
                    const password = e.target.password.value;

                    setLoginError("");
                    try {
                      // Sign in with Firebase
                      const userCredential = await signInWithEmailAndPassword(auth, email, password);
                      const idToken = await userCredential.user.getIdToken();

                      // Call backend API to create user instance in DB (like Google login)
                      const res = await fetch("http://103.253.145.7:3000/api/users/google-auth", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          idToken,
                          user: {
                            username: userCredential.user.displayName || userCredential.user.email.split('@')[0],
                            photoURL: userCredential.user.photoURL
                          }
                        }),
                        credentials: "include",
                      });
                      const data = await res.json();

                      if (!res.ok) {
                        setLoginError(data.message || "Login failed");
                        return;
                      }

                      await login();
                      onOpenChange(false);
                    }
                    catch (e) {
                      setLoginError(e.message);
                    }
                  }}
                >
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="p-2 rounded bg-gray-100 text-black"
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="p-2 rounded bg-gray-100 text-black"
                  />
                  {loginError && (
                    <span className="text-red-500 text-sm">{loginError}</span>
                  )}
                  <Button type="submit" className="w-full bg-orange">
                    Login
                  </Button>
                  <button
                    type="button"
                    className="text-xs text-blue-400 underline self-end mt-[-10px] mb-2 hover:text-blue-600"
                    onClick={() => setFormMode("reset")}
                  >
                    Forgot password?
                  </button>
                  <Button
                    variant="ghost"
                    className="text-sm text-gray-400"
                    onClick={() => setFormMode("social")}
                  >
                    ← Back to Social Login
                  </Button>
                </form>
              </>
            )}
            {formMode === "reset" && (
              <div className="flex flex-col items-center text-center text-white">
                <DialogHeader>
                  <DialogTitle>Reset Your Password</DialogTitle>
                  <DialogDescription>
                    Enter your email address and we'll send you a link to reset your password.
                  </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col space-y-4 w-full mt-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setResetError("");
                    setResetSuccess("");
                    try {
                      await sendPasswordResetEmail(auth, resetEmail);
                      setResetSuccess("Password reset email sent! Please check your inbox.");
                    } catch (e) {
                      setResetError(e.message);
                    }
                  }}
                >
                  <input
                    type="email"
                    name="resetEmail"
                    placeholder="Enter your email"
                    className="p-2 rounded bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-orange"
                    value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    required
                  />
                  {resetError && <span className="flex items-center gap-2 text-red-500 text-sm"><svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' /></svg>{resetError}</span>}
                  {resetSuccess && <span className="flex items-center gap-2 text-green-500 text-sm"><svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>{resetSuccess}</span>}
                  <Button type="submit" className="w-full bg-orange mt-2">
                    Send Password Reset Email
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-sm text-gray-400"
                    onClick={() => setFormMode("login")}
                  >
                    ← Back to Login
                  </Button>
                </form>
              </div>
            )}

            {formMode === "register" && (
              <form className="flex flex-col space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                const email = e.target.email.value;
                const password = e.target.password.value;
                const confirmPassword = e.target.confirmPassword.value;

                const defaultRegisterData = {
                  username: email.split("@")[0],
                  phone_number: "0000000000",
                  bio: "",
                  date_of_birth: "2000-01-01",
                  gender: "other",
                  country: "Unknown",
                  city: "Unknown",
                  is_chef: false
                };

                const bodyData = {
                  email: email,
                  password: password,
                  ...defaultRegisterData
                };

                setRegisterError("");

                if (password !== confirmPassword) {
                  setRegisterError("*Password do not match!");
                  return;
                }

                try {
                  // First, create user with Firebase
                  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                  const idToken = await userCredential.user.getIdToken();

                  // Then send the ID token and user data to your backend
                  const res = await fetch("http://103.253.145.7:3000/api/users/google-auth", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                      idToken,
                      user: {
                        username: bodyData.username,
                        photoURL: null
                      }
                    }),
                    credentials: "include",
                  });

                  console.log(bodyData)
                  const data = await res.json();

                  if (!res.ok) {
                    setRegisterError(data.message);
                    return;
                  }

                  login(data.user);
                  alert("Registration successful!")
                  onOpenChange(false);
                } catch (err) {
                  setRegisterError("* " + err.message);
                }
              }

              }>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="p-2 rounded bg-gray-100 text-black"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="p-2 rounded bg-gray-100 text-black"
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="p-2 rounded bg-gray-100 text-black"
                />
                <span className="text-red-500">
                {registerError}
                </span>
                <Button type="submit" className="w-full bg-orange">
                  Register
                </Button>
                <Button
                  variant="ghost"
                  className="text-sm text-gray-400"
                  onClick={() => setFormMode("social")}
                >
                  ← Back to Social Login
                </Button>
              </form>
            )}
          </div>

          {/* Footer chuyển đổi */}
          <div className="col-span-2 text-center mt-2">
            {formMode === "register" ? (
              <span className="text-gray-400">
                Already have an account?{" "}
                <button
                  className="text-orange-400 hover:underline"
                  onClick={() => setFormMode("login")}
                >
                  Login
                </button>
              </span>
            ) : (
              <span className="text-gray-400">
                Don't have an account?{" "}
                <button
                  className="text-orange-400 hover:underline"
                  onClick={() => setFormMode("register")}
                >
                  Sign up
                </button>
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
