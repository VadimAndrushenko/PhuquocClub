import Collections from "@/dataPage/mainDataPage/SectonCollections"
import Hero from "@/dataPage/mainDataPage/SectonHero"
import Planning from "@/dataPage/mainDataPage/SectonPlanning"
import Popular from "@/dataPage/mainDataPage/SectonPopular"
import Urgent from "@/dataPage/mainDataPage/SectonUrgent"


const container = 'container '

export default function Home() {
  return (
    <div className="bg-background min-h-[calc(100vh-80px)]">
      <Hero className={container} />
      <Popular className={container} />
      <Planning className={container} />
      <Collections className={container} />
      <Urgent className={container} />
    </div>
  )
}
