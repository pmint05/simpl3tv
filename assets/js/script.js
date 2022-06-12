const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const container = document.getElementById("mainApp"),
	left = document.getElementById("tvWrapper"),
	right = document.getElementById("iframeWrapper"),
	handle = document.getElementById("drag");
let channelsList;
let player;
const channelGr = $("#channelGr");
const channelsInput = $("#channels");
const website = $("#website");
let isPaused = false;
if (
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	)
) {
	$("#app").innerHTML = `
    <div id="mobileNoti">
    <header id="mobileHeader" class="done"><span> RHINZO </span>
            <mc>TV.</mc></header>
            <br>
        <p>Phiên bản mobile chưa sẵn sàng</p>
        <br>
        <p>Hãy truy cập trên máy tính desktop</p>
        </div>
        `;
}
const getChannels = () => {
	fetch("./assets/data/channels.json")
		.then((res) => res.json())
		.then((data) => {
			channelsList = data;
			for (key in data) {
				let option = document.createElement("option");
				option.value = key;
				option.innerHTML = key.toUpperCase();
				channelGr.appendChild(option);
				// console.group();
				// console.log(key);
				// console.log(data[key]);
				// console.groupEnd();
			}
			for (i in data["VTV"]) {
				let VTVchannels = data["VTV"][i];
				let option = document.createElement("option");
				option.value = VTVchannels.link;
				option.innerHTML = VTVchannels.name.toUpperCase();
				channelsInput.appendChild(option);
			}
			$("#tv source").setAttribute("src", channelsInput.value);
			player = videojs("tv", {
				fluid: false,
				responsive: true,
				aspectRatio: "16:9",
				playbackRates: [0.25, 0.5, 1, 1.5, 2],
				playWaitingForReady_: true,
				// controlBar: { pictureInPictureToggle: true },
				// src: channelsInput.value,
			});
			videojs("tv").ready(function () {
				$("#loadingWrapper").classList.add("hide");
				$("header").classList.add("done");
			});
			player.play();
			player.on("pause", () => {
				isPaused = true;
			});
			player.on("play", () => {
				$("#pip").classList.add("active");
			});
		});
	$("#selectField").style.width =
		container.offsetWidth - (container.offsetHeight * 16) / 9 + 55 + "px";
};
getChannels();
channelGr.onchange = () => {
	channelsInput.innerHTML = "";
	for (i in channelsList[channelGr.value]) {
		let option = document.createElement("option");
		option.value = channelsList[channelGr.value][i].link;
		option.innerHTML = channelsList[channelGr.value][i].name.toUpperCase();
		channelsInput.appendChild(option);
	}
	setChannel(channelsInput.value);
};
channelsInput.onchange = () => {
	setChannel(channelsInput.value);
};
const setChannel = (channel) => {
	$("#tv source").setAttribute("src", channel);
	player.src({ src: channel });
	player.play();
};
var isResizing = false;

(function () {
	handle.onmousedown = function (e) {
		isResizing = true;
		handle.style.width = container.offsetWidth + "px";
	};
	document.onmousemove = function (e) {
		if (!isResizing) {
			return;
		}
		if (e.clientX < 310) {
			right.style.width = container.clientWidth + "px";
			left.style.right = container.clientWidth + "px";
			player.pause();
			isPaused = false;
			$("#showOptions").classList.remove("active");
			$("#selectField").classList.remove("show");
			return;
		}
		if (container.clientWidth - e.clientX < 250) {
			right.style.width = "0px";
			left.style.right = "0px";
			$("#selectField").classList.remove("sticky");
			$("#showOptions").classList.remove("active");
			left.classList.add("active");
			handle.classList.add("active");
		} else {
			if (!isPaused) {
				player.play();
			}
			var offsetRight =
				container.clientWidth - (e.clientX - container.offsetLeft);
			$(
				".panelInfo"
			).innerText = `${right.clientWidth}x${right.clientHeight}`;
			$(".panelInfo").classList.add("show");
			left.style.right = offsetRight + "px";
			right.style.width = offsetRight + "px";
			left.classList.remove("active");
			$("#showOptions").classList.add("active");
			$("#selectField").classList.add("sticky");
			handle.classList.remove("active");
		}
	};

	document.onmouseup = function (e) {
		$(".panelInfo").classList.remove("show");

		// stop resizing
		isResizing = false;
		handle.style.width = "8px";
	};
})();
const reloadIframe = () => {
	$("#iframe").src += "";
};
const iframeBackward = () => {
	$("#iframe").contentDocument.history.back();
};
const iframeForward = () => {
	$("#iframe").contentDocument.history.forward();
};
const closeIframe = () => {
	$("#iframeWrapper").classList.remove("active");
	$("#tvWrapper").classList.add("active");
	$("#iframeWrapper").style.display = "none";
	$("#iframe").src = "";
	left.style.right = "0px";
	$("#selectField").style.width =
		container.offsetWidth - (container.offsetHeight * 16) / 9 + 55 + "px";
};
var aTags = document.querySelectorAll("span[data-href]");

for (var i = 0; i < aTags.length; i++) {
	var aTag = aTags[i];
	aTag.addEventListener("click", function (e) {
		var ele = e.target;
		window.open(ele.getAttribute("data-href"), "_blank").focus();
	});
}
const embedBtn = $("#embedBtn"),
	customWebInp = $("#customWebInp");
embedBtn.onclick = () => {
	if (customWebInp.value.trim().length > 0) {
		embedWebsite(customWebInp.value);
		customWebInp.value = "";
	} else if (website.value.trim().length > 0) {
		embedWebsite(website.value);
	} else {
		alert("Please enter a website");
	}
	left.classList.remove("active");
	right.classList.add("active");
};
$("#iframe").onload = () => {
	$("#loadingFrame").classList.add("loaded");
};
const embedWebsite = (site) => {
	$("#loadingFrame").classList.remove("loaded");
	$("#iframeWrapper").style.display = "block";
	$("#iframe").src = site;
	website.onchange = () => {
		$("#loadingFrame").classList.remove("loaded");
		$("#iframe").src = website.value;
	};
	$("#selectField").classList.add("sticky");
	$("#showOptions").classList.add("active");
};
const toggleOptions = (show) => {
	$("#selectField").classList.toggle("show");
};
const pip = () => {
	// If there is no element in Picture-in-Picture yet, let’s request
	// Picture-in-Picture for the video, otherwise leave it.
	if (!document.pictureInPictureElement) {
		$("video")
			.requestPictureInPicture()
			.catch((error) => {
				// Video failed to enter Picture-in-Picture mode.
			});
	} else {
		document.exitPictureInPicture().catch((error) => {
			// Video failed to leave Picture-in-Picture mode.
		});
	}
};
document.onclick = (e) => {
	if (
		!e.target.closest("#selectField") &&
		$("#selectField").classList.contains("show") &&
		!e.target.closest("#showOptions")
	) {
		$("#selectField").classList.remove("show");
	}
};
