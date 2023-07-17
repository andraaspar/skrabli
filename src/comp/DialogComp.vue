<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{ isOpen: boolean }>()

const isOpen = computed(() => props.isOpen)
const dialogVnode = ref<HTMLDialogElement | null>(null)

watch([isOpen, dialogVnode], () => {
	if (dialogVnode.value) {
		const shouldBeOpen = props.isOpen
		if (dialogVnode.value.open !== shouldBeOpen) {
			if (shouldBeOpen) {
				dialogVnode.value.showModal()
			} /*  else {
				dialogVnode.value.close()
			} */
		}
	}
})
</script>

<template>
	<Transition appear>
		<dialog v-if="isOpen" ref="dialogVnode" @close.prevent>
			<slot></slot>
		</dialog>
	</Transition>
</template>

<style scoped></style>
