var isWarningmodal = false;

//  load the quiz page content when the page loads
document.addEventListener("DOMContentLoaded", function () {
  loadPageContent("quiz");
  var navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener("click", function (evt) {
      evt.preventDefault();

      navLinks.forEach(function (otherLink) {
        otherLink.classList.remove('active');
      });
      link.classList.add('active');
      
      const pageId = evt.target.getAttribute("href").substring(1);
      loadPageContent(pageId);
    });
  });
});

// function to load the page content
function loadPageContent(pageId) {
  const mainContent = document.getElementById("content");

  if (!mainContent) {
    return;
  }

  mainContent.innerHTML = "";

  const objectTag = document.createElement("object");
  objectTag.setAttribute("type", "text/html");
  objectTag.setAttribute("data", `${pageId}.html`);
  objectTag.setAttribute("style", "width: 100%; min-height: 600px;");

  mainContent.appendChild(objectTag);

  if (pageId === "contact") {
    setupContactForm();
  }
}

// function to setup the contact form
function setupContactForm() {
  const contactForm = document.getElementById("contactForm");

  // implement logoc for contact form submission, api call, etc.

}

// function to validate the contact form
function submitQuiz() {
  const userAnswers = {
    q1: document.querySelector('input[name="q1"]:checked')?.value,
    q2: document.querySelector('input[name="q2"]:checked')?.value,
    q3: document.querySelector('input[name="q3"]:checked')?.value,
    q4: document.querySelector('input[name="q4"]:checked')?.value,
    q5: document.querySelector('input[name="q5"]:checked')?.value,
    q6: document.querySelector('input[name="q6"]:checked')?.value,
    q7: document.querySelector('input[name="q7"]:checked')?.value,
    q8: document.querySelector('input[name="q8"]:checked')?.value,
  };

  // get the accordion element
  const accordionElement = document.getElementById("accordion");

  // show error message if any question is not answered
  if (Object.values(userAnswers).some((answer) => !answer)) {
    openModal("Please answer all questions before submitting.");
    accordionElement.style.display = 'none';
    isWarningmodal = true;
    return;
  }

  // show the accordion element if all questions are answered
  accordionElement.style.display = 'block';

  const correctAnswers = {
    q1: "c",
    q2: "b",
    q3: "a",
    q4: "b",
    q5: "a",
    q6: "a",
    q7: "b",
    q8: "b",
  };

  // calculate the user's score
  let score = 0;
  Object.keys(userAnswers).forEach((question) => {
    if (userAnswers[question] === correctAnswers[question]) {
      score++;
    }
  });

  // show the user's score
  const feedback = `You scored ${score} out of ${Object.keys(userAnswers).length}`;

  // show the user's answers
  Object.keys(userAnswers).forEach((question) => {
    const userAnswerElement = document.getElementById(`userAnswer_${question}`);
    if (userAnswerElement) {
      const userAnswer = userAnswers[question] || 'Not answered';
      const userAnswerOption = getUserAnswerOption(question, userAnswer);
      userAnswerElement.innerHTML = `Your Answer: ${userAnswerOption}`;
    }
  });

  openModal(feedback);
}

// function to open the modal
function openModal(content) {
  const modal = document.getElementById("quizModal");
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = content;
  modal.style.display = "block";
}

// function to close the modal
function closeModal() {
  const modal = document.getElementById("quizModal");
  modal.style.display = "none";
  if (isWarningmodal) {
    isWarningmodal = false;
    return;
  }
  resetForm();
  resetAccordion();
}

// function to reset the form when close modal button is clicked
function resetForm() {
  const radioButtons = document.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((button) => (button.checked = false));

  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => (checkbox.checked = false));
}

// function to reset the accordion when close modal button is clicked
function resetAccordion() {
  var accordionElement = $("#accordion");

  if (accordionElement.hasClass('ui-accordion')) {
    accordionElement.accordion("destroy");
  }

  accordionElement.accordion({
    collapsible: true,
    active: false,
    heightStyle: "content"
  });
}

// function to get the user's answer option
function getUserAnswerOption(question, userAnswer) {
  const option = userAnswer.split(')')[0];
  const questionElement = document.querySelector(`div[data-question="${question}"]`);
  const optionLabel = questionElement.querySelector(`label[for="${question}${option}"]`);

  if (optionLabel) {
    return optionLabel.textContent.trim();
  }

  return '';
}

