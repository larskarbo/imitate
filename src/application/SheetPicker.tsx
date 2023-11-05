import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

export const SheetPicker = () => {
  const router = useRouter();
  const { data: sheets } = trpc.getSheets.useQuery();
  console.log("sheets: ", sheets);

  if (!sheets) {
    return null;
  }

  return (
    <ul className="flex  gap-4 mb-4">
      {sheets.map((sheet) => {
        let style = {};

        if (`/chamber/${sheet}` === router.asPath) {
          // Style for the current sheet.
          style = { fontWeight: "bold" };
        }

        return (
          <li key={sheet} style={style}>
            <a href={`/chamber/${sheet}`}>{sheet}</a>
          </li>
        );
      })}
    </ul>
  );
};
