import { Empty } from 'antd'
import ArticleCard from './ArticleCard.jsx'
import { useLanguage } from '../../context/LanguageContext.jsx'

export default function ArticleList({ articles, filter, onOpen, onAction, bookmarkedIds = [], shortcutIds = [], pinnedIds = [], onToggleBookmark, onToggleShortcut, onTogglePin, emptyDescription }) {
  const { t } = useLanguage()
  const visible = articles.filter((article) => filter === 'all' || article.status === filter)
  if (!visible.length) return <Empty className="list-empty" description={emptyDescription || t(filter === 'all' ? 'No articles yet' : 'No articles in this category')} />
  return <div className="article-list">{visible.map((article) => <ArticleCard key={article.id} article={article} onOpen={onOpen} onAction={onAction} isBookmarked={bookmarkedIds.includes(article.id)} isShortcut={shortcutIds.includes(article.id)} isPinned={pinnedIds.includes(article.id)} onToggleBookmark={onToggleBookmark} onToggleShortcut={onToggleShortcut} onTogglePin={onTogglePin} />)}</div>
}
