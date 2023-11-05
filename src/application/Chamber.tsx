import { random, range, throttle } from "lodash";
import { ITEMBOX_HEIGHT, Region } from "./PlaybackBoat";

import { atom, useAtom } from "jotai";
import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import { ItemBox } from "./ItemBox";
import { SheetPicker } from "./SheetPicker";
import { trpc } from "../utils/trpc";
import { useCallback, useEffect, useState } from "react";
import { Item } from "../server/routers/appRouter";
import { Button } from "./RecordBoat";

const ResponsiveGridLayout = WidthProvider(Responsive);

export function Chamber({ namespace }: { namespace: string }) {
  const context = trpc.useContext();
  const { data: fetchedItems } = trpc.getItems.useQuery({
    sheetNamespace: namespace,
  });

  const [items, setItems] = useAtom(itemsAtom);

  useEffect(() => {
    if (!fetchedItems) return;

    if (items) {
      console.log("Don't fetch... already here");
      return;
    }

    setItems(fetchedItems);
  }, [fetchedItems, items]);

  const { mutate: saveItems } = trpc.saveItems.useMutation({
    onSuccess: () => {
      context.getItems.invalidate();
    },
  });

  const maxY = Math.max(
    ...(items?.map((item) => item.dataGrid.y + item.dataGrid.h) || [0]),
    3
  );

  const unfilledSquares = range(0, maxY)
    .map((y) => {
      return range(0, 4).map((x) => {
        const item = items?.find(
          (item) => item.dataGrid.x === x && item.dataGrid.y === y
        );
        if (item) return null;
        return { x, y };
      });
    })
    .flat()
    .filter(Boolean) as { x: number; y: number }[];

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  // useEffects that disables text select on resize
  useEffect(() => {
    if (isResizing) {
      document.body.classList.add("disable-select");
    } else {
      document.body.classList.remove("disable-select");
    }
  }, [isResizing]);

  // Throttled saveItems
  const throttledSaveItems = useCallback(
    throttle((items, namespace) => {
      saveItems({ items: items, sheetNamespace: namespace });
    }, 5000),
    []
  );

  useEffect(() => {
    if (!items) return;

    throttledSaveItems(items, namespace);
  }, [items, namespace, throttledSaveItems]);

  return (
    <div className="flex flex-col items-center bg-gradient-to-tr from-gray-100 pt-0 to-yellow-50 min-h-screen w-full">
      <SheetPicker />
      <ResponsiveGridLayout
        draggableHandle=".drag-handle"
        className="layout w-full  "
        breakpoints={{ lg: 0 }}
        cols={{ lg: 4 }}
        compactType={null}
        rowHeight={ITEMBOX_HEIGHT}
        isResizable={true}
        resizeHandles={["se"]}
        isDraggable={true}
        onDragStart={() => {
          setIsDragging(true);
        }}
        onDragStop={() => {
          setIsDragging(false);
        }}
        onResizeStart={() => {
          setIsResizing(true);
        }}
        onResizeStop={() => {
          setIsResizing(false);
        }}
        onLayoutChange={(layouts) => {
          if (!items) return;
          setItems(
            items.map((item) => {
              const layout = layouts.find((l) => l.i === item.id)!;
              return { ...item, dataGrid: layout };
            })
          );
        }}
        preventCollision
      >
        {items?.map((item, i) => (
          <div key={item.id} data-grid={item.dataGrid}>
            <button className="drag-handle absolute top-0 left-0 bg-white z-50">
              drag
            </button>
            <ItemBox
              item={item}
              id={item.id}
              onDelete={() => {
                setItems(items!.filter((i) => i.id !== item.id));
              }}
              setItem={(newItem) => {
                setItems((items) => {
                  const newItems = items!.map((it) => {
                    if (it.id === item.id) {
                      return {
                        ...it,
                        ...newItem,
                      };
                    }
                    return it;
                  });
                  return newItems;
                });
              }}
            />
          </div>
        ))}
        {!isDragging &&
          !isResizing &&
          unfilledSquares.map((square) => (
            <div
              key={`${square.x}-${square.y}`}
              data-grid={
                {
                  x: square.x,
                  y: square.y,
                  w: 1,
                  h: 1,
                  isResizable: false,
                  isDraggable: false,
                } satisfies Omit<Layout, "i">
              }
              className=" w-full h-full group flex items-center justify-center"
            >
              <Button
                className="opacity-0 group-hover:opacity-50"
                onClick={() => {
                  setItems([
                    ...(items || []),
                    {
                      id: `${random(0, 100000)}`,
                      dataGrid: {
                        x: square.x,
                        y: square.y,
                        w: 1,
                        h: 1,
                      },
                    },
                  ]);
                }}
              >
                +
              </Button>
            </div>
          ))}
      </ResponsiveGridLayout>
      <div className="pt-64"> </div>
    </div>
  );
}

export const recordingCountAtom = atom(0);

export const lastRegionAtom = atom(
  null as {
    region: Region;
    blobUrl: string;
    isRecording: boolean;
  } | null
);

export const focusedItemAtom = atom(null as string | null);

export const itemsAtom = atom(null as Item[] | null);
