<script lang="ts">
	import Toaster from '$lib/Toaster.svelte';
	import { page } from '$app/stores';

	let { children } = $props();

	const tabs = [
		{ href: '/scan',     label: 'Scan / Lookup',
			icon: `<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>` },
		{ href: '/patients', label: 'All Patients',
			icon: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>` },
	];

	let currentPath = $derived($page.url.pathname);
</script>

<div class="relative z-10 flex flex-col items-center min-h-screen">

	<!-- Header -->
	<header class="w-full max-w-3xl px-6 pt-10 pb-0">
		<a href="/" class="flex items-center gap-3 mb-1 w-fit">
			<div class="w-7 h-7 border-2 border-emerald-400 p-1 grid grid-cols-2 grid-rows-2 gap-0.5">
				<span class="bg-emerald-400 block"></span>
				<span class="bg-emerald-400 block"></span>
				<span class="bg-emerald-400 block"></span>
				<span class="border border-emerald-400 block"></span>
			</div>
			<h1 class="text-xl font-bold tracking-tight text-white" style="font-family:'Syne',sans-serif;">
				Health<em class="text-emerald-400 font-light not-italic" style="font-family:'Instrument Serif',serif;">Flow</em>
			</h1>
		</a>
		<p class="text-[10px] text-[var(--dim)] tracking-[4px] uppercase pl-10 mb-6">
			Patient Identification System
		</p>

		<!-- Tab bar -->
		<div class="flex border-b border-[var(--border)]">
			{#each tabs as tab}
				<a
					href={tab.href}
					class="flex items-center gap-2 px-5 py-3 text-[10px] uppercase tracking-[3px] font-mono border-b-2 transition-colors -mb-px
						{currentPath === tab.href
							? 'border-emerald-400 text-emerald-400'
							: 'border-transparent text-[var(--dim)] hover:text-white'}"
				>
					<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
						{@html tab.icon}
					</svg>
					{tab.label}
				</a>
			{/each}
		</div>
	</header>

	<main class="w-full max-w-3xl px-6 py-8 flex flex-col gap-5">
		{@render children()}
	</main>
</div>

<Toaster />
