<script lang="ts">
	import { onMount } from 'svelte';
	import QRCode from 'qrcode';
	import type { Patient } from '$lib/types';

	let { patient, onclose }: { patient: Patient; onclose: () => void } = $props();

	let canvasEl: HTMLCanvasElement;
	let dataUrl = $state('');
	let copied  = $state(false);

	onMount(async () => {
		dataUrl = await QRCode.toDataURL(patient.id, {
			width: 320,
			margin: 2,
			color: { dark: '#0a1612', light: '#ecfdf5' },
			errorCorrectionLevel: 'H'
		});
		// Also draw onto canvas for display
		await QRCode.toCanvas(canvasEl, patient.id, {
			width: 280,
			margin: 2,
			color: { dark: '#0a1612', light: '#ecfdf5' },
			errorCorrectionLevel: 'H'
		});
	});

	function download() {
		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = `patient-${patient.id}.png`;
		a.click();
	}

	async function copyId() {
		await navigator.clipboard.writeText(patient.id);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}
</script>

<!-- Backdrop -->
<div
	class="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
	role="presentation"
	onclick={(e) => e.target === e.currentTarget && onclose()}
	onkeydown={(e) => e.key === 'Escape' && onclose()}
>
	<div class="slide-up w-full max-w-sm bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden">
		<!-- Top accent -->
		<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>

		<!-- Header -->
		<div class="px-6 py-4 border-b border-[var(--border)] flex items-center justify-between">
			<p class="text-[10px] uppercase tracking-[4px] text-[var(--dim)]">Patient QR Code</p>
			<button onclick={onclose} class="text-[var(--dim)] hover:text-white transition-colors text-lg leading-none">✕</button>
		</div>

		<!-- QR Canvas -->
		<div class="p-6 flex flex-col items-center gap-5">

			<!-- Name + gender pill -->
			<div class="text-center">
				<p class="text-lg text-white leading-tight"
					style="font-family:'Instrument Serif',serif; font-style:italic;">
					{patient.name}
				</p>
				<span class="inline-block mt-1.5 border border-emerald-400 text-emerald-400 text-[9px] tracking-[3px] uppercase px-3 py-1">
					{patient.gender}
				</span>
			</div>

			<!-- QR code -->
			<div class="relative border border-[var(--border)] p-3 bg-[var(--bg)]">
				<canvas bind:this={canvasEl}></canvas>
				<!-- Corner decorations -->
				<span class="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400 -translate-x-px -translate-y-px"></span>
				<span class="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400 translate-x-px -translate-y-px"></span>
				<span class="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400 -translate-x-px translate-y-px"></span>
				<span class="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400 translate-x-px translate-y-px"></span>
			</div>

			<!-- Patient ID with copy -->
			<button
				onclick={copyId}
				class="group w-full flex items-center justify-between gap-2 bg-[var(--bg)] border border-[var(--border)] hover:border-emerald-400 transition-colors px-3 py-2.5"
				title="Click to copy ID"
			>
				<span class="text-[10px] font-mono text-[var(--dim)] truncate">{patient.id}</span>
				<span class="shrink-0 text-[10px] font-mono tracking-wider
					{copied ? 'text-emerald-400' : 'text-[var(--dim)] group-hover:text-emerald-400'} transition-colors">
					{copied ? '✓ Copied' : 'Copy'}
				</span>
			</button>
		</div>

		<!-- Footer actions -->
		<div class="px-6 pb-6 flex gap-3">
			<button
				onclick={onclose}
				class="flex-1 px-4 py-2.5 border border-[var(--border)] text-[var(--dim)] text-xs tracking-widest uppercase hover:text-white hover:border-white/30 transition-colors font-mono"
			>
				Close
			</button>
			<button
				onclick={download}
				disabled={!dataUrl}
				class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-400 text-black text-xs font-medium tracking-widest uppercase hover:bg-emerald-300 transition-colors font-mono disabled:opacity-40"
			>
				<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
					<polyline points="7 10 12 15 17 10"/>
					<line x1="12" y1="15" x2="12" y2="3"/>
				</svg>
				Download PNG
			</button>
		</div>
	</div>
</div>
