'use client';

import { MAX_PAGE_SIZE, PaginatedData } from '@/api/config/consts';
import { AppointmentsWithPetAndServiceAndDoctor } from '@/api/schema/appointments.schema';
import { DoctorsWithUser } from '@/api/schema/doctors.schema';
import { PetWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Services } from '@/api/schema/services.schema';
import SearchInput from '@/components/list/search-input';
import TableComponent from '@/components/list/table-component';
import { TableCell, TableRow } from '@/components/ui/table';
import { handleNavigation } from '@/lib/utils';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';
import AddAppointmentButton from './add-appointment-button';

interface AppointmentsListClientProps {
	appointments: Promise<PaginatedData<AppointmentsWithPetAndServiceAndDoctor>>;
	services: Services[];
	pets: PetWithTutorAndBreed[];
	doctors: DoctorsWithUser[];
}

const AppointmentsListClient = ({
	appointments,
	services,
	pets,
	doctors,
}: AppointmentsListClientProps) => {
	const appointmentsResolved = use(appointments);
	const searchParams = useSearchParams();

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set('page', page.toString());
		handleNavigation(params);
	};

	const columns = [{ header: 'Pet', accessorKey: 'pet' }];

	const renderRow = (appointment: AppointmentsWithPetAndServiceAndDoctor) => {
		return (
			<TableRow key={appointment.id}>
				<TableCell>{appointment.pet.name}</TableCell>
			</TableRow>
		);
	};

	const renderMobile = (
		appointment: AppointmentsWithPetAndServiceAndDoctor,
	) => {
		return (
			<div key={appointment.id}>
				<div className='flex gap-4 items-center justify-between'>
					<span className='flex flex-col gap-2'>
						<h3>{appointment.pet.name}</h3>
					</span>
				</div>
			</div>
		);
	};

	return (
		<div className='flex flex-col w-full gap-4'>
			<div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
				<SearchInput />

				<AddAppointmentButton
					pets={pets}
					services={services}
					doctors={doctors}
				/>
			</div>

			<TableComponent
				emptyMessage='Nenhum agendamento encontrado...'
				columns={columns}
				renderRow={renderRow}
				renderMobile={renderMobile}
				data={appointmentsResolved?.data}
				currentPage={appointmentsResolved?.metadata.currentPage}
				totalPages={appointmentsResolved?.metadata.pageCount}
				totalElements={appointmentsResolved?.metadata.totalCount}
				pageSize={MAX_PAGE_SIZE}
				onPageChange={handlePageChange}
			/>
		</div>
	);
};

export default AppointmentsListClient;
