import type { Patient, PatientCreateDto, PatientUpdateDto } from './types';

const BASE = 'https://localhost:7190';

function isNetworkError(msg: string) {
	return ['fetch', 'network', 'Failed', 'CORS', 'Load'].some(k => msg.includes(k));
}

// ── GET /patient/{id} ──────────────────────────────────────────────
export async function fetchPatient(id: string): Promise<Patient> {
	const res = await fetch(`${BASE}/patient/${encodeURIComponent(id)}`);
	if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
	return res.json();
}

// ── GET /patient/all ───────────────────────────────────────────────
export async function fetchAllPatients(): Promise<Patient[]> {
	const res = await fetch(`${BASE}/patient/all`);
	if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
	return res.json();
}

// ── POST /patient ──────────────────────────────────────────────────
export async function createPatient(dto: PatientCreateDto): Promise<Patient> {
	const res = await fetch(`${BASE}/patient`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(dto)
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
	return res.json();
}

// ── PATCH /patient/{id} ────────────────────────────────────────────
export async function updatePatient(id: string, dto: PatientUpdateDto): Promise<Patient> {
	const res = await fetch(`${BASE}/patient/${encodeURIComponent(id)}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(dto)
	});
	if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
	return res.json();
}

// ── DELETE /patient/{id} ───────────────────────────────────────────
export async function deletePatient(id: string): Promise<void> {
	const res = await fetch(`${BASE}/patient/${encodeURIComponent(id)}`, { method: 'DELETE' });
	if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
}

// ── Mock helpers ───────────────────────────────────────────────────
export function getMockPatient(id: string): Patient {
	return {
		id: id,
		name: 'Alexandra Chen',
		gender: 'Female',
		dateOfBirth: '1985-03-14T00:00:00',
		diagnosis: 'Type 2 Diabetes Mellitus with peripheral neuropathy',
		lastUpdated: new Date().toISOString()
	};
}

export function getMockPatients(): Patient[] {
	return [
		{ id: '11111111-0000-0000-0000-000000000001', name: 'Alexandra Chen', gender: 'Female', dateOfBirth: '1985-03-14T00:00:00', diagnosis: 'Type 2 Diabetes Mellitus', lastUpdated: new Date().toISOString() },
		{ id: '11111111-0000-0000-0000-000000000002', name: 'Marcus Webb', gender: 'Male', dateOfBirth: '1972-07-22T00:00:00', diagnosis: 'Hypertension, Stage 2', lastUpdated: new Date().toISOString() },
		{ id: '11111111-0000-0000-0000-000000000003', name: 'Priya Nair', gender: 'Female', dateOfBirth: '1990-11-05T00:00:00', diagnosis: 'Asthma, moderate persistent', lastUpdated: new Date().toISOString() },
		{ id: '11111111-0000-0000-0000-000000000004', name: 'David Osei', gender: 'Male', dateOfBirth: '1968-01-30T00:00:00', diagnosis: 'Chronic kidney disease, Stage 3', lastUpdated: new Date().toISOString() },
	];
}

export function withMockFallback<T>(err: unknown, mock: T): T {
	const msg = err instanceof Error ? err.message : String(err);
	if (isNetworkError(msg)) return mock;
	throw err;
}

// ── Formatting ─────────────────────────────────────────────────────
export function calcAge(dob: string): number {
	return Math.floor((Date.now() - new Date(dob).getTime()) / (365.25 * 24 * 3600 * 1000));
}

export function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
	return new Date(iso).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Convert ISO datetime to date string for <input type="date">
export function isoToDateInput(iso: string): string {
	return iso ? iso.substring(0, 10) : '';
}
