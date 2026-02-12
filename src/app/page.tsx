'use client';
import { useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function Home() {
	const { isSignedIn } = useAuth();
	if (isSignedIn) redirect('/dashboard');

	return <p className='animate-pulse'>Carregando...</p>;
}
