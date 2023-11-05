import type { JSONContent } from "@tiptap/core";
import clsx from "clsx";
import Tiptap, { textToDoc } from "./TipTap";
import { isString } from "lodash";
import useKeypress from "./utils/useKeyPress";

export const Text = ({
	text, onTextChange, hasRecording, onFocus,

}: {
	text: string | JSONContent;
	onTextChange: (text: JSONContent | null) => void;
	hasRecording: boolean;
	onFocus: () => void;
}) => {
	return (
		<div
			className={clsx(
				"absolute bottom-0 right-0 top-0 left-0  p-2  font-serif flex justify-center ",
				hasRecording ? "pb-4 items-end " : "items-start",
				" w-full "
			)}
		>
			<Tiptap
				onFocus={onFocus}
				initialValue={isString(text) ? textToDoc(text) : text}
				onChange={(newDoc) => {
					console.log("newDoc: ", newDoc);
					onTextChange(newDoc);
				}} />
		</div>
	);
};
