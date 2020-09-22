document.addEventListener('DOMContentLoaded', function () {

	const formSearch = document.querySelector('.form-search'),
		inputCitiesFrom = document.querySelector('.input__cities-from'),
		dropDownCitiesFrom = document.querySelector('.dropdown__cities-from'),
		inputCitiesTo = document.querySelector('.input__cities-to'),
		dropDownCitiesTo = document.querySelector('.dropdown__cities-to'),
		inputDateDepart = document.querySelector('.input__date-depart'),
		cheapestTicket = document.querySelector('#cheapest-ticket'),
		otherCheapTickets = document.querySelector('#other-cheap-tickets')

	const CITIES_API = '../db/cities.json',
		PROXY = 'https://cors-anywhere.herokuapp.com/',
		API_KEY = '060f2e07ff83e3a45a39dfcac9669301',
		CALENDAR_API = 'http://min-prices.aviasales.ru/calendar_preload',
		MAX_COUNT = 10

	let city = []

	const getData = (url, callback, reject = console.error) => {
		const request = new XMLHttpRequest()

		request.open('GET', url)

		request.addEventListener('readystatechange', () => {
			if (request.readyState !== 4) return

			if (request.status === 200) {
				callback(request.response)
			} else {
				reject(request.status)
			}
		})

		request.send()
	}

	const showCity = (input, list) => {
		list.textContent = ''

		if (input.value) {
			const filteredCity = city.filter(item => {

				const fixItem = item.name.toLowerCase()
				return fixItem.startsWith(input.value.toLowerCase())

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

	const getChanges = (number) => {
		if (number) {
			return number === 1 ? 'С 1 пересадкой' : 'С 2 пересадками'
		} else {
			return 'Без пересадок'
		}
	}

	const getNameCity = (code) => {
		const objCity = city.find(item => item.code === code)
		return objCity.name
	}

	const getDate = (date) => {
		return new Date(date).toLocaleDateString('ru', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	const getLink = (data) => {
		let link = 'https://www.aviasales.ru/search/'

		link += data.origin

		const date = new Date(data.depart_date)

		const day = date.getDate()

		link += day < 10 ? `0${day}` : day

		const month = date.getMonth() + 1

		link += month < 10 ? `0${month}` : month

		link += data.destination

		link += '1'

		return link
	}

	const createCard = (data) => {
		const ticket = document.createElement('article')
		ticket.classList.add('ticket')

		let deep = ''

		if (data) {
			deep = `
			<h3 class="agent">${data.gate}</h3>
			<div class="ticket__wrapper">
				<div class="left-side">
					<a href="${getLink(data)}" target="_blank" class="button button__buy">Купить
						за ${data.value}₽</a>
				</div>
				<div class="right-side">
					<div class="block-left">
						<div class="city__from">Вылет из города
							<span class="city__name">${getNameCity(data.origin)}</span>
						</div>
						<div class="date">${getDate(data.depart_date)}</div>
					</div>
			
					<div class="block-right">
						<div class="changes">${getChanges(data.number_of_changes)}</div>
						<div class="city__to">Город назначения:
							<span class="city__name">${getNameCity(data.destination)}</span>
						</div>
					</div>
				</div>
			</div>
			`
		} else {
			deep = `К сожалению, билеты на ${date} не найдены`
		}

		ticket.insertAdjacentHTML('afterbegin', deep)

		return ticket
	}

	const renderCheapDay = (cheapTicket) => {

		cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>'

		const ticket = createCard(cheapTicket[0])
		cheapestTicket.append(ticket)
	}

	const renderCheapYear = (cheapTickets) => {
		otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>'
		cheapTickets.sort((a, b) => a.value - b.value)

		for (let i = 0; i < MAX_COUNT && i < cheapTickets.length; i++) {
			const ticket = createCard(cheapTickets[i])
			otherCheapTickets.append(ticket)
		}
	}

	const renderCheap = (data, date) => {
		const cheapTicketYear = JSON.parse(data).best_prices
		const cheapTicketDay = cheapTicketYear.filter(item => {
			return item.depart_date === date
		})

		renderCheapDay(cheapTicketDay)
		renderCheapYear(cheapTicketYear)
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

		cheapestTicket.innerHTML = '<h2>Самый дешевый билет на выбранную дату</h2>'
		otherCheapTickets.innerHTML = '<h2>Самые дешевые билеты на другие даты</h2>'

		const formData = {
			from: city.find(item => inputCitiesFrom.value === item.name),
			to: city.find(item => inputCitiesTo.value === item.name),
			when: inputDateDepart.value,
		}

		if (formData.from && formData.to) {
			const requestData = `?depart_date=${formData.when}&origin=${formData.from.code}&destination=${formData.to.code}&one_way=true`

			getData(CALENDAR_API + requestData, response => renderCheap(response, formData.when), (e) => {
				alert('В этом направлении нет рейсов')
				console.error(e)
			})
		} else {
			alert('Введите корректное название города!')
		}

	})

	getData(CITIES_API, (data) => {
		city = JSON.parse(data).filter(item => item.name)

		city.sort((a, b) => {
			if (a.name > b.name) {
				return 1
			}
			if (a.name < b.name) {
				return -1
			}
			// a должно быть равным b
			return 0
		})
	})

})