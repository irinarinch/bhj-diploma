/**
 * Основная функция для совершения запросов
 * на сервер.
 * */

const createRequest = ({method, url, data, callback}) => {
  const xhr = new XMLHttpRequest();
  
  xhr.responseType = 'json';

  xhr.onload = () => {
    callback(xhr.error, xhr.response)
  }; 
  xhr.onerror = () => {
    callback(xhr.error, xhr.response)
  }; 
  
  let data_paires_array;
 
  if (data) {
    data_paires_array = Object.entries(data);
  }
   
 
 
  xhr.open(method, url);
 
  try {
    if (method === 'GET') {
      url += '?';
      data_paires_array.forEach(pair => {
        url += `${pair[0]}=${pair[1]}`+'&';     
      });
  
     
  
      xhr.send();    
    } else {
      
  
      const formData = new FormData();
  
      data_paires_array.forEach(pair => {
        formData.append(`${pair[0]}`, `${pair[1]}`);
      });
  
      xhr.send(formData);
    }
  }
  
  catch(e) {
    callback(e);
  }
}  
  

  
  