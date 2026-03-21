<script lang="ts">
	import type { Patient } from '$lib/types';
	import { calcAge, formatDate, formatDateTime } from '$lib/api';
	import QrDisplay from '$lib/QrDisplay.svelte';

	let { patient, onedit, ondelete, compact = false }:
		{ patient: Patient; onedit?: (p: Patient) => void; ondelete?: (p: Patient) => void; compact?: boolean } = $props();

	let dob     = $derived(formatDate(patient.dateOfBirth));
	let age     = $derived(calcAge(patient.dateOfBirth));
	let updated = $derived(formatDateTime(patient.lastUpdated));

	let showQr = $state(false);
</script>

<div class="slide-up border border-[var(--border)] bg-[var(--surface)] relative overflow-hidden group">
	<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>

	<!-- Header -->
	<div class="p-5 border-b border-[var(--border)] flex items-start justify-between gap-4">
		<div class="min-w-0">
			<h2 class="{compact ? 'text-xl' : 'text-2xl sm:text-3xl'} leading-tight tracking-tight text-white"
				style="font-family:'Instrument Serif',serif; font-style:italic;">
				{patient.name}
			</h2>
			<p class="text-[10px] text-[var(--dim)] mt-1 tracking-wider font-mono truncate">
				ID / {patient.id}
			</p>
		</div>
		<div class="flex items-center gap-2 shrink-0">
			<span class="border border-emerald-400 text-emerald-400 text-[9px] tracking-[3px] uppercase px-3 py-1.5">
				{patient.gender}
			</span>
			<div class="flex gap-1">
				<!-- QR button -->
				<button
					onclick={() => showQr = true}
					class="p-1.5 border border-[var(--border)] text-[var(--dim)] hover:border-emerald-400 hover:text-emerald-400 transition-colors"
					title="Generate QR code"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
						<rect x="3" y="14" width="7" height="7"/>
						<path d="M14 14h1v1h-1z M17 14h1v1h-1z M20 14h1v1h-1z M14 17h1v1h-1z M17 17h1v1h-1z M20 17h1v1h-1z M14 20h1v1h-1z M17 20h1v1h-1z M20 20h1v1h-1z"/>
					</svg>
				</button>
				{#if onedit}
					<button
						onclick={() => onedit?.(patient)}
						class="p-1.5 border border-[var(--border)] text-[var(--dim)] hover:border-emerald-400 hover:text-emerald-400 transition-colors"
						title="Edit patient"
					>
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
							<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
						</svg>
					</button>
				{/if}
				{#if ondelete}
					<button
						onclick={() => ondelete?.(patient)}
						class="p-1.5 border border-[var(--border)] text-[var(--dim)] hover:border-red-400 hover:text-red-400 transition-colors"
						title="Delete patient"
					>
						<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
							<path d="M10 11v6"/><path d="M14 11v6"/>
							<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
						</svg>
					</button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Fields -->
	<div class="grid grid-cols-2 gap-px bg-[var(--border)]">
		<div class="bg-[var(--surface)] p-4">
			<p class="text-[9px] uppercase tracking-[3px] text-[var(--dim)] mb-1.5">Date of Birth</p>
			<p class="text-sm text-white font-mono">{dob}</p>
		</div>
		<div class="bg-[var(--surface)] p-4">
			<p class="text-[9px] uppercase tracking-[3px] text-[var(--dim)] mb-1.5">Age</p>
			<p class="text-sm text-white font-mono">{age} years</p>
		</div>
		<div class="bg-[var(--surface)] p-4 col-span-2">
			<p class="text-[9px] uppercase tracking-[3px] text-[var(--dim)] mb-1.5">Diagnosis</p>
			<p class="{compact ? 'text-base' : 'text-xl'} leading-snug text-emerald-300"
				style="font-family:'Instrument Serif',serif; font-style:italic; font-weight:300;">
				{patient.diagnosis}
			</p>
		</div>
	</div>

	<!-- Footer -->
	<div class="px-5 py-2.5 border-t border-[var(--border)] flex items-center justify-between">
		<span class="flex items-center gap-2 text-[10px] text-[var(--dim)] tracking-wider">
			<span class="pulse-dot w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
			Record active
		</span>
		<span class="text-[10px] text-[var(--dim)] tracking-wider">Updated {updated}</span>
	</div>
</div>

{#if showQr}
	<QrDisplay {patient} onclose={() => showQr = false} />
{/if}
