"use client";

import { ListWithCards } from "@/types";
import ListForm from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-form";
import { useEffect, useState } from "react";
import { ListItem } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/update-list-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/update-card-order";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  //rm from current position
  const [removed] = result.splice(startIndex, 1);
  //move to new position
  result.splice(endIndex, 0, removed);

  return result;
}

const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  //for optimistic update [improves user experience]
  //when data updated orderedData is updated with new data
  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    console.log("here", result);
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    //if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // user moves a list
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index }),
      );
      setOrderedData(items);

      //trigger server action
      executeUpdateListOrder({ items, boardId });
    }

    // User moves a card
    if (type === "card") {
      let newOrderedData = [...orderedData];
      // console.log("card", newOrderedData);

      //source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId,
      );
      // console.log("sourcelist", sourceList);
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId,
      );
      // console.log("destnList", destList);

      if (!sourceList || !destList) {
        return;
      }

      //check if cards exists on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }
      //check if cards exists on the destList
      if (!destList.cards) {
        destList.cards = [];
      }

      // moving card in then same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index,
        );

        //change order
        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });

        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);

        // TRIGGER SERVER ACTION to update card order
        executeUpdateCardOrder({ boardId: boardId, items: reorderedCards });
      } else {
        //if user moves card to another list

        //   1) rmove card from current list
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // assign new listId to the moved card
        movedCard.listId = destination.droppableId;

        //insert card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        //update the order the card on sourcelist
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        //update the order the card on sourcelist
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        // Trigger server action to update card in diff list
        executeUpdateCardOrder({
          boardId: boardId,
          items: destList.cards,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={"list"} type={"list"} direction={"horizontal"}>
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={"flex gap-x-3 h-full"}
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className={"flex-shrink-0 w-1"} />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
