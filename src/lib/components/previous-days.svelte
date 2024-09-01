<script lang="ts">
	import { page } from '$app/stores';
	import Card from './card.svelte';
</script>

<Card class="sm:px-8">
	<table class="w-full border-spacing-y-3 border-separate">
		<colgroup>
			<col span="1" class="w-24" />
			<col span="1" class="w-full" />
			<col span="1" class="min-w-20" />
		</colgroup>
		<thead class="text-right">
			<tr>
				<th class="text-left">Date</th>
				<th>Score</th>
				<th>Target</th>
			</tr>
		</thead>
		<tbody class="text-right">
			{#each $page.data.previousDays as day}
				<tr>
					<td>{day.date}</td>
					<td>
						<span class={`${day.score == day.targetScore ? 'bg-cyan-700 rounded-full px-2' : ''}`}
							>{day.score}</span
						>
					</td>
					<td>{day.targetScore}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</Card>
