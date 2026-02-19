import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

interface Image {
	src: string;
	alt?: string;
}

interface ZoomParallaxProps {
	/** Array of images to be displayed in the parallax effect max 7 images */
	images: Image[];
}

/*
 * Per-image layout — mobile shows only 4 images with spread-out positions;
 * desktop (sm:) shows all 7 with tighter collage layout.
 */
const imageStyles: string[] = [
	/* 0 – centre hero (always visible) */
	'h-[22vh] w-[50vw] sm:h-[25vh] sm:w-[25vw]',
	/* 1 – top-right (always visible) */
	'-top-[18vh] left-[3vw] h-[14vh] w-[32vw] sm:-top-[30vh] sm:left-[5vw] sm:h-[30vh] sm:w-[35vw]',
	/* 2 – top-left (always visible) */
	'top-[4vh] -left-[20vw] h-[14vh] w-[28vw] sm:-top-[10vh] sm:-left-[25vw] sm:h-[45vh] sm:w-[20vw]',
	/* 3 – bottom-right (always visible) */
	'top-[20vh] left-[6vw] h-[12vh] w-[28vw] sm:top-0 sm:left-[27.5vw] sm:h-[25vh] sm:w-[25vw]',
	/* 4 – bottom-left (desktop only) */
	'hidden sm:block sm:top-[27.5vh] sm:left-[5vw] sm:h-[25vh] sm:w-[20vw]',
	/* 5 – far-left (desktop only) */
	'hidden sm:block sm:top-[27.5vh] sm:-left-[22.5vw] sm:h-[25vh] sm:w-[30vw]',
	/* 6 – small corner (desktop only) */
	'hidden sm:block sm:top-[22.5vh] sm:left-[25vw] sm:h-[15vh] sm:w-[15vw]',
];

export function ZoomParallax({ images }: ZoomParallaxProps) {
	const container = useRef(null);
	const { scrollYProgress } = useScroll({
		target: container,
		offset: ['start start', 'end end'],
	});

	/* Fade the entire sticky viewport to transparent near the end of the scroll
	   so the section dissolves instead of leaving a black gap. */
	const opacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 1, 0]);

	const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
	const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
	const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
	const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
	const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);

	const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

	return (
		<div ref={container} className="relative h-[150vh] sm:h-[180vh]">
			<motion.div
				style={{ opacity }}
				className="sticky top-0 h-screen overflow-hidden bg-black"
			>
				{images.map(({ src, alt }, index) => {
					const scale = scales[index % scales.length];
					const posClass = imageStyles[index] ?? imageStyles[0];

					return (
						<motion.div
							key={index}
							style={{ scale }}
							className="absolute top-0 flex h-full w-full items-center justify-center"
						>
							<div className={`relative ${posClass}`}>
								<img
									src={src || '/placeholder.svg'}
									alt={alt || `Parallax image ${index + 1}`}
									className="h-full w-full object-cover rounded-lg"
								/>
							</div>
						</motion.div>
					);
				})}
			</motion.div>
		</div>
	);
}
