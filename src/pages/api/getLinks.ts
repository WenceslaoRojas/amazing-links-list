import { Client } from '@notionhq/client'

import type { Link } from '../../types'

// Get notion_key of env
const NOTION_KEY = import.meta.env.NOTION_KEY
const DATABASE_ID = import.meta.env.DATABASE_ID

async function getNotionData(): Promise<Link[]> {
  // Initializing a client
  const notion = new Client({
    auth: NOTION_KEY
  })

  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Show',
      checkbox: {
        equals: true
      }
    }
  })

  const links = response.results.map(page => {
    //@ts-ignore
    const image = page.properties?.Image.files[0].file.url
    //@ts-ignore
    const link = page.properties?.Link.url
    //@ts-ignore
    const title = page.properties?.Name.title[0].plain_text
    //@ts-ignore
    const description = page.properties?.Description?.rich_text[0].plain_text
    //@ts-ignore
    const category = page.properties.Category.multi_select[0].name

    return {
      id: page.id,
      image,
      link,
      title,
      description,
      category
    }
  })

  return links
}

export const LINKS: Link[] = await getNotionData()
