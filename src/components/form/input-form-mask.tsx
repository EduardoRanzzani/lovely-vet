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
import { PatternFormat } from 'react-number-format';

// 1. Omitimos o 'type' original que é muito amplo
type OmittedInputProps =
	| 'name'
	| 'defaultValue'
	| 'value'
	| 'onChange'
	| 'onBlur'
	| 'format'
	| 'type';

interface InputFormMaskProps<T extends FieldValues> extends Omit<
	InputHTMLAttributes<HTMLInputElement>,
	OmittedInputProps
> {
	label: string;
	format: string;
	mask?: string;
	error?: string;
	name: Path<T>;
	register: UseFormRegister<T>;
	registerOptions?: RegisterOptions<T, Path<T>>;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	// 2. Definimos apenas os tipos que o PatternFormat suporta
	type?: 'text' | 'tel' | 'password';
}

const InputFormMask = <T extends FieldValues>({
	label,
	format,
	mask,
	error,
	register,
	registerOptions,
	name,
	type = 'text', // Default para text
	...props
}: InputFormMaskProps<T>) => {
	const inputId = props.id || name;

	const {
		ref,
		onBlur,
		name: registerName,
		onChange,
		...registerProps
	} = register(name, registerOptions);

	return (
		<Field className={cn('flex flex-col -gap-1', props.className)}>
			<Label htmlFor={inputId} className='text-xs font-medium'>
				{label} {props.required && <span className='text-destructive'>*</span>}
			</Label>

			<PatternFormat
				// Props de controle do RHF
				name={registerName}
				getInputRef={ref}
				onBlur={onBlur}
				onChange={onChange}
				{...registerProps}
				// Configuração da Máscara
				format={format}
				mask={mask}
				type={type}
				// Customização
				id={inputId}
				customInput={Input}
				// Demais props HTML
				{...props}
				className={cn('read-only:cursor-not-allowed read-only:bg-zinc-200')}
			/>

			{error && <p className='text-xs text-destructive'>{error}</p>}
		</Field>
	);
};

export default InputFormMask;
