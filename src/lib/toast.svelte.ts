import type { Toast } from './types';

let toasts = $state<Toast[]>([]);
let _id = 0;

export function getToasts() { return toasts; }

export function addToast(type: Toast['type'], msg: string, ms = 3500) {
	const id = ++_id;
	toasts = [...toasts, { id, type, msg }];
	setTimeout(() => { toasts = toasts.filter(t => t.id !== id); }, ms);
}

export function removeToast(id: number) {
	toasts = toasts.filter(t => t.id !== id);
}
