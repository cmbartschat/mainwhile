import {Box, useInput, DOMElement} from 'ink'
import React from 'react'

interface IScrollView {
  children: React.ReactNode[]
}

const ScrollView: React.FC<IScrollView> = ({children}) => {
  const [_offset, setOffset] = React.useState(0)
  const offset = Math.max(0, _offset)
  const outerRef = React.useRef<DOMElement | null>(null)
  const innerRef = React.useRef<DOMElement | null>(null)

  const getMaxOffset = () => {
    const outerNode = outerRef.current?.yogaNode
    const innerNode = innerRef.current?.yogaNode
    if (!outerNode || !innerNode) {
      return undefined
    }

    return Math.max(
      0,
      innerNode.getComputedHeight() - outerNode.getComputedHeight(),
    )
  }

  const scroll = (delta: number) => {
    const maxOffset = getMaxOffset()
    if (!maxOffset) {
      return
    }
    setOffset(Math.max(0, Math.min(offset + delta, maxOffset)))
  }

  useInput(async (_, key) => {
    if (key.upArrow) {
      scroll(key.shift ? -10 : -1)
      return
    }

    if (key.downArrow) {
      scroll(key.shift ? 10 : 1)
      return
    }

    if (key.home) {
      setOffset(0)
    }
    if (key.pageUp) {
      scroll(-10)
    }

    if (key.pageDown) {
      scroll(10)
    }

    if (key.end) {
      scroll(Infinity)
    }
  })

  React.useLayoutEffect(() => {
    const maxOffset = getMaxOffset()
    if (!maxOffset) {
      return
    }
    if (offset > maxOffset) {
      setOffset(maxOffset)
    }
  })

  return (
    <Box ref={outerRef} flexDirection='column' overflow='hidden'>
      <Box
        ref={innerRef}
        marginTop={-offset}
        flexDirection='column'
        flexShrink={0}
        flexBasis={'auto'}
      >
        {children}
      </Box>
    </Box>
  )
}

export {ScrollView}
