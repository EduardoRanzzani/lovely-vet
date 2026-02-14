import { Specie } from '@/api/schema/species.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import SpecieFormClient from './specie-form';

interface EditSpecieButtonProps {
	specie: Specie;
}

const EditSpecieButton = ({ specie }: EditSpecieButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size={'icon'}>
					<PencilIcon />
				</Button>
			</DialogTrigger>

			{isOpen && (
				<SpecieFormClient specie={specie} onSuccess={() => setIsOpen(false)} />
			)}
		</Dialog>
	);
};

export default EditSpecieButton;
