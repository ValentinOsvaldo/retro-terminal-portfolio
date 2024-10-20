import EnhancedRetroTerminal from '@/components/RetroTerminal';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Retro portfolio',
  description: 'Retro portfolio template',
  creator: 'Osvaldo Valentin Garcia',
};

export default function Home() {
  return <EnhancedRetroTerminal />;
}
