<template>
  <footer class="px-8 py-5 flex items-center justify-between">
    <!-- <button
      :class="[
        'flex items-center gap-2 transition-colors text-sm',
        isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800',
      ]"
    >
      <Circle :size="14" fill="currentColor" />
      <span>Сделана командой DotX</span>
    </button> -->
    <Button class="select-none cursor-pointer" variant="outline">
      <Disc :size="14" /><span>Сделана командой DotX</span>
    </Button>

    <div class="flex items-center gap-2">
      <!-- <button
        :class="[
          'flex items-center gap-2 transition-colors text-sm',
          isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800',
        ]"
      >
        <Volume2 :size="14" />
        <span>Вкл</span>
      </button> -->
      <Button class="select-none cursor-pointer" variant="outline">
        <Volume2 :size="14" /><span>Вкл</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button class="select-none cursor-pointer" variant="outline">
            <Palette />
            <span>{{ isDark ? 'Темная тема' : 'Светлая тема' }}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
          <DropdownMenuItem
            @click="toggleDark()"
            :disabled="!isDark"
            class="select-none cursor-pointer"
          >
            <span>Светлая тема</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            @click="toggleDark()"
            :disabled="isDark"
            class="select-none cursor-pointer"
          >
            <span>Тёмная тема</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 1. Импорт Composable для общего состояния
import { useTheme } from '@/composables/useTheme'

// 2. Деструктуризация isDark и toggleDark (возвращаем простой переключатель)
const { isDark, toggleDark } = useTheme()

// 3. Импорт необходимых иконок
import { Disc, Volume2, Palette } from 'lucide-vue-next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-vue-next'
// Удаляем неиспользуемые переменные и компоненты Dropdown Menu
</script>
