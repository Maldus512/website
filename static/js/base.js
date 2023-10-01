window.addEventListener('DOMContentLoaded', async () => {
    let close_sidebar_btn_id = "close-sidebar-btn";
    let open_sidebar_btn_id = "open-sidebar-btn";
    let scaffold_open = false;

    let close_sidebar = () => {
        scaffold_open = false;

        let element = document.getElementById("side-navbar");
        element.style.transitionDuration = "0.5s";

        window.setTimeout(() => {
            let element = document.getElementById("side-navbar");
            element.style.flexBasis = "0px";
            element.style.width = "0px";
            window.setTimeout(() => {
                let element = document.getElementById("side-navbar");
                element.style.transitionDuration = "0s";
            }, 500);
        });
    };

    let open_sidebar = () => {
        scaffold_open = true;

        let element = document.getElementById("side-navbar");
        element.style.transitionDuration = "0.5s";

        window.setTimeout(() => {
            let element = document.getElementById("side-navbar");
            element.style.flexBasis = "320px";
            element.style.width = "320px";
            window.setTimeout(() => {
                let element = document.getElementById("side-navbar");
                element.style.transitionDuration = "0s";
            }, 500);
        });
    };

    let is_scaffold_open = () => {
        if (scaffold_open) {
            return true;
        }

        let taglist = window.location.href.split("#")
        if (taglist.length > 1) {
            return taglist.slice(-1)[0] == "scaffold";
        } else {
            return false;
        }
    };

    let should_open_scaffold = () => { // Do not open scaffold in small websites
        return !window.matchMedia("(max-width: 800px)").matches && is_scaffold_open()
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

    navigate_to = (path) => {
        console.log(path);
        if (should_open_scaffold()) {
            document.location.href = path + "#scaffold";
        } else {
            document.location.href = path;
        }
        return false;
    };


    document.getElementById(close_sidebar_btn_id)
        .addEventListener("click", close_sidebar);

    document.getElementById(open_sidebar_btn_id)
        .addEventListener("click",
            open_sidebar);

    if (is_scaffold_open()) {
        let element = document.getElementById("side-navbar");
        element.style.flexBasis = "320px";
        element.style.width = "320px";
    }

    for (const link of document.querySelectorAll(".navigation-link")) {
        link.onclick = () => {
            navigate_to(link.href);
            return false;
        }
    }

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
