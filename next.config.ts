import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactCompiler: true,
	reactStrictMode: false,
	images: {
		remotePatterns: [
			{ hostname: 'ui-avatars.com' },
			{
				hostname: 'res.cloudinary.com',
			},
		],
	},
};

export default nextConfig;
