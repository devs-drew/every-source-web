<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'

interface Props {
  content: string
}

const props = defineProps<Props>()

const editor = useEditor({
  content: props.content,
  extensions: [StarterKit, Underline],
})

const state = reactive({
  bold: false, italic: false, underline: false,
  h1: false, h2: false, list: false, code: false,
})

watch(editor, (ed) => {
  if (!ed) return
  ed.on('transaction', () => {
    state.bold = ed.isActive('bold')
    state.italic = ed.isActive('italic')
    state.underline = ed.isActive('underline')
    state.h1 = ed.isActive('heading', { level: 1 })
    state.h2 = ed.isActive('heading', { level: 2 })
    state.list = ed.isActive('bulletList')
    state.code = ed.isActive('codeBlock')
  })
}, { immediate: true })

defineExpose({ editor, state })
</script>

<template>
  <EditorContent :editor="editor" class="editor-wrapper" />
</template>

<style scoped>
.editor-wrapper { flex: 1; overflow-y: auto; height: 100%; }

.editor-wrapper :deep(.ProseMirror) { outline: none; min-height: 100%; padding: 40px; font-size: 14px; }
.editor-wrapper :deep(.ProseMirror h1) { font-size: 30px; font-weight: 700; letter-spacing: -0.7px; margin-bottom: 32px; color: var(--text); }
.editor-wrapper :deep(.ProseMirror h2) { font-size: 18px; font-weight: 700; margin-bottom: 10px; color: var(--text); }
.editor-wrapper :deep(.ProseMirror p) { font-size: 14px; color: var(--text-2); line-height: 1.8; margin-bottom: 18px; }
.editor-wrapper :deep(.ProseMirror code:not(pre code)) { font-family: 'JetBrains Mono', monospace; font-size: 12px; background: var(--bg); padding: 2px 5px; border-radius: 3px; }
.editor-wrapper :deep(.ProseMirror pre) { background: var(--bg); border: 1px solid var(--border); border-radius: var(--r); padding: 14px; margin-bottom: 14px; }
.editor-wrapper :deep(.ProseMirror pre code) { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-2); line-height: 1.6; background: none; padding: 0; }
.editor-wrapper :deep(.ProseMirror ul) { padding-left: 24px; margin-bottom: 14px; }
.editor-wrapper :deep(.ProseMirror li) { font-size: 14px; color: var(--text-2); line-height: 1.8; margin-bottom: 4px; }
</style>
