import MealCard from "../components/app-mealcard";

const options: {
  href: string,
  title: string
}[] = [
  {href: 'build', title: 'Build Your Own'},
  {href: 'appetizer', title: 'Appetizers'},
  {href: 'drink', title: 'Drinks'},
  {href: 'entree', title: 'Entrees'},
  {href: 'side', title: 'Sides'}
]

export default function Home() {
  return (
    <div className="grid grid-cols-5 gap-10 p-10 w-full">
        {options.map((item, i) => (
            <a href={`/home/${item.href}`} key={i}>
              <MealCard name={item.title} image="/images/image.png" key={i}/>
            </a>
        ))}
    </div>
  );
}