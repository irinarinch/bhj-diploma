/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  static URL = '/account';
  /**
   * Получает информацию о счёте
   * */
  
  static get(id = '', callback){   
    createRequest({
      url: this.URL + `/${id}`,
      method: 'GET',
      callback,      
    });
  }
}

/*

В исходном коде было так: static get(id = '', callback)
Почему id = ''? Это что, указание на то, что id должен быть строкой?
Никакой ошибки не возникает, если при этом передать, допустим, массив с единственным значением id.
Если я делаю так: static get(id, callback), ничего не меняется. 

*/