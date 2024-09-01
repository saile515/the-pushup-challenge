<script lang="ts">
	import { enhance } from '$app/forms';

	export let delta: number;
	export let label: string | null = null;
</script>

<form method="POST" action="?/updateScore" use:enhance>
	<input type="hidden" name="delta" value={delta} />
	<button type="submit" class="bg-zinc-900/30 backdrop-blur-sm rounded w-12 mx-2 my-1">
		{#if label}
			{label}
		{:else}
			{delta > 0 ? '+' : ''}{delta}
		{/if}
	</button>
</form>
