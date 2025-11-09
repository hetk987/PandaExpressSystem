import { Order } from "@/lib/types";
import { useEffect, useState } from "react";

function KitchenPage() {
    const [openOrders, setOpenOrders] = useState<Order[]>([]);
    useEffect(() => {
        const fetchOpenOrders = async () => {
            const response = await fetch('/api/orders/incomplete');
            const data = await response.json();
            setOpenOrders(data);
        };
        fetchOpenOrders();
    }, []);
    
    return <div>KitchenPage</div>;
}

export default KitchenPage;