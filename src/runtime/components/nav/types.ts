import type { BedtimeStory } from '../../../types/module'

export interface NavFolderData {
  folders: NavFolderData[]
  stories: BedtimeStory[]
  title: string
}
