<script>
	import Card from '$lib/components/card.svelte';
</script>

<div class="w-full h-screen flex justify-center items-center bg-[url('/mountains.jpg')] bg-cover">
	<Card>
		<div class="p-4">
			<h1 class="text-xl mb-4">Login</h1>
			<form method="POST">
				<button type="submit" class="bg-[#5865F2] p-2 rounded-lg flex items-center gap-2"
					><i class="bg-[url('/discord.svg')] size-6 inline-block bg-contain bg-no-repeat bg-center"
					></i>Log in with Discord</button
				>
			</form>
		</div>
	</Card>
</div>
