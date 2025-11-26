// CSS styles
const editorsChoiceStyles = `
<style>
    .homeSectionsContainer.editorsChoiceAdded {
        padding-top: 0 !important;
    }

    .homeSectionsContainer.editorsChoiceAdded .editorsChoiceContainer {
        padding-left: 3.3%;
        padding-left: max(env(safe-area-inset-left), 3.3%);
        padding-right: 3.3%;
        padding-right: max(env(safe-area-inset-right), 3.3%);
        margin-bottom: 1.8em;
    }

    .editorsChoiceItemsContainer {
        column-gap: normal !important;
    }

    .editorsChoiceScrollButtonsContainer, .editorsChoicePlayPauseContainer {
        position: absolute;
        z-index: 99;
        right: 0.15em;
        mix-blend-mode: difference;
    }

    .editorsChoiceScrollButtonsContainer {
        width: 7em;
    }

    .editorsChoicePlayPauseContainer {
        width: 4em;
    }

    .editorsChoiceScrollButtonsContainer > .splide__arrows, .editorsChoicePlayPauseContainer > .splide__toggle {
        float: right;
    }

    @media screen and (max-width: 500px) {
        .editorsChoiceScrollButtonsContainer, .editorsChoicePlayPauseContainer {
            display: none;
        }
    }

    .splide__track {
        border-radius: 0.2em;
    }

    .splide__arrow, .splide__toggle {
        position: relative;
        display: inline-block;
        opacity: 1;
        top: auto;
        transform: none;
        width: auto;
        height: auto;
        padding: .556em;
        background: transparent;
    }

    .splide__arrow--next {
        right: auto;
    }

    .splide__arrow--prev {
        left: auto;
    }

    .editorsChoicePlayPauseContainer {
        display: none;
        bottom: 0.83em;
    }

    .splide__toggle.is-active .splide__toggle__play, .emby-scrollbuttons-button>.splide__toggle__pause {
        display: none;
    }

    .editorsChoiceItemBanner {
        width: 100%;
        height: 360px;
        flex: none;
        background-size: cover;
        background-position-x: center;
        background-position-y: 15%;
        cursor: pointer;
        color: #ddd;
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
    }

    .editorsChoiceItemBanner > div {
        width: 100%;
        height: 100%;
        padding: 30px;
        box-sizing: border-box;
        background: linear-gradient(90deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 60%, rgba(0, 0, 0, 0) 100%);
    }

    .editorsChoiceItemLogo {
        display: block;
        max-width: 300px;
        max-height: calc(50% - 45px);
    }

    .editorsChoiceItemTitle {
        max-width: 100%;
        margin: 0 60px 0 0;
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .editorsChoiceItemOverview {
        white-space: normal;
        width: 650px;
        min-width: 40%;
        max-width: 100%;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
    }

    .layout-tv .editorsChoiceItemOverview {
        min-width: 55%;
        -webkit-line-clamp: 2;
    }

    .editorsChoiceItemButton {
        width: auto !important;
        display: inline-block !important;
        position: absolute;
        margin: 0 !important;
        bottom: 30px;
    }

    .editorsChoiceItemRating {
        display: block !important;
        margin-top: 1em;
    }

    .starIcon {
        color: #f2b01e;
        font-size: 1.4em;
        margin-right: 0.125em;
        vertical-align: bottom;
    }

    .editorsChoiceContainer .sectionTitle-cards {
        padding-bottom: 0.35em;
    }

    @media screen and (max-width: 500px) {
        .editorsChoiceItemLogo {
            max-width: 100%;
            max-height: 100px;
            height: auto;
            filter: drop-shadow(3px 3px 15px black);
        }
    }

    @media screen and (max-width: 1600px) {
        .homeSectionsContainer.editorsChoiceAdded {
            margin-top: 30px;
        }
    }
</style>
`;

