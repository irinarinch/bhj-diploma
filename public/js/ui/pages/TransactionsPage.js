/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    this.lastOptions;
    this.element = element;

    if (!element) {
      throw new Error('Ошибка, нет элемента');
    }
    
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      if (e.target.closest('.remove-account')) {       
        this.removeAccount();        
      } else if (e.target.closest('.transaction__remove')) {
        this.removeTransaction(e.target.closest('.transaction__remove').getAttribute('data-id')); 
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() { 
    if (!this.lastOptions) {
      return;
    }

    if (confirm('Вы действительно хотите удалить счёт?')) {
      Account.remove({id: this.lastOptions.account_id}, (err, response) => {
        if (response.success) {
          this.clear();
          App.updateWidgets();
          App.updateForms();
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({id: id}, (err, response) => { 
        if (response.success) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options) {
      return;
    }

    this.lastOptions = options;

    Account.get(options.account_id, (err, response) => {
      if (response.success) {
        this.renderTitle(response.data.name);
      }
    });
    
    Transaction.list({account_id: options.account_id}, (err, response) => {
      this.renderTransactions(response.data); 
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = undefined;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) { 
    this.element.querySelector('.content-title').textContent = name; 
  }
  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const ourDate = new Date(date);
    const dateOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',      
    };
    const timeOptions = {     
      hour: 'numeric',
      minute: 'numeric',
    };
    
    return ourDate.toLocaleString('ru', dateOptions) + ' в ' + ourDate.toLocaleString('ru', timeOptions);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const code =  `
      <div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>             
              <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
          ${new Intl.NumberFormat("ru", {style: "currency", currency: "RUB"}).format(item.sum)} <span class="currency"></span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
      </div>
    `;
    
    return code;   
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const transactionsListCode = data.reduce((acc, item) => acc + this.getTransactionHTML(item), ``);
    const content = this.element.querySelector('.content');

    content.innerHTML = transactionsListCode;
  }
}


/*

Как узнать вызывался ли раньше метод render()? Или как еще проверить передавались ли ему ранее данные options? 
Ведь если передавались - значит в this.lastOptions есть значение, так?
В методе clear не придумала ничего лучше чем this.lastOptions = undefined, чтобы удалить содержимое из this.lastOptions.

*/