import MealCard from "@/app/components/app-mealcard";


const options: {
  name: string,
  entrees: number,
  sides: number,
}[] = [{
  name: "Bowl", 
  entrees: 1, 
  sides: 2
}, {
  name: "Plate", 
  entrees: 2, 
  sides: 2
}, {
  name: "Bigger Plate", 
  entrees: 3, 
  sides: 2
}]

export default function Home() {
  return (
    <div className="grid grid-cols-5 gap-10 p-10 w-full">
        {options.map((item, i) => (
            <a href={`/home/build/${item.name}`} key={i}>
              <MealCard name={item.name} image="/images/image.png" key={i}/>
            </a>
        ))}
    </div>
  );
}