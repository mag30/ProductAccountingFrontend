<template>
  <div class="flex justify-content-center flex-wrap grid">
    <div class="align-self-start flex align-items-center justify-content-center pb-2">
      <div class="flex flex-column">
        <div class="flex align-items-center justify-content-center mb-2">
          <Button v-if="chapters.length !== 0" icon="pi pi-wrench" severity="secondary" class="w-full shadow-3" @click="resetStructChapterSetting(); visibleChapterSetting = true;"/>
          <Button v-else icon="pi pi-wrench" severity="secondary" class="w-5rem shadow-3" @click="resetStructChapterSetting(); visibleChapterSetting = true;"/>
        </div>
        <div v-if="chapters.length !==0" class="flex align-items-center justify-content-center border-500 p-2 border-round-md shadow-3" style="background-color: #f8f9fa">
          <div v-if="!loader1"  >
            <PanelMenu v-model:expandedKeys="expandedKeys" :model="chapters" :key="keyMainChapter"/>
          </div>
          <div v-else>
            <ProgressSpinner strokeWidth="8" fill="var(--surface-ground)"
                             animationDuration=".5s" aria-label="Custom ProgressSpinner" />
          </div>
        </div>
      </div>
    </div>
        <template>
          <div class="card flex justify-content-center">
            <Dialog v-model:visible="visibleChapterSetting" modal header="Настройка разделов" :style="{ width: '50vw' }">
              <Toast />
              <div v-if="!loader2">
                <PanelMenu v-model:expandedKeys="expandedKeys2" :model="settingChapters" :key="keySettingChapter"/>
              </div>
              <div v-else class="flex align-items-center justify-content-center">
                <ProgressSpinner strokeWidth="8" fill="var(--surface-ground)"
                                 animationDuration=".5s" aria-label="Custom ProgressSpinner" />
              </div>
                <OverlayPanel ref="addSubchapterOp">
                <div class="flex align-items-stretch flex-wrap justify-content-center">
                  <div class="align-self-center surface-card">
                    <div class="p-inputgroup flex-1">
                      <InputText v-model="addSubchapterName" placeholder="Название" />
                      <Button @click="addSubchapter" icon="pi pi-check" severity="success" />
                    </div>
                  </div>
                </div>
              </OverlayPanel>
              <OverlayPanel ref="editChapterOp">
                <div class="flex align-items-stretch flex-wrap justify-content-center">
                  <div class="align-self-center surface-card">
                    <div class="p-inputgroup flex-1">
                      <InputText v-model="editChapterName" placeholder="Название" />
                      <Button @click="editChapter" icon="pi pi-check" severity="success" />
                    </div>
                  </div>
                </div>
              </OverlayPanel>
              <ConfirmPopup></ConfirmPopup>
            </Dialog>
          </div>
        </template>


    <div class="flex flex-column align-items-center justify-content-center border-500 border-round-md shadow-3 ml-3 p-2" style="background-color: #f8f9fa; max-width: 81em;">
      <div v-if="nameBlockComponent !== ''">
        <span class="text-5xl font-bold text-500 uppercase">{{nameBlockComponent}}</span>
      </div>
      <div>
        <template v-if="components === null">
          <p class="flex text-4xl font-semibold">КОМПОНЕНТЫ</p>
        </template>
        <template v-else>
          <Toast />
          <div class="flex flex-wrap">
            <ConfirmDialog></ConfirmDialog>
            <template v-for="component in components['components']">
              <div class="flex flex-column border-200 p-1 border-round-md shadow-3 m-2 surface-0" style="height: 22.5em; width: 15em">
                  <Image alt="Картинки нету" :src="component['url']" height="130" preview/>
                  <span class="font-bold text-center pt-1">{{component['name']}}</span>
                  <span class="pl-2 pt-2"><b>Вес: </b><span>{{(component['weight']/1000) >> 0}} кг {{component['weight']%1000}} г</span></span>
                  <span class="pl-2 pt-2 pb-2"><b>Цена: </b><span>{{Math.round(component['price']*component['weight'])}} руб.</span></span>
                  <div class="pt-2 pl-2">
                    <Button label="Описание" severity="info" icon="pi pi-external-link" @click="component['visibleDescription'] = true" text raised style="width: 10em"/>
                    <Dialog v-model:visible="component['visibleDescription']" modal :header="component['name']" :style="{ width: '50vw' }">
                      <p class="font-bold text-center pt-1">Описание</p>
                      <p>{{component['description']}}</p>
                    </Dialog>
                  </div>
                  <div class="flex justify-content-between flex-wrap pt-3 pl-2 pr-2">
                    <Button icon="pi pi-pencil" severity="secondary" text raised rounded @click="component['editComponentVisible'] = true"/>
                    <Button icon="pi pi-trash" severity="danger" text raised rounded @click="confirmDeleteComponent(component['id'],components['guid'])"/>
                    <Button icon="pi pi-plus" severity="success" text raised rounded @click="component['addComponentVisible'] = true"/>

                    <Dialog v-model:visible="component['editComponentVisible']" modal header="Изминение компонента" :style="{ width: 'auto' }" @hide="(event)=>{file = ''; updateComponentsData(components['guid'])}">

                      <div class="pt-4">
                        <label for="nameComponent" class="block text-900 font-medium mb-2">Имя компонента</label>
                        <InputText v-model="component['name']" id="nameComponent" type="text" class="w-19rem mb-3" />
                      </div>

                      <div class="pt-4">
                        <label for="descriptionComponent" class="block text-900 font-medium mb-2">Описание компонента</label>
                        <Textarea v-model="component['description']" id="descriptionComponent" type="text" autoResize rows="5" cols="30" />
                      </div>

                      <template #footer class="mt-2">
                        <Button severity="secondary" label="Назад" icon="pi pi-times" @click="component['editComponentVisible'] = false" class="mb-2"/>
                        <Button severity="success" label="Изменить" icon="pi pi-check" @click="updateComponent(component)" autofocus class="mb-2"/>
                      </template>
                    </Dialog>

                    <Dialog v-model:visible="component['addComponentVisible']" modal header="Поступление компонента" :style="{ width: 'auto' }" @hide="(event)=>{updateComponentsData(components['guid']); newWeight = 0; newPrice = 0;}">

                      <div class="pt-4">
                        <label for="nameComponent" class="block text-900 font-medium mb-2">Вес</label>
                        <InputNumber v-model="newWeight" id="nameComponent" class="mb-3" inputId="minmaxfraction" :minFractionDigits="1" :maxFractionDigits="4" />
                        <SelectButton v-model="newTypeWeight" :options="optionTypeWeight" aria-labelledby="basic" />
                      </div>

                      <div class="pt-4">
                        <label for="descriptionComponent" class="block text-900 font-medium mb-2">Цена</label>
                        <InputNumber v-model="newPrice" inputId="currency-germany" mode="currency" currency="RUB" locale="de-DE" />
                      </div>

                      <template #footer class="mt-2">
                        <Button severity="secondary" label="Назад" icon="pi pi-times" @click="component['addComponentVisible'] = false" class="mb-2"/>
                        <Button severity="success" label="Создать" icon="pi pi-check" @click="addComponent(component)" autofocus class="mb-2"/>
                      </template>
                    </Dialog>

                  </div>
              </div>
            </template>
            <div class="flex align-items-center justify-content-center border-200 p-1 border-round-md shadow-3 m-2 hover:surface-300 surface-0" style="height: 22em; width: 15em" @click="createComponentVisible = true">
              <div class="pi pi-fw pi-plus">

              </div>
            </div>
            <Dialog v-model:visible="createComponentVisible" modal header="Создание компонента" :style="{ width: 'auto' }" @hide="(event)=>{file = ''; nameComponent='';descriptionComponent = ''; updateComponentsData(components['guid'])}">

                <div class="large-12 medium-12 small-12 cell">
                  <label for="imageComponent" class="block text-900 font-medium mb-2">Изображение компонента</label>
                  <input type="file" id="imageComponent" ref="fileInputData" v-on:change="handleFileUpload()"/>
                </div>

              <div class="pt-4">
                <label for="nameComponent" class="block text-900 font-medium mb-2">Имя компонента</label>
                <InputText v-model="nameComponent" id="nameComponent" type="text" class="w-19rem mb-3"/>
              </div>

              <div class="pt-4">
                <label for="descriptionComponent" class="block text-900 font-medium mb-2">Описание компонента</label>
                <Textarea v-model="descriptionComponent" id="descriptionComponent" type="text" autoResize rows="5" cols="30" />
              </div>

              <template #footer class="mt-2">
                <Button severity="secondary" label="Назад" icon="pi pi-times" @click="createComponentVisible = false" class="mb-2"/>
                <Button severity="success" label="Создать" icon="pi pi-check" @click="createComponent(components['guid'])" autofocus class="mb-2"/>
              </template>
            </Dialog>
          </div>
        </template>

      </div>
    </div>

  </div>
