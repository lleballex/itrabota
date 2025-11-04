import Separator from "@/components/ui/Separator"

interface Props {
  className?: string
}

export default function ProfileFormBlockSeparator({ className }: Props) {
  return <Separator className={className} type="horizontal" />
}
