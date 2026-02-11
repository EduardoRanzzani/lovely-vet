import { SignUp } from '@clerk/nextjs';

export default function Page() {
	return (
		<div
			className={`flex justify-center items-center min-h-screen bg-[url('/bg-image.png')] bg-cover bg-center p-8`}
		>
			<SignUp />
		</div>
	);
}
