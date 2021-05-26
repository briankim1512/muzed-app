let entries = [
    {
        id: generateUID(),
        date: "2020-01-01",
        title: "Bohemian Rhapsody",
        artist: "Queen",
        album: "http://static.rhap.com/img/170x170/7/7/1/4/12294177_170x170.jpg",
        preview: "https://listen.hs.llnwd.net/g3/prvw/4/4/9/2/0/1448702944.mp3",
        note: "The Bohemian Rhapsody, while widely known, has a special meaning for me as...",
        image: "https://upload.wikimedia.org/wikipedia/commons/2/20/Bohemian_Rhapsody.jpg",
        memories: {
            people: {
                list: ['Freddie Mercury'],
                description: 'Short Description'
            }
        }
    },
    {
        id: generateUID(),
        date: "2020-01-01",
        title: "I Want to Break Free",
        artist: "Queen",
        album: "http://static.rhap.com/img/170x170/0/6/1/4/24694160_170x170.jpg",
        preview: "https://listen.hs.llnwd.net/g3/prvw/2/8/5/7/5/2312157582.mp3",
        note: "This song's lyrics is relatable to nearly everyone and anyone...",
        image: "https://cdn10.picryl.com/photo/1991/06/08/fireworks-light-up-the-night-sky-behind-the-washington-monument-at-the-conclusion-6783a8-1600.jpg",
        memories: {
            mood: 'HAPPY'
        }
    }
]

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

async function getUserLogs (userID) {
    let userLogs = await fetch('/api', {
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            'type': 'regular_get',
            'userID': userID
        })})
        .then(response => response.json())

    return userLogs
}

async function postUserLogs (userID, logs) {
    await fetch('/api', {
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            'type': 'regular_post',
            'userID': userID,
            'data': JSON.stringify(logs)
        })
    })
}

async function getSharedLog (sharedID) {
    let logDetails = await fetch('/api', {
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            'type': 'shared_get',
            'sharedID': sharedID
        })})
        .then(response => response.json())
    
    return logDetails
}

async function createSharedLog (details) {
    await fetch('/api', {
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json"
        },
        method: 'POST',
        body: JSON.stringify({
            'type': 'shared_post',
            'data': JSON.stringify(details)
        })
    })
}

