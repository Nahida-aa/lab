<script setup lang="ts">
const name = 'anan'
const count = ref(0)
const toast = useToast()
const addCount = () => {
  count.value++
  toast.add({
    title: 'add',
    description: `count is ${count.value}`,
  })
}
</script>
<template>
  <main>
    my name is {{name}}
    <div class="flex items-center gap-2">
      <p>count is {{count}}</p>
      <UButton @click="addCount">add</UButton>
    </div>
  </main>
</template>