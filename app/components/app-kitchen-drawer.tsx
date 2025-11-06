"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { CarouselSpacing } from "./app-kitchen-carousel"

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]

export function DrawerDemo() {
  const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Kitchen</Button>
      </DrawerTrigger>
      <DrawerContent className="">
        <div className="mx-auto w-full">
          <DrawerHeader>
            <DrawerTitle>Kitchen</DrawerTitle>
            <DrawerDescription>Click Food To Cook</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0 flex justify-center pr-20 pl-20">
            <CarouselSpacing/>
          </div>
          <DrawerFooter>
            <DrawerClose asChild >
                <div className="flex justify-center">
                    <Button className="w-full max-w-sm">Close</Button>
                </div>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
