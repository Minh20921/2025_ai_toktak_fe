import { DropIndicator } from './DropIndicator';
import { LoadingIndicator } from './LoadingIndicator';
import { ProductItem } from './ProductItem';
import { GroupItem } from './GroupItem';
import { ScrollTrigger } from './ScrollTrigger';
import { DragHandlers, FlatItem } from '@/app/(DashboardLayout)/profile-link/@type/interface';

interface TreeItemComponentProps {
  item: FlatItem;
  index: number;
  isDraggingOver: boolean;
  isDragging: boolean;
  handlers: DragHandlers;
}

export function TreeItemComponent({ item, index, isDraggingOver, isDragging, handlers }: TreeItemComponentProps) {
  // Render drop indicator
  if (item.type === 'drop-indicator') {
    return (
      <DropIndicator
        id={item.id}
        index={index}
        depth={item.depth}
        parentId={item.parentId}
        isDraggingOver={isDraggingOver}
        isGroupEnd={item.isGroupEnd}
        isLevelEnd={item.isLevelEnd}
        isDragging={isDragging}
      />
    );
  }

  // Render Loading indicator
  if (item.id.toString().startsWith('loading-')) {
    return <LoadingIndicator depth={item.depth} />;
  }

  // Render Scroll Trigger (invisible element that triggers load more)
  if (item.id.toString().startsWith('scroll-trigger-')) {
    const groupId = item.id.toString().replace('scroll-trigger-', '');
    return <ScrollTrigger groupId={groupId} depth={item.depth} onLoadMore={handlers.onLoadMore} />;
  }

  // Render Product item
  if (item.type === 'product') {
    return <ProductItem item={item} index={index} isDraggingOver={isDraggingOver} handlers={handlers} />;
  }

  // Render Group item
  return <GroupItem item={item} index={index} isDraggingOver={isDraggingOver} handlers={handlers} />;
}
