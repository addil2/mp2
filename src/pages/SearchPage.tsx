import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

type Meal = {
    idMeal: string
    strMeal: string
    strArea: string | null
    strCategory: string
    strMealThumb: string
}

function SearchPage() {
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('name')
    const [sortOrder, setSortOrder] = useState('asc')
    const [meals, setMeals] = useState<Meal[]>([])

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
                console.error('Error fetching meals', error)
            })
    }, [])

    const filteredMeals = meals.filter((meal) =>
        meal.strMeal.toLowerCase().includes(search.toLowerCase()) ||
        meal.strArea?.toLowerCase().includes(search.toLowerCase())
    )

    const sortedMeals = [...filteredMeals].sort((a, b) => {
        let firstVal = ''
        let secondVal = ''

        if (sortBy === 'name') {
            firstVal = a.strMeal
            secondVal = b.strMeal
        } else {
            firstVal = a.strArea || ''
            secondVal = b.strArea || ''
        }

        if (sortOrder === 'asc') {
            return firstVal.localeCompare(secondVal)
        } else {
            return secondVal.localeCompare(firstVal)
        }
    })

    return (
        <main>
            <section className="search-hero">
                <p className="eyebrow">HUNGRY?</p>
                <h1>What do you <span>CRAVE?</span></h1>
                <p className="subtitle">
                    Search it. Find it. Eat it.
                </p>
            </section>

            <div className="search-controls">

                <input
                    type="text"
                    placeholder="Search by meal or cuisine..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                />

                <div className="search-controls">
                    <label htmlFor="sort">Sort by: </label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                    >
                        <option value="name">Meal Name</option>
                        <option value="cuisine">Cuisine</option>
                    </select>

                    <label htmlFor="order">Order: </label>
                    <select
                        id="order"
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value)}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </div>
            </div>

            <div>
                <div className="meal-list">
                    {sortedMeals.map((meal) => (
                        <Link
                            to={`/meal/${meal.idMeal}`}
                            className="meal-card"
                            key={meal.idMeal}
                        >
                            <img src={meal.strMealThumb} alt={meal.strMeal} />

                            <div className="meal-info">
                                <h2>{meal.strMeal}</h2>
                                <p>
                                    {meal.strArea || "Unknown cuisine"} • {meal.strCategory}
                                </p>
                            </div>

                            <span className="meal-arrow">→</span>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default SearchPage;