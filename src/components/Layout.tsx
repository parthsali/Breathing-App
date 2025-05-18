import type { ReactNode } from 'react';
import { useBreathingStore } from '../store/breathingStore';
import { LAYOUT } from '../utils/constants';

interface LayoutProps {
  children: ReactNode;
}

/**
 * Layout component for consistent page structure
 */
export const Layout = ({ children }: LayoutProps) => {
  const { theme, isBreathing } = useBreathingStore();

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: theme.background }}
    >
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-10 transition-colors duration-300"
        style={{ 
          height: LAYOUT.HEADER_HEIGHT,
          backgroundColor: theme.primary,
          color: 'white'
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <h1 className="text-2xl font-bold">BreathFlow</h1>
          <nav className="space-x-4">
            <a 
              href="/" 
              className={`hover:opacity-80 transition-opacity ${
                isBreathing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              Home
            </a>
            <a 
              href="/stats" 
              className={`hover:opacity-80 transition-opacity ${
                isBreathing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              Stats
            </a>
            <a 
              href="/about" 
              className={`hover:opacity-80 transition-opacity ${
                isBreathing ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
              }`}
            >
              About
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main
        className="pt-16 min-h-screen transition-colors duration-300"
        style={{ 
          paddingTop: LAYOUT.HEADER_HEIGHT,
          backgroundColor: theme.background
        }}
      >
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer
        className="py-4 text-center transition-colors duration-300"
        style={{ backgroundColor: theme.primary, color: 'white' }}
      >
        <p>© 2024 BreathFlow. All rights reserved.</p>
      </footer>
    </div>
  );
}; 