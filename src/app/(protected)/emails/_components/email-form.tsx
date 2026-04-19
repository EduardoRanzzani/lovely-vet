'use client';

import { sendEmailAction } from '@/api/actions/emails.actions';
import InputForm from '@/components/form/input-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const data = z.object({
	to: z.string().nonempty({ message: "O campo 'to' é obrigatório" }),
	subject: z.string().nonempty({ message: "O campo 'subject' é obrigatório" }),
	body: z.string().nonempty({ message: "O campo 'body' é obrigatório" }),
});

type EmailFormData = z.infer<typeof data>;

const EmailFormClient = () => {
	const form = useForm<EmailFormData>({
		resolver: zodResolver(data),
		defaultValues: {
			to: '',
			subject: '',
			body: '',
		},
	});

	const formSubmit = (data: EmailFormData) => {
		sendEmailAction(data);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(formSubmit)}
				className='flex flex-col gap-5'
			>
				<InputForm
					label='Para:'
					register={form.register}
					name='to'
					error={form.formState.errors.to?.message}
				/>

				<InputForm
					label='Assunto:'
					register={form.register}
					name='subject'
					error={form.formState.errors.subject?.message}
				/>

				<InputForm
					label='Corpo:'
					register={form.register}
					name='body'
					error={form.formState.errors.body?.message}
				/>

				<Button type='submit'>
					<SendIcon />
					Enviar
				</Button>
			</form>
		</Form>
	);
};

export default EmailFormClient;
