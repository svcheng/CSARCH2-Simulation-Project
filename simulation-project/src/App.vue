<script setup>
  import { ref } from 'vue'
  const tab = ref('base-2')
</script>

<template>
    <div class="text-h3 ma-3 text-white mt-4">
      Binary-64 Floating Point Simulator
    </div>
    
    <v-card
    title=""
    class="w-75 h-50 ma-4 pl-4 pr-4 pb-4"
    variant="elevated"
    color="var(--vt-c-white)"
    >
      <v-tabs
        v-model="tab"
        direction="horizontal"  
        >

          <v-tab value="base-2">
            Binary/Base-2 
          </v-tab>

          <v-tab value="base-10">
            Decimal/Base-10
          </v-tab>

      </v-tabs>

      <v-window 
        v-model="tab" 
        class="h-100">
        <v-window-item value="base-2">
          <v-card 
            class="h-100 w-auto mt-4 pa-4"
            variant="outlined">
            BASE 2
          </v-card>
        </v-window-item>

        <v-window-item value="base-10">
          <v-card 
            class="h-100 w-auto mt-4 pa-4"
            variant="outlined">
            BASE 10
          </v-card>
        </v-window-item>
        
      </v-window>

    </v-card>

    <v-card
      class="w-75 h-50 ma-4 pa-4"
      variant="elevated"
      color="var(--vt-c-white)"
      >

      <div class="text-h4 mt-3 text-white">
        Result
      </div>
    </v-card>

  
</template>

<style>
.text-white{
  color: var(vt-c-white)
}
</style>