<script setup lang="ts">
/* eslint-env browser */
import { onMounted, onUnmounted, ref, computed } from 'vue'
import Button from './Button.vue'
import { BsCheckLg } from 'vue-icons-plus/bs'
import { GoAlert } from 'vue-icons-plus/go'

type DialogType = 'default' | 'danger' | 'success'

type ButtonVariant = 'primary' | 'default' | 'light' | 'danger' | 'warning' | 'success'

type DialogButton = {
  label: string
  action?: 'confirm' | 'cancel' | string
  type?: ButtonVariant
  onClick?: () => void
}

const props = withDefaults(
  defineProps<{
    visible?: boolean
    title?: string
    message?: string
    type?: DialogType
    buttons?: DialogButton[]
    confirmText?: string
    cancelText?: string
    showCancel?: boolean
    closeOnOutside?: boolean
    className?: string
  }>(),
  {
    visible: false,
    type: 'default',
    showCancel: true,
    confirmText: 'OK',
    cancelText: 'Cancel',
    closeOnOutside: true,
    className: '',
    title: '',
    message: '',
    buttons: () => [],
  }
)

const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'close'): void
}>()

const modalContainer = ref<HTMLElement | null>(null)

const setVisible = (value: boolean) => {
  emit('update:visible', value)
  if (!value) emit('close')
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') setVisible(false)
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

const iconConfig = computed(() => {
  if (props.type === 'danger') {
    return {
      colorClasses: 'bg-red-light-5 text-red-dark',
      Icon: GoAlert,
    }
  }
  if (props.type === 'success') {
    return {
      colorClasses: 'bg-green-100 text-green-600',
      Icon: BsCheckLg,
    }
  }
  return null
})

const defaultButtons = computed<DialogButton[]>(() => {
  const confirmVariant: ButtonVariant =
    props.type === 'danger' ? 'danger' : props.type === 'success' ? 'success' : 'primary'
  const buttons: DialogButton[] = []
  if (props.showCancel) {
    buttons.push({ label: props.cancelText ?? 'Cancel', action: 'cancel', type: 'light' })
  }
  buttons.push({ label: props.confirmText ?? 'OK', action: 'confirm', type: confirmVariant })
  return buttons
})

const resolvedButtons = computed(() =>
  props.buttons?.length ? props.buttons : defaultButtons.value
)
const isSingleButton = computed(() => resolvedButtons.value.length === 1)

const isVariant = (variant?: ButtonVariant) => ({
  primary: variant === 'primary',
  default: variant === 'default',
  light: variant === 'light',
  danger: variant === 'danger',
  warning: variant === 'warning',
  success: variant === 'success',
})

const onButtonClick = (btn: DialogButton) => {
  if (btn.action === 'cancel') {
    emit('cancel')
    setVisible(false)
    btn.onClick?.()
    return
  }
  if (btn.action === 'confirm') {
    emit('confirm')
    setVisible(false)
    btn.onClick?.()
    return
  }
  btn.onClick?.()
}
</script>

<template>
  <div
    class="fixed top-0 left-0 flex items-center justify-center w-full h-full min-h-screen px-4 py-5 bg-dark/90 z-50"
    :class="{ block: props.visible, hidden: !props.visible }"
    @click.self="props.closeOnOutside ? setVisible(false) : undefined"
  >
    <div
      ref="modalContainer"
      class="w-full max-w-[570px] rounded-[20px] bg-white dark:bg-dark-2 py-8 px-6 text-center md:py-[42px] md:px-[60px]"
      :class="props.className"
      role="dialog"
      aria-modal="true"
    >
      <div
        v-if="iconConfig"
        class="mx-auto mb-5 flex h-[60px] w-[60px] items-center justify-center rounded-full"
        :class="iconConfig?.colorClasses"
      >
        <component :is="iconConfig?.Icon" size="26" />
      </div>
      <h3 v-if="props.title" class="pb-3 text-xl font-bold text-dark dark:text-white sm:text-2xl">
        {{ props.title }}
      </h3>
      <p
        v-if="props.message"
        class="text-base leading-relaxed mb-7 text-body-color dark:text-dark-6"
      >
        {{ props.message }}
      </p>
      <div v-if="$slots.default" class="mb-7 text-left">
        <slot />
      </div>

      <div class="-mx-2 flex flex-wrap justify-center">
        <div
          v-for="(btn, idx) in resolvedButtons"
          :key="idx"
          :class="[isSingleButton ? 'w-full max-w-[320px]' : 'w-1/2', 'px-2']"
        >
          <Button
            :label="btn.label"
            :primary="isVariant(btn.type).primary"
            :default="isVariant(btn.type).default"
            :light="isVariant(btn.type).light"
            :danger="isVariant(btn.type).danger"
            :warning="isVariant(btn.type).warning"
            :success="isVariant(btn.type).success"
            class-name="block w-full"
            @click="onButtonClick(btn)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
