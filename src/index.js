import keys from './components/keys';

class Keyboard {
  constructor() {
    this.lang = 'en';
    this.shift = false;
    this.capsLock = 'off';
    this.isMouseDown = false;
    this.capsSwitch = false;
    this.keysComb = false;
    this.tab = '    ';
    this.textValue = '';
    this.temp = '';
    this.alt = false;
  }

  checkLanguage() {
    if (localStorage.getItem('lang')) {
      this.lang = localStorage.getItem('lang');
    } else {
      localStorage.setItem('lang', this.lang);
    }
  }

  changeLanguage() {
    if (this.lang === 'en') {
      this.lang = 'ru';
    } else {
      this.lang = 'en';
    }
    this.updateKeyboard();
    if (this.shift === true) {
      this.changeKeyboardShift();
    }
    localStorage.setItem('lang', this.lang);
  }

  updateKeyboard() {
    const rows = document.querySelectorAll('.row');
    for (let row = 0; row < rows.length; row += 1) {
      const keyboardButtons = rows[row].querySelectorAll('.key');
      for (let index = 0; index < keyboardButtons.length; index += 1) {
        if (`${keyboardButtons[index].getAttribute(`data-lang-${this.lang}`)}` !== 'none') {
          keyboardButtons[index].innerHTML = `${keyboardButtons[index].getAttribute(`data-lang-${this.lang}`)}`;
        }
      }
    }
    if (this.capsLock === 'on') {
      this.uppercase();
      this.capsLock = 'on';
      this.capsSwitch = true;
      document.querySelector('.capslock').classList.add('caps-active');
    }
  }

  generateKeyboard() {
    document.body.innerHTML = `
      <div class="container">
      <h1 class = 'change-lang'>Change Language: Left Ctrl + Left Alt </br> Made for Windows</h1>
      <textarea class="textarea" spellcheck="false"></textarea>
      <div class="keyboard">
        <div class="keyboard__container">
          <div class="row"></div>
          <div class="row"></div>
          <div class="row"></div>
          <div class="row"></div>
          <div class="row"></div>
        </div>
      </div>
    </div>
    `;
    this.checkLanguage();
    const rows = document.querySelectorAll('.row');
    const { lang } = this;
    for (let row = 0; row < rows.length; row += 1) {
      for (let index = 0; index < keys[row].length; index += 1) {
        let classKey = '';
        if (typeof keys[row][index].class !== 'undefined') {
          classKey = `${keys[row][index].class}`;
        } else {
          classKey = '';
        }
        rows[row].innerHTML += `
          <div class="key ${classKey}" data-code = "${keys[row][index].code}" data-shift-lang-ru = '${
          keys[row][index].shift.ru
        }' data-shift-lang-en = '${keys[row][index].shift.en}' data-lang-en = "${
          keys[row][index].key.en
        }" data-lang-ru = '${keys[row][index].key.ru}'>
            ${lang === 'en' ? keys[row][index].key.en : keys[row][index].key.ru}
          </div>
      `;
      }
    }
    window.addEventListener('keydown', (event) => {
      event.preventDefault();
      this.keyDown(event);
    });
    window.addEventListener('keyup', (event) => {
      event.preventDefault();
      this.keyUp(event);
    });
  }

  keyUp(event) {
    const targetButton = event.code;
    const keyCode = document.querySelector(`[data-code = '${event.code}']`);
    keyCode.classList.remove('key-active');
    if (targetButton === 'ShiftLeft' || targetButton === 'ShiftRight') {
      if (this.shift === true) {
        this.changeKeyboardBeforeShift();
        this.shift = false;
      }
    }
    if (targetButton === 'CapsLock') {
      this.capsSwitch = true;
    }
    if (targetButton === 'ControlLeft' || targetButton === 'AltLeft') {
      this.keysComb = true;
    }
  }

