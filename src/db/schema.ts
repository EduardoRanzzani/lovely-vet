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

export const user = pgTable('user', {
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

export const veterinarian = pgTable('veterinarian', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
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

export const client = pgTable('client', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	userId: uuid('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	phone: text('phone').notNull(),
	cpf: text('cpf').notNull().unique(),
	email: text('email').notNull(),
	postalCode: text('postal_code').notNull(),
	address: text('address').notNull(),
	addressNumber: text('address_number').notNull().default('S/N'),
	city: text('city').notNull(),
	state: text('state').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const species = pgTable('species', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	name: text('name').notNull().unique(), // e.g., "Canine", "Feline"
});

export const breed = pgTable('breed', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	name: text('name').notNull(),
	speciesId: uuid('species_id')
		.notNull()
		.references(() => species.id, { onDelete: 'cascade' }),
});

export const pet = pgTable('pet', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	name: text('name').notNull(),
	birthDate: timestamp('birth_date'),
	breedId: uuid('breed_id')
		.notNull()
		.references(() => breed.id),
	sterile: boolean('sterile').default(false).notNull(),
	photo: text('photo'),
	color: text('color'),
	gender: text('gender'),
	weight: text('weight'),
	status: text('status'),
	observations: text('observations'),
});

export const ownersToPets = pgTable(
	'owners_to_pets',
	{
		clientId: uuid('client_id')
			.notNull()
			.references(() => client.id, { onDelete: 'cascade' }),
		petId: uuid('pet_id')
			.notNull()
			.references(() => pet.id, { onDelete: 'cascade' }),
	},
	(t) => [primaryKey({ columns: [t.clientId, t.petId] })],
);

export const service = pgTable('service', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	name: text('name').notNull(),
	priceInCents: integer('price_in_cents').notNull(),
	description: text('description'),
});

export const appointment = pgTable('appointment', {
	id: uuid('id').primaryKey().defaultRandom().notNull(),
	petId: uuid('pet_id')
		.notNull()
		.references(() => pet.id),
	serviceId: uuid('service_id')
		.notNull()
		.references(() => service.id),
	veterinarianId: uuid('veterinarian_id')
		.notNull()
		.references(() => veterinarian.id),
	scheduledAt: timestamp('scheduled_at').notNull(),
	status: appointmentStatusEnum('status').default('pending').notNull(),
	totalPriceInCents: integer('total_price_in_cents').notNull(), // Preço fixado no momento do agendamento
	notes: text('notes'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations

export const userRelations = relations(user, ({ one }) => ({
	veterinarianProfile: one(veterinarian, {
		fields: [user.id],
		references: [veterinarian.userId],
	}),
	clientProfile: one(client, {
		fields: [user.id],
		references: [client.userId],
	}),
}));

export const veterinarianRelations = relations(veterinarian, ({ one }) => ({
	user: one(user, {
		fields: [veterinarian.userId],
		references: [user.id],
	}),
}));

export const clientRelations = relations(client, ({ one, many }) => ({
	user: one(user, {
		fields: [client.userId],
		references: [user.id],
	}),
	ownersToPets: many(ownersToPets),
}));

export const petRelations = relations(pet, ({ one, many }) => ({
	breed: one(breed, {
		fields: [pet.breedId],
		references: [breed.id],
	}),
	ownersToPets: many(ownersToPets),
	appointments: many(appointment),
}));

export const ownersToPetsRelations = relations(ownersToPets, ({ one }) => ({
	client: one(client, {
		fields: [ownersToPets.clientId],
		references: [client.id],
	}),
	pet: one(pet, {
		fields: [ownersToPets.petId],
		references: [pet.id],
	}),
}));

export const breedRelations = relations(breed, ({ one, many }) => ({
	species: one(species, {
		fields: [breed.speciesId],
		references: [species.id],
	}),
	pets: many(pet),
}));

export const speciesRelations = relations(species, ({ many }) => ({
	breeds: many(breed),
}));

export const serviceRelations = relations(service, ({ many }) => ({
	appointments: many(appointment),
}));

export const appointmentRelations = relations(appointment, ({ one }) => ({
	pet: one(pet, {
		fields: [appointment.petId],
		references: [pet.id],
	}),
	service: one(service, {
		fields: [appointment.serviceId],
		references: [service.id],
	}),
	veterinarian: one(veterinarian, {
		fields: [appointment.veterinarianId],
		references: [veterinarian.id],
	}),
}));
