import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Edit2, Trash2, Github, Bug, ExternalLink, Settings } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Configuration } from "@/types/configuration"
import useConfiguration from "@/components/hooks/use-configuration"
import { TypographyInlineCode, TypographyMuted, TypographyP } from "@/components/ui/typography"
import { ModeToggle } from "@/components/ui/mode-toggle"

const getJiraUrl = (url: string) => {
  const hasTicketKeyPlaceholder = url.includes('{{Ticket}}');

  if (!hasTicketKeyPlaceholder) {
    return `${url}${url.endsWith('/') ? '' : '/'}{{Ticket}}`;
  }

  return url;
}

export default function GitHubJiraConfig() {
  const { configurations, addConfig, deleteConfig, updateConfig } = useConfiguration()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingConfig, setEditingConfig] = useState<Configuration | null>(null)
  const [formData, setFormData] = useState({
    githubUsername: "",
    repositoryName: "",
    regexPattern: "",
    jiraUrl: "",
  })

  const resetForm = () => {
    setFormData({
      githubUsername: "",
      repositoryName: "",
      regexPattern: "",
      jiraUrl: "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const configuration: Configuration = {
      id: "",
      createdAt: Date.now(),
      githubUsername: formData.githubUsername.trim(),
      repositoryName: formData.repositoryName.trim(),
      regexPattern: formData.regexPattern.trim(),
      jiraUrl: formData.jiraUrl.trim(),
    };

    if (editingConfig) {
      // Update existing configuration

      updateConfig(editingConfig.id, configuration);
      setEditingConfig(null)
    } else {
      // Add new configuration
      addConfig(configuration);
    }

    resetForm()
    setIsAddDialogOpen(false)
  }

  const handleEdit = (config: Configuration) => {
    setEditingConfig(config)
    setFormData({
      githubUsername: config.githubUsername,
      repositoryName: config.repositoryName,
      regexPattern: config.regexPattern,
      jiraUrl: config.jiraUrl,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteConfig(id);
  }

  const validateUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const isFormValid = () => {
    return (
      formData.githubUsername.trim() !== "" &&
      formData.repositoryName.trim() !== "" &&
      formData.regexPattern.trim() !== "" &&
      formData.jiraUrl.trim() !== "" &&
      validateUrl(formData.jiraUrl)
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">GitHub-Jira Integration</h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Configure repositories to automatically link pull requests to Jira tickets
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    resetForm()
                    setEditingConfig(null)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Configuration
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingConfig ? "Edit Configuration" : "Add New Configuration"}</DialogTitle>
                  <DialogDescription>
                    Configure a GitHub repository to link pull requests with Jira tickets using regex patterns.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="githubUsername">GitHub Username</Label>
                      <Input
                        id="githubUsername"
                        placeholder="e.g. torvalds"
                        value={formData.githubUsername}
                        onChange={(e) => setFormData((prev) => ({ ...prev, githubUsername: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="repositoryName">Repository Name</Label>
                      <Input
                        id="repositoryName"
                        placeholder="e.g. linux"
                        value={formData.repositoryName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, repositoryName: e.target.value }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="regexPattern">Regex Pattern</Label>
                    <Textarea
                      id="regexPattern"
                      placeholder="e.g. ^[A-Z]+-\d+"
                      value={formData.regexPattern}
                      onChange={(e) => setFormData((prev) => ({ ...prev, regexPattern: e.target.value }))}
                      className="font-mono text-sm"
                      rows={3}
                      required
                    />
                    <TypographyP>
                      <TypographyMuted>Regular expression to match Jira ticket IDs in PR titles</TypographyMuted>
                    </TypographyP>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jiraUrl">Jira Base URL</Label>
                    <Input
                      id="jiraUrl"
                      type="url"
                      placeholder="https://your-company.atlassian.net/browse/{{Ticket}}"
                      value={formData.jiraUrl}
                      onChange={(e) => setFormData((prev) => ({ ...prev, jiraUrl: e.target.value }))}
                      required
                    />
                    <TypographyP>
                      <TypographyMuted>
                        Use <TypographyInlineCode>{'{{'}Ticket{'}}'}</TypographyInlineCode> to specify where the ticket key should go,
                        otherwise ticket wil be added to the end of the url
                      </TypographyMuted>
                    </TypographyP>
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={!isFormValid()}>
                      {editingConfig ? "Update" : "Add"} Configuration
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <ModeToggle />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="h-7 w-7 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Total Configurations</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{configurations.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Github className="h-7 w-7 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Repositories</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {new Set(configurations.map((c) => `${c.githubUsername}/${c.repositoryName}`)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Bug className="h-7 w-7 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Jira Instances</p>
                  <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {new Set(configurations.map((c) => c.jiraUrl)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configurations List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Configurations</h2>

          {configurations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Settings className="h-15 w-15 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">No configurations yet</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  Add your first GitHub repository configuration to start linking pull requests with Jira tickets.
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Configuration
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {configurations.map((config) => (
                <Card key={config.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Github className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">
                            {config.githubUsername}/{config.repositoryName}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {getJiraUrl(config.jiraUrl)}
                          </CardDescription>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(config)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Configuration</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this configuration? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(config.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                          Regex Pattern
                        </Label>
                        <div className="mt-1 p-2 bg-neutral-50 dark:bg-neutral-950 rounded-md">
                          <code className="text-sm font-mono text-neutral-800 dark:text-neutral-200">{config.regexPattern}</code>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex items-center justify-between text-sm text-neutral-500">
                        <span>Created {new Date(config.createdAt)?.toLocaleDateString?.()}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                          Active
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
