<script lang="ts">
	import { onMount } from 'svelte';
	import PatientCard from '$lib/PatientCard.svelte';
	import PatientModal from '$lib/PatientModal.svelte';
	import { fetchAllPatients, getMockPatients, createPatient, updatePatient, deletePatient, withMockFallback } from '$lib/api';
	import { addToast } from '$lib/toast.svelte';
	import type { Patient, PatientCreateDto, PatientUpdateDto } from '$lib/types';

	let patients      = $state<Patient[]>([]);
	let loading       = $state(true);
	let searchQuery   = $state('');
	let modalMode     = $state<'create' | 'edit' | 'delete' | null>(null);
	let activePatient = $state<Patient | null>(null);
	let modalLoading  = $state(false);
	let createdPatient = $state<Patient | null>(null);  // shown in QR after create

	let filtered = $derived(
		patients.filter(p =>
			!searchQuery ||
			p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			p.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
			p.id.toLowerCase().includes(searchQuery.toLowerCase())
		)
	);

	onMount(async () => {
		try {
			patients = await fetchAllPatients();
		} catch (err) {
			patients = withMockFallback(err, getMockPatients());
			addToast('warn', 'Server unreachable — showing demo records.');
		} finally { loading = false; }
	});

	async function handleCreate(dto: PatientCreateDto) {
		modalLoading = true;
		try {
			const created = await createPatient(dto);
			patients = [created, ...patients];
			createdPatient = created;
			addToast('success', `Patient "${created.name}" created.`);
		} catch {
			const mock: Patient = { id: crypto.randomUUID(), ...dto, lastUpdated: new Date().toISOString() };
			patients = [mock, ...patients];
			createdPatient = mock;
			addToast('warn', 'Server unreachable — record added locally.');
		} finally { modalLoading = false; }
		// keep modal open but swap to QR view (createdPatient drives it)
	}

	async function handleEdit(dto: PatientUpdateDto) {
		if (!activePatient) return;
		modalLoading = true;
		try {
			const updated = await updatePatient(activePatient.id, dto);
			patients = patients.map(p => p.id === updated.id ? updated : p);
			addToast('success', 'Patient record updated.');
		} catch {
			const merged = { ...activePatient, ...dto, lastUpdated: new Date().toISOString() } as Patient;
			patients = patients.map(p => p.id === merged.id ? merged : p);
			addToast('warn', 'Server unreachable — changes applied locally.');
		} finally { modalLoading = false; modalMode = null; activePatient = null; }
	}

	async function handleDelete() {
		if (!activePatient) return;
		modalLoading = true;
		try { await deletePatient(activePatient.id); } catch { /* demo */ }
		finally {
			addToast('success', `Patient "${activePatient.name}" deleted.`);
			patients = patients.filter(p => p.id !== activePatient!.id);
			modalLoading = false; modalMode = null; activePatient = null;
		}
	}

	function openCreate() { activePatient = null; createdPatient = null; modalMode = 'create'; }
	function openEdit(p: Patient)   { activePatient = p; modalMode = 'edit'; }
	function openDelete(p: Patient) { activePatient = p; modalMode = 'delete'; }

	function closeModal() {
		modalMode = null; activePatient = null; createdPatient = null;
	}
</script>

<svelte:head><title>PatientScan — All Patients</title></svelte:head>

<!-- Toolbar -->
<div class="flex items-center gap-3">
	<div class="flex-1 relative">
		<svg class="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--dim)]" width="12" height="12"
			viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
		</svg>
		<input bind:value={searchQuery} type="text"
			placeholder="Search by name, diagnosis, or ID…"
			class="w-full bg-[var(--surface)] border border-[var(--border)] text-white text-xs pl-9 pr-4 py-3 outline-none focus:border-emerald-400 transition-colors placeholder:text-[var(--dim)] font-mono" />
	</div>
	<button onclick={openCreate}
		class="flex items-center gap-2 px-5 py-3 bg-emerald-400 text-black text-xs font-medium tracking-widest uppercase hover:bg-emerald-300 transition-colors font-mono shrink-0">
		<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
		</svg>
		New Patient
	</button>
</div>

{#if !loading}
	<p class="text-[10px] text-[var(--dim)] tracking-[3px] uppercase -mt-1">
		{filtered.length} record{filtered.length !== 1 ? 's' : ''}
		{#if searchQuery} matching "{searchQuery}"{/if}
	</p>
{/if}

{#if loading}
	<div class="flex flex-col gap-4">
		{#each [1,2,3] as _}
			<div class="border border-[var(--border)] bg-[var(--surface)] p-5 animate-pulse">
				<div class="h-3 w-1/3 bg-[var(--border)] rounded mb-3"></div>
				<div class="h-2 w-1/2 bg-[var(--border)] rounded"></div>
			</div>
		{/each}
	</div>
{:else if filtered.length === 0}
	<div class="border border-[var(--border)] bg-[var(--surface)] p-12 text-center">
		<p class="text-[var(--dim)] text-xs tracking-widest uppercase mb-2">No records found</p>
		{#if searchQuery}
			<button onclick={() => searchQuery = ''} class="text-emerald-400 text-xs underline">Clear search</button>
		{/if}
	</div>
{:else}
	<div class="flex flex-col gap-4">
		{#each filtered as p (p.id)}
			<PatientCard patient={p} compact={true} onedit={openEdit} ondelete={openDelete} />
		{/each}
	</div>
{/if}

<!-- Modals -->
{#if modalMode === 'create'}
	<PatientModal mode="create" loading={modalLoading} {createdPatient}
		onconfirm={(dto) => handleCreate(dto as PatientCreateDto)}
		oncancel={closeModal} />
{/if}

{#if modalMode === 'edit' && activePatient}
	<PatientModal mode="edit" patient={activePatient} loading={modalLoading}
		onconfirm={(dto) => handleEdit(dto as PatientUpdateDto)}
		oncancel={closeModal} />
{/if}

{#if modalMode === 'delete' && activePatient}
	<PatientModal mode="delete" patient={activePatient} loading={modalLoading}
		onconfirm={handleDelete}
		oncancel={closeModal} />
{/if}
