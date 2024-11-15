const wrapper = document.createElement('div')
wrapper.classList.add('repoElementsWrapper')
const mainEl = document.querySelector('.main')
const popUpWindow = document.createElement('ul')
const formEl = document.createElement('form')
const inputEl = document.createElement('input')

formEl.classList.add('serachForm')
inputEl.classList.add('searchInput')
popUpWindow.classList.add('popupWindow')

inputEl.setAttribute('name', 'name')

formEl.appendChild(inputEl)
mainEl.appendChild(formEl)

function getApiData() {
	return fetch(
		`https://api.github.com/search/repositories?q=${inputEl.value}&per_page=5`
	)
}

function createPopup(item) {
	mainEl.appendChild(popUpWindow)
	popUpWindow.insertAdjacentHTML('beforeend', `<li>${item}</li>`)
}

function popupHandler(data) {
	document.querySelectorAll('.popupWindow li').forEach((popupItem) => {
		popupItem.addEventListener('click', () => {
			inputEl.value = ''
			popUpWindow.remove()
			wrapper.appendChild(createRepoEl(data, popupItem.textContent))
			mainEl.appendChild(wrapper)
		})
	})
}

function createRepoEl(repoData, selectedItem) {
	const element = document.createElement('div')

	repoData.items.filter((item) => {
		if (selectedItem === item.name) {
			element.insertAdjacentHTML(
				'afterbegin',
				`
				<p>Name: ${item.name}</p>
			<p>Owner: ${item.owner.login}</p>
			<p>Stars: ${item.stargazers_count}</p>
	`
			)
		}
	})
	element.classList.add('repoCard')
	element.appendChild(createDeleteBtnEl())
	return element
}

function createDeleteBtnEl() {
	const element = document.createElement('button')
	element.classList.add('deleteBtn')
	element.innerText = 'X'
	element.addEventListener('click', (e) => {
		e.target.parentNode.remove()
	})

	return element
}

function debounce(func, delay) {
	let timeoutId

	return function executedFunction(...args) {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => {
			func.apply(this, args)
		}, delay)
	}
}

inputEl.addEventListener(
	'input',
	debounce(async (e) => {
		popUpWindow.innerHTML = ''
		if (!inputEl.value || !inputEl.value.trim().length > 0) return

		try {
			const response = await getApiData()
			const data = await response.json()
			await data.items.map((item) => {
				createPopup(item.name)
			})

			popupHandler(data)
		} catch (error) {
			alert('Произошла ошибка :(')
			console.error(error)
		}
	}, 300)
)

inputEl.addEventListener('keydown', (e) => {
	if (e.keycode === 13) e.preventDefault()
})