// Container HTML template
var containerTemplate = `<div class="verticalSection section-1 editorsChoiceContainer">
    <div class="splide cardScalable">
        <div class="editorsChoiceScrollButtonsContainer">
            <div class="emby-scrollbuttons splide__arrows">
                <button type="button" is="paper-icon-button-light" data-ripple="false" data-direction="left" title="Previous" class="emby-scrollbuttons-button paper-icon-button-light splide__arrow splide__arrow--prev">
                    <span class="material-icons chevron_left" aria-hidden="true"></span>
                </button>
                <button type="button" is="paper-icon-button-light" data-ripple="false" data-direction="right" title="Next" class="emby-scrollbuttons-button paper-icon-button-light splide__arrow splide__arrow--next">
                    <span class="material-icons chevron_right" aria-hidden="true"></span>
                </button>
            </div>
        </div>
        <div class="editorsChoicePlayPauseContainer">
            <button class="splide__toggle emby-scrollbuttons-button paper-icon-button-light" type="button">
                <span class="splide__toggle__play material-icons play_arrow" aria-hidden="true"></span>
                <span class="splide__toggle__pause material-icons pause" aria-hidden="true"></span>
            </button>
        </div>
        <div class="splide__track">
            <div is="emby-itemscontainer" class="editorsChoiceItemsContainer splide__list animatedScrollX">
            </div>
        </div>
    </div>
</div>`;

var stylesInjected = false;

const GUID = "70bb2ec1-f19e-46b5-b49a-942e6b96ebae";

// Localization strings
var localization = {
    watchButton: {
        en: "Watch",
        fr: "Regarder",
        es: "Ver",
        de: "Ansehen",
        it: "Guarda",
        pt: "Assistir",
        zh: "观看",
        ja: "見る",
        ru: "Смотреть",
    },
};

// Cache user language
var userLanguage = navigator.language.slice(0, 2);

function getLocalizedString(key) {
    return (localization[key] && localization[key][userLanguage]) || (localization[key] && localization[key]["en"]);
}

// Fisher-Yates shuffle
function shuffle(array) {
    var result = array.slice();
    for (var i = result.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = result[i];
        result[i] = result[j];
        result[j] = temp;
    }
    return result;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return "";
    var div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

// Cache screen dimensions
var bannerImageWidth = Math.max(window.screen.width, window.screen.height);

// Build backdrop URL for an item
function getBackdropUrl(itemId, reduceImageSizes) {
    var size = reduceImageSizes ? "?width=" + bannerImageWidth : "";
    return "../Items/" + itemId + "/Images/Backdrop/0" + size;
}

// Build slide HTML for a single favourite item
function buildSlideHtml(favourite, data, baseUrl) {
    var communityRating = favourite.community_rating ? favourite.community_rating.toFixed(1) : 0;

    // skip rating if it is 0 - a perfect zero means the metadata provider has no score so is misrepresentative
    var ratingHtml = communityRating != 0 ? '<div class="editorsChoiceItemRating starRatingContainer"><span class="material-icons starIcon star"></span>' + communityRating + "</div>" : "";

    // Logo or title fallback
    var logoImageSize = data.reduceImageSizes ? "?width=300" : "";
    var escapedName = escapeHtml(favourite.name);
    var logoHtml = favourite.hasLogo ? '<img class="editorsChoiceItemLogo" loading="lazy" src="../Items/' + favourite.id + "/Images/Logo/0" + logoImageSize + '" alt="' + escapedName + '"/>' : '<h1 class="editorsChoiceItemTitle">' + escapedName + "</h1>";

    // Overview
    var overviewHtml = favourite.overview ? '<p class="editorsChoiceItemOverview">' + escapeHtml(favourite.overview) + "</p>" : "";

    // Button
    var buttonHtml = '<button is="emby-button" class="editorsChoiceItemButton raised button-submit block emby-button"><span>' + getLocalizedString("watchButton") + "</span></button>";

    var backdropUrl = getBackdropUrl(favourite.id, data.reduceImageSizes);

    return '<a href="' + baseUrl + "#/details?id=" + favourite.id + '" ' + "onclick=\"Emby.Page.showItem('" + favourite.id + "'); return false;\" " + 'class="editorsChoiceItemBanner splide__slide" ' + "style=\"background-image:url('" + backdropUrl + "');\">" + "<div>" + logoHtml + ratingHtml + overviewHtml + buttonHtml + "</div></a>";
}

// Setup slider
function setup() {
    console.log("Attempting creation of editors choice slider.");

    var $containers = $(".homeSectionsContainer").not(".editorsChoiceAdded");
    if ($containers.length === 0) return;

    $containers.each(function () {
        var $elem = $(this);

        console.log("Fetching favourites data from API...");
        ApiClient.fetch({ url: ApiClient.getUrl("/EditorsChoice/favourites"), type: "GET" })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                // Check if already processed
                if ($elem.hasClass("editorsChoiceAdded")) return;

                var isTvLayout = document.documentElement.classList.contains("layout-tv");

                // If configured to hide on TV layout, skip rendering
                if (data.hideOnTvLayout && isTvLayout) {
                    console.log("Editors Choice: hidden on TV layout by configuration.");
                    return;
                }

                // Inject styles
                if (!stylesInjected) {
                    $("head").append(editorsChoiceStyles);
                    stylesInjected = true;
                }

                var favourites = shuffle(data.favourites);
                if (favourites.length === 0) return;

                var containerId = "editorsChoice-" + Date.now();
                var $containerElem = $(containerTemplate);
                $containerElem.first().attr("id", containerId);
                $elem.prepend($containerElem);

                // TV layout focus handling - redirect focus from scroll buttons to Home tab
                if (isTvLayout) {
                    var focusResolved = false;
                    var $homeTab = $(".emby-tab-button").first();
                    $("#" + containerId + " .emby-scrollbuttons button").on("focus", function () {
                        if (!focusResolved && $homeTab.length) {
                            $homeTab.focus();
                            focusResolved = true;
                        }
                    });
                }

                // Add heading if exists
                if (data.heading) {
                    $containerElem.prepend('<h2 class="sectionTitle sectionTitle-cards">' + escapeHtml(data.heading) + "</h2>");
                }

                // Calculate baseUrl
                var baseUrl = Emby.Page.baseUrl() + "/";
                if (window.location.href.indexOf("/index.html") !== -1) {
                    baseUrl += "index.html";
                }

                // Build HTML
                var slidesHtml = favourites
                    .map(function (favourite) {
                        return buildSlideHtml(favourite, data, baseUrl);
                    })
                    .join("");

                $("#" + containerId + " .editorsChoiceItemsContainer").html(slidesHtml);

                $elem.addClass("editorsChoiceAdded");

                if (data.autoplay) {
                    $("#" + containerId + " .editorsChoicePlayPauseContainer").show();
                }

                new Splide("#" + containerId + " .splide", {
                    type: "loop",
                    autoplay: data.autoplay,
                    interval: data.autoplayInterval,
                    pagination: false,
                    keyboard: true,
                    height: data.bannerHeight + "px",
                }).mount();
            })
            .catch(function (error) {
                console.error("Editors Choice: Failed to load favourites", error);
            });
    });
}

