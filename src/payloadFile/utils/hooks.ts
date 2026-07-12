import type { CollectionBeforeChangeHook, CollectionAfterReadHook } from 'payload'

/**
 * ============================================
 * 🔧 UTILITY HOOKS FOR PAYLOAD CMS
 * ============================================
 * Reusable hooks to avoid duplication
 */

/**
 * Generates href from section, subsection and slug
 */
export function generateHref(
  section: string | undefined,
  subsection: string | undefined,
  slug: string | undefined,
): string {
  if (!slug) return '/'
  
  const parts = [section, subsection, slug].filter(Boolean)
  return parts.length > 0 ? `/${parts.join('/')}` : '/'
}

/**
 * Hook: Simplify relationship fields to slugs
 * Converts relationship objects to string slugs for cleaner data
 */
export const simplifyRelationships: CollectionAfterReadHook = async ({ doc }) => {
  if (!doc) return doc

  // Simplify section to slug if it's an object
  if (doc.section && typeof doc.section === 'object' && 'slug' in doc.section) {
    doc.section = doc.section.slug
  }

  // Simplify subsection to slug if it's an object
  if (doc.subsection && typeof doc.subsection === 'object' && 'slug' in doc.subsection) {
    doc.subsection = doc.subsection.slug
  }

  // Fix broken href (e.g., /1/transport/zagluskaa instead of /transport/zagluskaa)
  if (doc.href && /^\/\d+\//.test(doc.href) && doc.slug) {
    const sectionSlug = typeof doc.section === 'string' ? doc.section : ''
    const subsectionSlug = typeof doc.subsection === 'string' ? doc.subsection : ''
    doc.href = generateHref(sectionSlug, subsectionSlug, doc.slug)
  }

  return doc
}

/**
 * Hook: Generate href before saving
 * This is more efficient than afterRead
 */
export const generateHrefBeforeSave: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!data) return data

  let sectionSlug = ''
  let subsectionSlug = ''

  // Get subsection slug
  if (data.subsection) {
    try {
      const subsectionId =
        typeof data.subsection === 'object' && 'id' in data.subsection
          ? data.subsection.id
          : data.subsection

      if (subsectionId) {
        const subsection = await req.payload.findByID({
          collection: 'subsections',
          id: subsectionId,
          depth: 0,
        })

        if (subsection) {
          subsectionSlug = subsection.slug || ''

          if (subsection.section) {
            const secId =
              typeof subsection.section === 'object' && subsection.section !== null
                ? (subsection.section as { id: number | string }).id
                : subsection.section
            try {
              const section = await req.payload.findByID({
                collection: 'sections',
                id: secId,
                depth: 0,
              })
              sectionSlug = section?.slug || ''
            } catch {
              sectionSlug = ''
            }
          }
        }
      }
    } catch (error) {
      console.error('❌ Error generating href:', error)
    }
  }

  // Generate href
  data.href = generateHref(sectionSlug, subsectionSlug, data.slug)
  return data
}