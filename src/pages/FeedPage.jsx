import { Link } from 'react-router-dom'
import { postService } from '../services/posts'
import PostList from '../components/posts/PostList'

export default function FeedPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h2 text-text-primary">Лента</h1>
        <Link to="/create" className="btn btn-filled">
          <i className="fas fa-plus mr-2"></i>
          Создать пост
        </Link>
      </div>
      
      <PostList fetchPosts={(page) => postService.getPosts(page)} />
    </div>
  )
}
