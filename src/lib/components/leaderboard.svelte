<script lang="ts">
	import { page } from '$app/stores';
	import Card from './card.svelte';
</script>

<Card class="sm:px-8">
	<table class="w-full border-separate border-spacing-y-2">
		<colgroup>
			<col span="1" class="min-w-12" />
			<col span="1" class="w-full" />
			<col span="1" class="min-w-20" />
			<col span="1" class="min-w-20" />
		</colgroup>
		<thead>
			<tr>
				<th class="text-left pl-4">#</th>
				<th class="text-left">User</th>
				<th class="text-right">Streak</th>
				<th class="text-right pr-4">Score</th>
			</tr>
		</thead>
		<tbody>
			{#each $page.data.leaderboard as user, index}
				<tr
					class={`${$page.data.user.username == user.username ? 'font-bold bg-cyan-700/20 rounded-lg' : ''}`}
				>
					<td class="p-2 pl-4">{index + 1}</td>
					<td class="flex items-center p-2">
						<img src={user.avatarUrl} alt="User avatar" class="rounded-full size-6" />
						<span class="ml-2">{user.username}</span>
					</td>
					<td class="text-right p-2">
						{user.streak}
					</td>
					<td class="text-right p-2 pr-4">
						{user.score}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</Card>
