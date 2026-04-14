'use client';

import InputForm from '@/components/form/input-form';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalculatorIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const formData = z.object({
	weight: z.string().min(1, { message: 'Peso obrigatório para o cálculo' }),
	dose: z.string().min(1, { message: 'Dose obrigatória para o cálculo' }),
	solute: z.string().min(1, { message: 'Solução obrigatória para o cálculo' }),
	solvent: z
		.string()
		.min(1, { message: 'Solvente obrigatório para o cálculo' }),
});

const DoseCalculation = () => {
	const [result, setResult] = useState<string>('');

	const form = useForm<z.infer<typeof formData>>({
		resolver: zodResolver(formData),
	});

	const calculateDose = (data: z.infer<typeof formData>) => {
		let concentration: number = Number(data.solute) / Number(data.solvent);
		concentration = concentration * 1000; // converting to mcg

		const tax: number =
			(Number(data.weight) * Number(data.dose) * 60) / concentration;

		setResult(tax.toFixed(2));
	};

	return (
		<div className='grid lg:grid-cols-4 gap-2'>
			<div className='border rounded-lg p-4'>
				<form
					onSubmit={form.handleSubmit(calculateDose)}
					className='flex flex-col gap-3'
				>
					<InputForm
						register={form.register}
						label='Peso (kg)'
						name='weight'
						type='number'
						step={0.1}
						error={form.formState.errors.weight?.message}
					/>

					<InputForm
						register={form.register}
						label='Dose (mg)'
						name='dose'
						type='number'
						step={0.1}
						error={form.formState.errors.dose?.message}
					/>

					<InputForm
						register={form.register}
						label='Solução'
						name='solute'
						type='number'
						step={0.1}
						error={form.formState.errors.solute?.message}
					/>

					<InputForm
						register={form.register}
						label='Solvente'
						name='solvent'
						type='number'
						step={0.1}
						error={form.formState.errors.solvent?.message}
					/>

					<Button type='submit' className='w-full'>
						<CalculatorIcon />
						Calcular
					</Button>

					<Separator className='my-6' />
					<h1 className='text-center font-semibold'>
						Resultado: {result} mcg/h
					</h1>
				</form>
			</div>
		</div>
	);
};

export default DoseCalculation;
