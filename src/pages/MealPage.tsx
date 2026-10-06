import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'


type Meal = {
    idMeal: string
    strMeal: string
    strArea: string | null
    strCategory: string
    strMealThumb: string
    strInstructions: string
    [key: string]: string | null
}



function MealPage() {
    const { id } = useParams()
    const [meal, setMeal] = useState<Meal | null>(null)
    const [allMeals, setAllMeals] = useState<Meal[]>([])

    useEffect(() => {
        axios
            .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
            .then((response) => {
                setMeal(response.data.meals[0])
            })
            .catch((error) => {
                console.error('Error fetching meal:', error)
            })
    }, [id])

    useEffect(() => {
        const letters = 'abcdefghijklmnopqrstuvwxyz'.split('')

        const requests = letters.map((letter) =>
            axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`)
        )

        Promise.all(requests)
            .then((responses) => {
                const meals = responses.flatMap(
                    (response) => response.data.meals || []
                )

                setAllMeals(meals)
            })
            .catch((error) => {
                console.error('Error fetching meal list:', error)
            })
    }, [])

    const currentIndex = allMeals.findIndex(
        (item) => item.idMeal === id
    )

    const previousMeal = 
        currentIndex > 0
            ? allMeals[currentIndex - 1]
            : allMeals[allMeals.length - 1]

    const nextMeal = 
        currentIndex >= 0 && currentIndex < allMeals.length - 1
            ? allMeals[currentIndex + 1]
            : allMeals[0]

    if (!meal) {
        return <main>Loading...</main>
    }

    return (
        <main className="meal-page">
            <Link to="/" className="back-link">
                ← Back to search
            </Link>

            <div className="meal-detail">
                <img
                    className="meal-detail-image"
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                />
                <div className="meal-detail-info">
                    <p className="eyebrow">{meal.strArea || 'CUISINE'}</p>
                    <h1>{meal.strMeal}</h1>
                    <p className="meal-category">{meal.strCategory}</p>
                </div>
            </div>

            <section className="meal-section">
                <h2>Ingredients</h2>
                <ul>
                    {Array.from({ length: 20}, (_, index) => {
                        const ingredient = meal[`strIngredient${index + 1}`]
                        const measure = meal[`strMeasure${index + 1}`]
                        
                        if (ingredient && ingredient.trim()) {
                            return (
                                <li key={index}>
                                    {measure} {ingredient}
                                </li>
                            )
                        }

                        return null
                    })}
                </ul>
            </section>

            <section className="meal-section">
                <h2>How to make it</h2>
                <p className="instructions">{meal.strInstructions}</p>
            </section>

            <div className="meal-navigation">
                {previousMeal && (
                    <Link to={`/meal/${previousMeal.idMeal}`}>
                        ← Previous
                    </Link>
                )}

                {nextMeal && (
                    <Link to={`/meal/${nextMeal.idMeal}`}>
                        Next →
                    </Link>
                )}
            </div>
        </main>
    )
}

export default MealPage