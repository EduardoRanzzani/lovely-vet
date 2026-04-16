'use client';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { CustomerWithUser } from '@/api/schema/customers.schema';
import { PetWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Specie } from '@/api/schema/species.schema';
import { calculateAge } from '@/api/util';
import { GoogleMapsIcon } from '@/components/icons/icon-googlemaps';
import EditButton from '@/components/list/edit-button';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import {
	CalendarIcon,
	DropletIcon,
	FileIcon,
	FilmIcon,
	FlaskConicalIcon,
	GalleryHorizontalIcon,
	MessageCircleIcon,
	ScaleIcon,
	ShoppingCartIcon,
	SquarePenIcon,
	StethoscopeIcon,
	SyringeIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use, useState } from 'react';
import DialogServices from './dialog-services';
import PetFormClient from './pet-form';

interface PetDetailsClientProps {
	pet: PetWithTutorAndBreed;
	speciesPromise: Promise<Specie[]>;
	breedsPromise: Promise<BreedsWithSpecies[]>;
	customersPromise: Promise<CustomerWithUser[]>;
}

const PetDetailsClient = ({
	pet,
	speciesPromise,
	breedsPromise,
	customersPromise,
}: PetDetailsClientProps) => {
	const species = use(speciesPromise);
	const breeds = use(breedsPromise);
	const customers = use(customersPromise);

	const [activeTab, setActiveTab] = useState('history');

	const age = calculateAge(new Date(pet.birthDate));
	const fullAddress = `${pet.tutor.address}, ${pet.tutor.addressNumber} - ${pet.tutor.neighborhood}, ${pet.tutor.city} - ${pet.tutor.state}`;

	// CORREÇÃO: URL correta para busca no Google Maps
	const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

	// Lista de opções das abas
	const tabOptions = [
		{ id: 'history', label: 'Histórico', icon: GalleryHorizontalIcon },
		{ id: 'protocols', label: 'Protocolos', icon: DropletIcon },
		{ id: 'timeline', label: 'Linha do Tempo', icon: FilmIcon },
		{ id: 'schedule', label: 'Agenda', icon: CalendarIcon },
		{ id: 'sales', label: 'Vendas', icon: ShoppingCartIcon },
	];

	return (
		<div className='flex flex-col gap-4 w-full'>
			<div className='flex flex-col md:flex-row gap-4 w-full'>
				{/* Card da Foto e Nome */}
				<div className='flex flex-col items-center justify-start gap-4 p-5 w-full lg:min-w-75 lg:w-1/3 border border-muted rounded-lg bg-card'>
					<div className='relative w-40 h-40 md:w-50 md:h-50'>
						<Image
							src={
								pet?.photo
									? pet.photo
									: pet?.breed?.specie.name === 'Canino'
										? '/dog-placeholder.png'
										: '/cat-placeholder.svg'
							}
							alt='Foto do pet'
							fill
							draggable={false}
							className='rounded-full border border-zinc-300 object-cover select-none'
						/>
					</div>

					<div className='text-center'>
						<h1 className='font-bold text-2xl'>{pet.name}</h1>
						<p className='text-muted-foreground text-sm'>
							{pet.breed.specie.name} • {age}
						</p>
					</div>
				</div>

				{/* Card de Dados Cadastrais */}
				<div className='flex flex-col gap-4 p-5 w-full lg:w-2/3 border border-muted rounded-lg bg-card'>
					<div className='flex flex-row items-center justify-between gap-3'>
						<h2 className='text-xl font-semibold'>Dados Cadastrais</h2>
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
					</div>

					<Separator />

					<div className='grid grid-cols-2 gap-y-3 gap-x-4 text-sm'>
						<p>
							<span className='font-semibold text-muted-foreground'>
								Espécie:
							</span>{' '}
							{pet.breed.specie.name}
						</p>

						<p>
							<span className='font-semibold text-muted-foreground'>Raça:</span>{' '}
							{pet.breed.name}
						</p>

						<p>
							<span className='font-semibold text-muted-foreground'>
								Gênero:
							</span>{' '}
							{pet.gender === 'female' ? 'Fêmea' : 'Macho'}
						</p>

						<p>
							<span className='font-semibold text-muted-foreground'>Cor:</span>{' '}
							{pet.color}
						</p>

						<p>
							<span className='font-semibold text-muted-foreground'>
								Nascimento:
							</span>{' '}
							{format(new Date(pet.birthDate + 'T12:00:00'), 'dd/MM/yyyy')}
						</p>

						<p>
							<span className='font-semibold text-muted-foreground'>
								Idade:
							</span>{' '}
							{age}
						</p>

						<p className='col-span-2 w-full'>
							<span className='font-semibold text-muted-foreground'>
								Tutor:
							</span>{' '}
							{pet.tutor.user.name}
						</p>

						<p className='col-span-2'>
							<span className='font-semibold text-muted-foreground'>
								Endereço:
							</span>{' '}
							{fullAddress}
						</p>

						<div className='col-span-2 pt-2'>
							<Button asChild variant='outline' className='w-full gap-2'>
								<Link href={googleMapsUrl} target='_blank'>
									<GoogleMapsIcon className='w-4 h-4' />
									Abrir no Google Maps
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Seção de Abas Mobile-Friendly */}
			<div className='flex flex-col gap-4 p-5 w-full border border-muted rounded-lg bg-card'>
				<h2 className='text-xl font-semibold'>Informações Adicionais</h2>
				<Separator />

				<Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
					{/* VIEW MOBILE: Dropdown (Select) */}
					<div className='md:hidden w-full'>
						<Select value={activeTab} onValueChange={setActiveTab}>
							<SelectTrigger className='w-full bg-muted/50 h-12'>
								<SelectValue placeholder='Selecione uma categoria' />
							</SelectTrigger>
							<SelectContent>
								{tabOptions.map((tab) => (
									<SelectItem key={tab.id} value={tab.id}>
										<div className='flex items-center gap-2'>
											<tab.icon className='w-4 h-4' />
											<span>{tab.label}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* VIEW DESKTOP: Tabs tradicionais */}
					<TabsList className='hidden md:flex w-full justify-start h-auto p-1 bg-muted/50 border'>
						{tabOptions.map((tab) => (
							<TabsTrigger
								key={tab.id}
								value={tab.id}
								className='flex gap-2 px-4 py-2 hover:cursor-pointer'
							>
								<tab.icon className='w-4 h-4' />
								{tab.label}
							</TabsTrigger>
						))}
					</TabsList>

					<div className='p-4 border rounded-md bg-card'>
						<TabsContent value='history' className='w-full'>
							<div className='flex flex-col lg:flex-row gap-4 '>
								<div className='grid grid-cols-1 lg:grid-cols-3 gap-4 lg:w-2/3 bg-card'>
									<DialogServices />

									<Button className='bg-weight hover:bg-weight/80'>
										<ScaleIcon />
										Peso
									</Button>

									<Button className='bg-pathology hover:bg-pathology/80'>
										<StethoscopeIcon />
										Patologia
									</Button>

									<Button className='bg-document hover:bg-document/80'>
										<FileIcon />
										Documento
									</Button>

									<Button className='bg-exam hover:bg-exam/80'>
										<FlaskConicalIcon /> Exame
									</Button>

									<Button className='bg-vaccine hover:bg-vaccine/80'>
										<SyringeIcon />
										Vacina
									</Button>

									<Button className='bg-prescription hover:bg-prescription/80'>
										<SquarePenIcon />
										Receita
									</Button>

									<Button className='bg-notes hover:bg-notes/80'>
										<MessageCircleIcon />
										Observações
									</Button>
								</div>

								<div className='w-full lg:w-1/3 border p-4 rounded-lg bg-card'>
									<h1>Histórico do {pet.name}</h1>
								</div>
							</div>
						</TabsContent>

						<TabsContent value='protocols'>
							<h1>Protocolos Clínicos</h1>
						</TabsContent>

						<TabsContent value='timeline'>
							<h1>Linha do Tempo</h1>
						</TabsContent>

						<TabsContent value='schedule'>
							<h1>Próximos Agendamentos</h1>
						</TabsContent>

						<TabsContent value='sales'>
							<h1>Histórico de Vendas</h1>
						</TabsContent>
					</div>
				</Tabs>
			</div>
		</div>
	);
};

export default PetDetailsClient;
