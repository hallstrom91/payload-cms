import type { Block } from 'payload'

export const CodeBlock: Block = {
  slug: 'code-block',
  labels: { singular: 'Code', plural: 'Code' },
  fields: [
    { name: 'title', type: 'text' },
    {
      name: 'language',
      type: 'select',
      defaultValue: 'typescript',
      options: [
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JavaScript', value: 'javaScript' },
        { label: 'C-sharp', value: 'csharp' },
        { label: 'Lua', value: 'lua' },
        { label: 'Bash/Shell', value: 'shell' },
        { label: 'CSS', value: 'css' },
        { label: 'Dockerfile', value: 'dockerfile' },
        // add more if needed:
        // https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages
      ],
    },
    { name: 'code', type: 'code', required: true },
  ],
}
