import { DoctorsWithUser } from '@/api/schema/doctors.schema';
import { PetWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import AppointmentFormClient from './appointment-form';
import { ServiceWithSpecie } from '@/api/schema/services.schema';

interface AddAppointmentButtonProps {
	pets: PetWithTutorAndBreed[];
	doctors: DoctorsWithUser[];
	services: ServiceWithSpecie[];
}

const AddAppointmentButton = ({
	pets,
	doctors,
	services,
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
				pets={pets}
				doctors={doctors}
				services={services}
				onSuccess={() => setIsOpen(false)}
			/>
		</Dialog>
	);
};

export default AddAppointmentButton;
