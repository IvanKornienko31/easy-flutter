<script lang="ts">
	import IconSchool from '~icons/mdi/school-outline'; // Иконка "Начать освоение"
	import IconTune from '~icons/mdi/tune'; // Иконка "Поменять тему"
	import FlutterLogo from '$lib/assets/flutter.svg';
	import DartLogo from '$lib/assets/dart.svg';
	import { uiState } from '$lib/state/ui.svelte.js';
	import { resolve } from '$app/paths';

	let { data } = $props();
</script>

<svelte:head>
	<title>EasyFlutter — Всё о Dart и Flutter</title>
</svelte:head>

<!-- 1. HERO SECTION (Приветственная карточка) -->
<section class="hero-card">
	<div class="hero-content">
		<div class="hero-titles">
			<h1 class="hero-title">Всё о Dart и Flutter — в одном месте!</h1>
			<p class="hero-subtitle">
				Здесь вы найдете уроки на любой вкус: от основ и первых виджетов до работы с нативными
				компонентами
			</p>
		</div>

		<a href={resolve('/lessons/what-is-flutter')} class="btn btn-primary">
			<IconSchool style="font-size: 1.5rem;" />
			<span>Начать освоение!</span>
		</a>
	</div>

	<div class="hero-images">
		<img src={FlutterLogo} alt="Flutter Logo" class="logo-flutter" />
		<img src={DartLogo} alt="Dart Logo" class="logo-dart" />
	</div>
</section>

<div class="page-wrapper">
	<!-- 2. POPULAR LESSONS (Популярные уроки) -->
	<section class="popular-section">
		<h2 class="section-title">Популярные уроки</h2>

		<div class="cards-grid">
			{#each data.popularLessons as lesson (lesson.slug)}
				<article class="lesson-card">
					<h3 class="card-title">{lesson.title}</h3>
					<p class="card-text">
						{lesson.description.length > 100
							? lesson.description.substring(0, 100) + '...'
							: lesson.description}
					</p>

					<a
						href={resolve('/lessons/[slug]', {
							slug: lesson.slug
						})}
						class="btn btn-secondary"
					>
						<IconSchool style="font-size: 1.25rem;" />
						<span>Читать</span>
					</a>
				</article>
			{/each}
		</div>
	</section>

	<!-- 3. FOOTER CTA (Настройки) -->
	<section class="settings-cta">
		<h2 class="cta-title">Настраивайте сайт так, как вам по душе</h2>

		<button class="btn btn-primary" onclick={() => uiState.openSettings()}>
			<IconTune style="font-size: 1.5rem;" />
			<span>Поменять тему</span>
		</button>
	</section>
</div>

<style>
	.page-wrapper {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		margin-top: 24px;
		padding-inline: 2rem;
		display: flex;
		flex-direction: column;
		gap: 60px;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		border: none;
		border-radius: 24px;
		cursor: pointer;
		font-family: 'Roboto', sans-serif;
		font-weight: 500;
		transition: opacity 0.2s;
		color: var(--color-text);
	}

	a.btn {
		text-decoration: none;
	}

	.btn:hover {
		opacity: 0.9;
	}

	.btn-primary {
		background-color: var(--color-accent);
		padding: 6px 24px;
		font-size: 1.125rem;
	}

	.btn-secondary {
		background-color: var(--color-accent);
		padding: 10px 20px;
		font-size: 1rem;
		width: 100%;
	}

	.hero-card {
		background-color: var(--color-surface);
		border-radius: 0 0 48px 48px;
		padding: 100px 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		position: relative;
		overflow: hidden;

		/* Тень по ТЗ: x: -8, y: 6, blur: 24 */
		box-shadow: -8px 6px 24px rgba(0, 0, 0, 0.25);
	}

	.hero-content {
		max-width: 500px;
		z-index: 2;
	}

	.hero-title {
		font-size: 2.625rem;
		line-height: 1.2;
		font-weight: 700;
		color: var(--color-primary);
		margin: 0 0 24px 0;
	}

	.hero-subtitle {
		max-width: 340px;
		font-size: 1.125rem;
		line-height: 1.5;
		color: var(--color-text);
		margin: 0 0 32px 0;
	}

	.hero-images {
		position: relative;
		width: 50%;
		height: 300px;
		display: flex;
		align-items: center;
		justify-content: space-evenly;
	}

	.logo-flutter {
		width: 120px;
		align-self: flex-start;
		height: auto;
	}

	.logo-dart {
		width: 140px;
		align-self: flex-end;
		height: auto;
	}

	.popular-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 40px;
	}

	.section-title {
		font-size: 2.25rem;
		font-weight: 700;
		color: var(--color-primary);
		text-align: center;
		margin: 0;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 30px;
		width: 100%;
	}

	.lesson-card {
		background-color: var(--color-surface);
		border-radius: 32px;
		padding: 32px;
		display: flex;
		flex-direction: column;
		gap: 20px;

		box-shadow: -4px 6px 24px rgba(0, 0, 0, 0.25);
	}

	.card-title {
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-primary);
		margin: 0;
	}

	.card-text {
		font-size: 1rem;
		line-height: 1.5;
		color: var(--color-text);
		margin: 0;
		flex-grow: 1;
	}

	.settings-cta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40px 60px;
	}

	.cta-title {
		font-size: 2.25rem;
		font-weight: 700;
		color: var(--color-primary);
		line-height: 1.2;
		margin: 0;
	}

	/* Tablet (меньше 1240px) */
	@media (width < 1240px) {
		.cards-grid {
			grid-template-columns: repeat(2, 1fr); /* 2 колонки */
		}

		.hero-card {
			flex-direction: column-reverse; /* Меняем порядок: картинки (2) станут сверху, текст (1) снизу */
			padding: 30px 24px;
			.btn-primary {
				min-width: 230px;
			}
		}

		.hero-content {
			display: flex;
			width: 100%;
			max-width: 750px;
			align-items: center;
			justify-content: space-between;
		}

		.hero-title {
			font-size: 1.75rem;
			max-width: 280px;
		}

		.hero-subtitle {
			max-width: 320px;
		}

		.hero-images {
			width: 100%;
			max-width: 500px;
			height: 200px;
			margin-bottom: 20px;
			justify-content: space-around;
		}
	}

	/* Mobile (меньше 600px) */
	@media (width < 600px) {
		.page-wrapper {
			padding: 20px 2rem;
			gap: 40px;
		}

		.btn-primary {
			width: 100%;
		}

		.hero-card {
			padding-top: 96px;
			text-align: center;
		}

		.hero-content,
		.hero-titles {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		.hero-images {
			height: 200px;
			margin-bottom: 20px;
			justify-content: space-evenly;
		}

		.logo-flutter {
			width: 80px;
		}

		.logo-dart {
			width: 80px;
		}

		.cards-grid {
			grid-template-columns: 1fr;
		}

		.lesson-card {
			align-items: center;
			text-align: center;
		}

		.settings-cta {
			flex-direction: column;
			align-items: center;
			text-align: center;
			gap: 20px;
			padding: 20px 0;
		}

		.cta-title {
			font-size: 1.5rem;
		}
	}
</style>
