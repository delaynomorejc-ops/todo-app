import type { TodoItem, Action } from '../types'
import { TodoNode } from './TodoNode'
import { AddItemRow } from './AddItemRow'

interface Props {
  items: TodoItem[]
  dispatch: React.Dispatch<Action>
  selectedId: string | null
  onSelect: (id: string) => void
}

export function TodoTree({ items, dispatch, selectedId, onSelect }: Props) {
  return (
    <div>
      {items.map(item => (
        <TodoNode
          key={item.id}
          item={item}
          depth={0}
          dispatch={dispatch}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      ))}
      <AddItemRow
        depth={0}
        placeholder="Add item…"
        onAdd={text => dispatch({ type: 'ADD', parentId: null, text })}
      />
    </div>
  )
}