</template>

<script setup>
  //Components
  import PanelMenu from 'primevue/panelmenu';
  import Dialog from 'primevue/dialog';
  import Button from 'primevue/button';
  import InputText from 'primevue/inputtext';
  import { PrimeIcons } from 'primevue/api';
  import ConfirmPopup from 'primevue/confirmpopup';
  import ProgressSpinner from 'primevue/progressspinner';
  import Toast from 'primevue/toast';
  import OverlayPanel from 'primevue/overlaypanel';
  import { useConfirm } from "primevue/useconfirm";
  import { useToast } from "primevue/usetoast";
  import Textarea from 'primevue/textarea';
  import ConfirmDialog from 'primevue/confirmdialog';
  import Image from 'primevue/image';
  import SelectButton from 'primevue/selectbutton';
  import InputNumber from 'primevue/inputnumber';


  //Dependencies
  import {onMounted, ref} from "vue";
  import {useStore} from "vuex";
  import API from "@/utils/api"
  import router from "@/router";
  const {API_URL} = useStore().state

  const createComponentVisible = ref(false);
  const chapters = ref([])
  const settingChapters = ref([])
  const expandedKeys = ref({});
  const expandedKeys2 = ref({});
  const visibleChapterSetting = ref(false);
  const confirm = useConfirm();
  const toast = useToast();
  const addSubchapterOp = ref();
  const addSubchapterGuid = ref("");
  const addSubchapterName = ref("");
  const editChapterOp = ref();
  const editChapterGuid = ref("");
  const editChapterName = ref("");
  const keySettingChapter = ref(0);
  const keyMainChapter = ref(0);
  const flagChapter = ref(false);
  const loader1 = ref(false);
  const loader2 = ref(false);
  const components = ref(null)
  const file = ref('')
  const fileInputData = ref(null)
  const nameComponent = ref("")
  const descriptionComponent = ref("")
  const nameBlockComponent = ref('')
  const newWeight = ref(0)
  const newPrice = ref(0)
  const newTypeWeight = ref('КГ')
  const optionTypeWeight = ref(['КГ','Г'])

  const addComponent = async (component) =>{
    let typeP
    if (newTypeWeight.value === "КГ"){
      typeP = "kg"
    }else{
      typeP = "g"
    }
    await API.post(API_URL + `/component/${component['id']}/add `,{
      'weight': newWeight.value,
      'price': newPrice.value,
      'typeWeight': typeP,
    }).then(()=>{
      toast.add({ severity: 'success', summary: 'Компонент поступил', detail: ``, life: 3000 });
    }).catch(error=>{
      toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    })

    component['addComponentVisible'] = false
  }

  const updateComponent = async (component) =>{
    await API.post(API_URL+`/component/${component['id']}/update`,{
      'name': component['name'],
      'description': component['description']
    }).then(()=>{
        toast.add({ severity: 'success', summary: 'Компоненты обнавлён', detail: ``, life: 3000 });
    }).catch((error)=>{
      toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    })

    component['editComponentVisible'] = false;
  }

  const deleteComponent = async (guid, chapter_id)=>{
    await API.post(API_URL + `/component/${guid}/delete`).then(()=>{
      toast.add({ severity: 'success', summary: 'Компонент удалён', detail: ``, life: 3000 });
    }).catch(error=>{
      toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    })

    updateComponentsData(chapter_id)
  }
  const createComponent = (chapter_guid) =>{
    API.post(API_URL+`/component/chapter/${chapter_guid}/create`,{
      'name': nameComponent.value,
      'description': descriptionComponent.value
    }).then(result=>{
      let formData = new FormData();
      formData.append('file', file.value);
      API.post(API_URL+`/component/${result.data['ID']}/uploadImage`,formData,{
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(()=>{
        toast.add({ severity: 'success', summary: 'Компоненты создан', detail: ``, life: 3000 });
        createComponentVisible.value = false

      }).catch((error)=>{
        toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      })
    }).catch((error)=>{
      toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    })
  }
  const handleFileUpload = () =>{
    file.value = fileInputData.value.files[0]
  }

  const updateComponentsData = (chapter_guid) =>{

    API.get(API_URL+`/chapter/${chapter_guid}/component/get`).then(result=>{
      components.value = { guid: chapter_guid, components: result.data['components']}
      toast.add({ severity: 'success', summary: 'Компоненты получены', detail: `Раздел ${chapter_guid}`, life: 3000 });
    }).catch((error)=>{
      toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    })
  }
  const onPanelClick = (chapter_guid,name,items) =>{
    if (items === null) {
      nameBlockComponent.value = name
      updateComponentsData(chapter_guid)
    }
  }

  const reset =async ()=>{
    await resetMainStructChapters();
    await resetStructChapterSetting();
    keySettingChapter.value += 1;
    keyMainChapter.value += 1;
  }
  const addSubchapterToggle = (event,guid, flag) => {
    addSubchapterGuid.value = guid;
    flagChapter.value = flag;
    addSubchapterOp.value.toggle(event);
  }

  const editChapterToggle = (event, guid, name) =>{
    editChapterGuid.value = guid;
    editChapterName.value = name;
    editChapterOp.value.toggle(event);
  }

  const editChapter = () =>{
    API.post(API_URL+`/chapter/${editChapterGuid.value}/update`,{
      "name":editChapterName.value,
    }).then(()=>{
      reset();
      toast.add({ severity: 'success', summary: 'Раздел изменён', detail: '', life: 3000 });
    }).catch((error)=>{
      toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    })

    editChapterOp.value.hide();
  }

  const addSubchapter = () =>{

    let newGUID = ""
    if (flagChapter.value) {
      API.post(API_URL + `/chapter/${addSubchapterGuid.value}/subchapter/add`, {
        "name": addSubchapterName.value,
      }).then(response => {
        newGUID = response.data["ID"]
        reset();
        toast.add({severity: 'success', summary: 'Подраздел добавлен', detail: '', life: 3000});
      }).catch((error) => {
        toast.add({severity: 'error', summary: 'Error', detail: error, life: 3000});
      })
    }else{
      API.post(API_URL + `/chapter/create`, {
        "name": addSubchapterName.value,
      }).then(response => {
        newGUID = response.data["ID"]
        reset();
        toast.add({severity: 'success', summary: 'Подраздел добавлен', detail: '', life: 3000});
      }).catch((error) => {
        toast.add({severity: 'error', summary: 'Error', detail: error, life: 3000});
      })
    }

    addSubchapterName.value = "";
    addSubchapterOp.value.hide();
  }

  const resetStructChapterSetting =async () =>{
    settingChapters.value = []
    loader2.value = true;
    await API.get(API_URL + "/chapter/get").then(
        response =>{
          let data = response.data["chapters"];
          data.forEach(chapter =>{
            let subchapters = [];
            chapter["subchapter"].forEach(
                subchapter =>{
                  subchapters.push({
                    key:settingChapters.value.length.toString()+'_'+subchapters.length.toString(),
                    guid:subchapter["id"],
                    label: subchapter["name"],
                    items: [
                      {
                        key: settingChapters.value.length.toString()+'_'+subchapters.length.toString()+"_0",
                        label: 'Редактировать',
                        icon: 'pi pi-fw pi-pencil',
                        command:()=>editChapterToggle(event, subchapter["id"],subchapter["name"])
                      },
                      {
                        key: settingChapters.value.length.toString()+'_'+subchapters.length.toString()+"_1",
                        label: 'Удалить',
                        icon: 'pi pi-fw pi-trash',
                        command: ()=>confirmDeleteChapter(event,subchapter["id"])
                      }
                    ]
                  })
                }
            )
            subchapters.push({
              key: settingChapters.value.length.toString()+'_'+((subchapters.length)).toString(),
              label: 'Добавить подраздел',
              command: ()=>addSubchapterToggle(event,chapter["id"],true),
              icon: PrimeIcons.PLUS ,
            })

            subchapters.push({
              key: settingChapters.value.length.toString()+'_'+((subchapters.length)).toString(),
              label: 'Редактировать',
              icon: PrimeIcons.PENCIL,
              command:()=>editChapterToggle(event, chapter["id"],chapter["name"])
            })

            subchapters.push({
              key: settingChapters.value.length.toString()+'_'+((subchapters.length)).toString(),
              label: 'Удалить',
              icon: PrimeIcons.TRASH,
              command: ()=>confirmDeleteChapter(event,chapter["id"])
            })
            settingChapters.value.push({
              key:settingChapters.value.length.toString(),
              guid: chapter["id"],
              label: chapter["name"],
              items: subchapters,
            })

          })
          settingChapters.value.push({
            key:settingChapters.value.length.toString(),
            label:"Добавить раздел",
            icon: PrimeIcons.PLUS ,
            command: ()=>addSubchapterToggle(event,null,false),
          })
        }
    )
    loader2.value = false;
  }

  const confirmDeleteChapter = (event,guid)=>{
    confirm.require({
      target: event.currentTarget,
      message: 'Вы уверены что хотите удалить раздел?',
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      acceptLabel: "Да",
      rejectLabel: "Нет",
      accept: () => {
        API.post(API_URL+`/chapter/${guid}/delete`).then(()=>{
          toast.add({ severity: 'success', summary: 'Раздел удалён', detail: '', life: 3000 });
          reset();
        }).catch((error)=>{
          toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
        })
      },
    })
  }

  const confirmDeleteComponent = (guid,chapter_id) => {
    confirm.require({
      message: 'Вы уверены что хотите удалить компонент?',
      header: 'Удаление компонента',
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      acceptLabel:'Да',
      rejectLabel:'Нет',
      accept: () => {
        deleteComponent(guid,chapter_id);
      },
    });
  }

  const resetMainStructChapters = async () =>{
    chapters.value = []
    loader1.value = true;
    await API.get(API_URL + "/chapter/get").then(
        response =>{
          let data = response.data["chapters"];
          data.forEach(chapter =>{
            let subchapters = [];
            chapter["subchapter"].forEach(
                subchapter =>{
                  subchapters.push({
                    key:chapters.value.length.toString()+'_'+subchapters.length.toString(),
                    guid:subchapter["id"],
                    label: subchapter["name"],
                    command:()=>onPanelClick(subchapter["id"],subchapter["name"],null),
                    items: []
                  })
                }
            )

            if (subchapters.length === 0){
              subchapters = null
            }
            chapters.value.push({
              key:chapters.value.length.toString(),
              guid: chapter["id"],
              label: chapter["name"],
              items: subchapters,
              command:()=>onPanelClick(chapter["id"],chapter["name"],subchapters),
            })

          })
        }
    )
    loader1.value = false;
  }
  onMounted(()=>{
    resetMainStructChapters();
  })

</script>

<style scoped>

:deep(.p-panelmenu-header-action){
  background-color: var(--surface-200);
}
</style>
