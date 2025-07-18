$(document).ready(function(){
    fnSetAsideHeight();

    // 커리큘럼 어코디언
    $(".btn-toggle").on('click', function (){
        var btn = this;
        var ul = $(btn).next("ul");

        if(ul.is(":visible")){
            ul.stop(true, true).slideUp();
            $(btn).removeClass("active");
        }else{
            ul.stop(true, true).slideDown();
            $(btn).addClass("active");
        }
    });

    // 질문하기
    $("input[name='secretOption']").on("change", function () {
        $(".radio-box-wrap i").removeClass().addClass("fa-regular fa-circle");

        $("input[name='secretOption']:checked").siblings("label").find("i").removeClass().addClass("fa-regular fa-circle-dot");
    });

    // 질문하기 - 초기 렌더링 시
    $("input[name='secretOption']:checked").siblings("label").find("i").removeClass().addClass("fa-regular fa-circle-dot");
}); //END: document.ready

$(window).on("resize", function(){
    fnSetAsideHeight();
});

function fnCloseCurr(){
    $(".player-container").addClass("full");
    $(".aside-pannels").addClass("closed");
    $(".video-wrap").addClass("expanded");
    $(".side-menu-wrap").addClass("fixed");
    $(".side-menu-wrap > button").removeClass("active");
}

function fnUpdatePanel(clickedBtn){
    const targetPanelId = $(clickedBtn).attr("aria-controls");
    
    $("#curriculumPanel").attr("hidden", targetPanelId !== "curriculumPanel");
    $("#qnaPanel").attr("hidden", targetPanelId !== "qnaPanel");

    $(".player-container").removeClass("full");
    $(".aside-pannels").removeClass("closed");
    $(".video-wrap").removeClass("expanded");
    $(".side-menu-wrap").removeClass("fixed");

    $(".side-menu-wrap > button").removeClass("active").attr("aria-expanded", "false");
    $(clickedBtn).addClass("active").attr("aria-expanded", "true");
}

function fnSetAsideHeight(){
    if(window.innerWidth < 1025){
        var windowHeight = $(window).height();
        var videoHeight = $(".video-wrap").outerHeight() || 0;
        var menuHeight = $(".side-menu-wrap.for-mobile").outerHeight() || 0;
        var newHeight = windowHeight - videoHeight - menuHeight;
        $(".aside-pannels .aside-wrap").css('height', newHeight + 'px');
    }else{
        $(".aside-pannels .aside-wrap").css('height', 'auto');
    }
}

function fnStdLink(){
    alert("준비중입니다...");
}

//콤마
function commaStr(str) {
    str = str.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    return str
}