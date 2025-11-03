import classNames from "classnames"
import Image from "next/image"
import { StaticImport } from "next/dist/shared/lib/get-img-props"
import { useMemo } from "react"

import avatarImg from "@/assets/images/avatar.png"
import { Attachment } from "@/types/entities/attachment"
import { getAttachmentUrl } from "@/lib/get-attachment-url"

/* TODO: alt */

interface Props {
  className?: string
  src?: string | StaticImport | Attachment | null
}

export default function Avatar({ className, src: src_ }: Props) {
  const src = useMemo(() => {
    if (!src_) {
      return avatarImg
    } else if (typeof src_ === "string") {
      return src_
    } else if ("id" in src_) {
      return getAttachmentUrl(src_)
    } else {
      return src_
    }
  }, [src_])

  return (
    <Image
      className={classNames(className, "rounded-full")}
      src={src}
      width={300}
      height={300}
      alt="alt"
    />
  )
}
