document.addEventListener('DOMContentLoaded', function () {

	const formSearch = document.querySelector('.form-search'),
		inputCitiesFrom = document.querySelector('.input__cities-from'),
		dropDownCitiesFrom = document.querySelector('.dropdown__cities-from'),
		inputCitiesTo = document.querySelector('.input__cities-to'),
		dropDownCitiesTo = document.querySelector('.dropdown__cities-to'),
		inputDateDepart = document.querySelector('.input__date-depart')

	const CITIES_API = '../db/cities.json',
		PROXY = 'https://cors-anywhere.herokuapp.com/',
		API_KEY = '060f2e07ff83e3a45a39dfcac9669301',
		CALENDAR_API = 'http://min-prices.aviasales.ru/calendar_preload'

	let city = []

	const getData = (url, callback) => {
		const request = new XMLHttpRequest()

		request.open('GET', url)

		request.addEventListener('readystatechange', () => {
			if (request.readyState !== 4) return

			if (request.status === 200) {
				callback(request.response)
			} else {
				console.error(request.status)
			}
		})

		request.send()
	}

	const showCity = (input, list) => {
		list.textContent = ''

		if (input.value) {
			const filteredCity = city.filter(item => {

				const fixItem = item.name.toLowerCase()
				return fixItem.includes(input.value.toLowerCase())

			})

			filteredCity.forEach(item => {
				const li = document.createElement('li')
				li.classList.add('dropdown__city')
				li.textContent = item.name
				list.append(li)
			})
		}
	}

	const selectCity = (e, input, list) => {
		const target = e.target
		const cityName = target.innerText

		if (target.tagName.toLowerCase() === 'li') {
			input.value = cityName
			list.textContent = ''
		}
	}

	const cheapTicketDay = (cheapTicket) => {
		console.log(cheapTicket)
	}

	const cheapTicketYear = (cheapTickets) => {
		console.log(cheapTickets)
	}

	const renderCheapTicket = (data, date) => {
		const cheapTicketYear = JSON.parse(data).best_prices
		const cheapTicketDay = cheapTicketYear.filter(item => {
			return item.depart_date === date
		})

		cheapTicketDay(cheapTicketDay)
		cheapTicketYear(cheapTicketYear)
	}

	inputCitiesFrom.addEventListener('input', () => {
		showCity(inputCitiesFrom, dropDownCitiesFrom)
	})

	inputCitiesTo.addEventListener('input', () => {
		showCity(inputCitiesTo, dropDownCitiesTo)
	})

	dropDownCitiesFrom.addEventListener('click', (e) => {
		selectCity(e, inputCitiesFrom, dropDownCitiesFrom)
	})

	dropDownCitiesTo.addEventListener('click', (e) => {
		selectCity(e, inputCitiesTo, dropDownCitiesTo)
	})

	formSearch.addEventListener('submit', (e) => {
		e.preventDefault()

		const formData = {
			from: city.find(item => inputCitiesFrom.value === item.name).code,
			to: city.find(item => inputCitiesTo.value === item.name).code,
			when: inputDateDepart.value,
		}

		const requestData = `?depart_date=${formData.when}&origin=${formData.from}&destination=${formData.to}&one_way=true&token=${API_KEY}`

		getData(PROXY + CALENDAR_API + requestData, response => renderCheapTicket(response, formData.when))

	})

	getData(CITIES_API, (data) => {
		city = JSON.parse(data).filter(item => item.name)
	})

})