function generateUID () {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

document.addEventListener('DOMContentLoaded', function () {

    //////////////////////////////////////////////////// 
    // Vue Javascript
    //////////////////////////////////////////////////// 

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

    let peopleMemory = new Vue({
        el: '#people-memory-card',
        delimiters: ['[[',']]'],
        data: {
            list: [],
            description: ''
        }
    })

    //////////////////////////////////////////////////// 
    // Intro Frame Javascript
    //////////////////////////////////////////////////// 

    let params = (new URL(document.location)).searchParams
    let html = document.querySelector('html')
    let introButton = document.querySelector('.intro-btn')
    let introFrame = document.querySelector('#intro-frame')
    let landingFrame = document.querySelector('#landing-frame')
    let userID = params.get('user_id')
    let sharedID = params.get('shared_id')

    if (userID == null && sharedID == null) {
        alert ('Please receive a URL with an ID from the admins')
        html.style.display = 'none'
    } else if (userID != null) {
        getUserLogs(userID)
        .then(userLogs => {
            userLogs = userLogs.result
            if (userLogs) {
                userLogs = JSON.parse(userLogs)
                diary.entries = userLogs
                updateEntryList()
            }
        })
    } else if (sharedID != null) {
        introFrame.style.display = 'none'
        playEntry(getSharedLog(sharedID))
    }
    
    introButton.addEventListener('click', function () {
        html.requestFullscreen()
        introFrame.style.opacity = 0
        landingFrame.style.display = 'flex'
        setTimeout(function () {
            introFrame.style.display = 'none'
        }, 400)
    })

    //////////////////////////////////////////////////// 
    // Landing Frame Javascript
    //////////////////////////////////////////////////// 

    function updateEntryList () {
        setTimeout(function() {
            document.querySelectorAll('.diary-entry').forEach(element => {
                let entryUID = element.childNodes[0].innerHTML
                let entryIndex = diary.entries.findIndex(element => element.id == entryUID)
                // if (!('tagged' in diary.entries[entryIndex])) {
                //     element.addEventListener('click', function () {
                //         playEntry(diary.entries[entryIndex])
                //     })
                //     diary.entries[entryIndex]['tagged'] = true
                // }
                element.addEventListener('click', function () {
                    playEntry(diary.entries[entryIndex])
                })
            })

            postUserLogs(userID, diary.entries)
        }, 100)
    }

    updateEntryList()

    let landingAdd = document.querySelector('.landing-add')
    let loggingFrame = document.querySelector('#logging-frame')
    let loggingSubframe1 = document.querySelector('#logging-subframe-1')
    
    loggingSubframe1.style.display = 'flex'
    
    landingAdd.addEventListener('click', function() {
        loggingStatus = 'logging'
        loggingFrame.style.display = 'flex'
        setTimeout(function() {
            loggingFrame.style.opacity = '100%'
        }, 100)
    })
    
    //////////////////////////////////////////////////// 
    // Logging Frame Javascript
    //////////////////////////////////////////////////// 
    
    let exitLog = document.querySelector('#exit-log')
    let previousLog = document.querySelector('#previous-log')
    
    let loggingSearch = document.querySelector('#logging-search')
    let loggingSubframe2 = document.querySelector('#logging-subframe-2')
    let taggingPeople = document.querySelector('#tagging-people')
    let taggingMood = document.querySelector('#tagging-mood')
    let musicAdd = document.querySelector('#music-add')
    
    let loggingSearchAdd = document.querySelector('#logging-search-add')
    let searchInput = document.querySelector('#logging-search-input')
    let searchPreview = new Audio()
    let searchResult = document.querySelector('#search-result')
    let addSearchLog = document.querySelector('#add-search-log')

    let goTaggingPeople = document.querySelector('#go-tagging-people')
    let goTaggingMood = document.querySelector('#go-tagging-mood')
    
    let addTagLog = document.querySelector('#add-tag-log')
    let preFinishLog = document.querySelector('#pre-finish-log')
    
    let personInput = document.querySelector('#person-input')
    let peopleDetail = document.querySelector('#people-detail')
    let moodList = document.querySelectorAll('.mood-item')
    
    let addImage = document.querySelector('#add-image')
    
    let finishLog = document.querySelector('#finish-log')

    let currentFrame = null
    let previousFrame = null
    
    let loggingInfo = {}
    let moodLog = null
    let logImageURL = null

    let loggingStatus = 'logging'

    function setLogs (data) {
        loggingInfo = data

        document.querySelector('.logging-music-title').innerHTML = data.title
        document.querySelector('.logging-music-artist').innerHTML = data.artist
        document.querySelector('.logging-music-album').src = data.album
        document.querySelector('#logging-story').value = data.note
        if ('memories' in data && data.memories) {
            if ('mood' in data.memories) {
                moodLog = data.memories.mood
            }
            if ('image' in data.memories) {
                logImageURL = data.image
            }
            if ('people' in data.memories) {
                peopleList.list = data.memories.people.list
                peopleDetail.value = data.memories.people.description
            }
        }
    }

    function clearLogFrames () {
        loggingStatus = 'logging'
        currentFrame = loggingSearch
        previousFrame = null
        moodLog = null
        logImageURL = null
        peopleList.list = []
        loggingInfo = {}

        loggingFrame.style.opacity = 0
        loggingSubframe2.style.opacity = 0

        document.querySelector('.logging-music-title').innerHTML = 'Music Title'
        document.querySelector('.logging-music-artist').innerHTML = 'Artist Name'
        document.querySelector('.logging-music-album').src = "static/img/music-add.svg"
        document.querySelector('#logging-story').value = ''
        peopleDetail.value = ''
        
        setTimeout(function () {
            previousLog.style.display = 'none'
            searchResult.style.display = 'none'
            loggingSearchAdd.style.display = 'none'
            loggingFrame.style.display = 'none'
            loggingSubframe1.style.display = 'flex'
            loggingSubframe1.style.opacity = 100
            loggingSubframe2.style.display = 'none'
        }, 401)
    }

    function goToFrame (thisFrame, targetFrame) {
        currentFrame = targetFrame
        previousFrame = thisFrame

        thisFrame.style.opacity = 0
        setTimeout(function () {
            thisFrame.style.display = 'none'
        }, 401)
        targetFrame.style.display = 'flex'
        setTimeout(function () {
            targetFrame.style.opacity = 100
        }, 100)
    }

    function goBackFrame () {
        goToFrame(currentFrame, previousFrame)
    }

    exitLog.addEventListener('click', function () {
        searchPreview.pause()
        clearLogFrames()
    })

    previousLog.addEventListener('click', function () {
        goBackFrame()
    })

    musicAdd.addEventListener('click', function() {
        previousLog.style.display = 'flex'
        goToFrame(loggingSubframe1, loggingSearch)
    })

    // Search Music
    searchInput.addEventListener('keyup', function(event) {
        if (event.keyCode==13) {
            searchNapster(searchInput.value).then(data => {
                searchResult.style.display = 'flex'
                loggingSearchAdd.style.display = 'flex'

                loggingInfo = data

                document.querySelector('#search-title').innerHTML = data.title
                document.querySelector('#search-artist').innerHTML = data.artist
                document.querySelector('#search-album').src = data.album
                searchPreview.src = data.preview
                searchPreview.loop = true
                searchPreview.play()
            })
        }
    })

    // Search To Log
    addSearchLog.addEventListener('click', function() {
        document.querySelector('.logging-music-title').innerHTML=loggingInfo.title
        document.querySelector('.logging-music-artist').innerHTML=loggingInfo.artist
        document.querySelector('.logging-music-album').src=loggingInfo.album
        
        searchPreview.pause()
        
        goToFrame(loggingSearch, loggingSubframe1)
    })

    // Add Additional Logs
    addTagLog.addEventListener('click', function() {
        let albumStr = document.querySelector('.logging-music-album').src
        albumStr = albumStr.substring((albumStr.length-13), albumStr.length)

        previousLog.style.display = 'flex'

        if (albumStr == 'music-add.svg' || document.querySelector('#logging-story').value == '') {
            alert('Fill out all fields please!')
        } else {
            document.querySelector('.logging-dateinput').value = new Date().toJSON().slice(0,10)
            loggingInfo['note'] = document.querySelector('#logging-story').value
            loggingInfo['memories'] = {}

            goToFrame(loggingSubframe1, loggingSubframe2)
        }
    })

    // Pre Finish Logs
    preFinishLog.addEventListener('click', function() {
        loggingInfo['note'] = document.querySelector('#logging-story').value

        if (loggingStatus == 'logging') {
            loggingInfo['date'] = new Date().toJSON().slice(0,10)
            loggingInfo['memories'] = null
            loggingInfo['id'] = generateUID()
            diary.entries.push(loggingInfo)
        } else if (loggingStatus == 'editing') {
            let diaryIndex = diary.entries.findIndex(entry => entry['id'] == loggingInfo['id'])
            diary.entries[diaryIndex] = loggingInfo
            playEntry(loggingInfo)
        }

        updateEntryList()
        clearLogFrames()
    })

    // Go to Tagging People
    goTaggingPeople.addEventListener('click', function() {
        goToFrame(loggingSubframe2, taggingPeople)
    })

    // Go to Tagging Mood
    goTaggingMood.addEventListener('click', function() {
        goToFrame(loggingSubframe2, taggingMood)
    })


    // Person List Append
    personInput.addEventListener('keyup', function(event) {
        if (event.keyCode==13) {
            peopleList.list.push(personInput.value)
        }
    })

    // Mood Select
    moodList.forEach(element => {
        element.addEventListener('click', function() {
            goBackFrame()
            moodLog = element.childNodes[3].innerHTML
        })
    })

    // Add Image (RIGHT NOW IS URL ONLY)
    addImage.addEventListener('click', function() {
        logImageURL = prompt('Please enter image URL')
    })

    // Finish Logs
    finishLog.addEventListener('click', function() {
        loggingInfo['date'] = document.querySelector('.logging-dateinput').value

        // Check if inputs are there and append to data
        if (peopleList.list.length > 0) {
            loggingInfo['memories']['people'] = {
                list: peopleList.list,
                description: peopleDetail.value
            }
        }
        if (moodLog) {
            loggingInfo['memories']['mood'] = moodLog
        }
        if (logImageURL) {
            loggingInfo['image'] = logImageURL
        }

        // Check what kind of data manipulation should ensue
        if (loggingStatus == 'logging') {
            loggingInfo['id'] = generateUID()
            diary.entries.push(loggingInfo)
        } else if (loggingStatus == 'editing') {
            let diaryIndex = diary.entries.findIndex(entry => entry['id'] == loggingInfo['id'])
            diary.entries[diaryIndex] = loggingInfo
            playEntry(loggingInfo)
        }
        
        updateEntryList()
        clearLogFrames()
    })

    //////////////////////////////////////////////////// 
    // Playing Frame Javascript
    //////////////////////////////////////////////////// 

    let playingFrame = document.querySelector('#playing-frame')
    let playingExit = document.querySelector('#playing-exit')
    let playingShare = document.querySelector('#playing-share')
    let playingEdit = document.querySelector('#playing-edit')
    let playingAlbum = document.querySelector('#playing-album')
    let playingImage = document.querySelector('#playing-image')
    let playingStart = document.querySelector('#playing-start')
    let playingSubframe = document.querySelector('#playing-subframe')
    let playingSubframeIndicator = document.querySelector('#playing-subframe-indicator')
    let playingNotes = document.querySelector('#playing-notes')
    let playingMemories = document.querySelector('#playing-memories')
    let notesSubframe = document.querySelector('#note-subframe')
    let memoriesSubframe = document.querySelector('#memories-subframe')
    let notesSubframeText = document.querySelector('#note-subframe-text')
    let moodMemoryImg = document.querySelector('#mood-memory-img')

    let playingSubframeStatus = false
    let playingAudio = new Audio()
    let playingStatus = false
    let playingData = null

    function playEntry (data) {
        playingData = data
        playingFrame.style.display = 'flex'
        setTimeout(function() {
            playingFrame.style.top = '0%'
    
            playingAlbum.style.backgroundImage = 'url(' + data.album + ')'
            playingAudio.src = data.preview
            notesSubframeText.innerHTML = data.note
    
            // Set Image
            playingImage.style.backgroundImage = ''
            if ('image' in data) {
                playingImage.style.backgroundImage = 'url(' + data.image + ')'
            }

            // Set Memories
            document.querySelector('#people-memory-card').style.display = 'none'
            document.querySelector('#mood-memory-card').style.display = 'none'

            peopleMemory.data = {
                list: [],
                description: ''
            }
            moodMemoryImg.src = ''

            if (data.memories != null) {
                if ('people' in data.memories) {
                    peopleMemory.list = data.memories.people.list
                    peopleMemory.description = data.memories.people.description
                    document.querySelector('#people-memory-card').style.display = 'flex'
                }
                if ('mood' in data.memories) {
                    if (data.memories.mood != null) {
                        let moodName = 'static/img/emoji/' + data.memories.mood.toLowerCase() + '.svg'
                        moodMemoryImg.src = moodName
                        document.querySelector('#mood-memory-card').style.display = 'flex'
                    }
                }
            }
    
            playingAudio.play()
            playingAudio.loop = true
            playingStatus = true
        }, 10)
    }

    function clearPlayingSubframes () {
        notesSubframe.style.display = 'none'
        memoriesSubframe.style.display = 'none'
    }

    // Exit out of playing
    playingExit.addEventListener('click', function () {
        playingAudio.pause()
        playingFrame.style.top = '100%'
        playingSubframe.style.height = '12%'
        playingSubframeStatus = false
        clearPlayingSubframes()
        setTimeout(function () {
            playingFrame.style.display = 'none'
        }, 400)
    })

    // Share log
    playingShare.addEventListener('click', function () {
        navigator.share({
            title: 'Muzed Log Share',
            url: 'https://testrepo.net'
          })
    })

    // Editing log
    playingEdit.addEventListener('click', function() {
        loggingStatus = 'editing'
        setLogs(playingData)
        loggingFrame.style.display = 'flex'
        setTimeout(function() {
            loggingFrame.style.opacity = '100%'
        }, 100)
    })

    // Playing or pausing log
    playingStart.addEventListener('click', function () {
        if (playingStatus == true) {
            playingAudio.pause()
            playingAlbum.style.animationPlayState = 'paused'
            playingStart.src = 'static/img/music/play.svg'
            playingStatus = false
        } else {
            playingAudio.play()
            playingAlbum.style.animationPlayState = 'running'
            playingStart.src = 'static/img/music/pause.svg'
            playingStatus = true
        }
    })

    // Opening Playing Subframe
    playingSubframeIndicator.addEventListener('click', function() {
        if (playingSubframeStatus == false) {
            playingSubframe.style.height = '85%'
            playingSubframeStatus = true
            notesSubframe.style.display = 'flex'
        } else {
            playingSubframe.style.height = '12%'
            playingSubframeStatus = false
            clearPlayingSubframes()
        }
    })

    // Open Notes
    playingNotes.addEventListener('click', function() {
        if (playingSubframeStatus == false) {
            playingSubframe.style.height = '85%'
            playingSubframeStatus = true
        }
        clearPlayingSubframes()
        notesSubframe.style.display = 'flex'
    })

    // Open Memories
    playingMemories.addEventListener('click', function() {
        if (playingSubframeStatus == false) {
            playingSubframe.style.height = '85%'
            playingSubframeStatus = true
        }
        clearPlayingSubframes()
        memoriesSubframe.style.display = 'flex'
    })

    ////////////////////////////////////////////////////
    // Sharing Frame Javascript
    ////////////////////////////////////////////////////
})