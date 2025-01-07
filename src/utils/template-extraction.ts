import { compileTemplate } from '@vue/compiler-sfc'
import type { ElementNode, TemplateChildNode } from '@vue/compiler-core'

/**
 * Get the leading whitespace from a line in the template.
 * The Vue compiler provides 1-indexed line numbers in loc.start.line,
 * so we convert to 0-indexed for array access.
 *
 * @param template - The full template source
 * @param startLine - The 1-indexed line number to get indentation from
 * @returns The whitespace string from the start of the line
 */
function getIndentFromTemplate(template: string, startLine: number): string {
  const lines = template.split('\n')
  if (startLine <= 0 || startLine >= lines.length) return ''
  const line = lines[startLine - 1]
  const match = line.match(/^\s*/)
  return match ? match[0] : ''
}

function extractNodeContent(node: TemplateChildNode, _template: string): string {
  // For v-for nodes, we need to look at their children
  if (node.type === 11 && 'children' in node && node.children?.[0]) {
    const firstChild = node.children[0]
    if ('loc' in firstChild) {
      return firstChild.loc.source
    }
  }

  // For regular nodes, use their location source
  if ('loc' in node) {
    return node.loc.source
  }

  return ''
}

/**
 * Extract content from a variant node
 */
export function extractVariantContent(variantNode: ElementNode, template: string) {
  if (!variantNode.children) return null

  // Get the title prop
  const props = variantNode.props?.find(p => p.name === 'title')
  const title = props?.type === 6 ? props.value?.content || '' : ''
  if (!title) return null

  // Get the slot content
  const content = variantNode.children
    .map(child => extractNodeContent(child, template))
    .join('')

  // Get indentation from template
  if ('loc' in variantNode && variantNode.children?.[0] && 'loc' in variantNode.children[0]) {
    const indent = getIndentFromTemplate(template, variantNode.children[0].loc.start.line)
    return { title, content: indent + content }
  }

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
      .map(child => extractNodeContent(child, template))
      .join('')

    // Add indentation based on the story's position
    if ('loc' in storyNode) {
      const indent = getIndentFromTemplate(template, storyNode.loc.start.line)
      return {
        template: indent + content,
        variants: {},
      }
    }

    return {
      template: content,
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
    variants[title] = content
  })

  return { template: null, variants }
}
