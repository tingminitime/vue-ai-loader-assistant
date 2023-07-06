import { QA_GENERATOR_PROMPT, QA_PROMPT } from '../utils/prompt.js'

// From: node_modules/langchain/dist/prompts/template.js
export const parseFString = template => {
  // Core logic replicated from internals of pythons built in Formatter class.
  // https://github.com/python/cpython/blob/135ec7cefbaffd516b77362ad2b2ad1025af462e/Objects/stringlib/unicode_format.h#L700-L706
  const chars = template.split('')
  const nodes = []
  const nextBracket = (bracket, start) => {
    for (let i = start; i < chars.length; i += 1) {
      if (bracket.includes(chars[i])) {
        return i
      }
    }
    return -1
  }
  let i = 0
  while (i < chars.length) {
    if (chars[i] === '{' && i + 1 < chars.length && chars[i + 1] === '{') {
      nodes.push({ type: 'literal', text: '{' })
      i += 2
    } else if (
      chars[i] === '}' &&
      i + 1 < chars.length &&
      chars[i + 1] === '}'
    ) {
      nodes.push({ type: 'literal', text: '}' })
      i += 2
    } else if (chars[i] === '{') {
      const j = nextBracket('}', i)
      if (j < 0) {
        throw new Error("Unclosed '{' in template.")
      }
      nodes.push({
        type: 'variable',
        name: chars.slice(i + 1, j).join(''),
      })
      i = j + 1
    } else if (chars[i] === '}') {
      throw new Error("Single '}' in template.")
    } else {
      const next = nextBracket('{}', i)
      const text = (next < 0 ? chars.slice(i) : chars.slice(i, next)).join('')
      nodes.push({ type: 'literal', text })
      i = next < 0 ? chars.length : next
    }
  }
  return nodes
}

console.log('Parse QA_GENERATOR_PROMPT: ', parseFString(QA_GENERATOR_PROMPT))
console.log('Parse QA_PROMPT: ', parseFString(QA_PROMPT))
