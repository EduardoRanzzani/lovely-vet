'use client';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { CustomerWithUser } from '@/api/schema/customers.schema';
import { PetWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Specie } from '@/api/schema/species.schema';
import { calculateAge } from '@/api/util';
import EditButton from '@/components/list/edit-button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import Image from 'next/image';
import PetFormClient from './pet-form';

interface PetDetailsClientProps {
	pet: PetWithTutorAndBreed;
	species: Specie[];
	breeds: BreedsWithSpecies[];
	customers: CustomerWithUser[];
}

const PetDetailsClient = ({
	pet,
	species,
	breeds,
	customers,
}: PetDetailsClientProps) => {
	return (
		<div className='flex flex-col gap-4 w-full'>
			<div className='flex flex-col md:flex-row gap-4 w-full'>
				<div className='flex flex-col items-center justify-start gap-4 p-5 w-full lg:min-w-2xs lg:w-1/3 border border-muted rounded-lg'>
					<Image
						src={
							pet?.photo
								? `${pet.photo}`
								: pet?.breed?.specie.name === 'Canino'
									? '/dog-placeholder.png'
									: '/cat-placeholder.svg'
						}
						alt='Foto do pet'
						width={500}
						height={500}
						className='rounded-full border border-zinc-300 overflow-hidden object-contain w-50 h-50 select-none'
					/>

					<div className='flex flex-col items-center justify-center'>
						<h1 className='font-bold text-2xl'>{pet.name}</h1>
						<p className='text-zinc-500 text-sm'>
							{pet.breed.specie.name} • {calculateAge(new Date(pet.birthDate))}
						</p>
					</div>
				</div>
				<div className='flex flex-col gap-4 p-5 w-full lg:w-2/3 border border-muted rounded-lg'>
					<span className='flex flex-row items-center justify-center gap-3'>
						<h1 className='items-center text-2xl'>Dados Cadastrais</h1>

						<EditButton
							tooltip={`Editar ${pet.name}`}
							renderForm={(close) => (
								<PetFormClient
									pet={pet}
									breeds={breeds}
									customers={customers}
									species={species}
									onSuccess={close}
								/>
							)}
						/>
					</span>
					<Separator className='text-muted' />

					<div className='grid grid-cols-1 xl:grid-cols-2 mb-3 justify-start items-center gap-2 w-full'>
						<p className='w-full lg:w-40%'>
							<span className='font-semibold'>Espécie:</span>{' '}
							{pet.breed.specie.name}
						</p>
						<p className='w-full lg:w-40%'>
							<span className='font-semibold'>Raça:</span> {pet.breed.name}
						</p>
						<p className='w-full lg:w-40%'>
							<span className='font-semibold'>Gênero:</span>{' '}
							{pet.gender === 'female' ? 'Fêmea' : 'Masculino'}
						</p>
						<p className='w-full lg:w-40%'>
							<span className='font-semibold'>Cor:</span> {pet.color}
						</p>
						<p className='w-full lg:w-40%'>
							<span className='font-semibold'>Nascimento:</span>{' '}
							{format(new Date(pet.birthDate + 'T12:00:00'), 'dd/MM/yyyy')} (
							{calculateAge(new Date(pet.birthDate))})
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PetDetailsClient;
