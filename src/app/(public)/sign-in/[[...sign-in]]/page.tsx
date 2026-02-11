import { SignIn } from '@clerk/nextjs';

const AuthPage = () => {
	return (
		<div
			className={`flex justify-center items-center min-h-screen bg-[url('/bg-image.png')] bg-cover bg-center p-8`}
		>
			<SignIn />
		</div>
	);
};

export default AuthPage;
