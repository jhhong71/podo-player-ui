// dummyData
const rawCurriculumData = [
    {
        sectionTitle: "섹션 1. Intro",
        lectures: [
            { title: "1-1. 강의 소개", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" },
            { title: "1-2. 자료 소개", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" }
        ]
    },
    {
        sectionTitle: "섹션 2. 일반 홈페이지 최적화",
        lectures: [
            { title: "2-1. 실습 내용 소개", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
            { title: "2-2. 서비스 탐색 및 코드 분석", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
            { title: "2-3. 이미지 지연 로딩", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
            { title: "2-4. 이미지 사이즈 최적화", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" }
        ]
    },
    {
        sectionTitle: "섹션 3. 심화 최적화",
        lectures: [
            { title: "3-1. Layout Shift 피하기", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4" },
            { title: "3-2. 최종 정리", src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" }
        ]
    }
];

var lectureData = []; 
var playerInstance = null;
var currentLectureIndex = 0; // 현재 재생 중인 강의의 전역 인덱스

$(document).ready(function(){
    fnRenderCurriculum();
    fnSetAsideHeight();

    $('#player').mediaelementplayer({
        videoWidth: '100%',
        videoHeight: '100%',
        features: ['playpause', 'current', 'progress', 'duration', 'volume', 'fullscreen'],
        
        // 초기화 성공 콜백
        success: function(mediaElement, originalNode, instance) {
            playerInstance = mediaElement;
            
            // 재생 중 진도율 체크 (표준 API 이벤트 사용)
            mediaElement.addEventListener('timeupdate', function() {
                updateCurrentProgress(mediaElement.currentTime, mediaElement.duration);
            });
            
            // 재생 종료 시
            mediaElement.addEventListener('ended', function() {
                updateCurrentProgress(mediaElement.duration, mediaElement.duration);
            });
        },
        
        // 에러 핸들링
        error: function(e) {
            console.error("미디어 로딩 실패", e);
        }
    });

    $("#curriculumList").on("click", ".lecture-btn", function() {
        var $this = $(this);
        var idx = $this.data("index");
        var src = $this.data("src");
        
        // 순차 학습 체크
        if (!checkPrerequisite(idx)) {
            alert("강의는 순차대로 수강해야합니다.\n이전 강의를 98% 이상 수강해주세요.");
            return;
        }

        // 강의 변경
        changeLecture(idx, src, $this);
    });

    // 커리큘럼 어코디언
    $(".btn-toggle").on("click", function (){
        var btn = $(this);
        var ul = btn.next("ul");

        if(ul.is(":visible")){
            ul.stop(true, true).slideUp();
            btn.removeClass("active");
        }else{
            ul.stop(true, true).slideDown();
            btn.addClass("active");
        }
    });

    // 질문하기
    $("input[name='secretOption']").on("change", function () {
        $(".radio-box-wrap i").removeClass().addClass("fa-regular fa-circle");
        $("input[name='secretOption']:checked").siblings("label").find("i").removeClass().addClass("fa-regular fa-circle-dot");
    });

    // 질문하기 - 초기 렌더링 시
    $("input[name='secretOption']:checked").siblings("label").find("i").removeClass().addClass("fa-regular fa-circle-dot");

    // 전체 진도율 초기 계산
    calcTotalProgress();
}); //END: document.ready

$(window).on("resize", function(){
    fnSetAsideHeight();
});

function fnRenderCurriculum() {
    var html = '';
    var globalIdx = 0; // 전체 강의에 대한 고유 인덱스

    $.each(rawCurriculumData, function(i, section) {
        html += `
            <div class="curriculum-section">
                <button type="button" class="btn-toggle active">
                    <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>${section.sectionTitle}
                </button>
                <ul>`;
        
        $.each(section.lectures, function(j, lec) {
            // 첫 번째 강의(0번)는 기본 active 및 아이콘 처리, 나머지는 빈 동그라미
            var activeClass = (globalIdx === 0) ? 'active' : ''; 
            var iconClass = 'fa-regular fa-circle'; 
            
            html += `
                <li>
                    <button type="button" class="lecture-btn ${activeClass}" data-index="${globalIdx}" data-src="${lec.src}">
                        <i class="${iconClass}" aria-hidden="true"></i>${lec.title}
                    </button>
                </li>`;

            // 로직용 데이터(State) 초기화
            lectureData.push({
                id: globalIdx,
                title: lec.title,
                progress: 0,
                completed: false
            });

            globalIdx++; // 다음 강의를 위해 인덱스 증가
        });

        html += `   </ul>
            </div>`;
    });

    $("#curriculumList").html(html);
}

/**
 * 선행 학습 여부 확인
 * index가 0이면 무조건 통과, 그 외에는 index-1번 강의가 completed인지 확인
 */
function checkPrerequisite(index) {
    if (index === 0) return true;
    // 이전 강의가 완료되었는지 확인
    return lectureData[index - 1].completed;
}

/**
 * 강의 변경 처리
 */
function changeLecture(index, src, $btnElement) {
    currentLectureIndex = index;

    $(".lecture-btn").removeClass("active");
    $btnElement.addClass("active");
    
    if (playerInstance) {
        playerInstance.setSrc(src);
        playerInstance.load();
        playerInstance.play();
    }

    $("section.video-wrap header").text(lectureData[index].title);
}

/**
 * 현재 강의 진도율 업데이트 및 완료 체크
 */
function updateCurrentProgress(currentTime, duration) {
    if (!duration || duration <= 0) return;

    var percent = (currentTime / duration) * 100;
    var currentData = lectureData[currentLectureIndex];

    // 이미 달성한 진도율보다 높을 때만 업데이트 (중복 합산 방지)
    if (percent > currentData.progress) {
        if (percent > 100) percent = 100; // 최대 100% 보정
        currentData.progress = percent;

        // 98% 이상이면 수강 완료 처리
        if (percent >= 98 && !currentData.completed) {
            currentData.completed = true;
            currentData.progress = 100; // 완료 시 100%로 강제 설정
            
            var $btn = $(".lecture-btn[data-index='" + currentLectureIndex + "']");
            $btn.find("i").removeClass("fa-regular fa-circle").addClass("fa-solid fa-circle-check");
            
            console.log("강의 완료: " + currentData.title);
        }
    }

    // 전체 진도율 UI 업데이트 호출
    calcTotalProgress();
}

/**
 * 전체 진도율 계산 및 UI 표시
 * (각 강의가 100%가 되어야 전체 100% 달성 가능)
 */
function calcTotalProgress() {
    var totalSum = 0;
    var totalCount = lectureData.length;

    // 모든 강의의 현재 진도율 합산
    for (var i = 0; i < totalCount; i++) {
        totalSum += lectureData[i].progress;
    }

    // 전체 평균 계산
    var totalPercent = (totalCount === 0) ? 0 : (totalSum / totalCount);
    totalPercent = Math.floor(totalPercent); // 소수점 버림

    $(".progress-wrap progress").val(totalPercent);
    $(".progress-txt .current").text((currentLectureIndex + 1) + "강"); // 현재 강의 번호
    $(".progress-txt .percent").text(totalPercent + "%"); // 전체 퍼센트
}

function fnCloseCurr(){
    $(".player-container").addClass("full");
    $(".aside-pannels").addClass("closed");
    $(".video-wrap").addClass("expanded");
    $(".side-menu-wrap").addClass("fixed");
    $(".side-menu-wrap > button").removeClass("active");

    fnSetAsideHeight();
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
        console.log("A");
        var windowHeight = $(window).height();
        var videoHeight = $(".video-wrap").outerHeight() || 0;
        var menuHeight = $(".side-menu-wrap.for-mobile").outerHeight() || 0;
        var newHeight = windowHeight - videoHeight - menuHeight;
        $(".aside-pannels .aside-wrap").css('height', newHeight + 'px');
    }else{
        console.log("B");
        $(".aside-pannels .aside-wrap").css('height', 'auto');
    }
}

//콤마
function commaStr(str) {
    str = str.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    return str
}