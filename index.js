(function () {
    const API_URL = 'https://xkcd.vercel.app/?comic='

    //gets comics and sets the comic images based on the url params
    async function getComics(firstImgNumber = 1, numberToShow = 3) {
        resetImages()
        document.querySelector('#loading').hidden = false
        const min = 2, max = 2476
        const comics = []
        const url = new URL(window.location.href)

        let imgLimit = firstImgNumber + numberToShow

        if (imgLimit < min) imgLimit = min;
        if (imgLimit > max) imgLimit = max;
        if (firstImgNumber < min - 1) firstImgNumber = min - 1;
        if (firstImgNumber > max - 1) firstImgNumber = max - 1;

        for (let i = firstImgNumber; i < imgLimit; i++) {
            const comic = await fetch(`${API_URL}${i}`).then((res) => res.json())
            comics.push(comic)
        }

        url.searchParams.set('img', firstImgNumber)
        url.searchParams.set('toShow', numberToShow)
        url.searchParams.delete('search')
        window.history.pushState({}, '', url)
        setComicImages(comics)

        document.querySelector('#loading').hidden = true
    }

    //extracts the parameters from the url to determine the comic numbers to fetch and the no. of images to show
    function getParams() {
        const params = new URLSearchParams(window.location.search)
        const toShow = parseInt(params.get('toShow'))
        const nextImg = parseInt(params.get('img'))
        return [toShow, nextImg]
    }

    function getDisplayedImages() {
        const cards = Array.from(document.querySelectorAll('.card'))
        return cards.filter((card) => card.style.display !== 'none')
    }

    function setComicImages(comics) {
        const comicContainer = document.querySelector('#comicContainer')
        for (let comic of comics) {
            // Dynamically create comic card containers as required
            const card = document.createElement('div')
            const comicTitle = document.createElement('h3')
            const year = document.createElement('p')
            const img = document.createElement('img')

            // Adds comic information to respective HTML nodes
            comicTitle.appendChild((document.createTextNode(comic.title)))
            year.appendChild((document.createTextNode(`Comic no.${comic.nun} - year ${comic.year}`)))
            img.src = comic.img
            img.alt = comic.alt

            // Set class attributes for CSS styles
            card.setAttribute('class', 'card')
            comicTitle.setAttribute('class', 'img-title')
            year.setAttribute('class', 'img-year')
            img.setAttribute('class', 'image')

            // Append children nodes to card div
            card.appendChild(comicTitle)
            card.appendChild(year)
            card.appendChild(img)
            comicContainer.appendChild(card)
        }
    }

    //resets the images on the page
    function resetImages() {
        const cards = document.querySelectorAll('.card')
        for (let card of cards) {
            card.remove()
        }
    }

    //fetches comics based on url params or 1st comic page if there are no params specified
    window.addEventListener('load', () => {
        const [toShow, nextImg] = getParams()
        toShow && nextImg ? getComics(nextImg, toShow) : getComics()
    })

    const nextBtn = document.querySelector('#nxt-btn')
    nextBtn.addEventListener('click', () => {
        const displayedImages = getDisplayedImages()
        const [toShow, nextImg] = getParams()
        displayedImages.length < toShow ? getComics(nextImg, toShow) : getComics(nextImg + toShow, toShow)
    })

    const randBtn = document.querySelector('#rand-btn');
    randBtn.addEventListener('click', () => {
        const randomImg = Math.floor(Math.random() * 2475 + 1)
        const [toShow, _] = getParams()
        getComics(randomImg, toShow)
    })

    const prevBtn = document.querySelector('#prev-btn');
    prevBtn.addEventListener('click', () => {
        const displayedImages = getDisplayedImages()
        const [toShow, nextImg] = getParams()
        displayedImages < toShow ? getComics(nextImg, toShow) : getComics(nextImg - toShow, toShow)
    })

    const toShowBtn = document.querySelector('#toShow');
    toShowBtn.addEventListener('change', () => {
        const url = new URL(window.location.href)
        url.searchParams.set('toShow', toShowBtn.value)
        window.history.pushState({}, '', url)
        const [toShow, nextImg] = getParams()
        getComics(nextImg, toShow)
    })

    const form = document.querySelector('form')
    form.addEventListener('submit', (ev) => {
        ev.preventDefault()
        const searchInput = parseInt(document.querySelector('#search').value)
        toShowBtn.value = 1
        getComics(searchInput, 1)
    })
})()