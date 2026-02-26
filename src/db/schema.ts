import { relations } from 'drizzle-orm';
import {
	boolean,
	date,
	index,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	text,
	time,
	timestamp,
	uuid,
} from 'drizzle-orm/pg-core';

// --- ENUMS ---

export const userRoleEnum = pgEnum('user_role', [
	'admin',
	'doctor',
	'customer',
]);
export const sexEnum = pgEnum('sex', ['male', 'female']);
export const petStatusEnum = pgEnum('pet_status', ['alive', 'dead', 'missing']);
export const appointmentStatusEnum = pgEnum('appointment_status', [
	'pending',
	'confirmed',
	'in_progress',
	'completed',
	'cancelled',
	'no_show',
]);

// --- TABLES ---

export const usersTable = pgTable('users', {
	id: uuid('id').defaultRandom().primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	image: text('image'),
	// Clerk ID opcional para permitir cadastro manual prévio
	clerkUserId: text('clerk_user_id').unique(),
	role: userRoleEnum('role').default('customer').notNull(),
	// Flag para sua dialog de "finalizar cadastro" no dashboard
	isRegistrationComplete: boolean('is_registration_complete')
		.default(false)
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const doctorsTable = pgTable('doctors', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	phone: text('phone').notNull(),
	cpf: text('cpf').notNull().unique(),
	gender: sexEnum('gender').notNull(),
	licenseNumber: text('license_number').notNull(),
	licenseState: text('license_state').notNull(),
	specialty: text('specialty'),
	// Uso de TIME para facilitar lógica de agenda
	availableFromWeekDay: integer('available_from_week_day').notNull().default(1),
	availableToWeekDay: integer('available_to_week_day').notNull().default(5),
	availableFromTime: time('available_from_time').notNull(),
	availableToTime: time('available_to_time').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const customersTable = pgTable('customers', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: uuid('user_id')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade' }),
	phone: text('phone').notNull(),
	cpf: text('cpf').notNull().unique(),
	gender: sexEnum('gender').notNull(),
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
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const breedsTable = pgTable('breeds', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	specieId: uuid('specie_id')
		.notNull()
		.references(() => speciesTable.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const petsTable = pgTable('pets', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	birthDate: date('birth_date').notNull(),
	breedId: uuid('breed_id')
		.notNull()
		.references(() => breedsTable.id),
	customerId: uuid('customer_id')
		.notNull()
		.references(() => customersTable.id, { onDelete: 'cascade' }),
	color: text('color').notNull(),
	gender: sexEnum('gender').notNull(),
	sterile: boolean('sterile').default(false).notNull(),
	status: petStatusEnum('status').default('alive').notNull(),
	weightInGrams: integer('weight_in_grams'),
	photo: text('photo'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const servicesTable = pgTable('services', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	description: text('description'),
	priceInCents: integer('price_in_cents').notNull(),
	durationMinutes: integer('duration_minutes').default(30).notNull(),
	specieId: uuid('specie_id').references(() => speciesTable.id, {
		onDelete: 'cascade',
	}),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

export const appointmentsTable = pgTable(
	'appointments',
	{
		id: uuid('id').primaryKey().defaultRandom(),
		petId: uuid('pet_id')
			.notNull()
			.references(() => petsTable.id),
		doctorId: uuid('doctor_id')
			.notNull()
			.references(() => doctorsTable.id),
		scheduledAt: timestamp('scheduled_at').notNull(),
		status: appointmentStatusEnum('status').default('pending').notNull(),
		totalPriceInCents: integer('total_price_in_cents').notNull(),
		notes: text('notes'),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at')
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => ({
		scheduledIdx: index('scheduled_at_idx').on(table.scheduledAt),
	}),
);

// Tabela Many-to-Many para múltiplos serviços por atendimento
export const appointmentItemsTable = pgTable(
	'appointment_items',
	{
		appointmentId: uuid('appointment_id')
			.notNull()
			.references(() => appointmentsTable.id, { onDelete: 'cascade' }),
		serviceId: uuid('service_id')
			.notNull()
			.references(() => servicesTable.id),
		priceAtTimeInCents: integer('price_at_time_in_cents').notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.appointmentId, table.serviceId] }),
	}),
);

// Prontuário Médico
export const medicalRecordsTable = pgTable('medical_records', {
	id: uuid('id').primaryKey().defaultRandom(),
	appointmentId: uuid('appointment_id').references(() => appointmentsTable.id),
	petId: uuid('pet_id')
		.notNull()
		.references(() => petsTable.id),
	doctorId: uuid('doctor_id')
		.notNull()
		.references(() => doctorsTable.id),
	diagnosis: text('diagnosis').notNull(),
	treatmentPlan: text('treatment_plan'),
	weightAtTimeInGrams: integer('weight_at_time_in_grams'),
	observations: text('observations'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// --- RELATIONS ---

export const usersRelations = relations(usersTable, ({ one }) => ({
	doctor: one(doctorsTable, {
		fields: [usersTable.id],
		references: [doctorsTable.userId],
	}),
	customer: one(customersTable, {
		fields: [usersTable.id],
		references: [customersTable.userId],
	}),
}));

export const doctorsRelations = relations(doctorsTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [doctorsTable.userId],
		references: [usersTable.id],
	}),
	appointments: many(appointmentsTable),
}));

export const customersRelations = relations(
	customersTable,
	({ one, many }) => ({
		user: one(usersTable, {
			fields: [customersTable.userId],
			references: [usersTable.id],
		}),
		pets: many(petsTable),
	}),
);

export const speciesRelations = relations(speciesTable, ({ many }) => ({
	breeds: many(breedsTable),
	services: many(servicesTable),
}));

export const breedsRelations = relations(breedsTable, ({ one, many }) => ({
	specie: one(speciesTable, {
		fields: [breedsTable.specieId],
		references: [speciesTable.id],
	}),
	pets: many(petsTable),
}));

export const servicesRelations = relations(servicesTable, ({ one }) => ({
	specie: one(speciesTable, {
		fields: [servicesTable.specieId],
		references: [speciesTable.id],
	}),
}));

export const petsRelations = relations(petsTable, ({ one, many }) => ({
	breed: one(breedsTable, {
		fields: [petsTable.breedId],
		references: [breedsTable.id],
	}),
	tutor: one(customersTable, {
		fields: [petsTable.customerId],
		references: [customersTable.id],
	}),
	medicalRecords: many(medicalRecordsTable),
	appointments: many(appointmentsTable),
}));

export const appointmentsRelations = relations(
	appointmentsTable,
	({ one, many }) => ({
		pet: one(petsTable, {
			fields: [appointmentsTable.petId],
			references: [petsTable.id],
		}),
		doctor: one(doctorsTable, {
			fields: [appointmentsTable.doctorId],
			references: [doctorsTable.id],
		}),
		items: many(appointmentItemsTable),
		medicalRecord: one(medicalRecordsTable, {
			fields: [appointmentsTable.id],
			references: [medicalRecordsTable.appointmentId],
		}),
	}),
);

export const appointmentItemsRelations = relations(
	appointmentItemsTable,
	({ one }) => ({
		appointment: one(appointmentsTable, {
			fields: [appointmentItemsTable.appointmentId],
			references: [appointmentsTable.id],
		}),
		service: one(servicesTable, {
			fields: [appointmentItemsTable.serviceId],
			references: [servicesTable.id],
		}),
	}),
);
