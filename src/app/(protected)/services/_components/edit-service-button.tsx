import { Services } from '@/api/schema/services.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import ServiceFormClient from './service-form';

interface EditServiceButtonProps {
	service: Services;
}

const EditServiceButton = ({ service }: EditServiceButtonProps) => {
	const [open, isOpen] = useState<boolean>(false);

	return (
		<Dialog open={open} onOpenChange={isOpen}>
			<DialogTrigger asChild>
				<Button size={'icon'}>
					<PencilIcon />
				</Button>
			</DialogTrigger>

			<ServiceFormClient service={service} onSuccess={() => isOpen(false)} />
		</Dialog>
	);
};

export default EditServiceButton;
