import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { InputHTMLAttributes } from 'react';
import {
	FieldValues,
	Path,
	RegisterOptions,
	UseFormRegister,
} from 'react-hook-form';

interface InputFormProps<
	T extends FieldValues,
> extends InputHTMLAttributes<HTMLInputElement> {
	label: string;
	error?: string;
	name: Path<T>;
	register: UseFormRegister<T>;
	registerOptions?: RegisterOptions<T, Path<T>>;
}

const InputForm = <T extends FieldValues>({
	label,
	error,
	type = 'text',
	register,
	registerOptions,
	name,
	...props
}: InputFormProps<T>) => {
	const inputId = props.id || name || label.replace(/\s+/g, '-').toLowerCase();

	return (
		<Field className={cn('flex flex-col -gap-1')}>
			<Label htmlFor={inputId} className='text-xs font-medium'>
				{label} {props.required && <span className='text-destructive'>*</span>}
			</Label>

			<Input
				id={inputId}
				type={type}
				{...register(name, registerOptions)}
				{...props}
				className={cn(
					'read-only:cursor-not-allowed read-only:bg-zinc-200',
					props.className,
				)}
			/>

			{error && <p className='text-xs text-destructive'>{error}</p>}
		</Field>
	);
};

export default InputForm;
