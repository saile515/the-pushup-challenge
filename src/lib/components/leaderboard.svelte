<script lang="ts">
	import { page } from '$app/stores';
	import Card from './card.svelte';
</script>

<Card>
	<div class="font-bold m-2">
		<span class="ml-12">User</span>
		<span class="float-right mr-8">Score</span>
	</div>
	<ol class="overflow-auto h-full">
		{#each $page.data.leaderboard as user}
			<li class="flex items-center gap-4 border-b border-zinc-900/20 p-2">
				<img src={user.avatarUrl} alt="User avatar" class="rounded-full size-8" /><span
					>{user.username}</span
				>
				<span class="ml-auto mr-8">{user.score}</span>
			</li>
		{/each}
	</ol>
</Card>
