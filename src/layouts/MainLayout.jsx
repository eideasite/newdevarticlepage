import { useState } from 'react'
import { Alert, Button, Card, Drawer, Layout, Menu, Typography } from 'antd'
import { BookOutlined, CloseOutlined, ExportOutlined, FileTextOutlined, ReloadOutlined, RobotOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons'
import AppHeader from '../components/common/AppHeader.jsx'
import LoadingState from '../components/common/LoadingState.jsx'
import { useConnectivityStatus } from '../hooks/useConnectivityStatus.js'
import { useLanguage } from '../context/LanguageContext.jsx'

const { Content, Sider } = Layout
const navItems = [
  { key: 'compose', icon: <FileTextOutlined />, label: 'Write a Post' },
  { key: 'write-article', icon: <FileTextOutlined />, label: 'Write an Article' },
  { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
  { key: 'editor', icon: <FileTextOutlined />, label: 'Article Editor' },
  { key: 'seo', icon: <SettingOutlined />, label: 'SEO Settings' },
  { key: 'published', icon: <FileTextOutlined />, label: 'Published Post' },
  { key: 'articles', icon: <FileTextOutlined />, label: 'Articles Management' },
  { key: 'bookmarks', icon: <BookOutlined />, label: 'Bookmarks' },
  { key: 'external-ai-tools', icon: <RobotOutlined />, label: 'External AI tools' },
]

export default function MainLayout({ page, onNavigate, saveStatus, workspaceRecoveryState, onDownloadRecoveryCopy, themeMode, onThemeChange, language, onLanguageChange, profile, onLock, onSignOut, children }) {
  const { t } = useLanguage()
  const { online, showRestored, checkConnection, checkResult, networkEstimate, liveSpeedTest, refreshingEstimate, refreshNetworkEstimate } = useConnectivityStatus()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [aiSupportOpen, setAiSupportOpen] = useState(false)
  const estimateType = {
    'slow-2g': t('Very slow (slow 2G estimate)'),
    '2g': t('Slow (2G estimate)'),
    '3g': t('Moderate (3G estimate)'),
    '4g': t('Faster (4G-class estimate)'),
  }[networkEstimate.effectiveType]
  const isSlowConnection = ['slow-2g', '2g', '3g'].includes(networkEstimate.effectiveType)
  const networkDetails = [
    estimateType ? { kind: 'connection', label: estimateType } : null,
    networkEstimate.downlink ? { kind: 'downlink', label: `${t('Estimated downlink')} ${networkEstimate.downlink} Mbps` } : null,
    networkEstimate.rtt ? { kind: 'latency', label: `${t('Estimated latency')} ${networkEstimate.rtt} ms` } : null,
  ].filter(Boolean)
  const liveTestMetrics = liveSpeedTest?.status === 'success' ? [
    { kind: 'downlink', label: `${t('Download speed')} ${liveSpeedTest.downloadMbps} Mbps` },
    { kind: 'latency', label: `${t('Latency to test server')} ${liveSpeedTest.latencyMs} ms` },
  ] : []
  const selectPage = (key) => {
    if (key === 'external-ai-tools') setAiSupportOpen(true)
    else onNavigate(key)
    setMobileNavOpen(false)
  }
  const menu = <Menu mode="inline" selectedKeys={[page === 'published' ? 'articles' : page]} items={navItems.map((item) => ({ ...item, label: t(item.label) }))} onClick={({ key }) => selectPage(key)} />
  const saveMessage = saveStatus === 'conflict'
    ? t('Another tab changed this workspace. Saving here is paused to protect its newer data.')
    : saveStatus === 'error' ? t('Could not save') : saveStatus === 'saving' ? <LoadingState /> : t('Saved in this browser')
  const renderSupportPanel = (headingId) => (
    <Card className="external-ai-support-card" aria-labelledby={headingId}>
      <div className="external-ai-support-heading-row">
        <Typography.Title id={headingId} level={5}><RobotOutlined /> {t('External AI tools')}</Typography.Title>
        <Button type="text" icon={<CloseOutlined />} aria-label={t('Close external AI tools panel')} onClick={() => setAiSupportOpen(false)} />
      </div>
      <Typography.Paragraph type="secondary">{t('These services operate separately from your writing workspace. This app does not send drafts or article content when you open a tool.')}</Typography.Paragraph>
      <Button className="external-ai-support-link" block href="https://www.google.com/ai" target="_blank" rel="noopener noreferrer" icon={<ExportOutlined />}>
        {t('Open Google AI in a new tab')}
      </Button>
      <Typography.Text className="external-ai-support-note" type="secondary">{t('Google controls its sign-in and availability. You can return to this tab at any time.')}</Typography.Text>
    </Card>
  )

  return (
    <Layout className="app-layout">
      <Sider className="app-sider" width={232} breakpoint="lg" collapsedWidth={0}>
        <div className="sider-brand"><span className="brand-mark">ஜெ</span><div><strong>Jeyamohan</strong><Typography.Text type="secondary">{t('Articles')}</Typography.Text></div></div>
        {menu}
        <div className={`sider-note sider-note-${saveStatus}`} role="status"><span className={`storage-indicator ${saveStatus}`} />{saveMessage}</div>
      </Sider>
      <Layout className="app-main-layout">
        <AppHeader onOpenMenu={() => setMobileNavOpen(true)} themeMode={themeMode} onThemeChange={onThemeChange} language={language} onLanguageChange={onLanguageChange} profile={profile} onNavigate={onNavigate} onLock={onLock} onSignOut={onSignOut} />
        <Content className="app-content">
          {workspaceRecoveryState === 'saved' && <Alert className="workspace-recovery-notice" type="warning" showIcon message={t('A recovery copy of damaged workspace data was preserved in this browser.')} description={t('The app loaded a safe working copy. Download the recovery copy before reviewing or clearing browser data.')} action={<Button onClick={onDownloadRecoveryCopy}>{t('Download recovery copy')}</Button>} />}
          {workspaceRecoveryState === 'blocked' && <Alert className="workspace-recovery-notice" type="error" showIcon message={t('Workspace data could not be saved safely.')} description={t('A recovery copy could not be stored in this browser. Download the original workspace data and do not clear browser data.')} action={<Button onClick={onDownloadRecoveryCopy}>{t('Download recovery data')}</Button>} />}
          {saveStatus === 'conflict' && <Alert className="workspace-recovery-notice" type="warning" showIcon message={t('Another tab changed this workspace.')} description={t('Saving in this tab is paused to protect the newer data. Copy any unsaved text before reloading this page.')} />}
          {!online && <Alert
            className="connectivity-status connectivity-offline"
            banner
            showIcon
            type="warning"
            role="status"
            message={t('You appear to be offline.')}
            description={<div className="connectivity-action-row">
              <span>
                {t('You can keep editing local content. Internet-dependent actions may fail; browser storage determines whether changes save successfully.')}
                {checkResult && <><br /><strong>{t(checkResult)}</strong></>}
              </span>
              <Button className="connectivity-check-button" icon={<ReloadOutlined />} onClick={checkConnection}>{t('Check connection')}</Button>
            </div>}
          />}
          {online && <Alert
            className={`connectivity-status network-estimate-status${isSlowConnection ? ' network-estimate-slow' : ''}`}
            banner
            showIcon
            type={isSlowConnection ? 'warning' : 'info'}
            role="status"
            message={liveSpeedTest?.status === 'success'
              ? t('Live speed test result')
              : liveSpeedTest?.status === 'running'
                ? t('Testing connection...')
                : liveSpeedTest?.status === 'error'
                  ? t('Live speed test unavailable')
                  : networkEstimate.supported
                    ? isSlowConnection ? t('Your connection may be slow.') : t('Network status')
                    : t('Network speed estimate unavailable')}
            description={<div className="connectivity-action-row">
              <span>
                {liveSpeedTest?.status === 'running'
                  ? t('Measuring latency and download speed from Cloudflare. No article text is sent.')
                  : liveSpeedTest?.status === 'success'
                    ? <>
                      <span className="network-estimate-metrics">
                        {liveTestMetrics.map(({ kind, label }) => <span key={kind} className={`network-estimate-pill network-estimate-pill-${kind}`}>{label}</span>)}
                      </span>
                      <small className="network-estimate-note">{t('Measured from Cloudflare; a 2 MB sample was downloaded. No article text is sent.')}</small>
                    </>
                    : liveSpeedTest?.status === 'error'
                      ? <>
                        {t(liveSpeedTest.message)}
                        {networkDetails.length > 0 && <span className="network-estimate-metrics">
                          {networkDetails.map(({ kind, label }) => <span key={kind} className={`network-estimate-pill network-estimate-pill-${kind}`}>{label}</span>)}
                        </span>}
                      </>
                      : networkEstimate.supported
                  ? <>
                    {networkDetails.length ? <span className="network-estimate-metrics">
                      {networkDetails.map(({ kind, label }) => <span key={kind} className={`network-estimate-pill network-estimate-pill-${kind}`}>
                        {label}
                      </span>)}
                    </span> : t('Browser network estimate unavailable.')}
                    <small className="network-estimate-note">{t('Approximate browser estimate. Run a live test using Cloudflare; up to 2 MB is downloaded. No article text is sent.')}</small>
                  </>
                  : <>
                    {t('Browser network estimate unavailable.')}
                    <small className="network-estimate-note">{t('Run a live test using Cloudflare; up to 2 MB is downloaded. No article text is sent.')}</small>
                  </>}
              </span>
              <Button className="connectivity-check-button" icon={<ReloadOutlined />} loading={refreshingEstimate} disabled={refreshingEstimate} onClick={refreshNetworkEstimate}>{t(refreshingEstimate ? 'Testing connection...' : 'Run speed test')}</Button>
            </div>}
          />}
          {online && showRestored && <Alert className="connectivity-status connectivity-restored" banner showIcon type="success" role="status" message={t('The browser reports that a connection is available again.')} description={t('This does not confirm that every online service is reachable.')} />}
          {aiSupportOpen && <section className="external-ai-support-inline" aria-label={t('External AI tools panel')}>{renderSupportPanel('external-ai-support-mobile-heading')}</section>}
          {children}
        </Content>
      </Layout>
      {aiSupportOpen && <aside className="external-ai-support-sidebar" aria-label={t('External AI tools panel')}>{renderSupportPanel('external-ai-support-desktop-heading')}</aside>}
      <Drawer title="Jeyamohan Articles" open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} placement="left" width={280}>{menu}</Drawer>
    </Layout>
  )
}
