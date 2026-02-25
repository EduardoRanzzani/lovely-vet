import { convertAppointmentStatus } from '@/api/config/consts';
import { AppointmentsWithRelations } from '@/api/schema/appointments.schema';
import { Badge } from '@/components/ui/badge';

interface BadgeStatusProps {
	appointment: AppointmentsWithRelations;
}

const BadgeStatus = ({ appointment }: BadgeStatusProps) => {
	const variant = () => {
		switch (appointment.status) {
			case 'completed':
				return 'default';
			case 'confirmed':
				return 'secondary';
			case 'cancelled':
				return 'destructive';
			default:
				return 'outline';
		}
	};

	return (
		<Badge variant={variant()}>
			{convertAppointmentStatus(appointment.status)}
		</Badge>
	);
};

export default BadgeStatus;
