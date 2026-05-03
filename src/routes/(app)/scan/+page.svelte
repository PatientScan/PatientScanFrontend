<script lang="ts">
	import QrScanner from '$lib/QrScanner.svelte';
	import PatientCard from '$lib/PatientCard.svelte';
	import PatientModal from '$lib/PatientModal.svelte';
	import { fetchPatient, getMockPatient, updatePatient, deletePatient, withMockFallback } from '$lib/api';
	import { addToast } from '$lib/toast.svelte';
	import type { Patient, PatientUpdateDto } from '$lib/types';

	type Status = { type: 'info' | 'error' | 'warn'; msg: string } | null;

	let cameraActive  = $state(false);
	let loading       = $state(false);
	let patient       = $state<Patient | null>(null);
	let status        = $state<Status>(null);
	let manualId      = $state('');
	let scanner: QrScanner;

	let modalMode     = $state<'edit' | 'delete' | null>(null);
	let modalLoading  = $state(false);

	async function handleScan(id: string) {
		cameraActive = false;
		if (!id) return;
		await lookupPatient(id);
	}

	async function lookupPatient(id: string) {
		id = id.trim();
		if (!id) { status = { type: 'error', msg: 'Please enter a valid patient ID.' }; return; }
		patient = null; status = null; loading = true;
		try {
			patient = await fetchPatient(id);
		} catch (err) {
			try {
				patient = withMockFallback(err, getMockPatient(id));
				status = { type: 'warn', msg: 'Cannot reach server — showing demo record.' };
			} catch {
				status = { type: 'error', msg: err instanceof Error ? err.message : String(err) };
			}
		} finally { loading = false; }
	}

	async function handleEdit(dto: PatientUpdateDto) {
		if (!patient) return;
		modalLoading = true;
		try {
			patient = await updatePatient(patient.id, dto);
			addToast('success', 'Patient record updated.');
		} catch {
			patient = { ...patient!, ...dto, lastUpdated: new Date().toISOString() } as Patient;
			addToast('warn', 'Server unreachable — changes applied locally.');
		} finally { modalLoading = false; modalMode = null; }
	}

	async function handleDelete() {
		if (!patient) return;
		modalLoading = true;
		try { await deletePatient(patient.id); } catch { /* demo */ }
		finally {
			addToast('success', `Patient "${patient.name}" deleted.`);
			patient = null; status = null; manualId = '';
			modalLoading = false; modalMode = null;
		}
	}

	function startScan() { cameraActive = true; patient = null; status = null; }
	function stopScan()  { cameraActive = false; scanner?.stopCamera(); }
	function reset()     { patient = null; status = null; manualId = ''; cameraActive = false; }

	$effect(() => { if (cameraActive && scanner) scanner.startCamera(); });
</script>

<svelte:head><title>PatientScan — Scan &amp; Lookup</title></svelte:head>

<!-- Scanner card -->
<div class="border border-[var(--border)] bg-[var(--surface)] relative overflow-hidden">
	<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
	<div class="p-6">
		<p class="text-[10px] uppercase tracking-[4px] text-[var(--dim)] mb-4 flex items-center gap-3">
			QR Scanner <span class="flex-1 h-px bg-[var(--border)]"></span>
		</p>

		<div class:hidden={!cameraActive} class="mb-4">
			<QrScanner bind:this={scanner} onscan={handleScan} />
		</div>

		{#if status}
			<div class="mb-4 border-l-2 px-3 py-2 text-xs tracking-wide flex items-center gap-2
				{status.type === 'error' ? 'border-red-400 text-red-400 bg-red-400/5' : ''}
				{status.type === 'warn'  ? 'border-amber-400 text-amber-400 bg-amber-400/5' : ''}
				{status.type === 'info'  ? 'border-emerald-400 text-emerald-400 bg-emerald-400/5' : ''}">
				{#if status.type === 'error'}⚠{:else if status.type === 'warn'}◌{:else}●{/if}
				{status.msg}
			</div>
		{/if}

		<div class="flex flex-wrap gap-3">
			{#if !cameraActive}
				<button class="flex items-center gap-2 px-5 py-3 bg-emerald-400 text-black text-xs font-medium tracking-widest uppercase hover:bg-emerald-300 transition-colors font-mono"
					onclick={startScan}>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
					</svg>
					Scan QR Code
				</button>
			{:else}
				<button class="flex items-center gap-2 px-5 py-3 border border-red-400 text-red-400 text-xs tracking-widest uppercase hover:bg-red-400/10 transition-colors font-mono"
					onclick={stopScan}>
					<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="6" y="6" width="12" height="12"/>
					</svg>
					Stop Camera
				</button>
			{/if}
		</div>

		<div class="border-t border-[var(--border)] my-5"></div>

		<p class="text-[10px] uppercase tracking-[4px] text-[var(--dim)] mb-3 flex items-center gap-3">
			Manual ID Entry <span class="flex-1 h-px bg-[var(--border)]"></span>
		</p>
		<div class="flex gap-2">
			<input bind:value={manualId} type="text"
				placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
				class="flex-1 bg-[var(--bg)] border border-[var(--border)] text-white text-xs px-4 py-3 outline-none focus:border-emerald-400 transition-colors placeholder:text-[var(--dim)] font-mono"
				onkeydown={(e) => e.key === 'Enter' && lookupPatient(manualId)} />
			<button class="px-5 py-3 bg-emerald-400 text-black text-xs font-medium tracking-widest uppercase hover:bg-emerald-300 transition-colors font-mono shrink-0"
				onclick={() => lookupPatient(manualId)}>
				Lookup
			</button>
		</div>
	</div>
</div>

{#if loading}
	<div class="flex items-center gap-3">
		<div class="w-3.5 h-3.5 border-2 border-[var(--border)] border-t-emerald-400 rounded-full animate-spin"></div>
		<span class="text-xs text-emerald-400 tracking-[2px] uppercase">Retrieving patient record…</span>
	</div>
{/if}

{#if patient}
	<PatientCard {patient} onedit={() => modalMode = 'edit'} ondelete={() => modalMode = 'delete'} />
	<div>
		<button class="flex items-center gap-2 px-5 py-3 border border-[var(--border)] text-[var(--muted)] text-xs tracking-widest uppercase hover:border-emerald-400 hover:text-emerald-400 transition-colors font-mono"
			onclick={reset}>
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
			</svg>
			Scan Another Patient
		</button>
	</div>
{/if}

{#if modalMode === 'edit' && patient}
	<PatientModal mode="edit" {patient} loading={modalLoading}
		onconfirm={(dto) => handleEdit(dto as PatientUpdateDto)}
		oncancel={() => modalMode = null} />
{/if}

{#if modalMode === 'delete' && patient}
	<PatientModal mode="delete" {patient} loading={modalLoading}
		onconfirm={handleDelete}
		oncancel={() => modalMode = null} />
{/if}
