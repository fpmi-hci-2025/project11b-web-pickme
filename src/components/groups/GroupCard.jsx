import { Link } from 'react-router-dom'

export default function GroupCard({ group, onDelete }) {
  return (
    <div className="card flex items-center justify-between">
      <Link
        to={`/groups/${group.id}`}
        className="flex-1 hover:opacity-80"
      >
        <h3 className="text-h5 text-text-primary">{group.name}</h3>
        <p className="text-body2 text-text-secondary">
          {group.members_count} {group.members_count === 1 ? 'участник' : 'участников'}
        </p>
      </Link>
      
      <div className="flex gap-2">
        <Link
          to={`/groups/${group.id}`}
          className="p-2 text-primary-pink hover:bg-background-light rounded"
        >
          <i className="fas fa-cog"></i>
        </Link>
        <button
          onClick={() => onDelete(group.id)}
          className="p-2 text-red-400 hover:bg-red-50 rounded"
        >
          <i className="fas fa-trash"></i>
        </button>
      </div>
    </div>
  )
}
