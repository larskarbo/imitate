import { useCallback } from "react";
import { blobToArrayBuffer } from "./blobToAudioBuffer";
import { useDropzone } from "react-dropzone";
import decodeAudio from "audio-decode";
import { audioBufferToBlob } from "./audioBufferToBlob";

export const Uploader = ({ onAudio }: { onAudio: (blob: Blob) => void; }) => {
	const onDrop = useCallback(async (acceptedFiles) => {
		const file = acceptedFiles[0]!;

		const arrayBuffer = await blobToArrayBuffer(file);

		const audioBuffer = await decodeAudio(arrayBuffer);

		// const audioBufferCleaned = await trimSilence(audioBuffer);
		const newBlob = await audioBufferToBlob(audioBuffer);

		onAudio(newBlob);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		noClick: true,
	});

	return (
		<div
			{...getRootProps()}
			className="absolute top-0 left-0 w-full h-full "
			style={{
				// pointerEvents: "none",
			}}
		>
			<input {...getInputProps()} />
			{isDragActive ? <p>Drop the files here ...</p> : <p></p>}
		</div>
	);
};