  keyDown(event) {
    const targetButton = event.code;
    const keyCode = document.querySelector(`[data-code = '${event.code}']`);
    keyCode.classList.add('key-active');
    event.preventDefault();
    switch (targetButton) {
      case 'CapsLock':
        if (this.capsLock === 'off') {
          this.uppercase();
          this.capsLock = 'on';
          this.capsSwitch = false;
          document.querySelector('.capslock').classList.add('caps-active');
        }
        if (this.capsSwitch) {
          this.lowercase();
          this.capsLock = 'off';
          this.capsSwitch = false;
          document.querySelector('.capslock').classList.remove('caps-active');
        }
        break;
      case 'ControlLeft':
        this.keysComb = true;
        break;
      case 'ControlRight':
        break;
      case 'ShiftLeft':
        this.changeKeyboardShift();
        this.shift = true;
        break;
      case 'ShiftRight':
        this.changeKeyboardShift();
        this.shift = true;
        break;
      case 'AltLeft':
        if (this.keysComb) {
          this.keysComb = false;
          this.changeLanguage();
        }
        break;
      case 'MetaLeft':
        break;
      case 'AltRight':
        break;
      case 'Delete':
        this.deleteKey();
        break;
      case 'Backspace':
        this.backspaceKey();
        break;
      case 'Space':
        this.writeInTextarea(' ');
        break;
      case 'Enter':
        this.writeInTextarea('\n');
        break;
      case 'Tab':
        this.tabKey();
        break;
      default:
        this.writeInTextarea(keyCode.innerText);
        break;
    }
  }

  tabKey() {
    const { tab } = this;
    const text = document.querySelector('.textarea');
    const startPos = text.selectionStart;
    const endPos = text.selectionEnd;
    const textBeforeCursor = text.value.slice(0, startPos);
    const textAfterCursor = text.value.slice(endPos);
    text.value = textBeforeCursor + tab + textAfterCursor;
    text.focus();
    text.setSelectionRange(startPos + 4, startPos + 4);
  }

  deleteKey() {
    const text = document.querySelector('.textarea');
    const startPos = text.selectionStart;
    const endPos = text.selectionEnd;
    const textBeforeCursor = text.value.slice(0, startPos);
    const textAfterCursor = text.value.slice(endPos).slice(1);
    this.textValue = 'Deleted';
    text.focus();
    if (startPos === endPos) {
      text.value = textBeforeCursor + textAfterCursor;
      text.setSelectionRange(startPos, startPos);
    } else {
      text.value = textBeforeCursor + text.value.slice(endPos);
      text.setSelectionRange(startPos, startPos);
    }
  }

  backspaceKey() {
    const text = document.querySelector('.textarea');
    const startPos = text.selectionStart;
    const endPos = text.selectionEnd;
    const textBeforeCursor = text.value.slice(0, startPos - 1);
    const textAfterCursor = text.value.slice(endPos);
    this.textValue = 'Deleted';
    text.focus();
    if (startPos === endPos && startPos !== 0 && endPos !== 0) {
      text.value = textBeforeCursor + textAfterCursor;
      text.setSelectionRange(startPos - 1, startPos - 1);
    } else {
      text.value = text.value.slice(0, startPos) + text.value.slice(endPos);
      text.setSelectionRange(startPos, startPos);
    }
  }

  uppercase() {
    const rows = document.querySelectorAll('.row');
    for (let row = 0; row < rows.length; row += 1) {
      const keyboardButtons = rows[row].querySelectorAll('.key');
      for (let index = 0; index < keyboardButtons.length; index += 1) {
        if (`${keyboardButtons[index].getAttribute(`data-shift-lang-${this.lang}`)}` !== 'none') {
          keyboardButtons[index].innerHTML = `${keyboardButtons[index]
            .getAttribute(`data-lang-${this.lang}`)
            .toUpperCase()}`;
        }
      }
    }
  }

  lowercase() {
    const rows = document.querySelectorAll('.row');
    for (let row = 0; row < rows.length; row += 1) {
      const keyboardButtons = rows[row].querySelectorAll('.key');
      for (let index = 0; index < keyboardButtons.length; index += 1) {
        if (`${keyboardButtons[index].getAttribute(`data-shift-lang-${this.lang}`)}` !== 'none') {
          keyboardButtons[index].innerHTML = `${keyboardButtons[index]
            .getAttribute(`data-lang-${this.lang}`)
            .toLowerCase()}`;
        }
      }
    }
  }

