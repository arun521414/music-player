var song_storage = []
var menu_icon        = document.getElementById("menu-icon")
var close_icon       = document.getElementById("close-icon")
var side_nav         = document.getElementById("side-nav")
var overlay          = document.getElementById("overlay")
var all_songs        = document.getElementById("all-songs")
var playlist         = document.getElementById("play-list")
var new_playlist     = document.getElementById("new-playlist")
var favourite        = document.getElementById("favourite")
var sleep            = document.getElementById("sleep")
var song_list_div    = document.getElementById("song-list-div")
var import_songs_div = document.getElementById("import-songs-div")
var import_song_btn  = document.getElementById("import-song-btn")
var import_song_input= document.getElementById("import-song-input")
var loading          = document.getElementById("load-bar")
var play_icon        = document.getElementById("play-icon")
var loop_icon        = document.getElementById('loop-icon')
var volume_icon       = document.getElementById('volume-icon')
var next_icon        = document.getElementById('skip-next-icon')
var back_icon        = document.getElementById('skip-back-icon')
var seeker           = document.getElementById("slider")
var player_div       = document.getElementById('music-player')
var duration_status  = document.getElementById("duration-status")
var volume_status    = document.getElementById("volume-status")
var volume_seeker    = document.getElementById("volume-seeker")

var songs_list;
var seeking = false
var current_song_id = 0;
var next_song_id =current_song_id+1;
var start_id = 1;
var end_id ;
console.log(end_id)
var audio = new Audio();

//side nav bar hide display


menu_icon.addEventListener("click",()=>{
    show_side_nav();
})

close_icon.addEventListener("click",()=>{
    hide_side_nav();
})



function show_side_nav(){

    side_nav.style.display = "block";
    overlay.style.display  = "block";

}

function hide_side_nav(){
    
    side_nav.style.display = "none";
    overlay.style.display  = "none";

}

//heading default

change_heading("ALL SONGS")

function change_heading(value){

    var heading = document.getElementById("heading")
    heading.innerHTML=value;

}

//side nav options


all_songs.addEventListener("click",()=>{

    change_heading("ALL SONGS");
    hide_side_nav();
    check_songs();

})

playlist.addEventListener("click",()=>{

    change_heading("PLAYLIST");
    hide_side_nav();
})

new_playlist.addEventListener("click",()=>{

    change_heading("NEW PLAYLIST");
    hide_side_nav();

})

favourite.addEventListener("click",()=>{

    change_heading("FAVOURITE");
    hide_side_nav();

})

sleep.addEventListener("click",()=>{

    change_heading("SLEEP");
    hide_side_nav();

})

//songs have or not

function check_songs(){

    if(song_storage.length!=0){
       show_songs();
    }
    else{
        song_list_div.style.display="none";
        import_songs_div.style.display="block";

    }
}


// import songs

import_song_btn.addEventListener("click",()=>{

    import_song_input.click();

})

//get songs

import_song_input.addEventListener("change",()=>{

    songs_list = import_song_input.files
    store_song(songs_list)
    import_songs_div.style.display="none";
    loading.style.display="block";

})

//store a song into song storage


function store_song(songs_list){

    var song_list_length = songs_list.length

    for(let i =0;i<song_list_length;i++){

        let reader = new FileReader();

            reader.readAsDataURL(songs_list[i])
            
        reader.onloadend = ()=>{

            //once song fully loaded
            if(song_list_length===song_storage.length){
                console.log("song loaded completely")
                end_id = song_storage.length;
                loading.style.display="none";
                check_songs();
            }

        }
    
        reader.onload = ()=>{

        if(songs_list[i].type=="audio/mpeg"){
            console.log('add')
            song_storage.push(

                {
                    id           : song_storage.length+1,
                    name         : songs_list[i].name,
                    favourite    :false,
                    playlistName :{},
                    source       : reader.result,
                }
                
            )
        }
        else{
            console.log(song_list_length)
            song_list_length  = song_list_length-1;
        }


          
        }
    }
  


}



// show song list in main content

function show_songs(){

    song_list_div.innerHTML = "";
    song_storage.forEach((data)=>{
        song_list_div.innerHTML += `<li  onclick="ready_play_song('${data.id}')" id="${data.id}">${data.name}</li>`
    })
    import_songs_div.style.display="none";
    song_list_div.style.display="block";
}



