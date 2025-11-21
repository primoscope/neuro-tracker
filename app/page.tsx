import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to auth page - storage detection happens client-side
  redirect('/auth');
}
