import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

type Meal = {
    idMeal: string
    strMeal: string
    strArea: string | null
    strCategory: string
    strMealThumb: string
}



function DiscoverPage() {
    const [meals, setMeals] = useState<Meal[]>([])
    const [category, setCategory] = useState('All')

    useEffect(() => {
        const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

        const requests = letters.map((letter) =>
            axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        )

        Promise.all(requests)
            .then((responses) => {
                const allMeals = responses.flatMap(
                    (response) => response.data.meals || []
                )

                setMeals(allMeals)
            })
            .catch((error) => {
                console.error('Error fetching meals:', error)
            })
    }, [])

    const categories = [
        'All',
        'Beef',
        'Chicken',
        'Dessert',
        'Pasta',
        'Seafood',
        'Vegetarian',
    ]

    const filteredMeals = 
        category === 'All'
            ? meals
            : meals.filter((meal) => meal.strCategory === category)

    return (
        <main>
            <section className="discover-header">
                <p className="eyebrow">DON'T KNOW WHAT YOU WANT?</p>
                <h1>Discover your next <span>CRAVE.</span></h1>
                <p className="subtitle">
                    Pick a category and see what looks good.
                </p>
            </section>

            <div className="category-buttons">
                {categories.map((item) => (
                    <button
                        key={item}
                        className={category === item ? 'active-category' : ''}
                        onClick={() => setCategory(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="meal-gallery">
                {filteredMeals.map((meal) => (
                    <Link
                        to={`/meal/${meal.idMeal}`}
                        className="gallery-card"
                        key={meal.idMeal}
                    >
                        <img src={meal.strMealThumb} alt={meal.strMeal} />

                        <div className="gallery-info">
                            <p>{meal.strArea || 'Unknown cuisine'}</p>
                            <h2>{meal.strMeal}</h2>
                            <span>{meal.strCategory}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    )
}

export default DiscoverPage