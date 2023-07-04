<script setup lang="ts">
import { ref, watch, computed, onUpdated } from 'vue'

const props = defineProps<{ isOpen: boolean }>()

const isOpen = computed(() => props.isOpen)
const dialogVnode = ref<HTMLDialogElement | null>(null)

watch([isOpen, dialogVnode], () => {
	if (dialogVnode.value) {
		const shouldBeOpen = props.isOpen
		if (dialogVnode.value.open !== shouldBeOpen) {
			if (shouldBeOpen) {
				dialogVnode.value.showModal()
			} else {
				dialogVnode.value.close()
			}
		}
	}
})
</script>

<template>
	<dialog ref="dialogVnode" @close.prevent>
		<slot></slot>
	</dialog>
</template>

<style scoped></style>
