/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

const createRequest = ({method, url, data, callback}) => {
  const xhr = new XMLHttpRequest();
  const formData = new FormData(); 
  
  xhr.responseType = 'json';

  xhr.onload = () => {
    callback(xhr.error, xhr.response)
  } 
  xhr.onerror = () => {
    callback(xhr.error, xhr.response)
  }
  
  if (data) {
    const dataPairs = Object.entries(data);
    
    if (method === 'GET') {
      const urlStr = dataPairs.reduce((acc, item) => acc + `${item[0]}=${item[1]}&`, '');
      url += '?' + urlStr;
    } else { 
      dataPairs.forEach(pair => {
        formData.append(pair[0], pair[1]);
      });
    }
  }

  xhr.open(method, url);
  xhr.send(formData);
}  
  
/* 
  xhr.onload = () => {
    callback(xhr.error, xhr.response)
  }
  xhr.onerror = () => {
    callback(xhr.error, xhr.response)
  }

  Норм? По-другому может надо было сделать?
  Написать написала, но не до конца понимаю.
*/
  
  