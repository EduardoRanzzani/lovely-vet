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
	weight: z.string().min(1),
	dose: z.string().min(1),
	solute: z.string().min(1),
	solvent: z.string().min(1),
});

const DoseCalculationPage = () => {
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
		<div className='flex flex-col gap-2 items-center'>
			<h1>Calculadora de Doses</h1>

			<form onSubmit={form.handleSubmit(calculateDose)}>
				<div className='flex flex-col w-full lg:w-100 gap-3 border rounded-lg p-4'>
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
					/>

					<InputForm
						register={form.register}
						label='Solução'
						name='solute'
						type='number'
						step={0.1}
					/>

					<InputForm
						register={form.register}
						label='Solvente'
						name='solvent'
						type='number'
						step={0.1}
					/>

					<Button type='submit' className='w-full'>
						<CalculatorIcon />
						Calcular
					</Button>

					<Separator className='my-6' />
					<h1 className='text-center font-semibold'>
						Resultado: {result} mcg/h
					</h1>
				</div>
			</form>
		</div>
	);
};

export default DoseCalculationPage;
