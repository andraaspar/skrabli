<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'

const queryClient = useQueryClient()
queryClient.setQueryDefaults([], {
	staleTime: Infinity,
	refetchOnMount: false,
	refetchOnWindowFocus: false,
	refetchOnReconnect: false,
	cacheTime: Infinity,
})
</script>

<template>
	<router-view v-slot="{ Component }">
		<transition appear>
			<component :is="Component" />
		</transition>
	</router-view>
</template>
