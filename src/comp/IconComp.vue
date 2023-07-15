<script setup lang="ts">
const props = defineProps<{
	icon: string
	color?: string
	rotate90AndFlip?: boolean
}>()
</script>

<template>
	<span
		:class="['icon', { 'rotate-90-and-flip': props.rotate90AndFlip }]"
		:style="{ color: props.color }"
		v-html="
			props.icon
				.replace(` width=&quot;16&quot;`, '')
				.replace(` height=&quot;16&quot;`, '')
		"
	></span>
</template>

<style scoped>
.icon {
	display: inline-block;
	vertical-align: -0.23em;
	width: 1.15em;
	height: 1.15em;
	filter: drop-shadow(-0.1px -0.1px 0 #333);
}

.rotate-90-and-flip {
	transform: rotateZ(90deg) scaleY(-1);
}

.icon > svg {
	width: 1.15em;
	height: 1.15em;
}
</style>
