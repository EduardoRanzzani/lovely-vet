import z from 'zod';

const formSchema = z.object({});

type FormSchema = z.infer<typeof formSchema>;

const DialogObservations = () => {
	return <div>DialogObservations</div>;
};

export default DialogObservations;
