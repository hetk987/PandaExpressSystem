"use client"

import * as React from "react"
import { Cooked, Recipe } from "@/lib/types"

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
import { KitchenCarousel } from "./app-kitchen-carousel"

export const KitchenDrawer = (props: {
    cooked: Cooked[]
}) => {
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
            <KitchenCarousel cooked={props.cooked}/>
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
