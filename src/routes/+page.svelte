<script lang="ts">
	export const spaces = [
		{ id: 'space1', name: 'work', displayName: 'Work' },
		{ id: 'space2', name: 'relationships', displayName: 'Relationships' },
		{ id: 'space3', name: 'health', displayName: 'Health' }
	];
</script>

<svelte:head>
	<link
		href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400..700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<main class="main">
	<div class="card card--menu">
		<h1>Words of Affirmation</h1>
	</div>

	<div class="card card--menu">
		<p>What do you want to talk about?</p>

		<form action="" class="form form--select">
			{#each spaces as space}
				<input type="checkbox" id={space.id} class="form" />
				<label for={space.id}>{space.displayName}</label>
			{/each}

			<button type="button" class="button button--expandform">[more]</button>
			<button type="submit">Done</button>
		</form>
	</div>
</main>

<style>
	main.main {
		display: grid;
		width: 100vw;
		height: 100vh;
		align-content: center;
		place-items: center;
		font-family: 'Pixelify Sans', serif;
		background-color: #111;
		color: #fff;
		font-optical-sizing: auto;
		font-size: 2rem;
		font-weight: 700;
		font-style: normal;
	}

	h1 {
		font-weight: 700;
	}

	p {
		font-weight: 400;
	}

	.card {
		display: grid;
		align-content: center;
		place-items: center;
		background-color: #333;
		margin: 1rem;
		padding: 1rem;
		border-radius: 1rem;
	}
</style>
