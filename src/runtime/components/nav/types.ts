import type { BedtimeStory } from '../../../types/module'

export interface NavFolderData {
  title: string
  path: string
  folders: NavFolderData[]
  stories: BedtimeStory[]
}
