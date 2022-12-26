
/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const sidebar_toggle_button = document.querySelector('.sidebar-toggle');

    sidebar_toggle_button.addEventListener('click', (e) => {
      e.preventDefault();

      document.body.classList.toggle('sidebar-open');
      document.body.classList.toggle('sidebar-collapse');
    });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const register_button = document.querySelector('.menu-item_register');
    const login_button = document.querySelector('.menu-item_login');
    const logout_button = document.querySelector('.menu-item_logout');

    register_button.addEventListener('click', openRegisterModal);
    login_button.addEventListener('click', openLoginModal);
    logout_button.addEventListener('click', logout)
    
    function openRegisterModal(e) {
      e.preventDefault();      
      App.getModal('register').open();
    }

    function openLoginModal(e) {
      e.preventDefault();      
      App.getModal('login').open();
    }

    function logout(e) {
      e.preventDefault();      
      User.logout((err, response) => {
        if (response.success) {
          App.setState( 'init' );
        }
      });
    }
  }
}

