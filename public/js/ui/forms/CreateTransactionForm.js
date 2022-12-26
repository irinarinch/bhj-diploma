/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() { //+
    Account.list(User.current(), (err, response) => {
      if (response && response.success) { 
        
        const select = this.element.querySelector('select');
        select.querySelectorAll('option').forEach(el => {
          select.removeChild(el);
        })
        
        response.data.forEach(element => {
          select.insertAdjacentHTML('beforeend', `
            <option value="${element.id}">${element.name}</option>
          `); 
        });
      }
    });   

  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response.success) {
        
        App.getModal('newIncome').close() || App.getModal('newExpense').close(); 
        App.update();
        App.getForm('createIncome').element.reset() || App.getForm('createExpense').element.reset();
       
      }
      console.log(response)
    }); 
  }
}