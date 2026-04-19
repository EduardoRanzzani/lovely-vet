'use server';
import { actionClient } from '@/lib/next-safe-action';
import { currentUser } from '@clerk/nextjs/server';
import nodemailer from 'nodemailer';
import {
	ActionResponse,
	EmailSchema,
	emailSchema,
} from '../schema/emails.schema';
import path from 'path';

export const sendEmailAction = async (
	data: EmailSchema,
): Promise<ActionResponse> => {
	const { to, subject, body } = data;
	const mailUser = process.env.EMAIL_USER;
	const mailPass = process.env.EMAIL_PASS;

	// Define o caminho da imagem no servidor
	const imagePath = path.join(process.cwd(), 'public', 'logo.png');

	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: mailUser,
			pass: mailPass,
		},
	});

	try {
		await transporter.sendMail({
			from: `"LovelyVet - Dra. Regina de Oliveira Maciel" <${mailUser}>`,
			to,
			subject,
			html: `
			<div style='width: 100%; max-width: 600px; font-family: sans-serif; border: 1px solid #eee; border-radius: 1em; overflow: hidden;'>
        		<div style='padding: 20px; text-align: center; background-color: #ffffff;'>
					<div style='margin-bottom: 20px;'>
						<img src="cid:logo_lovelyvet" alt="Logo" style='width: 150px; height: auto;' />
					</div>
            		<div style='text-align: left; color: #333; line-height: 1.6;'>
                		<p>${body.replace(/\n/g, '<br>')}</p>
            		</div>
        		</div>
    		</div>`,
			attachments: [
				{
					filename: 'logo.png',
					path: imagePath,
					cid: 'logo_lovelyvet', // Mesmo nome usado no src do HTML
				},
			],
		});

		return {
			success: true,
			message: 'Email enviado com sucesso!',
		};
	} catch (error) {
		console.error('Erro ao enviar email:', error);
		return {
			success: false,
			message: 'Erro ao enviar email',
		};
	}
};

export const sendEmail = actionClient
	.schema(emailSchema)
	.action(async ({ parsedInput }) => {
		const authenticatedUser = await currentUser();
		if (!authenticatedUser) throw new Error('Usuário não autenticado');

		const { to, subject, body } = parsedInput;
		const mailUser = process.env.EMAIL_USER;
		const mailPass = process.env.EMAIL_PASS;

		const imagePath = path.join(process.cwd(), 'public', 'logo.png');

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: mailUser,
				pass: mailPass,
			},
		});

		try {
			await transporter.sendMail({
				from: `"LovelyVet - Dra. Regina de Oliveira Maciel" <${mailUser}>`,
				to,
				subject,
				html: `
					<div style='width: 100%; max-width: 600px; font-family: sans-serif; border: 1px solid #eee; border-radius: 1em; overflow: hidden;'>
						<div style='padding: 20px; text-align: center; background-color: #ffffff;'>
							<div style='margin-bottom: 20px;'>
								<img src="cid:logo_lovelyvet" alt="Logo" style='width: 150px; height: auto;' />
							</div>
							<div style='text-align: left; color: #333; line-height: 1.6;'>
								<p>${body.replace(/\n/g, '<br>')}</p>
							</div>
						</div>
					</div>`,
				attachments: [
					{
						filename: 'logo.png',
						path: imagePath,
						cid: 'logo_lovelyvet', // Mesmo nome usado no src do HTML
					},
				],
			});

			return {
				success: true,
				message: 'Email enviado com sucesso!',
			};
		} catch (error) {
			console.error('Erro ao enviar email:', error);
			return {
				success: false,
				message: 'Erro ao enviar email',
			};
		}
	});