window.onload = function () {
    var sliderScript = document.createElement("script");
    sliderScript.type = "text/javascript";
    sliderScript.src = "../EditorsChoice/splide.js";

    var sliderStyle = document.createElement("link");
    sliderStyle.rel = "stylesheet";
    sliderStyle.href = "../EditorsChoice/splide.css";

    document.head.appendChild(sliderScript);
    document.head.appendChild(sliderStyle);

    var target = document.getElementById("reactRoot");
    if (!target) {
        console.warn("Editors Choice: reactRoot not found");
        return;
    }

    // MutationObserver with debounce
    var setupPending = false;
    var observer = new MutationObserver(function (mutations) {
        if (setupPending) return;

        for (var i = 0; i < mutations.length; i++) {
            var mutation = mutations[i];
            if (mutation.type !== "childList" || !mutation.addedNodes.length) continue;

            for (var j = 0; j < mutation.addedNodes.length; j++) {
                var node = mutation.addedNodes[j];
                if (node.nodeType === 1 && node.classList && node.classList.contains("section0") && !node.classList.contains("editorsChoiceAdded")) {
                    setupPending = true;
                    setTimeout(function () {
                        setup();
                        setupPending = false;
                    }, 50);
                    return;
                }
            }
        }
    });

    observer.observe(target, { childList: true, subtree: true });

    // Remind user that their favourites will be public when they add a new favourite
    $(document.body).on("click", '[is="emby-ratingbutton"]', function () {
        var $btn = $(this);
        if (!$btn.hasClass("ratingbutton-withrating")) {
            ApiClient.getPluginConfiguration(GUID).then(function (data) {
                if (ApiClient.getCurrentUserId() === data.EditorUserId) {
                    Dashboard.confirm("You are the featured items editor! Your favourites will be displayed on the home page for all users, if enabled.");
                }
            });
        }
    });
};
