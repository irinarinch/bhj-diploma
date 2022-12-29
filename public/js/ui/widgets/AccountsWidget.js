/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor(element){
    this.element = element;

    if (!element) {
      throw new Error('Ошибка, нет элемента');
    }

    this.registerEvents();
    this.update();    
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() { 
    this.element.addEventListener('click', (e) => {
      if (e.target.closest('.account')) {
        this.onSelectAccount(e.target.closest('.account'));        
      } else if (e.target.closest('.create-account')) {        
        App.getModal('createAccount').open();       
      }
    });
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if (User.current()) {
      Account.list(User.current(), (err, response) => {
        if (response.success) {          
          this.clear()
          this.renderItem(response.data)
        }
      });      
    } 
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    this.element.querySelectorAll('.account').forEach(element => {
      element.remove();
    });
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount(element) {
    if (this.element.querySelector('.active')) {
      this.element.querySelector('.active').classList.remove('active');
    }    
    element.classList.add('active');
    App.showPage('transactions', {account_id: element.getAttribute('data-id')});    
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item) {
    const code =  `
      <li class="account" data-id="${item.id}">
        <a href="#">
          <span>${item.name}</span> /
          <span>${new Intl.NumberFormat("ru", {style: "currency", currency: "RUB"}).format(item.sum)}</span>
        </a>
      </li>
    `
    return code;   
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data) {
    const accountsListCode = data.reduce((acc, item) => acc + this.getAccountHTML(item), ``);
    this.element.insertAdjacentHTML('beforeend', accountsListCode);
  }
}

/* в методе update, в Account.list первым аргументом (data) почему-то передаю User.current(), 
хотя там любой объект можно передать и response не изменится.
Не понимаю что именно туда на самом деле надо передать. Нигде не написано, или я не вижу.
*/
