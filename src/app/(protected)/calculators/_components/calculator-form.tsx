'use client';

import DialogButton from '@/components/list/dialog-button';
import { CalculatorIcon } from 'lucide-react';
import RuleOfThree from './rule-of-three';

const CalculatorPageForm = () => {
	return (
		<div>
			<DialogButton
				text='Regra de Três Simples'
				icon={CalculatorIcon}
				renderForm={() => <RuleOfThree />}
			/>
		</div>
	);
};

export default CalculatorPageForm;
