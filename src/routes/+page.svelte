<svelte:head><title>PatientScan — Patient Identification System</title></svelte:head>

<div class="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">

	<!-- Logo -->
	<div class="flex items-center gap-3 mb-2">
		<div class="w-10 h-10 border-2 border-emerald-400 p-1.5 grid grid-cols-2 grid-rows-2 gap-0.5">
			<span class="bg-emerald-400 block"></span>
			<span class="bg-emerald-400 block"></span>
			<span class="bg-emerald-400 block"></span>
			<span class="border border-emerald-400 block"></span>
		</div>
		<h1 class="text-4xl font-bold tracking-tight text-white" style="font-family:'Syne',sans-serif;">
			Patient<em class="text-emerald-400 font-light not-italic" style="font-family:'Instrument Serif',serif;">Scan</em>
		</h1>
	</div>

	<p class="text-[10px] text-[var(--dim)] tracking-[4px] uppercase mb-16">
		Patient Identification System
	</p>

	<!-- Headline -->
	<h2 class="text-3xl sm:text-4xl font-bold text-center text-white max-w-xl mb-5 leading-tight" style="font-family:'Syne',sans-serif;">
		Instant patient identification,<br>
		<em class="text-emerald-400 font-light" style="font-family:'Instrument Serif',serif;">at a glance</em>
	</h2>

	<p class="text-sm text-center text-[var(--dim)] max-w-md mb-12 leading-relaxed font-mono">
		Scan a patient's QR code or enter their ID to instantly retrieve their record.
		Manage your full patient database in one place.
	</p>

	<!-- CTA buttons -->
	<div class="flex flex-wrap gap-4 justify-center mb-20">
		<a href="/scan"
			class="flex items-center gap-2 px-8 py-4 bg-emerald-400 text-black text-xs font-medium tracking-widest uppercase hover:bg-emerald-300 transition-colors font-mono">
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
			</svg>
			Scan / Lookup
		</a>
		<a href="/patients"
			class="flex items-center gap-2 px-8 py-4 border border-[var(--border)] text-white text-xs tracking-widest uppercase hover:border-emerald-400 hover:text-emerald-400 transition-colors font-mono">
			<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
				<path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
			</svg>
			All Patients
		</a>
	</div>

	<!-- Feature grid -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">

		<div class="border border-[var(--border)] bg-[var(--surface)] p-6 relative overflow-hidden">
			<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"></div>
			<div class="w-8 h-8 border border-emerald-400/30 flex items-center justify-center mb-4">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2">
					<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
					<rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/>
					<path d="M17 14h4"/><path d="M17 17v4"/>
				</svg>
			</div>
			<p class="text-[10px] uppercase tracking-[3px] text-emerald-400 mb-2 font-mono">QR Scanning</p>
			<p class="text-xs text-[var(--dim)] leading-relaxed font-mono">
				Point your camera at any patient QR code for instant, hands-free identification.
			</p>
		</div>

		<div class="border border-[var(--border)] bg-[var(--surface)] p-6 relative overflow-hidden">
			<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>
			<div class="w-8 h-8 border border-emerald-400/30 flex items-center justify-center mb-4">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2">
					<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
				</svg>
			</div>
			<p class="text-[10px] uppercase tracking-[3px] text-emerald-400 mb-2 font-mono">Manual Lookup</p>
			<p class="text-xs text-[var(--dim)] leading-relaxed font-mono">
				Enter a patient ID directly to retrieve their record from anywhere on the ward.
			</p>
		</div>

		<div class="border border-[var(--border)] bg-[var(--surface)] p-6 relative overflow-hidden">
			<div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>
			<div class="w-8 h-8 border border-emerald-400/30 flex items-center justify-center mb-4">
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="2">
					<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
					<path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
				</svg>
			</div>
			<p class="text-[10px] uppercase tracking-[3px] text-emerald-400 mb-2 font-mono">Patient Database</p>
			<p class="text-xs text-[var(--dim)] leading-relaxed font-mono">
				Browse, search, create, edit and delete patient records with a full audit trail.
			</p>
		</div>

	</div>

</div>
