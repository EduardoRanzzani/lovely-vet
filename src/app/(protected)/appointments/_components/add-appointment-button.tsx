import { DoctorsWithUser } from '@/api/schema/doctors.schema';
import { PetsWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Services } from '@/api/schema/services.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import AppointmentFormClient from './appointment-form';

interface AddAppointmentButtonProps {
	pets: PetsWithTutorAndBreed[];
	services: Services[];
	doctors: DoctorsWithUser[];
}

const AddAppointmentButton = ({
	pets,
	services,
	doctors,
}: AddAppointmentButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button className='w-full lg:w-60'>
					<PlusIcon />
					Adicionar Agendamento
				</Button>
			</DialogTrigger>

			<AppointmentFormClient
				services={services}
				pets={pets}
				doctors={doctors}
				onSuccess={() => setIsOpen(false)}
			/>
		</Dialog>
	);
};

export default AddAppointmentButton;
