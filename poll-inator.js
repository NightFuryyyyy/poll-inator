javascript:
(async () => {
    document.getElementById("pollResultWindow")?.remove();

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const question = document.querySelector("div.x67bb7w div.x1r8uery span.x19gsaw2").textContent;

    async function getVotersFromSeeAll() {
		const scrollBox = document.querySelector("div.x67bb7w div.xupqr0c");
        const voteCountText = scrollBox.querySelector("div.x1gxa6cn").textContent;
        const voteCount = parseInt(voteCountText.slice(0, voteCountText.indexOf(" ")));
        const voters = [];
        var lastRecordedVoterSpan = null;
        while (voters.length < voteCount) {
            var voterSpans = [...scrollBox.querySelectorAll(".x1iyjqo2.x1n2onr6")];
            voterSpans = voterSpans.slice(voterSpans.indexOf(lastRecordedVoterSpan) + 1);
            voters.push(...voterSpans.map(voterSpan => {
                var voter = voterSpan.textContent;
                if (voter.startsWith("~")) {
                    voter = voter.slice(2);
                }
                return voter;
            }));
            lastRecordedVoterSpan = voterSpans[voterSpans.length - 1];
            lastRecordedVoterSpan.scrollIntoView();
            await sleep(1000);
        }
        return voters;
    }

    async function getResults() {
        var obj = {};

        function optionDivs() {
            return [...document.querySelectorAll("div.x67bb7w div.x1r8uery div.x13mwh8y")].slice(1);
        }

        for (let i = 0; i < optionDivs().length; i++) {
            const optionDiv = optionDivs()[i];
            const option = optionDiv.querySelector("span.xo1l8bm").textContent;
            obj[option] = [];
            const seeAllButton = optionDiv.querySelector("button.html-button");
            if (!seeAllButton) {
                const voterSpans = optionDiv.querySelectorAll("span.x1iyjqo2");
                voterSpans.forEach(voterSpan => {
                    var voter = voterSpan.textContent;
                    if (voter.startsWith("~")) {
                        voter = voter.slice(2);
                    }
                    obj[option].push(voter);
                });
                continue;
            }
            seeAllButton.click();
            await sleep(1000);
            obj[option] = await getVotersFromSeeAll();
            const backButton = document.querySelector("div.x67bb7w button.html-button");
            backButton.click();
            await sleep(1000);
        };

        return obj;
    }

    const obj = await getResults();
    console.log(obj);

    function createElement(type, props, parent) {
        const element = document.createElement(type);
        if (props) {
            const classNames = props?.className;
            if (classNames) {
                classNames.split(/\s+/).forEach(className => {
                    element.classList.add(className);
                });
            }
            delete props.className;
            Object.assign(element, props);
        }
        parent?.appendChild(element);
        return element;
    }

    function createButton(d, props, parent) {
        const buttonDiv = document.createElement("div");
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("viewBox", "0 0 640 640");
        buttonDiv.appendChild(svg);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", d);
        svg.appendChild(path);
        if (props) {
            const classNames = props?.className;
            if (classNames) {
                classNames.split(/\s+/).forEach(className => {
                    buttonDiv.classList.add(className);
                });
            }
            delete props.className;
            Object.assign(buttonDiv, props);
        }
        parent?.appendChild(buttonDiv);
        return buttonDiv;
    }

    const pollResultWindow = createElement(
        "div",
        { id: "pollResultWindow" }
    );
    const style = createElement(
        "style",
        { textContent: "#pollResultWindow{background:#161717;padding:14px;font-size:14px;display:flex;flex-direction:column;gap:8px;width:90vw;max-width:300px;border-radius:8px;position:fixed;top:0;left:0;z-index:100;border:1px solid #343535}#pollResultWindow .titleBar{display:flex;align-items:center;gap:4px;margin:-14px -14px 0;padding:14px 14px 0}#pollResultWindow .titleDiv{flex:1;font-size:16px}#pollResultWindow .closeButtonDiv{padding:4px;background:#242626;border-radius:4px}#pollResultWindow .closeButtonDiv svg{height:16px;fill:rgb(255,255,255)}#pollResultWindow .windowContentDiv{display:flex;flex-direction:column;gap:8px}#pollResultWindow .replaceYouDiv{display:flex;flex-direction:column;gap:4px}#pollResultWindow .replaceYouInput{background:#242626;padding:4px;color:#fff;font-size:14px;border-radius:4px;border:none}#pollResultWindow .copyDiv{display:flex;flex-direction:column;gap:4px}#pollResultWindow .copyTextarea{background:#242626;max-height:400px;height:30vh;color:#fff;resize:none;font-size:14px;border:medium;padding:4px;border-radius:4px}#pollResultWindow .copyButtonDiv{padding:4px;background:#242626;margin-left:auto;border-radius:4px}#pollResultWindow .copyButtonDiv svg{height:16px;fill:rgb(255,255,255)}#pollResultWindow .copyButtonDiv .checkSvg{fill:#00ff00;display:none}#pollResultWindow .copyButtonDiv.copied svg{display:none}#pollResultWindow .copyButtonDiv.copied .checkSvg{display:block}" },
        pollResultWindow
    );
    const titleBar = createElement(
        "div",
        {
            className: "titleBar",
            onmousedown: ev => {
                if (ev.target == closeButtonDiv) {
                    return;
                }
                pollResultWindow.initialMouseX = ev.clientX;
                pollResultWindow.initialMouseY = ev.clientY;
                pollResultWindow.initialX = pollResultWindow.getBoundingClientRect().x;
                pollResultWindow.initialY = pollResultWindow.getBoundingClientRect().y;
                window.addEventListener("mousemove", windowMouseMove);
                window.addEventListener("mouseup", windowMouseUp);
            },
        },
        pollResultWindow
    );
    const titleDiv = createElement(
        "div",
        {
            className: "titleDiv",
            textContent: "poll-inator",
        },
        titleBar
    );
    const closeButtonDiv = createButton(
        "M183.1 137.4C170.6 124.9 150.3 124.9 137.8 137.4C125.3 149.9 125.3 170.2 137.8 182.7L275.2 320L137.9 457.4C125.4 469.9 125.4 490.2 137.9 502.7C150.4 515.2 170.7 515.2 183.2 502.7L320.5 365.3L457.9 502.6C470.4 515.1 490.7 515.1 503.2 502.6C515.7 490.1 515.7 469.8 503.2 457.3L365.8 320L503.1 182.6C515.6 170.1 515.6 149.8 503.1 137.3C490.6 124.8 470.3 124.8 457.8 137.3L320.5 274.7L183.1 137.4z",
        {
            className: "closeButtonDiv",
            onclick: () => {
                pollResultWindow.remove();
            },
        },
        titleBar
    );
    const windowContentDiv = createElement(
        "div",
        { className: "windowContentDiv" },
        pollResultWindow
    );
    const replaceYouDiv = createElement(
        "div",
        { className: "replaceYouDiv" },
        windowContentDiv
    );
    const replaceYouSpan = createElement(
        "span",
        {
            className: "replaceYouSpan",
            textContent: "Replace \"You\" with:",
        },
        replaceYouDiv
    );
    const replaceYouInput = createElement(
        "input",
        {
            className: "replaceYouInput",
            oninput: () => {
                copyTextarea.value = getPollResultString();
            },
        },
        replaceYouDiv
    );
    const copyDiv = createElement(
        "div",
        { className: "copyDiv" },
        windowContentDiv
    );
    const copyTitleSpan = createElement(
        "span",
        {
            className: "copyTitleSpan",
            textContent: "Copy this:",
        },
        copyDiv
    );
    const copyTextarea = createElement(
        "textarea",
        {
            className: "copyTextarea",
            value: getPollResultString(),
        },
        copyDiv
    );
    const copyButtonDiv = createButton(
        "M480 400L288 400C279.2 400 272 392.8 272 384L272 128C272 119.2 279.2 112 288 112L421.5 112C425.7 112 429.8 113.7 432.8 116.7L491.3 175.2C494.3 178.2 496 182.3 496 186.5L496 384C496 392.8 488.8 400 480 400zM288 448L480 448C515.3 448 544 419.3 544 384L544 186.5C544 169.5 537.3 153.2 525.3 141.2L466.7 82.7C454.7 70.7 438.5 64 421.5 64L288 64C252.7 64 224 92.7 224 128L224 384C224 419.3 252.7 448 288 448zM160 192C124.7 192 96 220.7 96 256L96 512C96 547.3 124.7 576 160 576L352 576C387.3 576 416 547.3 416 512L416 496L368 496L368 512C368 520.8 360.8 528 352 528L160 528C151.2 528 144 520.8 144 512L144 256C144 247.2 151.2 240 160 240L176 240L176 192L160 192z",
        {
            className: "copyButtonDiv",
            onclick: () => {
                navigator.clipboard.writeText(copyTextarea.value);
                copyButtonDiv.classList.add("copied");
                setTimeout(() => {
                    copyButtonDiv.classList.remove("copied");
                }, 2000);
            },
        },
        copyDiv
    );
    const checkSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    checkSvg.setAttribute("viewBox", "0 0 640 640");
    checkSvg.classList.add("checkSvg");
    copyButtonDiv.appendChild(checkSvg);
    const checkSvgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    checkSvgPath.setAttribute("d", "M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z");
    checkSvg.appendChild(checkSvgPath);

    document.body.appendChild(pollResultWindow);

    function getPollResultString() {
        var resultArray = [question];
        Object.keys(obj).forEach(option => {
            resultArray.push(`\n\n${option}:`);
            if (obj[option].length == 0) {
                resultArray.push("\nNone");
                return;
            }
            obj[option].forEach((voter, i) => {
                if (i == 0 && voter == "You") {
                    const youReplacement = replaceYouInput.value;
                    if (youReplacement) {
                        voter = youReplacement;
                    }
                }
                resultArray.push(`\n${i + 1}. ${voter}`);
            });
        });
        return resultArray.join("");
    }

    function windowMouseMove(e) {
        const xDiff = e.clientX - pollResultWindow.initialMouseX;
        const yDiff = e.clientY - pollResultWindow.initialMouseY;
        pollResultWindow.style.left = `${pollResultWindow.initialX + xDiff}px`;
        pollResultWindow.style.top = `${pollResultWindow.initialY + yDiff}px`;
    }

    function windowMouseUp() {
        window.removeEventListener("mouseup", windowMouseUp);
        window.removeEventListener("mousemove", windowMouseMove);
        delete pollResultWindow.initialY;
        delete pollResultWindow.initialX;
        delete pollResultWindow.initialMouseY;
        delete pollResultWindow.initialMouseX;
    }
})();
