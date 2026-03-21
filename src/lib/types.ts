export interface Patient {
	id: string;
	name: string;
	gender: string;
	dateOfBirth: string;
	diagnosis: string;
	lastUpdated: string;
}

export interface PatientUpdateDto {
	name?: string;
	gender?: string;
	dateOfBirth?: string;
	diagnosis?: string;
}

export interface PatientCreateDto {
	name: string;
	gender: string;
	dateOfBirth: string;
	diagnosis: string;
}

export type Toast = { id: number; type: 'success' | 'error' | 'warn'; msg: string };
export type ModalMode = 'edit' | 'delete' | 'create' | null;
