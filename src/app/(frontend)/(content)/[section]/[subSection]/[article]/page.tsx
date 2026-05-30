import { notFound } from 'next/navigation'
import { getArticleBySlug } from '@/lib/payload'
import { transformArticle } from '@/lib/articleTransform'
import type { ArticlePageProps } from '@/shared/types/article.type'

import HederArticle from '@/dataPage/articleDataPage/sectionArticle/HederArticle'
import KratkoArticle from '@/dataPage/articleDataPage/sectionArticle/KratkoArticle'
import BodyArticle from '@/dataPage/articleDataPage/sectionArticle/BodyArticle'
import NavigationArticle from '@/dataPage/articleDataPage/sectionArticle/NavigationArticle'
import UsefulArticle from '@/dataPage/articleDataPage/sectionArticle/UsefulArticle'
import RelatedArticles from '@/dataPage/articleDataPage/sectionArticle/RelatedArticles'
import NeedHelpArticle from '@/dataPage/articleDataPage/sectionArticle/NeeHelpArticle'


// ========== СТАТИЧЕСКАЯ ГЕНЕРАЦИЯ =========== \\

// ============================================ \\

// ================ МЕТАДАНЫЕ ================ \\

// ============================================ \\

const classPY = 'py-10 max-md:py-6'

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { article: slug } = await params

  const rawArticle = await getArticleBySlug(slug)

  if (!rawArticle) {
    notFound()
  }

  const { 
    article, 
    kratkoItems, 
    sectionBlocks, 
    usefulLinks, 
    relatedArticles, 
  } = transformArticle(rawArticle)

  return (
    <div className="container">
      <article>
        <HederArticle className={classPY} article={article} />

        {kratkoItems.length > 0 && (
          <KratkoArticle className={classPY} items={kratkoItems} />
        )}

        {sectionBlocks.length > 0 && (
          <>
            <NavigationArticle blocks={sectionBlocks} className={classPY} />
            <BodyArticle className={classPY} contentArticle={sectionBlocks} />
          </>
        )}

        {usefulLinks.length > 0 && (
          <UsefulArticle className={classPY} links={usefulLinks} />
        )}

        <NeedHelpArticle className={classPY} />

        {relatedArticles.length > 0 && (
          <RelatedArticles className={classPY} articles={relatedArticles} />
        )}
      </article>
    </div>
  )
}