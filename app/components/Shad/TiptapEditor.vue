<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import TextAlign from '@tiptap/extension-text-align'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'

interface Props {
  content: string
  readonly?: boolean
}

const props = defineProps<Props>()

const editor = useEditor({
  // ponytail: editable is initial-value only; add setEditable watcher if dynamic toggling is needed
  editable: !props.readonly,
  content: props.content,
  extensions: [
    StarterKit,
    Underline,
    Link.configure({ openOnClick: false }),
    Superscript,
    Subscript,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Table.configure({ resizable: false }),
    TableRow,
    TableCell,
    TableHeader
  ]
})

const state = reactive({
  bold: false, italic: false, underline: false,
  h1: false, h2: false, h3: false, h4: false, paragraph: false, list: false, code: false,
  strike: false, orderedList: false, taskList: false, blockquote: false, table: false,
  superscript: false, subscript: false,
  alignLeft: false, alignCenter: false, alignRight: false, alignJustify: false
})

watch(editor, (ed) => {
  if (!ed) return
  ed.on('transaction', () => {
    state.bold = ed.isActive('bold')
    state.italic = ed.isActive('italic')
    state.underline = ed.isActive('underline')
    state.h1 = ed.isActive('heading', { level: 1 })
    state.h2 = ed.isActive('heading', { level: 2 })
    state.h3 = ed.isActive('heading', { level: 3 })
    state.h4 = ed.isActive('heading', { level: 4 })
    state.paragraph = ed.isActive('paragraph')
    state.list = ed.isActive('bulletList')
    state.code = ed.isActive('codeBlock')
    state.strike = ed.isActive('strike')
    state.orderedList = ed.isActive('orderedList')
    state.taskList = ed.isActive('taskList')
    state.table = ed.isActive('table')
    state.blockquote = ed.isActive('blockquote')
    state.superscript = ed.isActive('superscript')
    state.subscript = ed.isActive('subscript')
    state.alignLeft = ed.isActive({ textAlign: 'left' })
    state.alignCenter = ed.isActive({ textAlign: 'center' })
    state.alignRight = ed.isActive({ textAlign: 'right' })
    state.alignJustify = ed.isActive({ textAlign: 'justify' })
  })
}, { immediate: true })

defineExpose({ editor, state })
</script>

<template>
  <EditorContent
    :editor="editor"
    class="editor-wrapper"
  />
</template>

<style scoped>
.editor-wrapper { flex: 1; overflow-y: auto; height: 100%; }

.editor-wrapper :deep(.ProseMirror) { outline: none; min-height: 100%; padding: 40px; font-size: 14px; }
.editor-wrapper :deep(.ProseMirror h1) { font-size: 30px; font-weight: 700; letter-spacing: -0.7px; margin-bottom: 32px; color: var(--text); }
.editor-wrapper :deep(.ProseMirror h2) { font-size: 18px; font-weight: 700; margin-bottom: 10px; color: var(--text); }
.editor-wrapper :deep(.ProseMirror p) { font-size: 14px; color: var(--text-2); line-height: 1.6; margin-bottom: 4px; }
.editor-wrapper :deep(.ProseMirror code:not(pre code)) { font-family: 'JetBrains Mono', monospace; font-size: 12px; background: var(--bg); padding: 2px 5px; border-radius: 3px; }
.editor-wrapper :deep(.ProseMirror pre) { background: var(--bg); border: 1px solid var(--border); border-radius: var(--r); padding: 14px; margin-bottom: 14px; }
.editor-wrapper :deep(.ProseMirror pre code) { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--text-2); line-height: 1.6; background: none; padding: 0; }
.editor-wrapper :deep(.ProseMirror ul) { list-style-type: disc; padding-left: 24px; margin-bottom: 14px; }
.editor-wrapper :deep(.ProseMirror ol) { list-style-type: decimal; padding-left: 24px; margin-bottom: 14px; }
.editor-wrapper :deep(.ProseMirror li) { font-size: 14px; color: var(--text-2); line-height: 1.8; margin-bottom: 4px; }
.editor-wrapper :deep(.ProseMirror blockquote) { border-left: 3px solid var(--border); padding-left: 16px; color: var(--text-3); margin: 0 0 14px; }
.editor-wrapper :deep(.ProseMirror a) { color: var(--accent); text-decoration: underline; }
.editor-wrapper :deep(ul[data-type="taskList"]) { list-style: none; padding-left: 4px; margin-bottom: 14px; }
.editor-wrapper :deep(ul[data-type="taskList"] li) { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; }
.editor-wrapper :deep(ul[data-type="taskList"] li label) { margin-top: 2px; flex-shrink: 0; cursor: pointer; }
.editor-wrapper :deep(ul[data-type="taskList"] li input[type="checkbox"]) { accent-color: var(--accent); width: 14px; height: 14px; cursor: pointer; }
.editor-wrapper :deep(ul[data-type="taskList"] li[data-checked="true"] > div) { text-decoration: line-through; color: var(--text-3); }
.editor-wrapper :deep(.ProseMirror table) { border-collapse: collapse; width: 100%; margin-bottom: 14px; table-layout: fixed; }
.editor-wrapper :deep(.ProseMirror th) { background: var(--bg); font-weight: 600; text-align: left; padding: 8px 12px; border: 1px solid var(--border); font-size: 13px; color: var(--text); }
.editor-wrapper :deep(.ProseMirror td) { padding: 8px 12px; border: 1px solid var(--border); font-size: 13px; color: var(--text-2); vertical-align: top; }
.editor-wrapper :deep(.ProseMirror .selectedCell) { background: color-mix(in srgb, var(--accent) 12%, transparent); }
</style>
