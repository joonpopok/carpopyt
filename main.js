const apiKey = 'AIzaSyBe0T9X9RDwTcJM4EXd9NTZIMDpzERJQZY';
const videoChannel = document.querySelector('#video-channel');
const videoContainer = document.querySelector('#video-container');
const channelId = 'UCQ665siYyilhuXWxWbGEwIg';

// Channel
const channelEndpoint = `https://www.googleapis.com/youtube/v3/channels?key=${apiKey}&id=${channelId}&part=snippet,contentDetails,statistics`;

// const ytPromise = fetch(channelEndpoint);
// ytPromise.then(res => res.json()).then(data => console.log(data));

fetch(channelEndpoint)
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        showChannel(data);
        
        const playlistId = data.items[0].contentDetails.relatedPlaylists.uploads;
        requestPlaylist(playlistId);
    });

function showChannel(data) {
    const myId = data.items[0].id;
    const title = data.items[0].snippet.title;
	const desc = data.items[0].snippet.description;
	const videos = data.items[0].statistics.videoCount;
	const subscribers = data.items[0].statistics.subscriberCount;
	const views = data.items[0].statistics.viewCount;
	const imageLink = data.items[0].snippet.thumbnails.medium.url;

    let output = `
    <div class="col-md-6 mb-4 text-center">
        <img src="${imageLink}" alt="" class="img-fluid" />
        <br />
        <a href="https://www.youtube.com/channel/${myId}" target="_blank" class="btn btn-danger btn-sm">유튜브 채널로 이동</a>
    </div>
    <div class="col-md-6 mb-4">
        <ul class="list-group shadow-lg">	
            <li class="list-group-item bg-danger"><strong class="text-white"> ${title}</strong></li>
            <li class="list-group-item"><strong>동영상 수</strong>: ${numberWithCommas(videos)}</li>
            <li class="list-group-item"><strong>구독자 수</strong>: ${numberWithCommas(subscribers)}</li>
        </ul>
    </div>
    `;
    videoChannel.innerHTML = output;
}

// Add commas to number
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Request play list items
function requestPlaylist(playlistId) {
    const maxResults = ${numberWithCommas(videos)};
    const playlistURL = `https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&playlistId=${playlistId}&part=snippet&maxResults=${maxResults}`;

    fetch(playlistURL)
        .then(res => res.json())
        .then(data => loadVideo(data));
}

// Display Videos
function loadVideo(data) {
	const playListItems = data.items;
	// console.log(playListItems);

	if(playListItems) {
		let output = '';

		playListItems.forEach(item => {
			const videoId = item.snippet.resourceId.videoId;

			output += `
				<div class="col-lg-4 col-md-6 mb-4">
					<div class="card card-body p-0 shadow embed-responsive embed-responsive-16by9">
						<iframe height="auto" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
					</div>
				</div>
			`;
		});

		videoContainer.innerHTML = output;
	} else {
		videoContainer.innerHTML = 'Sorry, No videos uploaded!';
	}
}
