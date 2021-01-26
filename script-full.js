'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const header = document.querySelector('.header');
const message = document.createElement('div');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault(); // Will prevent from 'jumping' to top of the page because the href is set to #
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Creating/deleting cookies message
message.classList.add('cookie-message');
// message.textContent =
//   'We use cookies for improved functionality and analytics.';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

message.style.backgroundColor = '#37383d';
message.style.width = '120%';

header.append(message);

message.style.height = `${
  parseFloat(getComputedStyle(message).height, 10) + 20
}px`;

document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

///////////////////////////////////////
// Scroll down button
btnScrollTo.addEventListener('click', function () {
  const sect1Coordinates = section1.getBoundingClientRect();

  window.scrollTo({
    top: sect1Coordinates.top + window.scrollY,
    behavior: 'smooth',
  });

  // alternative, not so much supported
  // section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page navigation (using event delegation)
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

////////////////////////////////////////
// Tabbed ccomponent
tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();

  const clicked = e.target.closest('.operations__tab');

  console.log(clicked);

  // Guard clause
  if (!clicked) return;

  // Activate correct tab
  tabs.forEach(function (el) {
    el.classList.remove('operations__tab--active');
  });

  clicked.classList.add('operations__tab--active');

  // Activate correct content
  tabsContent.forEach(function (cont) {
    cont.classList.remove('operations__content--active');
  });

  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade navigation
const handleHoverEffect = function (e) {
  const link = e.target;

  if (link.classList.contains('nav__link')) {
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    // console.log(this);

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });

    logo.style.opacity = this;
  }
};

// Passing an "argument" into handler function
nav.addEventListener('mouseover', handleHoverEffect.bind(0.5));
nav.addEventListener('mouseout', handleHoverEffect.bind(1));

// Sticky navigation
const obsCallback = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const navHeight = nav.getBoundingClientRect().height;

const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(obsCallback, obsOptions);
headerObserver.observe(header);

// Revealing items on scroll

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  // There is first entry with target section 1 whic is not intersecting. This allows also section 1 to reveal on scroll
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  // Unobserving is better for performance
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

const allSections = document.querySelectorAll('.section');

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy loading images
const loadImages = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) return;

  // Replacing src attribute value
  entry.target.src = entry.target.dataset.src;

  //Remove lazy img class only after the large image is loaded (looks better on slow connections)
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );

  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImages, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

const targetImages = document.querySelectorAll('img[data-src]');

targetImages.forEach(image => imageObserver.observe(image));

// Slider/Carousel

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');
  const dotsContainer = document.querySelector('.dots');
  const maxSlide = slides.length - 1;

  let curSlide = 0;

  // Just to see, how the slides are positioned next to each other
  // const slider = document.querySelector('.slider');
  // slider.style.overflow = 'visible';
  // slider.style.transform = 'scale(0.4) translateX(-1000px)';
  // slides.forEach((s, i) => (s.style.transform = `translateX(${i * 100}%)`));

  // Functions
  const shiftSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`)
    );
  };

  const createDots = function () {
    slides.forEach((_, i) => {
      dotsContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot' data-slide='${i}'></button>`
      );
    });
  };

  const activateDot = function (slide) {
    const dots = document.querySelectorAll('.dots__dot');
    // console.log(dots);

    dots.forEach(dot => {
      dot.classList.remove('dots__dot--active');
    });

    const curDot = document.querySelector(`.dots__dot[data-slide="${slide}"]`);
    curDot.classList.add('dots__dot--active');
  };

  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    shiftSlide(curSlide);

    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }

    shiftSlide(curSlide);

    activateDot(curSlide);
  };

  // Initialization

  const init = function () {
    shiftSlide(0);
    createDots();
    activateDot(0);
  };

  init();

  // Event handlers

  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    // console.log(e);
    if (e.key === 'ArrowRight') {
      nextSlide();
    }
    //short circuiting
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotsContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      // console.log(slide);
      shiftSlide(slide);

      activateDot(slide);
    }
  });
};

slider();

////////////////////////////////////////
// Lectures

// // 181 - Selecting, creating/inserting and deleting elements

// // create/insert
// const header = document.querySelector('.header');
// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent =
// //   'We use cookies for improved functionality and analytics.';
// message.innerHTML =
//   'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));
// // header.before(message);
// // header.after(message);

// // delete
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.remove();
//   });

// // 182 - Styling

// // Styles
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// // console.log(getComputedStyle(message).height);
// message.style.height = `${
//   parseFloat(getComputedStyle(message).height, 10) + 20
// }px`;

// document.documentElement.style.setProperty('--color-primary', 'pink');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// // console.log(logo.designer);
// console.log(logo.getAttribute('designer'));
// console.log(logo.className);

// logo.alt = 'Super logo';
// logo.setAttribute('company', 'bankist');

// const link = document.querySelector('.nav__link--btn');
// // absolute
// console.log(link.href);
// //relative
// console.log(link.getAttribute('href'));

// // data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('new');
// logo.classList.remove('new');
// logo.classList.toggle('new');
// logo.classList.contains('new');

// // 182 - Smooth scrolling

// const btnScrollTo = document.querySelector('.btn--scroll-to');
// const section1 = document.querySelector('#section--1');

// btnScrollTo.addEventListener('click', function () {
//   const sect1Coordinates = section1.getBoundingClientRect();

//   window.scrollTo({
//     top: sect1Coordinates.top + window.scrollY,
//     behavior: 'smooth',
//   });

//   // alternative, not so much supported
//   // section1.scrollIntoView({ behavior: 'smooth' });
// });

// // 183 - Event listeners

// const h1 = document.querySelector('h1');

// const alertH1 = function () {
//   alert('Bla bla');
// };

// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 1000);

// // 183 - Event propagation

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);

// let randomColor = () =>
//   `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`;

// document.querySelector('.nav__link').addEventListener(
//   'click',
//   function (e) {
//     e.preventDefault();
//     this.style.backgroundColor = randomColor();
//   },
//   true
// );

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
// });

// // 188 - Traversing DOM

// const h1 = document.querySelector('h1');

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.firstChild);
// console.log(h1.firstElementChild);
// h1.firstElementChild.style.color = 'red';

// [...h1.parentElement.children].forEach(function (e) {
//   if (e !== h1) {
//     e.style.transform = 'scale(0.5)';
//   } else {
//     e.style.color = 'salmon';
//   }
// });
