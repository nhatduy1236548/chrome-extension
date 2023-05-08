import { Client } from '@notionhq/client'
import { useEffect, useState } from 'react'

export default function Home() {
  const [pageData, setPageData] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  async function saveBookmarkToNotion(bookmark) {
    // 1
    const notion = new Client({
      auth: process.env.NEXT_PUBLIC_NOTION_API_TOKEN,
    })
  
    try {
      // 2
      await notion.pages.create({
        parent: {
          database_id: process.env.NEXT_PUBLIC_NOTION_DATABASE_ID,
        },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: bookmark.title,
                },
              },
            ],
          },
          URL: {
            url: bookmark.url,
          },
          Tags: {
            multi_select: bookmark.tags,
          },
          Notes: {
            rich_text: [
              {
                text: {
                  content: bookmark.notes || '-',
                },
              },
            ],
          },
        },
      })
      return true
    } catch (error) {
      return false
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsSaving(true)
  
    // 1
    const data = new FormData(e.target)
    const bookmark = Object.fromEntries(data.entries())
  
    // 2
    bookmark.tags = bookmark.tags
      .split(',')
      .filter((tag) => tag.trim().length !== 0)
      .map((tag) => ({
        name: tag.trim(),
      }))
  
    // 3
    const result = await saveBookmarkToNotion(bookmark)
  
    // 4
    if (result) {
      setIsSaved(true)
    } else {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    // 1
    chrome.tabs &&
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // 2
        const url = tabs[0].url
        const title = tabs[0].title
        // 3
        setPageData({ url, title })
      })
  }, [])

  return (
    <div className="container mx-auto px-4">
      <div className="text-center my-8">
        <h1 className="text-4xl font-bold">Save to Notion Bookmarks</h1>
      </div>
      <div>
        {isSaved ? (
          <span className="text-green-500">Saved</span>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
              <input
                name="title"
                type="text"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">URL</label>
              <input
                name="url"
                type="url"
                required
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Languages</label>
              <input
                name="languages"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <small className="text-gray-500">Separate Languages with Commas</small>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Tags</label>
              <input
                name="tags"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <small className="text-gray-500">Separate Tags with Commas</small>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">Notes</label>
              <textarea
                name="notes"
                rows={3}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                disabled={                isSaving}
                className={`px-4 py-2 font-semibold text-white rounded ${
                  isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                }`}
              >
                {isSaving ? <span>Saving</span> : <span>Save</span>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

