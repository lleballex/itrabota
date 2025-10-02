import classNames from "classnames"
import Image from "next/image"

import avatarImg from "@/assets/images/avatar.png"

interface Props {
  className?: string
  src?: string | null
}

export default function Avatar({ className, src }: Props) {
  return (
    <Image
      className={classNames(className, "rounded-full")}
      src={src ?? avatarImg}
      width={300}
      height={300}
    />
  )
}
