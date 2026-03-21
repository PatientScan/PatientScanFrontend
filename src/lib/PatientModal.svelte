<script lang="ts">
	import type { Patient, PatientCreateDto, PatientUpdateDto } from '$lib/types';
	import { isoToDateInput } from '$lib/api';
	import QrDisplay from '$lib/QrDisplay.svelte';

	let {
		mode,
		patient,
		loading = false,
		createdPatient = null,   // set by parent after POST resolves to show QR
		onconfirm,
		oncancel
	}: {
		mode: 'create' | 'edit' | 'delete';
		patient?: Patient;
		loading?: boolean;
		createdPatient?: Patient | null;
		onconfirm: (dto: PatientCreateDto | PatientUpdateDto) => void;
		oncancel: () => void;
	} = $props();

	let name      = $state(patient?.name ?? '');
	let gender    = $state(patient?.gender ?? '');
	let dob       = $state(patient ? isoToDateInput(patient.dateOfBirth) : '');
	let diagnosis = $state(patient?.diagnosis ?? '');
	let errors    = $state<Record<string, string>>({});

	// After creation succeeds, parent sets createdPatient → show QR inline
	let showQr = $derived(mode === 'create' && !!createdPatient);

	function validate(): boolean {
		const e: Record<string, string> = {};
		if (mode === 'create') {
			if (!name.trim())      e.name = 'Name is required';
			if (!gender.trim())    e.gender = 'Gender is required';
			if (!dob)              e.dob = 'Date of birth is required';
			if (!diagnosis.trim()) e.diagnosis = 'Diagnosis is required';
		}
		errors = e;
		return Object.keys(e).length === 0;
	}

	function submit() {
		if (mode === 'delete') { onconfirm({}); return; }
		if (!validate()) return;
		if (mode === 'create') {
			onconfirm({ name: name, gender: gender, dateOfBirth: new Date(dob).toISOString(), diagnosis: diagnosis } satisfies PatientCreateDto);
		} else {
			const dto: PatientUpdateDto = {};
			if (name !== patient?.name)                                    dto.name = name;
			if (gender !== patient?.gender)                                dto.gender = gender;
			if (dob !== isoToDateInput(patient?.dateOfBirth ?? ''))        dto.dateOfBirth = new Date(dob).toISOString();
			if (diagnosis !== patient?.diagnosis)                          dto.diagnosis = diagnosis;
			onconfirm(dto);
		}
	}

	const titles = { create: 'New Patient', edit: 'Edit Patient', delete: 'Delete Patient' };
</script>

