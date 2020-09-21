document.addEventListener('DOMContentLoaded', function () {

	const formSearch = document.querySelector('.form-search'),
		inputCitiesFrom = document.querySelector('.input__cities-from'),
		dropDownCitiesFrom = document.querySelector('.dropdown__cities-from'),
		inputCitiesTo = document.querySelector('.input__cities-to'),
		dropDownCitiesTo = document.querySelector('.dropdown__cities-to'),
		inputDateDepart = document.querySelector('.input__date-depart')

	const city = ['Москва', 'Киев', 'Санкт-Петербург', 'Казань', 'Хабаровск', 'Харьков', 'Минск', 'Сочи', 'Анапа', 'Ванино']

	const showCity = (input, list) => {
		list.textContent = ''

		if (input.value) {
			const filteredCity = city.filter(item => {
				const fixItem = item.toLowerCase()

				return fixItem.includes(input.value.toLowerCase())
			})

			filteredCity.forEach(item => {
				const li = document.createElement('li')
				li.classList.add('dropdown__city')
				li.textContent = item
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

})