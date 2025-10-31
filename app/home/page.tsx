import MealCard from "../components/app-mealcard";

const options = ['orange chicken', 'bejing beef', 'tariyaki chicken', 'tacos', 'loaf of bread']

export default function Home() {
  return (
    <div className="grid grid-cols-5 gap-10 p-10 w-full">
        {options.map((item, i) => (
            <MealCard name={item} image="/images/image.png" key={i}/>
        ))}
    </div>
  );
}