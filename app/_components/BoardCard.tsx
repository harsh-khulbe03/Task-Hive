import Link from 'next/link';
import { Board } from '@/types';

type BoardCardProps = {
  board: Board;
};

export default function BoardCard({ board }: BoardCardProps) {
  return (
    <Link
      href={`/boards/${board.id}`}
      className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-50"
    >
      <h3 className="text-xl font-semibold text-gray-900">{board.name}</h3>
      <p className="text-sm text-gray-500 mt-2">
        Created: {new Date(board.createdAt).toLocaleDateString()}
      </p>
    </Link>
  );
}