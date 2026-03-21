<script lang="ts">
	import { getToasts, removeToast } from '$lib/toast.svelte';

	let toasts = $derived(getToasts());
</script>

<div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
	{#each toasts as t (t.id)}
		<div
			class="slide-up pointer-events-auto flex items-center gap-3 px-4 py-3 text-xs font-mono tracking-wide border max-w-xs
				{t.type === 'success' ? 'bg-[var(--surface)] border-emerald-400 text-emerald-300' : ''}
				{t.type === 'error'   ? 'bg-[var(--surface)] border-red-400 text-red-300' : ''}
				{t.type === 'warn'    ? 'bg-[var(--surface)] border-amber-400 text-amber-300' : ''}
			"
		>
			<span>
				{#if t.type === 'success'}✓{:else if t.type === 'error'}✕{:else}◌{/if}
			</span>
			<span class="flex-1">{t.msg}</span>
			<button onclick={() => removeToast(t.id)} class="opacity-50 hover:opacity-100 transition-opacity ml-1">✕</button>
		</div>
	{/each}
</div>