  changeKeyboard(event) {
    const targetButton = event.code;
    if (targetButton === 'ShiftLeft') {
      if (this.shift === false) {
        this.changeKeyboardShift();
        this.shift = true;
      } else {
        this.changeKeyboardBeforeShift();
        this.shift = 'off';
      }
    }
  }

  changeKeyboardShift() {
    if (this.capsLock === 'on') {
      const rows = document.querySelectorAll('.row');
      for (let row = 0; row < rows.length; row += 1) {
        const keyboardButtons = rows[row].querySelectorAll('.key');
        for (let index = 0; index < keyboardButtons.length; index += 1) {
          if (`${keyboardButtons[index].getAttribute(`data-shift-lang-${this.lang}`)}` !== 'none') {
            keyboardButtons[index].innerHTML = `${keyboardButtons[index]
              .getAttribute(`data-shift-lang-${this.lang}`)
              .toLowerCase()}`;
          }
        }
      }
    } else {
      const rows = document.querySelectorAll('.row');
      for (let row = 0; row < rows.length; row += 1) {
        const keyboardButtons = rows[row].querySelectorAll('.key');
        for (let index = 0; index < keyboardButtons.length; index += 1) {
          if (`${keyboardButtons[index].getAttribute(`data-shift-lang-${this.lang}`)}` !== 'none') {
            keyboardButtons[index].innerHTML = `${keyboardButtons[index]
              .getAttribute(`data-shift-lang-${this.lang}`)
              .toUpperCase()}`;
          }
        }
      }
    }
  }

  changeKeyboardBeforeShift() {
    if (this.capsLock === 'on') {
      this.checkLanguage();
      document.querySelector('.keyboard__container').innerHTML = `
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        `;
      const rows = document.querySelectorAll('.row');
      const { lang } = this;
      for (let row = 0; row < rows.length; row += 1) {
        for (let index = 0; index < keys[row].length; index += 1) {
          let classKey = '';
          if (typeof keys[row][index].class !== 'undefined') {
            classKey = `${keys[row][index].class}`;
          } else {
            classKey = '';
          }
          if (keys[row][index].class === 'capslock') {
            if (this.capsLock === 'on') {
              classKey = 'caps-active capslock';
            } else if (this.capsLock === 'off') {
              classKey = 'capslock';
            }
          }
          rows[row].innerHTML += `
                <div class="key ${classKey}" data-code = "${keys[row][index].code}" data-shift-lang-ru = '${
            keys[row][index].shift.ru
          }' data-shift-lang-en = '${keys[row][index].shift.en}' data-lang-en = "${
            keys[row][index].key.en
          }" data-lang-ru = "${keys[row][index].key.ru}"  data-class =  "${keys[row][index].class}">
                  ${lang === 'en' ? keys[row][index].key.en : keys[row][index].key.ru}
                </div>
            `;
        }
        this.uppercase();
      }
    } else {
      this.checkLanguage();
      document.querySelector('.keyboard__container').innerHTML = `
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        <div class="row"></div>
        `;
      const rows = document.querySelectorAll('.row');
      const { lang } = this;
      for (let row = 0; row < rows.length; row += 1) {
        for (let index = 0; index < keys[row].length; index += 1) {
          let classKey = '';
          if (typeof keys[row][index].class !== 'undefined') {
            classKey = `${keys[row][index].class}`;
          } else {
            classKey = '';
          }
          if (keys[row][index].class === 'capslock') {
            if (this.capsLock === 'on') {
              classKey = 'caps-active capslock';
            } else if (this.capsLock === 'off') {
              classKey = 'capslock';
            }
          }
          rows[row].innerHTML += `
                <div class="key ${classKey}" data-code = "${keys[row][index].code}" data-shift-lang-ru = '${
            keys[row][index].shift.ru
          }' data-shift-lang-en = '${keys[row][index].shift.en}' data-lang-en = "${
            keys[row][index].key.en
          }" data-lang-ru = "${keys[row][index].key.ru}"  data-class =  "${keys[row][index].class}">
                  ${lang === 'en' ? keys[row][index].key.en : keys[row][index].key.ru}
                </div>
            `;
        }
      }
    }
  }

