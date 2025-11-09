import { Order } from "@/lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CardContent } from "@/components/ui/card";
import { Button } from "./ui/button";
import { CardFooter } from "@/components/ui/card";

function KitchenOrderItem({ order }: { order: Order }) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Order {order.id}</CardTitle>
                <CardDescription>
                    {order.orderTime}
                </CardDescription>
                <CardContent>
                    <p>
                        Total Cost: {order.totalCost}
                    </p>
                </CardContent>
            </CardHeader>
            <CardFooter>
                <Button>
                    Complete Order
                </Button>
            </CardFooter>
        </Card>
    );
}

export default KitchenOrderItem;