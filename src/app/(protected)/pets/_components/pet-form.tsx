'use client';
import { BreedsWithSpecies } from '@/api/schema/breeds.schema';
import { CustomerWithUser } from '@/api/schema/customers.schema';
import { PetsWithTutorAndBreed } from '@/api/schema/pets.schema';
import { Specie } from '@/api/schema/species.schema';
import {
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';

interface PetFormClientProps {
	pet?: PetsWithTutorAndBreed;
	species: Specie[];
	breeds: BreedsWithSpecies[];
	customers: CustomerWithUser[];
	onSuccess?: () => void;
}

const PetFormClient = ({
	pet,
	species,
	breeds,
	customers,
	onSuccess,
}: PetFormClientProps) => {
	return (
		<DialogContent
			onInteractOutside={(e) => e.preventDefault()}
			showCloseButton={false}
			className='max-w-lg'
		>
			<DialogHeader>
				<DialogTitle>{pet ? 'Atualizar Pet' : 'Cadastrar Pet'}</DialogTitle>
				<DialogDescription>
					{pet
						? 'Atualize as informações do pet selecionadl'
						: 'Adicione um novo pet ao sistema'}
				</DialogDescription>
			</DialogHeader>

			<h1>teste</h1>

			<DialogFooter>
				{/* <div className='flex flex-col lg:flex-row gap-4 w-full'>
					<DialogClose asChild>
						<Button
							type='button'
							variant={'destructive'}
							onClick={() => {
								if (!isPending) reset();
							}}
							className='flex-1'
						>
							<BanIcon />
							Cancelar
						</Button>
					</DialogClose>

					<Button
						type='submit'
						disabled={isPending}
						form='registerForm'
						className='flex-1'
					>
						{isPending ? (
							<Loader2Icon className='h-5 w-5 animate-spin' />
						) : (
							<>
								<SaveIcon className='mr-2 h-4 w-4' />
								Salvar
							</>
						)}
					</Button>
				</div> */}
			</DialogFooter>
		</DialogContent>
	);
};

export default PetFormClient;
