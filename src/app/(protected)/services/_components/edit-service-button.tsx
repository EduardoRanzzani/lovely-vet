'use client';
import { Specie } from '@/api/schema/species.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import ServiceFormClient from './service-form';
import { ServiceWithSpecie } from '@/api/schema/services.schema';

interface EditServiceButtonProps {
	service: ServiceWithSpecie;
	species: Specie[];
}

const EditServiceButton = ({ service, species }: EditServiceButtonProps) => {
	const [open, isOpen] = useState<boolean>(false);

	return (
		<Dialog open={open} onOpenChange={isOpen}>
			<DialogTrigger asChild>
				<Button size={'icon'}>
					<PencilIcon />
				</Button>
			</DialogTrigger>

			{isOpen && (
				<ServiceFormClient
					service={service}
					species={species}
					onSuccess={() => isOpen(false)}
				/>
			)}
		</Dialog>
	);
};

export default EditServiceButton;
