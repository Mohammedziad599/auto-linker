import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import GitHubJiraConfig from '@/github-jira-config.tsx'
import '@/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="auto-linker-ui-theme">
      <GitHubJiraConfig />
    </ThemeProvider>
  </StrictMode>,
)
