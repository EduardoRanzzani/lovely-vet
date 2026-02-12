import { relations } from 'drizzle-orm';
import {
	boolean,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';

// Enums

export const appointmentStatusEnum = pgEnum('appointment_status', [
	'pending', // Aguardando confirmação
	'confirmed', // Confirmado pelo veterinário
	'in_progress', // Veterinário em deslocamento ou em atendimento
	'completed', // Finalizado
	'cancelled', // Cancelado
	'no_show', // Cliente não estava em casa
]);

export const userRoleEnum = pgEnum('user_role', [
	'admin',
	'veterinarian',
	'client',
]);

// System tables to manage all the clinic data

export const usersTable = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	image: text('image'),
	clerkUserId: text('clerk_user_id').notNull(),
	role: userRoleEnum('role').default('client').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const doctorsTable = pgTable('doctors', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	phone: text('phone').notNull(),
	cpf: text('cpf').notNull().unique(),
	licenseNumber: text('licence_number').notNull(),
	licenseState: text('license_state').notNull(),
	specialty: text('specialty'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const customersTable = pgTable('customers', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	phone: text('phone').notNull(),
	cpf: text('cpf').notNull().unique(),
	email: text('email').notNull(),
	postalCode: text('postal_code').notNull(),
	address: text('address').notNull(),
	addressNumber: text('address_number').notNull().default('S/N'),
	neighborhood: text('neighborhood').notNull(),
	city: text('city').notNull(),
	state: text('state').notNull().default('MS'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const speciesTable = pgTable('species', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	name: text('name').notNull().unique(), // e.g., "Canine", "Feline"
});

export const breedsTable = pgTable('breeds', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	name: text('name').notNull(),
	speciesId: uuid('species_id')
		.notNull()
		.references(() => speciesTable.id, { onDelete: 'cascade' }),
});

export const petsTable = pgTable('pets', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	name: text('name').notNull(),
	birthDate: timestamp('birth_date'),
	breedId: uuid('breed_id')
		.notNull()
		.references(() => breedsTable.id),
	sterile: boolean('sterile').default(false).notNull(),
	photo: text('photo'),
	color: text('color'),
	gender: text('gender'),
	weight: text('weight'),
	status: text('status'),
	observations: text('observations'),
});

export const ownersToPetsTable = pgTable(
	'owners_to_pets',
	{
		clientId: uuid('client_id')
			.notNull()
			.references(() => customersTable.id, { onDelete: 'cascade' }),
		petId: uuid('pet_id')
			.notNull()
			.references(() => petsTable.id, { onDelete: 'cascade' }),
	},
	(t) => [primaryKey({ columns: [t.clientId, t.petId] })],
);

export const servicesTable = pgTable('services', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	name: text('name').notNull(),
	priceInCents: integer('price_in_cents').notNull(),
	description: text('description'),
});

export const appointmentsTable = pgTable('appointments', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	petId: uuid('pet_id')
		.notNull()
		.references(() => petsTable.id),
	serviceId: uuid('service_id')
		.notNull()
		.references(() => servicesTable.id),
	veterinarianId: uuid('veterinarian_id')
		.notNull()
		.references(() => doctorsTable.id),
	scheduledAt: timestamp('scheduled_at').notNull(),
	status: appointmentStatusEnum('status').default('pending').notNull(),
	totalPriceInCents: integer('total_price_in_cents').notNull(), // Preço fixado no momento do agendamento
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations

export const usersRelations = relations(usersTable, ({ one }) => ({
	doctorsProfile: one(doctorsTable, {
		fields: [usersTable.id],
		references: [doctorsTable.userId],
	}),
	customersProfile: one(customersTable, {
		fields: [usersTable.id],
		references: [customersTable.userId],
	}),
}));

export const doctorsRelations = relations(doctorsTable, ({ one }) => ({
	users: one(usersTable, {
		fields: [doctorsTable.userId],
		references: [usersTable.id],
	}),
}));

export const customersRelations = relations(
	customersTable,
	({ one, many }) => ({
		users: one(usersTable, {
			fields: [customersTable.userId],
			references: [usersTable.id],
		}),
		ownersToPets: many(ownersToPetsTable),
	}),
);

export const petsRelations = relations(petsTable, ({ one, many }) => ({
	breeds: one(breedsTable, {
		fields: [petsTable.breedId],
		references: [breedsTable.id],
	}),
	ownersToPets: many(ownersToPetsTable),
	appointments: many(appointmentsTable),
}));

export const ownersToPetsRelations = relations(
	ownersToPetsTable,
	({ one }) => ({
		customers: one(customersTable, {
			fields: [ownersToPetsTable.clientId],
			references: [customersTable.id],
		}),
		pets: one(petsTable, {
			fields: [ownersToPetsTable.petId],
			references: [petsTable.id],
		}),
	}),
);

export const breedsRelations = relations(breedsTable, ({ one, many }) => ({
	species: one(speciesTable, {
		fields: [breedsTable.speciesId],
		references: [speciesTable.id],
	}),
	pets: many(petsTable),
}));

export const speciesRelations = relations(speciesTable, ({ many }) => ({
	breeds: many(breedsTable),
}));

export const servicesRelations = relations(servicesTable, ({ many }) => ({
	appointments: many(appointmentsTable),
}));

export const appointmentsRelations = relations(
	appointmentsTable,
	({ one }) => ({
		pets: one(petsTable, {
			fields: [appointmentsTable.petId],
			references: [petsTable.id],
		}),
		services: one(servicesTable, {
			fields: [appointmentsTable.serviceId],
			references: [servicesTable.id],
		}),
		doctors: one(doctorsTable, {
			fields: [appointmentsTable.veterinarianId],
			references: [doctorsTable.id],
		}),
	}),
);
