import * as React from 'react'
import './AspectComp.css'

export function AspectComp({
	width,
	height,
	children,
}: React.PropsWithChildren<{
	width: number
	height: number
}>) {
	return (
		<div className='aspect'>
			<svg viewBox={`0 0 ${width} ${height}`} />
			{children}
		</div>
	)
}
