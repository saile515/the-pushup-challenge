const methods = new Map<string, { method: Function; expires: Date; value: any }>();

export function cache<T>(key: string, method: (...args: any[]) => T, time: number) {
	methods.set(key, { method, expires: new Date(Date.now() + time), value: method() });

	return async () => {
		const entry = methods.get(key);

		if (!entry) {
			return method();
		}

		if (entry.expires > new Date()) {
			return entry.value as T;
		}

		return entry.method();
	};
}
