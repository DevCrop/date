class Calender {
  constructor(monthElement, calenderHook) {
    this.monthElement = monthElement;
    this.calenderHook = calenderHook;
    this.currentDate = new Date();
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.swiper = null;
  }

  render() {
    this.clearCalender();
    const daysInMonth = this.getDaysInMonth(
      this.currentYear,
      this.currentMonth
    );
    this.updateMonthText();
    this.renderDays(daysInMonth);
    this.initSwiper(daysInMonth);
    this.addSlideClickEvents();
  }

  //reset
  clearCalender() {
    this.calenderHook.innerHTML = ``;
  }

  //달 업데이트
  updateMonthText() {
    this.monthElement.textContent = `${this.currentYear}.${
      this.currentMonth + 1
    }`;
  }

  getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
  }

  //slide 생성 및 dom append
  renderDays(daysInMonth) {
    for (let i = 1; i <= daysInMonth; i++) {
      const dateElement = document.createElement("div");
      dateElement.classList.add("date", "swiper-slide");
      dateElement.textContent = i;
      dateElement.dataset.day = i; // Store the day for easy access
      this.calenderHook.appendChild(dateElement);
    }
  }

  //swiper 생성
  initSwiper(daysInMonth) {
    if (this.swiper) this.swiper.destroy();

    this.swiper = new Swiper(".swiper", {
      slidesPerView: daysInMonth / 2,
      slidesPerGroup: daysInMonth / 2,
      speed: 5000,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
    });

    this.swiper.update();
  }

  //click 시 active
  addSlideClickEvents() {
    const slides = this.calenderHook.querySelectorAll(".swiper-slide");
    slides.forEach((slide) => {
      slide.addEventListener("click", () => this.setActiveSlide(slide));
    });
  }

  setActiveSlide(slide) {
    this.clearActiveStates();
    slide.classList.add("active");
  }

  // active 삭제
  clearActiveStates() {
    const activeSlides = this.calenderHook.querySelectorAll(
      ".swiper-slide.active"
    );
    activeSlides.forEach((activeSlide) =>
      activeSlide.classList.remove("active")
    );
  }

  setDate(year, month, day) {
    this.currentYear = year;
    this.currentMonth = month;
    this.render();

    const slideIndex = day - 1;
    if (this.swiper) this.swiper.slideTo(slideIndex);

    const selectedSlide = this.calenderHook.querySelector(
      `.swiper-slide[data-day="${day}"]`
    );
    if (selectedSlide) this.setActiveSlide(selectedSlide);
  }

  resetToCurrentMonth() {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.render();

    const today = this.currentDate.getDate();
    const selectedSlide = this.calenderHook.querySelector(
      `.swiper-slide[data-day="${today}"]`
    );
    if (selectedSlide) this.setActiveSlide(selectedSlide);
  }

  updateMonth(increment) {
    this.currentMonth += increment;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.render();
  }
}

class App {
  constructor(calender) {
    this.calender = calender;
    this.BUTTON = {
      next: document.getElementById("nextBtn"),
      prev: document.getElementById("prevBtn"),
      current: document.getElementById("currentBtn"),
    };
    this.datePicker = document.getElementById("datePicker");
  }

  init() {
    this.calender.render();
    this.clickEvent();
    this.setDefaultDateInput();
  }

  clickEvent() {
    this.BUTTON.next.addEventListener("click", () =>
      this.calender.updateMonth(1)
    );
    this.BUTTON.prev.addEventListener("click", () =>
      this.calender.updateMonth(-1)
    );
    this.BUTTON.current.addEventListener("click", () =>
      this.calender.resetToCurrentMonth()
    );
    this.datePicker.addEventListener("change", (event) =>
      this.onDateChange(event)
    );
  }

  onDateChange(event) {
    const selectedDate = new Date(event.target.value);
    const selectedYear = selectedDate.getFullYear();
    const selectedMonth = selectedDate.getMonth();
    const selectedDay = selectedDate.getDate();
    this.calender.setDate(selectedYear, selectedMonth, selectedDay);
  }

  setDefaultDateInput() {
    const year = this.calender.currentYear;
    const month = String(this.calender.currentMonth + 1).padStart(2, "0");
    const day = String(this.calender.currentDate.getDate()).padStart(2, "0");
    this.datePicker.value = `${year}-${month}-${day}`;
  }
}

// Initialize
const calender = new Calender(
  document.getElementById("month"),
  document.getElementById("calender").querySelector(".swiper-wrapper")
);
const app = new App(calender);
app.init();
