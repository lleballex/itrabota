"use client"

import {
  cloneElement,
  FocusEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  useRef,
} from "react"

import Popover from "@/components/ui/Popover"

interface TriggerProps {
  className?: string
  popoverTarget?: string
  onBlur?: (event: FocusEvent<HTMLElement>) => void
  onFocus?: (event: FocusEvent<HTMLElement>) => void
  onMouseEnter?: (event: MouseEvent<HTMLElement>) => void
  onMouseLeave?: (event: MouseEvent<HTMLElement>) => void
}

interface Props {
  className?: string
  content: ReactNode
  children: ReactElement<TriggerProps>
  position?: "center" | "left" | "right"
}

export default function Tooltip({
  className,
  content,
  children,
  position = "center",
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null)

  const showTooltip = () => {
    const node = contentRef.current

    if (!node || node.matches(":popover-open")) {
      return
    }

    node.showPopover()
  }

  const hideTooltip = () => {
    const node = contentRef.current

    if (!node || !node.matches(":popover-open")) {
      return
    }

    node.hidePopover()
  }

  const trigger = cloneElement(children, {
    onBlur: (event: FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(event)
      hideTooltip()
    },
    onFocus: (event: FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(event)
      showTooltip()
    },
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(event)
      showTooltip()
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(event)
      hideTooltip()
    },
  })

  return (
    <Popover.Root className={className} position={position}>
      <Popover.Trigger>
        {trigger}
      </Popover.Trigger>

      <Popover.Content
        ref={contentRef}
        className="max-w-[260px] px-2 py-1.5 text-sm leading-snug"
      >
        {content}
      </Popover.Content>
    </Popover.Root>
  )
}
