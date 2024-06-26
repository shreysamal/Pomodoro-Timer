(function () {

  const fehBody = document.body;
  const workDurationInput = document.getElementById("work-duration");
  const restDurationInput = document.getElementById("rest-duration");
  const circleProgress = document.querySelector(".circle-progress");
  const timerTime = document.getElementById("feh-timer-time");

  const btnToggleSettings = document.getElementById("feh-toggle-settings");
  const btnCloseSettings = document.getElementById("feh-close-settings");

  let workDuration = parseInt(workDurationInput.value) * 60;
  let restDuration = parseInt(restDurationInput.value) * 60;
  let remainingTime = workDuration;
  let isPaused = true;
  let isWorking = true;
  let intervalId;

  const completedSessionsElement = document.getElementById(
    "feh-completed-sessions"
  );
  let completedSessions = 0;


  window.addEventListener("load", () => {
    fehBody.classList.add("page-loaded");
  });

 

  function setBodySettings() {
    fehBody.classList.contains("settings-active")
      ? fehBody.classList.remove("settings-active")
      : fehBody.classList.add("settings-active");
  }

  function toggleSettings(event) {
    if (event.type === "click") {
      setBodySettings();
    } else if (event.type === "keydown" && event.keyCode === 27) {
      fehBody.classList.remove("settings-active");
    }
  }

  btnToggleSettings.addEventListener("click", toggleSettings);
  btnCloseSettings.addEventListener("click", toggleSettings);
  document.addEventListener("keydown", toggleSettings);



  const startBtn = document.getElementById("start-btn");
  startBtn.addEventListener("click", () => {
    isPaused = false;

    fehBody.classList.add("timer-running");

    /**
     * Is work timer
     */
    if (isWorking) {
      fehBody.classList.remove("timer-paused");
    } else {
      /**
       * or rest timer
       */
      fehBody.classList.add("rest-mode");
      fehBody.classList.remove("timer-paused");
    }

    if (!intervalId) {
      intervalId = setInterval(updateTimer, 1000);
    }
  });


  const pauseBtn = document.getElementById("pause-btn");
  pauseBtn.addEventListener("click", () => {
    isPaused = true;

    fehBody.classList.remove("timer-running");
    fehBody.classList.add("timer-paused");

    // document.title = "Timer Paused";
  });

  /********************************************************************************
   * Get work / rest times from settings
   ********************************************************************************/

  workDurationInput.addEventListener("change", () => {
    workDuration = parseInt(workDurationInput.value) * 60;
    if (isWorking) {
      remainingTime = workDuration;
      updateProgress();
    }
  });

  restDurationInput.addEventListener("change", () => {
    restDuration = parseInt(restDurationInput.value) * 60;
    if (!isWorking) {
      remainingTime = restDuration;
      updateProgress();
    }
  });


  function updateTimer() {
    const workFinished = new Audio("success-fanfare-trumpets-6185.mp3");
    const restFinished = new Audio("FM9B3TC-alarm.mp3");

    if (!isPaused) {
      remainingTime--;
      let playalarm;

      /**
       * When timer stops running
       */
      if (remainingTime <= 0) {
        isWorking = !isWorking;
        remainingTime = isWorking ? workDuration : restDuration;

        /**
         * Check what timer (work/rest) has just finished
         */
        if (!isWorking) {
          /**
           * Increment the completed sessions counter and update the display
           */
          fehBody.classList.add("rest-mode");
          fehBody.classList.remove("timer-running");

          completedSessions++;
          completedSessionsElement.textContent = completedSessions;

          console.log(completedSessions);
        } else {
          fehBody.classList.remove("rest-mode");
          fehBody.classList.remove("timer-running");
        }
        playalarm = isWorking ? restFinished : workFinished;
        playalarm.play();

        isPaused = false;
        fehBody.classList.remove("timer-work-active");
      }

      document.title = timerTime.textContent = formatTime(remainingTime);

      updateProgress();
    }
  }


  function updateProgress() {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;

    const totalDuration = isWorking ? workDuration : restDuration;
    const dashOffset = (circumference * remainingTime) / totalDuration;

    circleProgress.style.strokeDashoffset = dashOffset;
    timerTime.textContent = formatTime(remainingTime);
  }


  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }

  updateProgress();
})();
