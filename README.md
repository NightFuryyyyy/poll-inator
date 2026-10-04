# poll-inator

Bookmarklet to extract WhatsApp poll responses.

[Demo](#demo) • [Install](#install) • [Bonus](#bonus)

![screenshot](https://raw.githubusercontent.com/NightFuryyyyy/poll-inator/refs/heads/assets/screenshot.png)

## Demo

![demo](https://raw.githubusercontent.com/NightFuryyyyy/poll-inator/refs/heads/assets/demo.gif)

## Install

Installation tutorial: [example](https://example.com)

## Bonus

The script I used to hide sensitive information in the screen recordings:
```js
javascript:
(() => {
    function shuffle(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    const TARGET_SELECTOR = "span.x1iyjqo2.x6ikm8r.x10wlt62.x1n2onr6.xlyipyv.xuxw1ft.x1jchvi3.xnpuxes";
    const CONTAINER_SELECTOR = "div.x9f619:nth-child(7) div.x13mwh8y";

    const avengers = [
        "Tony Stark",
        "Steven Rogers",
        "Thor Odinson",
        "Bruce Banner",
        "Natasha Romanoff",
        "Clinton Barton",
        "Wanda Maximoff",
        "Peter Parker",
        "Carol Danvers",
        "Stephen Strange",
    ];

    const observer = new MutationObserver(mutations => {
        const right_sidebar = document.querySelector("div.x9f619:nth-child(7)")
        if (
            !right_sidebar ||
            !mutations.some(mutation => right_sidebar.contains(mutation.target))
        ) return;
        replaceNames();
    });

    function replaceNames() {
        observer.disconnect();

        document.querySelectorAll(CONTAINER_SELECTOR).forEach((container) => {
            let list = shuffle(avengers);
            container.querySelectorAll(TARGET_SELECTOR).forEach(element => {
                if (element.textContent == "You") {
                    return;
                }
                element.textContent = list.pop();
            });
        });

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    replaceNames();

    const style = document.createElement("style");
    style.textContent = `
        img {
            content: url() !important;
        }

        div.x78zum5.xdl72j9.xdt5ytf.x1iyjqo2.xl56j7k.xeuugli.x1n1b19v,
        div.x9f619.x1hx0egp.x1yrsyyn.xf159sx.xwib8y2.x7coems,
        div.x10l6tqk.xtu3fll.x2o16fc.x1vjfegm.x1okw0bk.xh8yej3.x5yr21d.xu0uyjx.xhohe0.xodnr36.xks1hqh.xztyhrg.x18d0r48.x127lhb5.x4afe7t.xa3vuyk.x10e4vud,
        div.x78zum5.xdt5ytf.x1iyjqo2.xl56j7k.xeuugli.xtnn1bt.x9v5kkp.xmw7ebm.xrdum7p {
            filter: blur(8px);
        }
    `;
    document.head.appendChild(style);
})();
```
