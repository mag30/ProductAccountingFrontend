<template>
  <div class="flex align-items-stretch flex-wrap justify-content-center">
    <div class="align-self-center surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <div class="text-center mb-5">
        <div class="text-900 text-3xl font-medium mb-3">Добро пожаловать</div>
      </div>
      <Message v-if="idMessage !== 0" severity="error" :key="idMessage">Пользователь не найден</Message>
      <div>
        <label for="email1" class="block text-900 font-medium mb-2">Почта</label>
        <InputText v-model="email" id="email1" type="text" class="w-full mb-3" />

        <label for="password1" class="block text-900 font-medium mb-2">Пароль</label>
        <InputText v-model="password" id="password1" type="password" class="w-full mb-3" />

        <Button label="Войти" icon="pi pi-user" class="w-full" @click="onLogin"/>
      </div>
    </div>
  </div>
</template>

<script setup>
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import Message from 'primevue/message';

  import {ref} from "vue";
  import {useStore} from "vuex";
  import API from "@/utils/api"
  import router from "@/router";
  const {API_URL} = useStore().state

  const email = ref("")
  const password = ref("")
  let idMessage = ref(0);
  const onLogin = () =>{
    API.post(API_URL + "/user/login",{
      "email":email.value,
      "password":password.value
    }).then(response=>{
        localStorage.access_token = response.data["JWT"]
        router.push("/")
    }).catch(()=>{
      idMessage.value +=1
    })
  }

</script>

<style scoped>

</style>