<!-- If creation just succeeded, hand off to QrDisplay directly -->
{#if showQr && createdPatient}
	<QrDisplay patient={createdPatient} onclose={oncancel} />
{:else}
<!-- Backdrop -->
<div
	class="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
	role="presentation"
	onclick={(e) => e.target === e.currentTarget && oncancel()}
	onkeydown={(e) => e.key === 'Escape' && oncancel()}
>
	<div class="slide-up w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
		<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent
			{mode === 'delete' ? 'via-red-400' : 'via-emerald-400'} to-transparent"></div>

		<!-- Header -->
		<div class="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
			<p class="text-[10px] uppercase tracking-[4px] text-[var(--dim)] flex items-center gap-3">
				{titles[mode]}
				{#if mode !== 'create'}
					<span class="font-mono text-[var(--dim)] normal-case tracking-normal truncate max-w-[180px]">{patient?.id}</span>
				{/if}
			</p>
			<button onclick={oncancel} class="text-[var(--dim)] hover:text-white transition-colors text-lg leading-none">✕</button>
		</div>

		<!-- Body -->
		<div class="p-6">
			{#if mode === 'delete'}
				<p class="text-xl text-white mb-1" style="font-family:'Instrument Serif',serif; font-style:italic;">{patient?.name}</p>
				<p class="text-xs text-[var(--dim)] mb-6">This will permanently delete the patient record. This action cannot be undone.</p>
			{:else}
				<div class="flex flex-col gap-4">

					<!-- Name -->
					<div>
						<label for="field-name" class="block text-[9px] uppercase tracking-[3px] text-[var(--dim)] mb-1.5">
							Name {#if mode === 'create'}<span class="text-red-400">*</span>{/if}
						</label>
						<input id="field-name" bind:value={name} type="text" placeholder="Full name"
							class="w-full bg-[var(--bg)] border text-white text-xs px-4 py-3 outline-none transition-colors font-mono placeholder:text-[var(--dim)]
								{errors.name ? 'border-red-400' : 'border-[var(--border)] focus:border-emerald-400'}" />
						{#if errors.name}<p class="text-[10px] text-red-400 mt-1">{errors.name}</p>{/if}
					</div>

					<!-- Gender -->
					<div>
						<label for="field-gender" class="block text-[9px] uppercase tracking-[3px] text-[var(--dim)] mb-1.5">
							Gender {#if mode === 'create'}<span class="text-red-400">*</span>{/if}
						</label>
						<div class="flex gap-2 mb-2">
							{#each ['Male', 'Female', 'Other'] as g}
								<button type="button" onclick={() => gender = g}
									class="flex-1 py-2.5 text-xs tracking-widest uppercase border transition-colors font-mono
										{gender === g ? 'bg-emerald-400 text-black border-emerald-400' : 'border-[var(--border)] text-[var(--dim)] hover:border-emerald-400 hover:text-emerald-400'}"
								>{g}</button>
							{/each}
						</div>
						<input id="field-gender" bind:value={gender} type="text" placeholder="Or type custom…"
							class="w-full bg-[var(--bg)] border text-white text-xs px-4 py-2.5 outline-none transition-colors font-mono placeholder:text-[var(--dim)]
								{errors.gender ? 'border-red-400' : 'border-[var(--border)] focus:border-emerald-400'}" />
						{#if errors.gender}<p class="text-[10px] text-red-400 mt-1">{errors.gender}</p>{/if}
					</div>

					<!-- Date of Birth -->
					<div>
						<label for="field-dob" class="block text-[9px] uppercase tracking-[3px] text-[var(--dim)] mb-1.5">
							Date of Birth {#if mode === 'create'}<span class="text-red-400">*</span>{/if}
						</label>
						<input id="field-dob" bind:value={dob} type="date" max={new Date().toISOString().substring(0,10)}
							class="w-full bg-[var(--bg)] border text-white text-xs px-4 py-3 outline-none transition-colors font-mono [color-scheme:dark]
								{errors.dob ? 'border-red-400' : 'border-[var(--border)] focus:border-emerald-400'}" />
						{#if errors.dob}<p class="text-[10px] text-red-400 mt-1">{errors.dob}</p>{/if}
					</div>

					<!-- Diagnosis -->
					<div>
						<label for="field-diagnosis" class="block text-[9px] uppercase tracking-[3px] text-[var(--dim)] mb-1.5">
							Diagnosis {#if mode === 'create'}<span class="text-red-400">*</span>{/if}
						</label>
						<textarea id="field-diagnosis" bind:value={diagnosis} rows="3" placeholder="Primary diagnosis…"
							class="w-full bg-[var(--bg)] border text-white text-xs px-4 py-3 outline-none transition-colors font-mono placeholder:text-[var(--dim)] resize-none
								{errors.diagnosis ? 'border-red-400' : 'border-[var(--border)] focus:border-emerald-400'}"></textarea>
						{#if errors.diagnosis}<p class="text-[10px] text-red-400 mt-1">{errors.diagnosis}</p>{/if}
					</div>

				</div>
			{/if}
		</div>

		<!-- Footer -->
		<div class="px-6 pb-6 flex gap-3 justify-end">
			<button onclick={oncancel}
				class="px-5 py-2.5 border border-[var(--border)] text-[var(--dim)] text-xs tracking-widest uppercase hover:text-white hover:border-white/30 transition-colors font-mono">
				Cancel
			</button>
			<button onclick={submit} disabled={loading}
				class="flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase font-mono transition-colors disabled:opacity-50
					{mode === 'delete' ? 'bg-red-500 text-white hover:bg-red-400' : 'bg-emerald-400 text-black hover:bg-emerald-300'}">
				{#if loading}
					<span class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
				{/if}
				{mode === 'create' ? 'Create Patient' : mode === 'delete' ? 'Delete' : 'Save Changes'}
			</button>
		</div>
	</div>
</div>
{/if}
