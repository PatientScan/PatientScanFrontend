<script lang="ts">
	import { onDestroy } from 'svelte';
	import jsQR from 'jsqr';

	let { onscan }: { onscan: (id: string) => void } = $props();

	let videoEl: HTMLVideoElement;
	let canvasEl: HTMLCanvasElement;
	let stream: MediaStream | null = null;
	let scanning = false;
	let frameId: ReturnType<typeof setInterval> | null = null;
	let lastScanned: string | null = null;
	let flashing = $state(false);
	let error = $state('');

	export async function startCamera() {
		error = '';
		lastScanned = null;
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: 'environment', width: { ideal: 720 }, height: { ideal: 1280 } }
			});
			videoEl.srcObject = stream;
			await videoEl.play();
			scanning = true;
			frameId = setInterval(scanFrame, 180);
		} catch {
			error = 'Camera access denied or unavailable.';
		}
	}

	export function stopCamera() {
		scanning = false;
		if (frameId) { clearInterval(frameId); frameId = null; }
		if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
	}

	function scanFrame() {
		if (!scanning || !videoEl || videoEl.readyState < 2) return;
		canvasEl.width  = videoEl.videoWidth;
		canvasEl.height = videoEl.videoHeight;
		const ctx = canvasEl.getContext('2d')!;
		ctx.drawImage(videoEl, 0, 0);
		const img = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
		const code = jsQR(img.data, img.width, img.height, { inversionAttempts: 'dontInvert' });
		if (code?.data && code.data !== lastScanned) {
			lastScanned = code.data;
			flashing = true;
			setTimeout(() => { flashing = false; }, 300);
			stopCamera();
			onscan(code.data.trim());
		}
	}

	onDestroy(stopCamera);
</script>

<div class="relative overflow-hidden bg-black" style="aspect-ratio:4/3;">
	<video bind:this={videoEl} class="w-full h-full object-cover" playsinline muted autoplay></video>
	<canvas bind:this={canvasEl} class="hidden"></canvas>

	{#if flashing}
		<div class="absolute inset-0 bg-emerald-400 flash-anim pointer-events-none"></div>
	{/if}

	<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
		<div class="relative w-48 h-48">
			<span class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-emerald-400"></span>
			<span class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-emerald-400"></span>
			<span class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-emerald-400"></span>
			<span class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-emerald-400"></span>
			<div
				class="scan-line absolute left-1 right-1 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
				style="box-shadow: 0 0 10px rgba(52,211,153,0.6);"
			></div>
		</div>
		<div class="absolute bottom-3 w-full text-center">
			<span class="text-emerald-400 text-[10px] tracking-[3px] uppercase">Scanning…</span>
		</div>
	</div>

	{#if error}
		<div class="absolute inset-0 flex items-center justify-center bg-black/80">
			<p class="text-red-400 text-xs text-center px-6">{error}</p>
		</div>
	{/if}
</div>
