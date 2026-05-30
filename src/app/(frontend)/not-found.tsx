'use client';

import Link from 'next/link';
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center px-4">
      <div className="text-center text-white max-w-2xl">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <h2 className="text-4xl mb-6">Страница не найдена</h2>
        <p className="text-xl mb-8 text-blue-100">
          К сожалению, запрашиваемая страница не существует.
          Возможно, она была удалена или вы ввели неверный адрес.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            <Home size={20} />
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
