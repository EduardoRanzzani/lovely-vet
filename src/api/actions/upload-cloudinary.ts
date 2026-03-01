'use server';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
	api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export const uploadImageAction = async (
	formData: FormData,
): Promise<string> => {
	const file = formData.get('file') as File;
	const folder = formData.get('folder') as string;

	if (!file) throw new Error('Nenhum arquivo selecionado');

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);

	return new Promise<string>((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					folder,
					// transformation: [{ width: 500, height: 500 }],
				},
				(error, result) => {
					if (error) {
						console.error('Erro ao enviar imagem:', error);
						return reject(error);
					}
					resolve(result?.secure_url || '');
				},
			)
			.end(buffer);
	});
};
