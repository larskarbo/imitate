import {
	AbsoluteFill,
	Img,
	interpolate,
	Sequence,
	spring,
	useCurrentFrame,
	useVideoConfig,
	Video,
} from 'remotion';
import litVideo from '../../scripts/content-script/out-explains/sound-lit-explain.mp4';
// import eiffel from './eiffel.svg';
import eiffel from './croissant.svg';
import './font.css';
import rec from './rec.mp4';
import './tailwind.min.css';

export const HelloWorld: React.FC<{
	titleText: string;
	titleColor: string;
}> = ({titleText, titleColor}) => {
	const frame = useCurrentFrame();
	const videoConfig = useVideoConfig();
	const videoDuration = 1260;

	const opacity = interpolate(
		frame,
		[videoDuration - 25, videoDuration - 15],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const transitionStart = 60;

	const shitDuration = 300;
	const fade = interpolate(
		frame,
		[0, transitionStart, transitionStart + 10, shitDuration, shitDuration + 10],
		[0, 0, 1, 1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);

	const transOut = interpolate(
		spring({
			frame: frame - shitDuration,
			fps: videoConfig.fps,
			config: {
				damping: 100,
				mass: 0.5,
			},
		}),
		[0, 1],
		[0, 150],
		{
			// extrapolateLeft: 'clamp',
			// extrapolateRight: 'clamp',
		}
	);

	const translationIn = interpolate(
		spring({
			frame: frame - transitionStart,
			fps: videoConfig.fps,
			config: {
				damping: 100,
				mass: 0.5,
			},
		}),
		[0, 1],
		[150, 0]
	);

	const translation = frame < 50 ? translationIn : transOut;

	return (
		<div style={{flex: 1, backgroundColor: 'white'}}>
			<div style={{opacity}}>
				<Sequence from={0} durationInFrames={videoDuration}>
					<Video src={litVideo} />
				</Sequence>
				<Sequence from={0} durationInFrames={videoDuration}>
					<AbsoluteFill
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'flex-end',
						}}
					>
						<div
							style={{
								height: '25%',
								width: '80%',
								background: '#FBF9EF',
								borderRadius: 10,
								marginBottom: '5%',
								opacity: fade,
								transform: `translateY(${transOut}px)`,
							}}
							className="flex items-center shadow-2xl"
						>
							<div className="h-full py-16 ml-12 mr-16">
								<Img className="h-full" src={eiffel} />
							</div>
							<div className="w-full pr-16">
								<div
									style={{
										fontSize: 80,
									}}
									className="font-bold"
								>
									[i] - lit
								</div>
								<div
									style={{
										fontSize: 40,
									}}
									className="font-light mt-2 flex justify-between"
								>
									<div>Sound 1/13 - French Pronunciation Basics 🇫🇷</div>
									<div className="text-gray-00">imita.io</div>
								</div>
							</div>
						</div>
					</AbsoluteFill>
				</Sequence>
			</div>
			<Sequence from={videoDuration - 30} durationInFrames={Infinity}>
				<AbsoluteFill
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: '#FBF9EF',
						opacity: 1 - opacity,
					}}
				>
					<div className="text-center flex flex-col gap-8">
						<div className="text-4xl font-light">check out</div>
						<div className="text-7xl font-bold">
							French Pronunciation Basics 🇫🇷
						</div>
						<div className="text-4xl font-light">on imita.io</div>
					</div>
					<Video
						src={rec}
						style={{
							width: 1000,
						}}
						className="border-2 rounded overflow-hidden border-gray-400 mt-16"
					/>
				</AbsoluteFill>
			</Sequence>
		</div>
	);
};
