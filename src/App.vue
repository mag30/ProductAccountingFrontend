<script setup>
import {onMounted} from "vue";
import {useStore} from "vuex";
import API from "@/utils/api"
const {API_URL} = useStore().state

import Menubar from 'primevue/menubar';
import Button from 'primevue/button';

onMounted(()=>{
  API.post(API_URL + "/user/test")
})

</script>

<template>
  <header >
    <Menubar class="flex align-content-center flex-wrap shadow-3">
      <template #start class="flex align-items-center justify-content-center">
        <img alt="logo" src="@/resurses/logo.png" height="100" class="mr-2" />
      </template>
      <template #end class="flex align-items-center justify-content-center">
        <div class="grid">
          <div class="col">
            <Button label="КОМПОНЕНТЫ" />
          </div>
          <div class="col mr-3">
            <Button label="ПРОДУКТЫ" />
          </div>
        </div>
      </template>
    </Menubar>
  </header>

  <main class="mt-3">
    <div>
      <router-view />
    </div>
  </main>
</template>

<style scoped>

</style>
