import { useState, useEffect, useCallback } from 'react'
import PostCard from './PostCard'

export default function PostList({ fetchPosts }) {
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const loadPosts = useCallback(async (pageNum) => {
    setIsLoading(true)
    try {
      const data = await fetchPosts(pageNum)
      if (pageNum === 1) {
        setPosts(data.results || [])
      } else {
        setPosts(prev => [...prev, ...(data.results || [])])
      }
      setHasMore(!!data.next)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [fetchPosts])

  useEffect(() => {
    loadPosts(1)
  }, [loadPosts])

  const handleLoadMore = () => {
    if (hasMore && !isLoading) {
      setPage(prev => prev + 1)
      loadPosts(page + 1)
    }
  }

  const handleDelete = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-pink border-t-transparent"></div>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-inbox text-4xl text-text-secondary mb-4"></i>
        <p className="text-text-secondary">Нет постов для отображения</p>
      </div>
    )
  }

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} onDelete={handleDelete} />
      ))}
      
      {hasMore && (
        <div className="text-center py-4">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="btn btn-outline"
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Загрузка...
              </>
            ) : (
              'Загрузить ещё'
            )}
          </button>
        </div>
      )}
    </div>
  )
}
