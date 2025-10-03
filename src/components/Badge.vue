<script setup lang="ts">
type BadgeColor =
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'zinc'

type BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    color?: BadgeColor
    size?: BadgeSize
    pill?: boolean
    className?: string
  }>(),
  { color: 'zinc', size: 'md', pill: false, className: '' }
)

const colorClasses: Record<BadgeColor, string> = {
  red: 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/25 dark:text-red-200 dark:border-red-800/40',
  orange:
    'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-900/25 dark:text-orange-200 dark:border-orange-800/40',
  amber:
    'bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-900/25 dark:text-amber-200 dark:border-amber-800/40',
  yellow:
    'bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/25 dark:text-yellow-200 dark:border-yellow-800/40',
  lime: 'bg-lime-100 text-lime-800 border border-lime-200 dark:bg-lime-900/25 dark:text-lime-200 dark:border-lime-800/40',
  green:
    'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/25 dark:text-green-200 dark:border-green-800/40',
  emerald:
    'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-emerald-900/25 dark:text-emerald-200 dark:border-emerald-800/40',
  teal: 'bg-teal-100 text-teal-800 border border-teal-200 dark:bg-teal-900/25 dark:text-teal-200 dark:border-teal-800/40',
  cyan: 'bg-cyan-100 text-cyan-800 border border-cyan-200 dark:bg-cyan-900/25 dark:text-cyan-200 dark:border-cyan-800/40',
  sky: 'bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-900/25 dark:text-sky-200 dark:border-sky-800/40',
  blue: 'bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/25 dark:text-blue-200 dark:border-blue-800/40',
  indigo:
    'bg-indigo-100 text-indigo-800 border border-indigo-200 dark:bg-indigo-900/25 dark:text-indigo-200 dark:border-indigo-800/40',
  violet:
    'bg-violet-100 text-violet-800 border border-violet-200 dark:bg-violet-900/25 dark:text-violet-200 dark:border-violet-800/40',
  purple:
    'bg-purple-100 text-purple-800 border border-purple-200 dark:bg-purple-900/25 dark:text-purple-200 dark:border-purple-800/40',
  fuchsia:
    'bg-fuchsia-100 text-fuchsia-800 border border-fuchsia-200 dark:bg-fuchsia-900/25 dark:text-fuchsia-200 dark:border-fuchsia-800/40',
  pink: 'bg-pink-100 text-pink-800 border border-pink-200 dark:bg-pink-900/25 dark:text-pink-200 dark:border-pink-800/40',
  rose: 'bg-rose-100 text-rose-800 border border-rose-200 dark:bg-rose-900/25 dark:text-rose-200 dark:border-rose-800/40',
  zinc: 'bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-zinc-900/25 dark:text-zinc-200 dark:border-zinc-800/40',
}

const sizeClasses: Record<BadgeSize, string> = {
  xs: 'text-[10px] px-2 py-0.5',
  sm: 'text-xs px-2.5 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-3.5 py-1.5',
  xl: 'text-lg px-4 py-2',
}
</script>

<template>
  <span
    :class="[
      'inline-flex items-center font-medium select-none',
      props.pill ? 'rounded-full' : 'rounded-sm',
      sizeClasses[props.size],
      colorClasses[props.color],
      props.className,
    ]"
  >
    <slot />
  </span>
</template>
