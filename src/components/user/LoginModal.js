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

export default function LoginModal({ open, onOpenChange }) {
  const [formMode, setFormMode] = useState("social"); // 'social', 'login', 'register'

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
                <Button className="w-full justify-center hover-orange-bg" variant="outline">
                  <FaFacebookSquare className="mr-2 h-4 w-4" />
                  Login with Facebook
                </Button>
                <Button className="w-full justify-center hover-orange-bg" variant="outline">
                  <FaGooglePlusSquare className="mr-2 h-4 w-4" />
                  Login with Google
                </Button>
                <Button className="w-full justify-center hover-orange-bg" variant="outline">
                  <FaSquareXTwitter className="mr-2 h-4 w-4" />
                  Login with X
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
              <form className="flex flex-col space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="p-2 rounded bg-gray-100 text-black"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="p-2 rounded bg-gray-100 text-black"
                />
                <Button type="submit" className="w-full bg-orange">
                  Login
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

            {formMode === "register" && (
              <form className="flex flex-col space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="p-2 rounded bg-gray-100 text-black"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="p-2 rounded bg-gray-100 text-black"
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="p-2 rounded bg-gray-100 text-black"
                />
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
                Don’t have an account?{" "}
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
