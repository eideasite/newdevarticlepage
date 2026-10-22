import { Button, Space, Typography } from 'antd'
import ArticleStatusTag from '../common/ArticleStatusTag.jsx'
import ArticleActionsMenu from './ArticleActionsMenu.jsx'
import { BookFilled, BookOutlined, PushpinFilled, PushpinOutlined, StarFilled, StarOutlined } from '@ant-design/icons'
import { getArticleExcerpt, getArticleTitle } from '../../utils/article.js'
import { formatDate } from '../../utils/formatDate.js'
import { useLanguage } from '../../context/LanguageContext.jsx'

const { Title, Text, Paragraph } = Typography

export default function ArticleCard({ article, onOpen, onAction, isBookmarked, isShortcut, isPinned, onToggleBookmark, onToggleShortcut, onTogglePin }) {
  const { t, language } = useLanguage()
  return (
    <article className="article-row">
      <Button type="text" className="article-row-main" aria-label={t('Open article')} onClick={() => onOpen(article)}>
        <div className="article-row-title"><Title level={5}>{getArticleTitle(article)}</Title><ArticleStatusTag status={article.status} /></div>
        <Paragraph ellipsis={{ rows: 2 }} type="secondary">{getArticleExcerpt(article.body) || t('Article body has not been added yet.')}</Paragraph>
        <Text className="article-row-date" type="secondary">{t('Updated:')} {formatDate(article.updatedAt, undefined, language === 'ta' ? 'ta-LK' : 'en-US')}</Text>
      </Button>
      <Space className="article-row-actions" wrap>
        {onTogglePin && <Button type={isPinned ? 'primary' : 'default'} icon={isPinned ? <PushpinFilled /> : <PushpinOutlined />} aria-label={t(isPinned ? 'Unpin article' : 'Pin article')} aria-pressed={isPinned} title={t(isPinned ? 'Unpin article' : 'Pin article')} onClick={() => onTogglePin(article)}>{t(isPinned ? 'Pinned' : 'Pin')}</Button>}
        {onToggleBookmark && <Button type={isBookmarked ? 'primary' : 'default'} icon={isBookmarked ? <BookFilled /> : <BookOutlined />} aria-label={t(isBookmarked ? 'Remove bookmark' : 'Bookmark article')} aria-pressed={isBookmarked} title={t(isBookmarked ? 'Remove bookmark' : 'Bookmark article')} onClick={() => onToggleBookmark(article)}>{t(isBookmarked ? 'Bookmarked' : 'Bookmark')}</Button>}
        {onToggleShortcut && <Button type={isShortcut ? 'primary' : 'default'} icon={isShortcut ? <StarFilled /> : <StarOutlined />} aria-label={t(isShortcut ? 'Remove home shortcut' : 'Add to Home Shortcuts')} aria-pressed={isShortcut} title={t(isShortcut ? 'Remove home shortcut' : 'Add to Home Shortcuts')} onClick={() => onToggleShortcut(article)}>{t(isShortcut ? 'In shortcuts' : 'Add shortcut')}</Button>}
        <Button onClick={() => onOpen(article)}>{t(article.status === 'published' ? 'View article' : 'Open article')}</Button>
        {onAction && <ArticleActionsMenu article={article} onAction={onAction} />}
      </Space>
    </article>
  )
}
