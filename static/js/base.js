let isLightMode = () => {
    let theme = localStorage.getItem("theme")
    if (theme == null || theme == "light") {
        return true;
    } else {
        return false;
    }
};

let updateTheme = () => {
    let replaceClass = (from, to) => {
        for (const element of document.querySelectorAll("." + from)) {
            element.classList.remove(from);
            element.classList.add(to);
        }
    };

    let replaceImgSource = (from, to) => {
        for (const element of document.querySelectorAll("img")) {
            element.src = element.src.replace(from, to)
        }
    };

    if (isLightMode()) {
        replaceClass("light-bg", "dark-bg");
        replaceClass("light-secondary-bg", "dark-secondary-bg");
        replaceClass("light-fg", "dark-fg");
        replaceClass("light-border", "dark-border");
        replaceClass("light-hover", "dark-hover");
        replaceClass("light-highlight", "dark-highlight");
        replaceImgSource("icon-light", "icon-dark");
    } else {
        replaceClass("dark-bg", "light-bg");
        replaceClass("dark-secondary-bg", "light-secondary-bg");
        replaceClass("dark-fg", "light-fg");
        replaceClass("dark-border", "light-border");
        replaceClass("dark-hover", "light-hover");
        replaceClass("dark-highlight", "light-highlight");
        replaceImgSource("icon-dark", "icon-light");
    }
}

window.onscroll = function() {
  var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrolled = (winScroll / height) * 100;
  document.getElementById("scroll-indicator-bar").style.width = scrolled + "%";
} 

window.addEventListener('DOMContentLoaded', async () => {
    for (const element of document.querySelectorAll("h1, h2, h3, h4, h5")) {
        element.classList.add("dark-fg")
    }

    let themeBtn = document.getElementById("theme-btn");
    if (themeBtn != null) {
        themeBtn.style.display = "inline";

        themeBtn.onclick = (_) => {
            if (isLightMode()) {
                localStorage.setItem("theme", "dark");
            } else {
                localStorage.setItem("theme", "light");
            }
            updateTheme();
        }

        updateTheme();
    }

    let get = async (url) => {
        const CACHE_TIMEOUT = 60000;
        const now = new Date().getTime();
        const prevResp = JSON.parse(localStorage.getItem(url));
        if (prevResp && Math.abs(now - prevResp.time) < CACHE_TIMEOUT) {
            return prevResp.data;
        }
        const resp = await fetch(url);
        const json = await resp.json();
        localStorage.setItem(url, JSON.stringify({time: now, data: json}));
        return json;
    };

    const emojis = await get('https://api.github.com/emojis');
    const colors = await get('https://raw.githubusercontent.com/ozh/github-colors/master/colors.json');

    for (const element of document.querySelectorAll('.github-repo-details')) {
        if (element.attributes.custom) {
            let data = await get(`https://api.github.com/repos/${element.attributes.custom.nodeValue}`);

            data.description = (data.description || '').replace(/:\w+:/g, function (match) {
                const name = match.substring(1, match.length - 1);
                const emoji = emojis[name];

                if (emoji) {
                    return `<span><img src="${emoji}" style="width: 1rem; height: 1rem; vertical-align: -0.2rem;" alt="${name}"></span>`;
                }

                return match;
            });

            element.innerHTML = `
            <div style="display : flex; flex-direction = column;">
                <div>${data.description}</div>  
                <div style="display : flex; flex-direction = row;">
                    <div style="${data.language ? '' : 'display: none;'} margin-right: 16px;">
                          <span style="width: 12px; height: 12px; border-radius: 100%; background-color: ${data.language ? colors[data.language].color : ''}; display: inline-block; top: 1px; position: relative;"></span>
                          <span>${data.language}</span>
                    </div>
                </div>
                    <div style="display: ${data.stargazers_count === 0 ? 'none' : 'flex'}; align-items: center; margin-right: 16px;">
                        <svg class="svg-icon" aria-label="stars" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path></svg>
                            &nbsp; <span>${data.stargazers_count}</span>
                    </div>
                <div style="display: ${data.forks === 0 ? 'none' : 'flex'}; align-items: center;">
                    <svg class="svg-icon" aria-label="fork" viewBox="0 0 16 16" version="1.1" width="16" height="16" role="img"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
                    &nbsp; <span>${data.forks}</span>
                </div>
            </div>
            `;
        }
    }
});
