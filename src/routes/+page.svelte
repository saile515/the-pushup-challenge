<script lang="ts">
	import ChangeScore from '$lib/components/change-score.svelte';
	import Leaderboard from '$lib/components/leaderboard.svelte';
	import PreviousDays from '$lib/components/previous-days.svelte';
	import { page } from '$app/stores';
</script>

<div class="bg-[url('/mountains.jpg')] bg-cover min-h-screen flex flex-col">
	<nav class="p-2 flex">
		<span class="text-xl m-2">The Push-up Challenge</span>
		<img
			src={$page.data.user.avatarUrl}
			alt="User avatar"
			class="size-10 rounded-full shadow-lg ml-auto"
		/>
	</nav>
	<div class="flex items-center mt-24 font-bold flex-col">
		<p class="text-7xl sm:text-8xl">{$page.data.today.score}/{$page.data.today.targetScore}</p>
		<div class="flex flex-wrap justify-center m-8">
			<div class="flex">
				<ChangeScore delta={-100000} label="Min" />
				{#if $page.data.today.targetScore >= 100}
					<ChangeScore delta={-100} />
				{/if}
				{#if $page.data.today.targetScore >= 20}
					<ChangeScore delta={-20} />
				{/if}
				<ChangeScore delta={-5} />
				<ChangeScore delta={-1} />
			</div>
			<div class="flex">
				<ChangeScore delta={1} />
				<ChangeScore delta={5} />
				{#if $page.data.today.targetScore >= 20}
					<ChangeScore delta={20} />
				{/if}
				{#if $page.data.today.targetScore >= 100}
					<ChangeScore delta={100} />
				{/if}
				<ChangeScore delta={100000} label="Max" />
			</div>
		</div>
	</div>
	<div class="!mt-auto m-4 sm:m-8 min-h-80 grid grid-cols-1 sm:grid-cols-2 gap-8">
		<Leaderboard />
		<PreviousDays />
	</div>
</div>
