'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'; // Optional icon library (lucide-react)

export default function NotFound() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 overflow-hidden">
      
      {/* Animated glowing background circles */}
      <div className="absolute w-72 h-72 bg-purple-500 opacity-30 rounded-full blur-3xl top-20 left-10 animate-pulse" />
      <div className="absolute w-72 h-72 bg-blue-500 opacity-20 rounded-full blur-3xl bottom-20 right-10 animate-ping" />

      {/* 404 Number with glow effect */}
      <h1 className="text-[8rem] md:text-[10rem] font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-lg animate-float">
        404
      </h1>

      {/* Subheading */}
      <p className="text-2xl md:text-3xl font-semibold mb-2 text-center">
        Uh-oh! This page vanished.
      </p>

      {/* Description */}
      <p className="text-md text-gray-300 mb-6 text-center max-w-xl">
        The page you're trying to find doesn't exist or might have been moved. Let’s take you back home.
      </p>

      {/* Button */}
      <Link href="/">
        <button className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white text-lg rounded-full shadow-xl transition-all duration-300 transform hover:scale-105">
          <ArrowLeft className="w-5 h-5" />
          Go Home
        </button>
      </Link>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
