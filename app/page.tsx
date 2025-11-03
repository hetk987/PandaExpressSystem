import Image from "next/image";
import React from 'react';
import { useAuth } from './auth/auth-context';
import AuthHome from './auth/auth-home';
import LoginComponent from './auth/login-component';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-white">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start">
          <AuthHome />
      </main>
    </div>
  );
}
