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
    function getParams(option = 'next') {
        const params = new URLSearchParams(window.location.search)
        const toShow = parseInt(params.get('toShow'))
        let nextImg = parseInt(params.get('img'))
        switch (option) {
            case 'next':
                nextImg += toShow
                break
            case 'prev':
                nextImg -= toShow
                break
            case 'rand':
                nextImg = Math.floor(Math.random() * 2505 + 1)
                break
        }
        return [toShow, nextImg]
    }

    //sets the image src and alt attributes
    function setComicImages(comics) {
        const comicContainer = document.querySelector('#comicContainer')
        for (let comic of comics) {
            const card = document.createElement('div')
            const comicTitle = document.createElement('h3')
            comicTitle.appendChild((document.createTextNode(comic.title)))
            const year = document.createElement('p')
            year.appendChild((document.createTextNode(`Comic no.${comic.nun} - year ${comic.year}`)))
            const img = document.createElement('img')
            img.src = comic.img
            img.alt = comic.alt
            card.setAttribute('class', 'card')
            comicTitle.setAttribute('class', 'img-title')
            year.setAttribute('class', 'img-year')
            img.setAttribute('class', 'image')

            card.appendChild(comicTitle)
            card.appendChild(year)
            card.appendChild(img)
            comicContainer.appendChild(card)
        }
    }

    //resets the images on the page
    function resetImages() {
        const cards = document.querySelectorAll('.card');
        for (let card of cards) {
            card.style.display = "none"
        }
    }

    window.addEventListener('load', () => {
        getComics()
    })

    const nextBtn = document.querySelector('#nxt-btn');
    nextBtn.addEventListener('click', () => {
        const [toShow, nextImg] = getParams()
        getComics(nextImg, toShow)
    })

    const randBtn = document.querySelector('#rand-btn');
    randBtn.addEventListener('click', () => {
        const [toShow, nextImg] = getParams('rand')
        getComics(nextImg, toShow)
    })

    const prevBtn = document.querySelector('#prev-btn');
    prevBtn.addEventListener('click', () => {
        const [toShow, nextImg] = getParams('prev')
        getComics(nextImg, toShow)
    })

    const toShowBtn = document.querySelector('#toShow');
    toShowBtn.addEventListener('click', () => {
        const url = new URL(window.location.href)
        url.searchParams.set('toShow', toShowBtn.value)
        window.history.pushState({}, '', url)
    })

    const form = document.querySelector('form')
    form.addEventListener('submit', (ev) => {
        ev.preventDefault()
        const searchInput = parseInt(document.querySelector('#search').value)
        getComics(searchInput, 1)
    })
})()