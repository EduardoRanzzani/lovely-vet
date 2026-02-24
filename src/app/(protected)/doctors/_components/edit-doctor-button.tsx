'use client';

import { DoctorsWithUser } from '@/api/schema/doctors.schema';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { PencilIcon } from 'lucide-react';
import { useState } from 'react';
import DoctorFormClient from './doctor-form';

interface EditDoctorButtonProps {
	doctor: DoctorsWithUser;
}

const EditDoctorButton = ({ doctor }: EditDoctorButtonProps) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button size={'icon'}>
					<PencilIcon />
				</Button>
			</DialogTrigger>
			{isOpen && (
				<DoctorFormClient doctor={doctor} onSuccess={() => setIsOpen(false)} />
			)}
		</Dialog>
	);
};

export default EditDoctorButton;