function ready_play_song(song_id){
    if(current_song_id!=song_id){
        show_player()
        get_song(song_id)
    }
    
}

//show player




function show_player(){

    player_div.style.display = 'block';
    play_icon.innerHTML = 'pause';
    console.log(songs_list)
}

function get_song(song_id){
    console.log("song get")
    song_storage.every((data)=>{
        if(data.id==song_id){
            show_status(data.id)
            play_song(data.source);
            console.log("moved")
            current_song_id = data.id;
            next_song_id = current_song_id+1;
            return false;
        }
        else{
            console.log("false")
            return true
        }
    })

}



function play_song(src){
    console.log("song start")
    audio.pause()
    audio.loop=false;
    audio.volume=0.5;
    loop_icon.style.color= "silver";
    audio.src = src;
    reset_seeker();
    audio.play();


}

audio.addEventListener("ended",()=>{
    console.log("song ended")
    if(audio.loop == false){
        get_song(next_song_id);
    }
    else{
        console.log("song looped")
    }
    
})

// audio.addEventListener("playing",)


//icon control


play_icon.addEventListener("click",()=>{

    if(play_icon.innerHTML==='pause'){
        //play
        audio.pause();
        play_icon.innerHTML="play_arrow";
    }
    else{
        audio.play();
        play_icon.innerHTML="pause";
    }

})

next_icon.addEventListener("click",()=>{
    if(current_song_id===end_id){
        get_song(start_id)
    }
    else{
    get_song(current_song_id+1)
    }
})

back_icon.addEventListener("click",()=>{
    if(current_song_id===1){
        console.log(current_song_id)
        console.log(end_id)
        get_song(end_id)
    }
    else{
    get_song(current_song_id-1)
    }
})

loop_icon.addEventListener("click",()=>{
    looping();
})


function looping(){

    if(audio.loop == false){
        loop_icon.style.color="black";
        audio.loop=true
    }
    else{
        audio.loop=false
        loop_icon.style.color= "silver";
    }
}

seeker.addEventListener("change",()=>{
    var seeker_positiion = audio.duration*(seeker.value/100)
    audio.currentTime = seeker_positiion
})
var range_slider

var position

audio.addEventListener("timeupdate",range_slider)

function range_slider(){
    if(!isNaN(audio.duration)){
        position = audio.currentTime * (100/audio.duration)
        seeker.value = position
    }

}

function reset_seeker(){
    seeker.value = 0;
}

function show_status(d){
    var status_li = document.getElementsByTagName("li")
    var len = status_li.length
    console.log(status_li)

    for(var i = 0;i<len;i++){
        if(status_li[i].id==d){
            status_li[i].style.color="black";
        }
        else{
            status_li[i].style.color="white";
        }
    }
}

audio.addEventListener("timeupdate",()=>{
    let current_minutes = Math.floor(audio.currentTime/60)
    let current_seconds = Math.floor(audio.currentTime - current_minutes*60)
    let duration_minutes = Math.floor(audio.duration/60)
    let duration_seconds = Math.floor(audio.duration-duration_minutes*60)
    // if(current_seconds<10){
    //     current_seconds = "0"+current_seconds
    // }
    if(duration_seconds<10){
        duration_seconds = "0"+duration_seconds
    }

    if(current_minutes<10){
        current_minutes = "0"+current_minutes
    }
    if(current_seconds <10){
        current_seconds = "0"+current_seconds
    }
    if(duration_minutes&&duration_status != NaN)
        duration_status.innerHTML=`${current_minutes}.${current_seconds} / ${duration_minutes}.${duration_seconds}`
})

var current_volume;
var seeker_current_value;

volume_seeker.addEventListener("change",(e)=>{

    volume_status.innerHTML=`${e.target.value}`;
    seeker_current_value = e.target.value;
    audio.volume = volume_seeker.value /100;
    current_volume = audio.volume
    if(audio.volume==0){
        volume_icon.innerHTML="volume_off"
    }
    else{
        volume_icon.innerHTML = "volume_up"
    }

})

volume_icon.addEventListener("click",()=>{

    if(volume_icon.innerHTML==="volume_off"){
        volume_icon.innerHTML = "volume_up"
        audio.volume = current_volume;
    }
    else{
        volume_icon.innerHTML = "volume_off"
        audio.volume = 0;
    }
})






