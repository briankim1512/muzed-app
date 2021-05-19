async function searchNapster (searchTerm = '') {
    const napsterKey = "YWUwOTA0ZmEtZWQwNS00YmUyLWFhNjEtZWEwMDNlYWViOWQ4"
    const searchURL = "http://api.napster.com/v2.2/search/verbose?query="
    const albumURL = "https://api.napster.com/v2.2/albums/"

    searchTerm = searchTerm.replace(' ', '+')
    let searchRequest = searchURL + searchTerm
    let albumRequest = albumURL

    let trackInfo = {
        title: '',
        artist: '',
        album: '',
        preview: ''
    }
    
    await fetch(searchRequest, {headers: {'apikey': napsterKey}})
        .then(response => response.json())
        .then(data => {
            let trackData = data.search.data.tracks[0]
            albumRequest = albumURL + trackData.albumId + '/images'
            trackInfo.title = trackData.name
            trackInfo.artist = trackData.artistName
            trackInfo.preview = trackData.previewURL

        })

    await fetch(albumRequest, {headers: {'apikey': napsterKey}})
        .then(response => response.json())
        .then(data => {
            trackInfo.album = data.images[0]['url']
        })
    
    return trackInfo
}

document.addEventListener('DOMContentLoaded', function () {
    // Intro Frame Javascript
    let html = document.querySelector('html')
    let introButton = document.querySelector('.intro-btn')
    let introFrame = document.querySelector('#intro-frame')
    let landingFrame = document.querySelector('#landing-frame')
    
    introButton.addEventListener('click', function () {
        html.requestFullscreen()
        introFrame.style.opacity = 0
        landingFrame.style.display = 'flex'
        setTimeout(function () {
            introFrame.style.display = 'none'
        }, 400)
    })

    // Landing Frame Javascript
    // !!! Dummy Data for testing  !!!
    let entries = [
        {
            date: "2020-01-01",
            title: "Bohemian Rhapsody",
            artist: "Queen",
            album: "http://static.rhap.com/img/170x170/7/7/1/4/12294177_170x170.jpg",
            preview: "https://listen.hs.llnwd.net/g3/prvw/4/4/9/2/0/1448702944.mp3",
            note: "Test",
            memories: null
        },
        {
            date: "2020-01-01",
            title: "I Want to Break Free",
            artist: "Queen",
            album: "http://static.rhap.com/img/170x170/0/6/1/4/24694160_170x170.jpg",
            preview: "https://listen.hs.llnwd.net/g3/prvw/2/8/5/7/5/2312157582.mp3",
            note: "Test",
            memories: null
        }
    ]

    let diary = new Vue({
        el: '#landing-diary',
        delimiters: ['[[',']]'],
        data: {
            entries: entries
        }
    })

    let peopleList = new Vue({
        el: '#people-list',
        delimiters: ['[[',']]'],
        data: {
            list: []
        }
    })

    let landingAdd = document.querySelector('.landing-add')
    let loggingFrame = document.querySelector('#logging-frame')
    let loggingSearch = document.querySelector('#logging-search')

    loggingSearch.style.display = 'flex'

    landingAdd.addEventListener('click', function() {
        loggingFrame.style.display = 'flex'
        setTimeout(function() {
            loggingFrame.style.opacity = '100%'
        }, 100)
    })

    // Logging Frame Javascript

    let searchInput = document.querySelector('#logging-search-input')
    let searchPreview = new Audio()
    let searchResult = document.querySelector('#search-result')
    let loggingSearchAdd = document.querySelector('#logging-search-add')
    let loggingInfo = {}

    searchInput.addEventListener('keyup', function(event) {
        if (event.keyCode==13) {
            searchNapster(searchInput.value).then(data => {
                

                searchResult.style.display = 'flex'
                loggingSearchAdd.style.display = 'flex'

                let searchTitle = document.querySelector('#search-title')
                let searchArtist = document.querySelector('#search-artist')
                let searchAlbum = document.querySelector('#search-album')

                loggingInfo = data

                searchTitle.innerHTML = data.title
                searchArtist.innerHTML = data.artist
                searchAlbum.src = data.album
                searchPreview.src = data.preview
                searchPreview.play()
            })
        }
    })

    // Search To Log

    let addSearchLog = document.querySelector('#add-search-log')
    let loggingSubframe1 = document.querySelector('#logging-subframe-1')

    addSearchLog.addEventListener('click', function() {
        let loggingMusicTitle = document.querySelector('.logging-music-title')
        let loggingMusicArtist = document.querySelector('.logging-music-artist')
        let loggingMusicAlbum = document.querySelector('.logging-music-album')

        loggingMusicTitle.innerHTML=loggingInfo.title
        loggingMusicArtist.innerHTML=loggingInfo.artist
        loggingMusicAlbum.src=loggingInfo.album

        searchPreview.pause()
        loggingSearch.style.opacity = 0
        setTimeout(function () {
            loggingSearch.style.display = 'none'
        }, 401)
        loggingSubframe1.style.display = 'flex'
        setTimeout(function () {
            loggingSubframe1.style.opacity = 100
        }, 1)
    })

    // Add Additional Logs

    let addTagLog = document.querySelector('#add-tag-log')
    let loggingSubframe2 = document.querySelector('#logging-subframe-2')

    addTagLog.addEventListener('click', function() {
        document.querySelector('.logging-dateinput').value = new Date().toJSON().slice(0,10)
        loggingInfo['note'] = document.querySelector('#logging-story').value

        loggingSubframe1.style.opacity = 0
        setTimeout(function () {
            loggingSubframe1.style.display = 'none'
        }, 401)
        loggingSubframe2.style.display = 'flex'
        setTimeout(function () {
            loggingSubframe2.style.opacity = 100
        }, 100)
    })

    // Pre Finish Logs

    let preFinishLog = document.querySelector('#pre-finish-log')

    preFinishLog.addEventListener('click', function() {
        loggingStory = document.querySelector('#logging-story')
        loggingInfo['date'] = new Date().toJSON().slice(0,10)
        loggingInfo['note'] = loggingStory.value
        loggingInfo['memories'] = null
        loggingStory.value = ""
        diary.entries.push(loggingInfo)
        loggingInfo = {}

        searchResult.style.display = 'none'
        loggingSearchAdd.style.display = 'none'
        loggingSubframe1.style.display = 'none'
        loggingSearch.style.display = 'flex'
        loggingSearch.style.opacity = 100
        loggingFrame.style.opacity = '0%'
        setTimeout(function() {
            loggingFrame.style.display = 'none'
        }, 100)
    })

    // Person List Append
    
    let personInput = document.querySelector('#person-input')

    personInput.addEventListener('keyup', function(event) {
        if (event.keyCode==13) {
            peopleList.list.push(personInput.value)
        }
    })

    // Finish Logs

    let finishLog = document.querySelector('#finish-log')
    
    finishLog.addEventListener('click', function() {
        let peopleLog = {
            list: [],
            description: ''
        }
        let mood = ''
        let imageUrl = ''

        searchResult.style.display = 'none'
        loggingSearchAdd.style.display = 'none'
        loggingSubframe2.style.display = 'none'
        loggingSearch.style.display = 'flex'
        loggingSearch.style.opacity = 100
        loggingFrame.style.opacity = '0%'
        setTimeout(function() {
            loggingFrame.style.display = 'none'
        }, 100)
    })

    // Playing Frame Javascript

    // Sharing Frame Javascript
})