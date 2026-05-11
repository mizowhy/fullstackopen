import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange} />
    </div>
  )
}

const CountryDetails = ({ country, weather }) => {
  const languages = Object.values(country.languages)

  return (
    <div>
      <h1>{country.name.common}</h1>

      <p>capital {country.capital}</p>
      <p>area {country.area}</p>

      <h2>languages</h2>

      <ul>
        {languages.map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt}
        width="150"
      />

      {weather && (
        <div>
          <h2>Weather in {country.capital}</h2>

          <p>temperature {weather.main.temp} Celsius</p>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt={weather.weather[0].description}
          />

          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

const Countries = ({ countries, handleShowCountry, weather }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => (
          <div key={country.cca3}>
            {country.name.common}{' '}
            <button onClick={() => handleShowCountry(country)}>
              show
            </button>
          </div>
        ))}
      </div>
    )
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} weather={weather} />
  }

  return null
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const countriesToShow = selectedCountry
    ? [selectedCountry]
    : countries.filter(country =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      )

  useEffect(() => {
    if (countriesToShow.length === 1 && apiKey) {
      const country = countriesToShow[0]
      const capital = country.capital[0]

      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
        )
        .then(response => {
          setWeather(response.data)
        })
    } else {
      setWeather(null)
    }
  }, [countriesToShow, apiKey])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
  }

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
    setSearch(country.name.common)
  }

  return (
    <div>
      <Filter search={search} handleSearchChange={handleSearchChange} />

      <Countries
        countries={countriesToShow}
        handleShowCountry={handleShowCountry}
        weather={weather}
      />
    </div>
  )
}

export default App