  shiftInit(event, state) {
    if (
      event.target.getAttribute('data-code') === 'ShiftLeft' ||
      event.target.getAttribute('data-code') === 'ShiftRight'
    ) {
      if (state === 'on') {
        this.isMouseDown = true;
      } else {
        this.isMouseDown = false;
      }
      if (this.isMouseDown) {
        if (event.target.getAttribute('data-code') === 'ShiftLeft') {
          document.querySelector('.shift-left').classList.add('caps-active');
        } else if (event.target.getAttribute('data-code') === 'ShiftRight') {
          document.querySelector('.shift-right').classList.add('caps-active');
        }
        this.changeKeyboardShift();
      } else {
        if (event.target.getAttribute('data-code') === 'ShiftLeft') {
          document.querySelector('.shift-left').classList.remove('caps-active');
        } else if (event.target.getAttribute('data-code') === 'ShiftRight') {
          document.querySelector('.shift-right').classList.remove('caps-active');
        }
        this.changeKeyboardBeforeShift();
      }
    }
  }

  writeInTextarea(textContent) {
    const text = document.querySelector('.textarea');
    const startPos = text.selectionStart;
    const endPos = text.selectionEnd;
    const caretPos = startPos + textContent.length;
    const textBeforeCursor = text.value.slice(0, startPos);
    const textAfterCursor = text.value.slice(endPos);
    text.value = textBeforeCursor + textContent + textAfterCursor;
    this.textValue = 'Add';
    text.focus();
    text.setSelectionRange(caretPos, caretPos);
  }

  removeClick(event) {
    const keyCode = event.target;
    const textarea = document.querySelector('.textarea');
    this.temp = 'Remove Class';
    textarea.focus();
    if (keyCode.getAttribute('data-code')) {
      keyCode.classList.remove('key-active');
    }
  }

  clickOnKey(event) {
    const keyCode = event.target;
    const textarea = document.querySelector('.textarea');
    textarea.focus();
    if (keyCode.getAttribute('data-code')) {
      keyCode.classList.add('key-active');
    }
    if (keyCode.classList.contains('key') === true) {
      switch (keyCode.getAttribute('data-code')) {
        case 'ShiftLeft':
          if (this.shift === false) {
            this.changeKeyboardShift();
            this.shift = true;
          }
          break;
        case 'ShiftRight':
          if (this.shift === false) {
            this.changeKeyboardShift();
            this.shift = true;
          }
          break;
        case 'CapsLock':
          if (this.capsLock === 'off') {
            this.uppercase();
            this.capsLock = 'on';
            document.querySelector('.capslock').classList.add('caps-active');
          } else {
            this.lowercase();
            this.capsLock = 'off';
            document.querySelector('.capslock').classList.remove('caps-active');
            document.querySelector('.capslock').classList.remove('key-active');
          }
          break;
        case 'ControlLeft':
          break;
        case 'ControlRight':
          break;
        case 'AltLeft':
          break;
        case 'MetaLeft':
          break;
        case 'AltRight':
          break;
        case 'Delete':
          this.deleteKey();
          break;
        case 'Backspace':
          this.backspaceKey();
          break;
        case 'Space':
          this.writeInTextarea(' ');
          break;
        case 'Enter':
          this.writeInTextarea('\n');
          break;
        case 'Tab':
          this.tabKey();
          break;
        default:
          this.writeInTextarea(keyCode.innerText);
          break;
      }
    }
  }

  capsLockClick(event) {
    const targetButton = event.target;
    if (targetButton.getAttribute('data-code') === 'CapsLock') {
      this.capsSwitch = true;
    }
  }
}

const keyboard = new Keyboard();
keyboard.generateKeyboard();

document.body.addEventListener('mousedown', (event) => {
  keyboard.shiftInit(event, 'on');
  keyboard.clickOnKey(event);
});

document.body.addEventListener('mouseup', (event) => {
  keyboard.shiftInit(event, 'off');
  keyboard.removeClick(event);
});
