"use client";

import * as React from "react";
import { Cooked } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { KitchenCarousel } from "./app-kitchen-carousel";

export const KitchenDrawer = ({ cooked }: { cooked: Cooked[] }) => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="font-mono border-2 border-black hover:bg-black hover:text-white transition-all"
        >
          Open Kitchen
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-white border-t-2 border-black">
        <div className="mx-auto w-full max-w-6xl">
          <DrawerHeader className="text-center space-y-1">
            <DrawerTitle className="text-2xl font-mono font-bold">
              Kitchen Controls
            </DrawerTitle>
            <DrawerDescription className="text-gray-600 font-mono text-sm">
              Click an item below to cook it
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-6">
            <KitchenCarousel cooked={cooked} />
          </div>

          <DrawerFooter className="border-t border-gray-300 mt-4">
            <DrawerClose asChild>
              <div className="flex justify-center">
                <Button className="w-full max-w-sm font-mono bg-black text-white hover:bg-gray-800 transition-all">
                  Close
                </Button>
              </div>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
