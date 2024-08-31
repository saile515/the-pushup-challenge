<script lang="ts">
	import { page } from '$app/stores';
	import Card from './card.svelte';
</script>

<Card>
	<div class="font-bold m-2">
		<span>Date</span>
		<span class="float-right mr-8">Target Score</span>
		<span class="float-right mr-12">Score</span>
	</div>
	<ol class="overflow-auto h-full">
		{#each $page.data.previousDays as day}
			<li class="flex gap-4 border-b border-zinc-900/20 p-2">
				<span>{day.date}</span>
				<span
					class={`ml-auto mr-28 ${day.score == day.targetScore ? 'bg-emerald-600 px-2 rounded-full' : ''}`}
					>{day.score}</span
				>
				<span class="mr-8">{day.targetScore}</span>
			</li>
		{/each}
	</ol>
</Card>
