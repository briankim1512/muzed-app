document.addEventListener('DOMContentLoaded', function () {
    // Intro Frame Javascript
    let html = document.querySelector('html')
    let introButton = document.querySelector('.intro-btn')
    
    introButton.addEventListener('click', function () {
        html.requestFullscreen()
    })

    // Landing Frame Javascript
    // !!! Dummy Data for testing  !!!
    const entries = [
        {date: 1, songName: "a", songArtist: "a"},
        {date: 2, songName: "b", songArtist: "b"},
        {date: 3, songName: "c", songArtist: "c"},
        {date: 4, songName: "d", songArtist: "d"},
        {date: 5, songName: "e", songArtist: "e"},
        {date: 6, songName: "f", songArtist: "f"},
        {date: 7, songName: "g", songArtist: "g"},
        {date: 8, songName: "h", songArtist: "h"},
        {date: 9, songName: "a", songArtist: "a"}
    ]

    let diary = new Vue({
        el: '#landing-diary',
        delimiters: ['[[',']]'],
        data: {
            entries: entries
        }
    })

    // Logging Frame Javascript

    // Playing Frame Javascript

    // Sharing Frame Javascript
})