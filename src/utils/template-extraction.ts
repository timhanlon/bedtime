import { compileTemplate } from '@vue/compiler-sfc'
import type { ElementNode, TemplateChildNode } from '@vue/compiler-core'

/**
 * Clean up template indentation
 */
export function cleanTemplate(template: string) {
  const lines = template
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  // If it's a single line, return as is
  if (lines.length === 1) return lines[0]

  // For multiline, add proper indentation
  return lines[0] + '\n'
    + lines.slice(1, -1).map(line => '  ' + line).join('\n') + '\n'
    + lines[lines.length - 1]
}

/**
 * Extract content from a variant node
 */
export function extractVariantContent(variantNode: ElementNode, _template: string) {
  if (!variantNode.children) return null

  // Get the title prop
  const props = variantNode.props?.find(p => p.name === 'title')
  const title = props?.type === 6 ? props.value?.content || '' : ''
  if (!title) return null

  // Get the slot content
  const content = variantNode.children
    .filter((child): child is TemplateChildNode => child.type !== 3) // Skip whitespace nodes
    .map((child) => {
      if ('loc' in child && child.loc?.source) {
        return child.loc.source.trim()
      }
      return ''
    })
    .filter(Boolean)
    .join('\n')

  return { title, content }
}

/**
 * Extract template content from a story component
 */
export function extractStoryContent(template: string, filename: string, id: string) {
  const { ast } = compileTemplate({
    source: template,
    filename,
    id,
  })

  if (!ast || !('children' in ast)) return { template: null, variants: {} }

  // Find the Story component's content
  const storyNode = ast.children.find(node =>
    node.type === 1 // Element
    && 'tag' in node
    && node.tag === 'Story',
  ) as ElementNode | undefined

  if (!storyNode?.children) return { template: null, variants: {} }

  // Find all Variant components
  const variantNodes = storyNode.children
    .filter((node): node is ElementNode =>
      node.type === 1 // Element
      && 'tag' in node
      && node.tag === 'Variant',
    )

  // If no variants, return the story content as template
  if (variantNodes.length === 0) {
    const content = storyNode.children
      .filter((child): child is ElementNode => {
        // Include element nodes, v-for nodes, and v-if nodes
        return (child.type === 1 && 'tag' in child) || child.type === 11 || child.type === 9
      })
      .map((child) => {
        if ('codegenNode' in child && child.codegenNode?.loc?.source) {
          return child.codegenNode.loc.source.trim()
        }
        if ('loc' in child && child.loc?.source) {
          return child.loc.source.trim()
        }
        return ''
      })
      .filter(Boolean)
      .join('\n')

    return {
      template: content ? cleanTemplate(content) : '',
      variants: {},
    }
  }

  // Process variants
  const processedVariants = variantNodes
    .map(node => extractVariantContent(node, template))
    .filter((v): v is { title: string, content: string } => v !== null)

  // Store variant templates
  const variants: Record<string, string> = {}
  processedVariants.forEach(({ title, content }) => {
    variants[title] = cleanTemplate(content)
  })

  return { template: null, variants }
}
