<template>
  <div>
    <input type="checkbox" id="my-modal-13" class="modal-toggle" />
    <div class="modal">
      <div class="border-2 border-black rounded-none modal-box">
        <!-- TITLE -->
        <div class="flex justify-between text-xl">
          <h1>Manage password</h1>
          <button
            @click="closeModal()"
            class="relative border-2 border-black btn btn-square hover:border-2 hover:border-black btn-sm">
            <iconify-icon
              icon="material-symbols:close"
              class="absolute w-6 h-6">
            </iconify-icon>
          </button>
        </div>
        <!-- FORM -->
        <Form ref="formRef" @submit="submitForm">
          <div class="mt-6 form-control">
            <label class="px-0 cursor-pointer label">
              <span class="text-base text-black">Change password</span>
              <input
                type="checkbox"
                class="border-2 border-black rounded-none checkbox"
                @click="setPasswordRequirement()" />
            </label>
            <!-- PASSWORD INPUT -->
            <input
              v-model="password"
              v-if="passwordRequired === true"
              class="py-2 text-sm neobrutalist-input"
              placeholder="Choose a new password for your group" />
            <div v-if="passwordError" class="text-red-500">
              {{ passwordError }}
            </div>
          </div>
          <div class="modal-action">
            <!-- UPDATE PASSWORD BUTTON -->
            <button
              v-if="passwordRequired === true"
              class="my-4 mb-2 text-black bg-white border-2 border-black btn hover:bg-black hover:border-black hover:text-white"
              type="submit"
              @click="changeGroupPassword">
              Update Password
            </button>
            <!-- DELETE PASSWORD BUTTON -->
            <button
              v-if="passwordRequired === false && channel?.type === 'protected'"
              class="my-4 mb-2 text-white bg-red-400 border-2 border-black btn hover:border-black hover:bg-black"
              type="submit"
              @click="deleteGroupPassword">
              Delete Password
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ******* //
// IMPORTS //
// ******* //

import { ref, toRefs, watch, type PropType } from 'vue'
import { Form } from 'vee-validate'
import { useToast } from 'vue-toastification'

import { storeToRefs } from 'pinia'

import type { Channel } from '@/types'

import { useChannelStore } from '@/stores/ChannelStore'

// ******************** //
// VARIABLE DEFINITIONS //
// ******************** //

const channelStore = useChannelStore()
const emit = defineEmits(['update:showModal'])
const password = ref<string | null>(null)
const passwordError = ref<string | null>(null)
const passwordRequired = ref<boolean>(false)
const props = defineProps({
  showModal: { type: Boolean },
  channel: { type: Object as PropType<Channel | null> }
})
const toast = useToast()

const { selectedChannel } = storeToRefs(channelStore)
const { showModal, channel } = toRefs(props)

// ******************** //
// FUNCTION DEFINITIONS //
// ******************** //

// ******************* //
// changeGroupPassword //
// ******************* //

const changeGroupPassword = async (): Promise<void> => {
  if (!password.value) {
    toast.error(`You must provide a password`)
    return
  }

  if (!selectedChannel.value) return

  try {
    await channelStore.changeGroupPassword(
      selectedChannel.value,
      password.value
    )
    toast.success(`Password changed successfully`)
    passwordError.value = null
  } catch (error) {
    toast.error(`An error occured while changing the password`)
  }
}

// ********** //
// closeModal //
// ********** //

function closeModal(): void {
  if (passwordRequired.value && (!password.value || passwordError.value)) return
  const modalElement = document.getElementById(
    'my-modal-13'
  ) as HTMLInputElement
  if (modalElement) {
    modalElement.checked = !modalElement.checked
    emit('update:showModal', modalElement.checked)
  }
}

// ******************* //
// deleteGroupPassword //
// ******************* //

const deleteGroupPassword = async (): Promise<void> => {
  if (!selectedChannel.value) return

  try {
    await channelStore.deleteGroupPassword(selectedChannel.value)
    toast.success(`Password deleted successfully`)
  } catch (error) {
    toast.error(`An error occured while deleting the group password.`)
  }
}

// ********************** //
// setPasswordRequirement //
// ********************** //

const setPasswordRequirement = (): void => {
  if (passwordRequired.value) passwordRequired.value = false
  else passwordRequired.value = true
  passwordError.value = null
}

// ********** //
// submitForm //
// ********** //

const submitForm = async (values: Record<string, any>): Promise<void> => {
  if (passwordRequired.value && !password.value) {
    passwordError.value = 'The password field is required.'
    return
  }

  if (
    password.value &&
    (password.value.length < 4 || password.value.length > 50)
  ) {
    passwordError.value = 'The password must be 4 and 50 characters.'
    return
  }

  passwordError.value = null
}
// ********************* //
// VueJs LIFECYCLE HOOKS //
// ********************* //

watch(showModal, (newValue) => {
  const modalElement = document.getElementById(
    'my-modal-13'
  ) as HTMLInputElement
  if (modalElement) {
    modalElement.checked = newValue
  }
})
</script>
