// ### IMPORTS ###
import isEmail from 'validator/lib/isEmail';

// ### SALVA NOME DA CLASSE ###
const SHOW_ERROR_MESSAGE = 'show-error-message';

// ### OBTEM OS CAMPOS DE FORMULÁRIO ###
const form = document.querySelector('.form') as HTMLFormElement;
const username = document.querySelector('.username') as HTMLInputElement;
const email = document.querySelector('.email') as HTMLInputElement;
const password = document.querySelector('.password') as HTMLInputElement;
const password2 = document.querySelector('.password2') as HTMLInputElement;

form.addEventListener('submit', function (event) {
  event.preventDefault();

  // ### OCULTA MENSAGENS ###
  hideErrorMessages(this);

  //   ### CHECAGEM DE MENSAGENS ###
  checkForEmptyfields(username, email, password, password2);

  //   ### CHECAGEM DE EMAIL ###
  checkEmail(email);

  //   ### CHECAGEM DE PASSWORDS ###
  checkEqualPasswords(password, password2);

  if (shoulSendForm(this)) form.submit();
});

function checkEqualPasswords(
  password: HTMLInputElement,
  password2: HTMLInputElement,
): void {
  if (password.value !== password2.value) {
    showErrorMessage(password2, 'Senha Incorreta');
  }
}

function checkEmail(input: HTMLInputElement): void {
  if (!isEmail(input.value)) showErrorMessage(input, 'Email Inválido');
}

function checkForEmptyfields(...inputs: HTMLInputElement[]): void {
  inputs.forEach((input) => {
    if (!input.value) showErrorMessage(input, 'Campo não pode ficar vazio');
  });
}

function hideErrorMessages(form: HTMLFormElement): void {
  form.querySelectorAll('.' + SHOW_ERROR_MESSAGE).forEach((item) => {
    item.classList.remove(SHOW_ERROR_MESSAGE);
  });
}

function showErrorMessage(input: HTMLInputElement, msg: string): void {
  const formFields = input.parentElement as HTMLDivElement; // seleciona o elemento pai do input

  const errorMessage = formFields.querySelector(
    '.error-message',
  ) as HTMLSpanElement;

  errorMessage.innerText = msg;

  formFields.classList.add(SHOW_ERROR_MESSAGE);
}

function shoulSendForm(form: HTMLFormElement): boolean {
  let send = true;

  form.querySelectorAll('.' + SHOW_ERROR_MESSAGE).forEach(() => (send = false));

  return send;
}
