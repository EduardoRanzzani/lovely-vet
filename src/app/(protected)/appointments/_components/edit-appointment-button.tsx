import { AppointmentsWithRelations } from '@/api/schema/appointments.schema';
import { DoctorsWithUser } from '@/api/schema/doctors.schema';
import { PetWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import AppointmentFormClient from './appointment-form';
import { ServiceWithSpecie } from '@/api/schema/services.schema';

interface EditAppointmentButtonProps {
	appointment: AppointmentsWithRelations;
	pets: PetWithTutorAndBreed[];
	doctors: DoctorsWithUser[];
	services: ServiceWithSpecie[];
	disabled?: boolean;
}

const EditAppointmentButton = ({
	appointment,
	pets,
	doctors,
	services,
	disabled = false,
}: EditAppointmentButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<Tooltip>
				<TooltipTrigger asChild>
					<DialogTrigger asChild>
						<Button size={'icon'} disabled={disabled}>
							<PencilIcon />
						</Button>
					</DialogTrigger>
				</TooltipTrigger>
				<TooltipContent>Editar o agendamento</TooltipContent>
			</Tooltip>

			{isOpen && (
				<AppointmentFormClient
					appointment={appointment}
					pets={pets}
					doctors={doctors}
					services={services}
					onSuccess={() => setIsOpen(false)}
				/>
			)}
		</Dialog>
	);
};

export default EditAppointmentButton;
